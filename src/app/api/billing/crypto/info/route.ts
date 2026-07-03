import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { CRYPTO_CONFIG } from "@/lib/crypto-config";

// GET /api/billing/crypto/info
// Returns the deposit address + QR data for the user's UI.
// Public-ish — requires auth so we know who's asking, but the deposit
// address is the same treasury wallet for everyone (one address model).

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    asset: CRYPTO_CONFIG.asset,
    network: CRYPTO_CONFIG.network,
    networkFullName: CRYPTO_CONFIG.networkFullName,
    chainId: CRYPTO_CONFIG.chainId,
    depositAddress: CRYPTO_CONFIG.depositAddress,
    contractAddress: CRYPTO_CONFIG.usdtContractAddress,
    decimals: CRYPTO_CONFIG.decimals,
    minConfirmations: CRYPTO_CONFIG.minConfirmations,
    estimatedConfirmationMinutes: CRYPTO_CONFIG.estimatedConfirmationMinutes,
    sessionTtlHours: CRYPTO_CONFIG.sessionTtlHours,
    explorerUrl: CRYPTO_CONFIG.explorerUrl,
    addressUrl: `${CRYPTO_CONFIG.explorerUrl}/address/${CRYPTO_CONFIG.depositAddress}`,
    warning:
      "Only send USDT on the BEP20 (Binance Smart Chain) network. Sending on any other network will result in permanent loss of funds.",
  });
}
