import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/tokens";

const FB_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const REDIRECT_URI = "https://smtools.online/api/accounts/facebook/callback";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // user token
  const error = url.searchParams.get("error");

  const dashboardUrl = "https://smtools.online/dashboard/accounts";

  if (error) {
    return NextResponse.redirect(`${dashboardUrl}?error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${dashboardUrl}?error=missing_code`);
  }

  if (!FB_APP_ID || !FB_APP_SECRET) {
    return NextResponse.redirect(`${dashboardUrl}?error=facebook_not_configured`);
  }

  try {
    // Verify user from state (JWT token)
    const payload = verifyToken(state);
    if (!payload || !payload.userId) {
      return NextResponse.redirect(`${dashboardUrl}?error=invalid_token`);
    }
    const userId = payload.userId;

    // Step 1: Exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${FB_APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("[Facebook OAuth] Token exchange failed:", tokenData);
      return NextResponse.redirect(`${dashboardUrl}?error=token_exchange_failed`);
    }

    // Step 2: Get user info
    const userRes = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name,email&access_token=${tokenData.access_token}`
    );
    const userData = await userRes.json();

    if (!userData.id) {
      console.error("[Facebook OAuth] Failed to get user info:", userData);
      return NextResponse.redirect(`${dashboardUrl}?error=user_info_failed`);
    }

    // Step 3: Try to get pages (may fail if pages_read_engagement permission not granted)
    let pages: any[] = [];
    try {
      const pagesRes = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${tokenData.access_token}`
      );
      const pagesData = await pagesRes.json();
      pages = pagesData.data || [];
    } catch {
      // Pages permission not available — continue with user profile only
    }

    // Step 4: Save each page as a connected account
    for (const page of pages) {
      const existing = await db.socialAccount.findFirst({
        where: { userId, platform: "facebook", platformAccountId: page.id },
      });

      if (existing) {
        await db.socialAccount.update({
          where: { id: existing.id },
          data: {
            accessToken: page.access_token || tokenData.access_token,
            displayName: page.name || existing.displayName,
            isConnected: true,
          },
        });
      } else {
        await db.socialAccount.create({
          data: {
            userId,
            platform: "facebook",
            platformAccountId: page.id,
            displayName: page.name || userData.name || "Facebook Page",
            accessToken: page.access_token || tokenData.access_token,
            username: page.name?.toLowerCase().replace(/\s+/g, "") || "",
            isConnected: true,
          },
        });
      }
    }

    // If no pages found, save the user's personal profile
    if (pages.length === 0) {
      const existing = await db.socialAccount.findFirst({
        where: { userId, platform: "facebook", platformAccountId: userData.id },
      });

      if (!existing) {
        await db.socialAccount.create({
          data: {
            userId,
            platform: "facebook",
            platformAccountId: userData.id,
            displayName: userData.name || "Facebook Profile",
            accessToken: tokenData.access_token,
            username: userData.name?.toLowerCase().replace(/\s+/g, "") || "",
            isConnected: true,
          },
        });
      } else {
        await db.socialAccount.update({
          where: { id: existing.id },
          data: { accessToken: tokenData.access_token, isConnected: true },
        });
      }
    }

    return NextResponse.redirect(`${dashboardUrl}?success=facebook_connected`);
  } catch (err: any) {
    console.error("[Facebook OAuth] Error:", err);
    return NextResponse.redirect(`${dashboardUrl}?error=${encodeURIComponent(err.message || "unknown")}`);
  }
}
