// Shared crypto payment config — must match the client component
// In production these would be env vars: CRYPTO_TREASURY_ADDRESS, etc.

export const CRYPTO_CONFIG = {
  asset: "USDT",
  network: "BEP20",
  networkFullName: "Binance Smart Chain (BEP20)",
  chainId: 56,
  explorerUrl: "https://bscscan.com",
  depositAddress: "0x3bab639ebab9cfb034a199b023376cc8e6390588",
  usdtContractAddress: "0x55d398326f99059fF775485246999027B3197955", // USDT on BSC
  decimals: 18,
  minConfirmations: 12,
  estimatedConfirmationMinutes: 3,
  sessionTtlHours: 24,
} as const;

export type CryptoPaymentStatus =
  | "pending"
  | "confirming"
  | "confirmed"
  | "expired"
  | "failed";

export interface CryptoPaymentRecord {
  id: string;
  userId: string;
  amount: number; // USDT
  amountUsd: number;
  plan: string;
  cycle: "monthly" | "yearly";
  status: CryptoPaymentStatus;
  txHash?: string;
  confirmations: number;
  createdAt: string;
  expiresAt: string;
  confirmedAt?: string;
}

// In-memory store for demo. In production this would be Prisma + Postgres.
const sessions = new Map<string, CryptoPaymentRecord>();

export function createSession(
  userId: string,
  amount: number,
  plan: string,
  cycle: "monthly" | "yearly"
): CryptoPaymentRecord {
  const id = `cp_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date();
  const record: CryptoPaymentRecord = {
    id,
    userId,
    amount,
    amountUsd: amount,
    plan,
    cycle,
    status: "pending",
    confirmations: 0,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CRYPTO_CONFIG.sessionTtlHours * 3600_000).toISOString(),
  };
  sessions.set(id, record);
  return record;
}

export function getSession(id: string): CryptoPaymentRecord | undefined {
  return sessions.get(id);
}

export function listUserSessions(userId: string): CryptoPaymentRecord[] {
  return Array.from(sessions.values())
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function updateSession(
  id: string,
  patch: Partial<CryptoPaymentRecord>
): CryptoPaymentRecord | undefined {
  const cur = sessions.get(id);
  if (!cur) return undefined;
  const next = { ...cur, ...patch };
  sessions.set(id, next);
  return next;
}

// ---------------------------------------------------------------------
// On-chain verification helper (mock — wire up BSC RPC in production)
// ---------------------------------------------------------------------

/**
 * Verifies a USDT BEP20 transfer to our treasury address.
 * In production, query the BSC RPC:
 *   1. Fetch TX receipt by txHash
 *   2. Confirm it calls `transfer(address,uint256)` on the USDT contract
 *   3. Confirm `to` == CRYPTO_CONFIG.depositAddress
 *   4. Confirm `value` == amount * 10^decimals
 *   5. Confirm receipt.status == 1
 *   6. Fetch current block, compute confirmations = currentBlock - receipt.blockNumber
 *   7. If confirmations >= minConfirmations, mark confirmed
 */
export async function verifyTxOnChain(
  _txHash: string,
  _expectedAmount: number
): Promise<{ ok: boolean; confirmations?: number; error?: string }> {
  // Demo: simulate 60% chance of finding a confirming tx
  if (Math.random() > 0.4) {
    return { ok: true, confirmations: Math.floor(Math.random() * 30) + 1 };
  }
  return { ok: false, error: "Transaction not found on BEP20 yet — try again in 30s" };
}
