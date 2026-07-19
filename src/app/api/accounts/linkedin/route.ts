import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/accounts/linkedin/callback`
  : "https://smtools.online/api/accounts/linkedin/callback";

const LINKEDIN_SCOPE = "w_member_social r_liteprofile r_emailaddress";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  if (!LINKEDIN_CLIENT_ID) {
    return NextResponse.json(
      { error: "LinkedIn Client ID not configured. Add LINKEDIN_CLIENT_ID to environment variables." },
      { status: 500 }
    );
  }

  const userToken = request.headers.get("authorization")?.replace("Bearer ", "") || "";

  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${LINKEDIN_SCOPE}&state=${encodeURIComponent(userToken)}`;

  return NextResponse.redirect(linkedinAuthUrl);
}
