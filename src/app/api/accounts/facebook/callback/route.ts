import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const FB_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/accounts/facebook/callback`
  : "https://smtools.online/api/accounts/facebook/callback";

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
    // Step 1: Exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${FB_APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${dashboardUrl}?error=token_exchange_failed`);
    }

    // Step 2: Get user info
    const userRes = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokenData.access_token}`
    );
    const userData = await userRes.json();

    // Step 3: Get pages managed by user
    const pagesRes = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token&access_token=${tokenData.access_token}`
    );
    const pagesData = await pagesRes.json();
    const pages = pagesData.data || [];

    // Step 4: Verify user from state (JWT token)
    const { verifyToken } = await import("@/app/api/auth/register/route");
    const payload = verifyToken(state);
    if (!payload || !payload.userId) {
      return NextResponse.redirect(`${dashboardUrl}?error=invalid_token`);
    }
    const userId = payload.userId;

    // Step 5: Save each page as a connected account
    for (const page of pages) {
      const existing = await db.socialAccount.findFirst({
        where: { userId, platform: "facebook", platformAccountId: page.id },
      });

      if (existing) {
        // Update token
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
            isConnected: true,
          },
        });
      }
    }

    return NextResponse.redirect(`${dashboardUrl}?success=facebook_connected`);
  } catch (err: any) {
    console.error("[Facebook OAuth] Error:", err);
    return NextResponse.redirect(`${dashboardUrl}?error=${encodeURIComponent(err.message || "unknown")}`);
  }
}
