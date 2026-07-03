import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { listUserSessions, CRYPTO_CONFIG } from "@/lib/crypto-config";

// GET /api/billing/crypto/sessions
// Returns the user's crypto payment history.

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const sessions = listUserSessions(auth.user.userId);

  return NextResponse.json({
    sessions,
    count: sessions.length,
    config: {
      asset: CRYPTO_CONFIG.asset,
      network: CRYPTO_CONFIG.network,
      depositAddress: CRYPTO_CONFIG.depositAddress,
      explorerUrl: CRYPTO_CONFIG.explorerUrl,
      minConfirmations: CRYPTO_CONFIG.minConfirmations,
    },
  });
}
