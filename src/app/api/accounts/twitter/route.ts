import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokens";
import crypto from "crypto";

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID || "";
const REDIRECT_URI = "https://smtools.online/api/accounts/twitter/callback";

function base64url(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("https://smtools.online/dashboard/accounts?error=missing_token");
  }

  const decodedToken = decodeURIComponent(token);
  const payload = verifyToken(decodedToken);
  if (!payload) {
    return NextResponse.redirect("https://smtools.online/signin?error=session_expired");
  }

  if (!TWITTER_CLIENT_ID) {
    return NextResponse.redirect("https://smtools.online/dashboard/accounts?error=twitter_not_configured");
  }

  // Generate PKCE code verifier and challenge
  const codeVerifier = base64url(crypto.randomBytes(32));
  const codeChallenge = base64url(crypto.createHash("sha256").update(codeVerifier).digest());

  // We'll store the code_verifier in the state parameter (encoded with the user token)
  const state = JSON.stringify({ token: decodedToken, codeVerifier, ts: Date.now() });

  const scopes = ["tweet.read", "tweet.write", "users.read", "offline.access"].join(" ");

  const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  return NextResponse.redirect(twitterAuthUrl);
}
