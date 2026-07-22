import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/tokens";
import bcrypt from "bcryptjs";

const FB_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const REDIRECT_URI = "https://smtools.online/api/auth/facebook/callback";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateStr = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  let source = "web";
  try {
    if (stateStr) {
      const state = JSON.parse(decodeURIComponent(stateStr));
      source = state.source || "web";
    }
  } catch {}

  const completeUrl = new URL("https://smtools.online/auth/facebook-complete");

  if (error) {
    completeUrl.searchParams.set("error", error);
    return NextResponse.redirect(completeUrl.toString());
  }

  if (!code || !stateStr) {
    completeUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(completeUrl.toString());
  }

  if (!FB_APP_ID || !FB_APP_SECRET) {
    completeUrl.searchParams.set("error", "facebook_not_configured");
    return NextResponse.redirect(completeUrl.toString());
  }

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${FB_APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("[Facebook Login] Token exchange failed:", tokenData);
      completeUrl.searchParams.set("error", "token_exchange_failed");
      return NextResponse.redirect(completeUrl.toString());
    }

    // Step 2: Get user info from Facebook
    const userRes = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name,email&access_token=${tokenData.access_token}`
    );
    const fbUser = await userRes.json();

    if (!fbUser.id) {
      console.error("[Facebook Login] Failed to get user info:", fbUser);
      completeUrl.searchParams.set("error", "user_info_failed");
      return NextResponse.redirect(completeUrl.toString());
    }

    const fbId = fbUser.id;
    const fbName = fbUser.name || "Facebook User";
    const fbEmail = fbUser.email || null;

    // Step 3: Find or create user in DB
    // First check if there's a user with this Facebook ID linked
    let existingFbAccount = await db.socialAccount.findFirst({
      where: { platformAccountId: fbId, platform: "facebook" },
      include: { user: true },
    });

    let user = existingFbAccount?.user || null;

    // Also try to find by email if Facebook provided one
    if (!user && fbEmail) {
      user = await db.user.findUnique({
        where: { email: fbEmail.toLowerCase() },
      });
    }

    // If still no user, create a new one
    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-12), 10);
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      user = await db.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email: fbEmail || `fb_${fbId}@facebook.local`,
            name: fbName,
            passwordHash: randomPassword,
            role: "USER",
            status: "ACTIVE",
            approvalStatus: "APPROVED",
            emailVerified: new Date(),
            lastLoginAt: new Date(),
            avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbName)}`,
          },
        });

        await tx.userSettings.create({
          data: { userId: newUser.id, timezone: "Asia/Dhaka" },
        });

        const freePlan = await tx.plan.findFirst({ where: { tier: "FREE" } });
        if (freePlan) {
          await tx.subscription.create({
            data: {
              userId: newUser.id,
              planId: freePlan.id,
              status: "ACTIVE",
              billingCycle: "MONTHLY",
              currentPeriodStart: new Date(),
              currentPeriodEnd: trialEndsAt,
              trialEndsAt,
            },
          });
        }

        // Notify admins
        const admins = await tx.user.findMany({
          where: { role: "ADMIN", status: "ACTIVE" },
          select: { id: true },
        });
        for (const admin of admins) {
          await tx.notification.create({
            data: {
              userId: admin.id,
              type: "SYSTEM",
              title: "New User (Facebook)",
              body: `${fbName} (${fbEmail || "no email"}) registered via Facebook login.`,
              data: JSON.stringify({ userId: newUser.id, action: "facebook_signup" }),
            },
          });
        }

        return newUser;
      });
    } else {
      // Existing user — update last login
      await db.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    // Step 4: Link Facebook account if not already linked
    const alreadyLinked = await db.socialAccount.findFirst({
      where: { userId: user.id, platform: "facebook", platformAccountId: fbId },
    });

    if (!alreadyLinked) {
      await db.socialAccount.create({
        data: {
          userId: user.id,
          platform: "facebook",
          platformAccountId: fbId,
          displayName: fbName,
          accessToken: tokenData.access_token,
          username: fbName.toLowerCase().replace(/\s+/g, ""),
          isConnected: true,
        },
      });
    } else {
      await db.socialAccount.update({
        where: { id: alreadyLinked.id },
        data: { accessToken: tokenData.access_token, isConnected: true },
      });
    }

    // Step 5: Generate auth token
    const token = generateToken(user.id, true);

    // Step 6: Build user data for response
    const planName = "FREE";

    completeUrl.searchParams.set("token", token);
    completeUrl.searchParams.set("userId", user.id);
    completeUrl.searchParams.set("name", user.name || fbName);
    completeUrl.searchParams.set("email", user.email || "");
    completeUrl.searchParams.set("avatarUrl", user.avatarUrl || "");
    completeUrl.searchParams.set("role", user.role);
    completeUrl.searchParams.set("plan", planName);
    completeUrl.searchParams.set("source", source);

    return NextResponse.redirect(completeUrl.toString());
  } catch (err: any) {
    console.error("[Facebook Login] Error:", err);
    completeUrl.searchParams.set("error", err.message || "unknown_error");
    return NextResponse.redirect(completeUrl.toString());
  }
}
