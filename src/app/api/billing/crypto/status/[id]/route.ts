import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getSession, updateSession, verifyTxOnChain, CRYPTO_CONFIG } from "@/lib/crypto-config";

// GET /api/billing/crypto/status/[id]
// Returns the current status of a crypto payment session.
// In production a cron job would poll the chain for all "pending" sessions
// and update their status. This endpoint lets the client poll for updates.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const session = getSession(id);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.userId !== auth.user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // If we have a txHash and status isn't final, simulate re-checking on-chain
  if (session.txHash && (session.status === "pending" || session.status === "confirming")) {
    const verify = await verifyTxOnChain(session.txHash, session.amount);
    if (verify.ok) {
      const confirmed = verify.confirmations! >= CRYPTO_CONFIG.minConfirmations;
      const updated = updateSession(id, {
        confirmations: verify.confirmations!,
        status: confirmed ? "confirmed" : "confirming",
        confirmedAt: confirmed ? new Date().toISOString() : undefined,
      });
      return NextResponse.json({
        session: updated,
        activated: confirmed,
        explorerUrl: `${CRYPTO_CONFIG.explorerUrl}/tx/${session.txHash}`,
      });
    }
  }

  return NextResponse.json({
    session,
    explorerUrl: session.txHash
      ? `${CRYPTO_CONFIG.explorerUrl}/tx/${session.txHash}`
      : `${CRYPTO_CONFIG.explorerUrl}/address/${CRYPTO_CONFIG.depositAddress}`,
  });
}
