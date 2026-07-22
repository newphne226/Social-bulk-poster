import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokens";

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/accounts/linkedin/callback`
  : "https://smtools.online/api/accounts/linkedin/callback";

const LINKEDIN_SCOPE = "openid profile email w_member_social";

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

  if (!LINKEDIN_CLIENT_ID) {
    return NextResponse.json(
      { error: "LinkedIn Client ID not configured. Add LINKEDIN_CLIENT_ID to environment variables." },
      { status: 500 }
    );
  }

  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${LINKEDIN_SCOPE}&state=${encodeURIComponent(token)}`;

  return NextResponse.redirect(linkedinAuthUrl);
}
