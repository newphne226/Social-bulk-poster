import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getSession, updateSession, verifyTxOnChain, CRYPTO_CONFIG } from "@/lib/crypto-config";

// POST /api/billing/crypto/verify
// Called by the client when the user clicks "I've sent the payment" (optionally
// with a TX hash). The server:
//   1. Looks up the session
//   2. If a txHash is provided, queries the BSC chain to confirm
//   3. Updates the session status to "confirming" or "confirmed"
//   4. If confirmed, activates the subscription (would call Stripe-equivalent
//      internal logic to bump the user's plan)

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { sessionId, txHash } = body || {};

    if (!sessionId) {
      return NextResponse.json({ error: "Missing 'sessionId'" }, { status: 400 });
    }

    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== auth.user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (session.status === "confirmed") {
      return NextResponse.json({
        ok: true,
        session,
        message: "Already confirmed",
      });
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      const expired = updateSession(sessionId, { status: "expired" });
      return NextResponse.json(
        { error: "Session expired. Please create a new one.", session: expired },
        { status: 410 }
      );
    }

    // If user provided a txHash, try on-chain verification
    if (txHash) {
      const verify = await verifyTxOnChain(txHash, session.amount);
      if (verify.ok) {
        const confirmed = verify.confirmations! >= CRYPTO_CONFIG.minConfirmations;
        const updated = updateSession(sessionId, {
          txHash,
          confirmations: verify.confirmations!,
          status: confirmed ? "confirmed" : "confirming",
          confirmedAt: confirmed ? new Date().toISOString() : undefined,
        });

        // If confirmed, activate the subscription (mock)
        if (confirmed && updated) {
          // In production: await db.subscription.update({ where: { userId }, data: { plan, status: "ACTIVE" } })
          return NextResponse.json({
            ok: true,
            session: updated,
            activated: true,
            message: "Payment confirmed — subscription activated",
          });
        }

        return NextResponse.json({
          ok: true,
          session: updated,
          message: `Detected on-chain — ${verify.confirmations}/${CRYPTO_CONFIG.minConfirmations} confirmations`,
        });
      }
      // Verification failed — keep session pending so user can retry
      const updated = updateSession(sessionId, { txHash, status: "pending" });
      return NextResponse.json(
        { ok: false, session: updated, error: verify.error },
        { status: 202 }
      );
    }

    // No txHash — just mark as "awaiting confirmation"
    const updated = updateSession(sessionId, { status: "pending" });
    return NextResponse.json({
      ok: true,
      session: updated,
      message: "Awaiting on-chain payment. We'll auto-detect within ~3 minutes.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Verification failed", detail: String(err) },
      { status: 500 }
    );
  }
}
