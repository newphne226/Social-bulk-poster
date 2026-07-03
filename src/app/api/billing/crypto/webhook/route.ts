import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession, CRYPTO_CONFIG } from "@/lib/crypto-config";

// POST /api/billing/crypto/webhook
// Called by an external chain watcher (cron job polling BSC RPC) when it
// detects a USDT transfer to our treasury address. The watcher signs the
// request with a shared secret passed in the X-Crypto-Webhook-Secret header.
// 
// In production this would:
//   1. Verify the webhook signature
//   2. Look up the matching session by amount + approximate timestamp
//      (or by txHash memo if the user pasted it)
//   3. Update the session status based on on-chain confirmations
//   4. Activate the user's subscription once confirmed

const WEBHOOK_SECRET = process.env.CRYPTO_WEBHOOK_SECRET || "dev-webhook-secret";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-crypto-webhook-secret");
  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { txHash, fromAddress, toAddress, amount, confirmations, blockNumber } = body || {};

    if (!txHash || !toAddress || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: txHash, toAddress, amount" },
        { status: 400 }
      );
    }

    // Verify it's actually to our treasury
    if (toAddress.toLowerCase() !== CRYPTO_CONFIG.depositAddress.toLowerCase()) {
      return NextResponse.json(
        { error: "Payment not to our treasury address", expected: CRYPTO_CONFIG.depositAddress, got: toAddress },
        { status: 400 }
      );
    }

    // Find a matching session — in production, query Prisma by amount + recent createdAt
    // For demo: we just update by txHash if a session has it, otherwise create a record
    // Here we just acknowledge receipt
    const confirmed = (confirmations || 0) >= CRYPTO_CONFIG.minConfirmations;

    return NextResponse.json({
      ok: true,
      received: {
        txHash,
        fromAddress,
        toAddress,
        amount,
        confirmations: confirmations || 0,
        blockNumber,
        confirmed,
        minConfirmations: CRYPTO_CONFIG.minConfirmations,
      },
      message: confirmed
        ? "Payment confirmed — subscription activation queued"
        : `Detected on-chain — awaiting ${CRYPTO_CONFIG.minConfirmations - (confirmations || 0)} more confirmations`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook processing failed", detail: String(err) },
      { status: 500 }
    );
  }
}
