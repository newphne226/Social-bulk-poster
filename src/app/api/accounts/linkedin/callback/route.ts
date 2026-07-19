import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/accounts/linkedin/callback`
  : "https://smtools.online/api/accounts/linkedin/callback";

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

  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    return NextResponse.redirect(`${dashboardUrl}?error=linkedin_not_configured`);
  }

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }).toString(),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${dashboardUrl}?error=token_exchange_failed`);
    }

    // Step 2: Get user profile
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileRes.json();

    // Step 3: Verify user from state (JWT token)
    const { verifyToken } = await import("@/app/api/auth/register/route");
    const payload = verifyToken(state);
    if (!payload || !payload.userId) {
      return NextResponse.redirect(`${dashboardUrl}?error=invalid_token`);
    }
    const userId = payload.userId;

    const linkedinId = profileData.sub || profileData.id || "";
    const displayName = profileData.name || `${profileData.given_name || ""} ${profileData.family_name || ""}`.trim() || "LinkedIn User";

    // Step 4: Save account
    const existing = await db.socialAccount.findFirst({
      where: { userId, platform: "linkedin", platformAccountId: linkedinId },
    });

    if (existing) {
      await db.socialAccount.update({
        where: { id: existing.id },
        data: {
          accessToken: tokenData.access_token,
          displayName,
          isConnected: true,
          refreshToken: tokenData.refresh_token || existing.refreshToken,
          tokenExpiresAt: tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : existing.tokenExpiresAt,
        },
      });
    } else {
      await db.socialAccount.create({
        data: {
          userId,
          platform: "linkedin",
          platformAccountId: linkedinId,
          displayName,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || null,
          tokenExpiresAt: tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : null,
          isConnected: true,
        },
      });
    }

    return NextResponse.redirect(`${dashboardUrl}?success=linkedin_connected`);
  } catch (err: any) {
    console.error("[LinkedIn OAuth] Error:", err);
    return NextResponse.redirect(`${dashboardUrl}?error=${encodeURIComponent(err.message || "unknown")}`);
  }
}
