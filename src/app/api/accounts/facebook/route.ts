import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokens";

const FB_APP_ID = process.env.FACEBOOK_APP_ID || "";
const REDIRECT_URI = "https://smtools.online/api/accounts/facebook/callback";

const FB_SCOPES = "public_profile,email";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (!FB_APP_ID) {
    return NextResponse.json(
      { error: "Facebook App ID not configured. Add FACEBOOK_APP_ID to environment variables." },
      { status: 500 }
    );
  }

  const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${FB_SCOPES}&state=${encodeURIComponent(token)}&response_type=code`;

  return NextResponse.redirect(fbAuthUrl);
}
