import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { createSession, CRYPTO_CONFIG } from "@/lib/crypto-config";

// POST /api/billing/crypto/checkout
// Creates a new crypto payment session. Returns the deposit address + QR data
// for the client to render. The user has 24 hours to send the payment.

const VALID_PLANS = new Map([
  ["silver_monthly", { amount: 3, plan: "Silver", cycle: "monthly" as const }],
  ["silver_yearly", { amount: 30, plan: "Silver", cycle: "yearly" as const }],
  ["vip_monthly", { amount: 10, plan: "VIP Pro", cycle: "monthly" as const }],
  ["vip_yearly", { amount: 100, plan: "VIP Pro", cycle: "yearly" as const }],
]);

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { sku, amount: customAmount, plan: customPlan, cycle: customCycle } = body || {};

    let amount: number;
    let plan: string;
    let cycle: "monthly" | "yearly";

    if (sku && VALID_PLANS.has(sku)) {
      const p = VALID_PLANS.get(sku)!;
      amount = p.amount;
      plan = p.plan;
      cycle = p.cycle;
    } else if (customAmount && customPlan) {
      amount = Number(customAmount);
      plan = String(customPlan);
      cycle = customCycle === "yearly" ? "yearly" : "monthly";
    } else {
      return NextResponse.json(
        { error: "Missing 'sku' or 'amount' + 'plan' in request body" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (amount < 1) {
      return NextResponse.json(
        { error: "Minimum crypto payment is 1 USDT" },
        { status: 400 }
      );
    }

    const session = createSession(auth.user.userId, amount, plan, cycle);

    return NextResponse.json({
      session,
      deposit: {
        asset: CRYPTO_CONFIG.asset,
        network: CRYPTO_CONFIG.network,
        networkFullName: CRYPTO_CONFIG.networkFullName,
        chainId: CRYPTO_CONFIG.chainId,
        address: CRYPTO_CONFIG.depositAddress,
        contractAddress: CRYPTO_CONFIG.usdtContractAddress,
        amount: session.amount,
        amountAtomic: BigInt(Math.round(session.amount * 10 ** CRYPTO_CONFIG.decimals)).toString(),
        explorerUrl: `${CRYPTO_CONFIG.explorerUrl}/address/${CRYPTO_CONFIG.depositAddress}`,
        // EIP-681 URI for wallet deep-linking
        uri: `ethereum:${CRYPTO_CONFIG.usdtContractAddress}@${CRYPTO_CONFIG.chainId}/transfer?address=${CRYPTO_CONFIG.depositAddress}&uint256=${BigInt(
          Math.round(session.amount * 10 ** CRYPTO_CONFIG.decimals)
        )}`,
        minConfirmations: CRYPTO_CONFIG.minConfirmations,
        estimatedConfirmationMinutes: CRYPTO_CONFIG.estimatedConfirmationMinutes,
        expiresAt: session.expiresAt,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create crypto payment session", detail: String(err) },
      { status: 500 }
    );
  }
}
