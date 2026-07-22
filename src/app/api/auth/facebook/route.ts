import { NextRequest, NextResponse } from "next/server";

const FB_APP_ID = process.env.FACEBOOK_APP_ID || "";
const REDIRECT_URI = "https://smtools.online/api/auth/facebook/callback";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const source = url.searchParams.get("source") || "web";

  if (!FB_APP_ID) {
    const webUrl = source === "extension" ? "https://smtools.online/auth/facebook-complete?error=facebook_not_configured" : "https://smtools.online/signin?error=facebook_not_configured";
    return NextResponse.redirect(webUrl);
  }

  const state = JSON.stringify({ source, ts: Date.now() });
  const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=public_profile,email&state=${encodeURIComponent(state)}&response_type=code`;

  return NextResponse.redirect(fbAuthUrl);
}
