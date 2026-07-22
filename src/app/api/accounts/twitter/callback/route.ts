import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID || "";
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET || "";
const REDIRECT_URI = "https://smtools.online/api/accounts/twitter/callback";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateStr = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const dashboardUrl = "https://smtools.online/dashboard/accounts";

  if (error) {
    return NextResponse.redirect(`${dashboardUrl}?error=${encodeURIComponent(error)}`);
  }

  if (!code || !stateStr) {
    return NextResponse.redirect(`${dashboardUrl}?error=missing_code`);
  }

  if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
    return NextResponse.redirect(`${dashboardUrl}?error=twitter_not_configured`);
  }

  try {
    // Parse state to get user token and code verifier
    const state = JSON.parse(decodeURIComponent(stateStr));
    const userToken = state.token;
    const codeVerifier = state.codeVerifier;

    // Verify user from state
    const { verifyToken } = await import("@/lib/tokens");
    const payload = verifyToken(userToken);
    if (!payload || !payload.userId) {
      return NextResponse.redirect(`${dashboardUrl}?error=invalid_token`);
    }
    const userId = payload.userId;

    // Step 1: Exchange code for access token
    const credentials = Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString("base64");

    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }).toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("[Twitter OAuth] Token exchange failed:", tokenData);
      return NextResponse.redirect(`${dashboardUrl}?error=token_exchange_failed`);
    }

    // Step 2: Get user info
    const userRes = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username", {
      headers: { "Authorization": `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    if (!userData.data?.id) {
      console.error("[Twitter OAuth] Failed to get user info:", userData);
      return NextResponse.redirect(`${dashboardUrl}?error=user_info_failed`);
    }

    const twitterId = userData.data.id;
    const displayName = userData.data.name || "Twitter User";
    const username = userData.data.username || "";
    const avatarUrl = userData.data.profile_image_url || "";

    // Step 3: Save account
    const existing = await db.socialAccount.findFirst({
      where: { userId, platform: "x", platformAccountId: twitterId },
    });

    if (existing) {
      await db.socialAccount.update({
        where: { id: existing.id },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || existing.refreshToken,
          tokenExpiresAt: tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : existing.tokenExpiresAt,
          displayName,
          username: `@${username}`,
          avatarUrl,
          isConnected: true,
        },
      });
    } else {
      await db.socialAccount.create({
        data: {
          userId,
          platform: "x",
          platformAccountId: twitterId,
          displayName,
          username: `@${username}`,
          avatarUrl,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || null,
          tokenExpiresAt: tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : null,
          isConnected: true,
        },
      });
    }

    return NextResponse.redirect(`${dashboardUrl}?success=twitter_connected`);
  } catch (err: any) {
    console.error("[Twitter OAuth] Error:", err);
    return NextResponse.redirect(`${dashboardUrl}?error=${encodeURIComponent(err.message || "unknown")}`);
  }
}
