import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const FB_APP_ID = process.env.FACEBOOK_APP_ID || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/accounts/facebook/callback`
  : "https://smtools.online/api/accounts/facebook/callback";

const FB_SCOPES = "pages_manage_posts,pages_read_engagement,pages_show_list,basic_profile";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  if (!FB_APP_ID) {
    return NextResponse.json(
      { error: "Facebook App ID not configured. Add FACEBOOK_APP_ID to environment variables." },
      { status: 500 }
    );
  }

  // Store user token in cookie for callback
  const url = new URL(request.url);
  const userToken = request.headers.get("authorization")?.replace("Bearer ", "") || "";

  const fbAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${FB_SCOPES}&state=${encodeURIComponent(userToken)}&response_type=code`;

  return NextResponse.redirect(fbAuthUrl);
}
