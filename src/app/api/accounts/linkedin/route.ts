import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokens";

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "";
const REDIRECT_URI = "https://smtools.online/api/accounts/linkedin/callback";

const LINKEDIN_SCOPE = "openid profile email w_member_social";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  let token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("https://smtools.online/dashboard/accounts?error=missing_token");
  }

  token = decodeURIComponent(token);

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect("https://smtools.online/signin?error=session_expired");
  }

  if (!LINKEDIN_CLIENT_ID) {
    return NextResponse.redirect("https://smtools.online/dashboard/accounts?error=linkedin_not_configured");
  }

  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${LINKEDIN_SCOPE}&state=${encodeURIComponent(token)}`;

  return NextResponse.redirect(linkedinAuthUrl);
}
