"use client";

import * as React from "react";
import QRCode from "qrcode";
import {
  Copy,
  Check,
  AlertTriangle,
  Clock,
  Wallet,
  Shield,
  ExternalLink,
  RefreshCw,
  QrCode,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// =====================================================================
// SocialPilot — Crypto Payment (USDT on BEP20)
// =====================================================================
// All crypto deposits go to a single treasury wallet. The user sends the
// exact USDT amount, then clicks "I've sent it" — the backend watches the
// chain (via BSC RPC or a block explorer API) and marks the payment
// confirmed after enough block confirmations.
// =====================================================================

export const CRYPTO_CONFIG = {
  asset: "USDT",
  network: "BEP20",
  networkFullName: "Binance Smart Chain (BEP20)",
  chainId: 56,
  explorerUrl: "https://bscscan.com",
  depositAddress: "0x3bab639ebab9cfb034a199b023376cc8e6390588",
  decimals: 18,
  minConfirmations: 12,
  estimatedConfirmationMinutes: 3,
  contractAddress: "0x55d398326f99059fF775485246999027B3197955", // USDT on BSC mainnet
};

export type CryptoPaymentStatus = "pending" | "confirming" | "confirmed" | "expired" | "failed";

export interface CryptoPaymentSession {
  id: string;
  amount: number; // USDT
  amountUsd: number;
  plan: string;
  cycle: "monthly" | "yearly";
  status: CryptoPaymentStatus;
  createdAt: string;
  expiresAt: string;
  txHash?: string;
  confirmations?: number;
}

interface CryptoPaymentProps {
  /** Amount in USDT the user must send */
  amount: number;
  /** What the payment is for — e.g. "VIP Pro — Monthly" */
  description: string;
  /** Optional session id returned by the backend */
  sessionId?: string;
  /** Called when the user clicks "I've sent the payment" */
  onPaymentSent?: (txHash?: string) => void;
  /** Compact mode for embedding in modals/dialogs */
  compact?: boolean;
  /** Show the explorer link */
  showExplorer?: boolean;
}

export function CryptoPayment({
  amount,
  description,
  sessionId,
  onPaymentSent,
  compact = false,
  showExplorer = true,
}: CryptoPaymentProps) {
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [sending, setSending] = React.useState(false);

  // Generate QR code locally (no external API dependency)
  React.useEffect(() => {
    // EIP-681 URI format for wallet apps to prefill the payment
    // https://eips.ethereum.org/EIPS/eip-681
    const uri = `ethereum:${CRYPTO_CONFIG.contractAddress}@${CRYPTO_CONFIG.chainId}/transfer?address=${CRYPTO_CONFIG.depositAddress}&uint256=${BigInt(
      Math.round(amount * 10 ** CRYPTO_CONFIG.decimals
    ))}`;
    QRCode.toDataURL(uri, {
      width: 240,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then(setQrDataUrl)
      .catch((e) => console.error("QR generation failed", e));
  }, [amount]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CRYPTO_CONFIG.depositAddress);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select and copy manually");
    }
  };

  const handleSent = async () => {
    setSending(true);
    // In production: POST to /api/billing/crypto/verify with { sessionId, txHash }
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    onPaymentSent?.(txHash || undefined);
    toast.success("Payment submitted — we'll confirm on-chain within ~3 minutes");
  };

  return (
    <div className="space-y-4">
      {/* Asset + Network header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#f3ba2f]/15 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-[#f3ba2f]" />
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              {CRYPTO_CONFIG.asset}
              <Badge variant="outline" className="text-[10px] bg-[#f3ba2f]/10 text-[#b8860b] border-[#f3ba2f]/30">
                {CRYPTO_CONFIG.network}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">{CRYPTO_CONFIG.networkFullName}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Amount due</div>
          <div className="text-lg font-bold">
            {amount.toFixed(2)} <span className="text-sm font-medium text-muted-foreground">USDT</span>
          </div>
          <div className="text-[10px] text-muted-foreground">≈ ${amount.toFixed(2)}</div>
        </div>
      </div>

      {!compact && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
          <div className="font-medium text-amber-700 dark:text-amber-400 mb-1">
            {description}
          </div>
          <div className="text-muted-foreground">
            Send exactly <span className="font-mono font-medium">{amount.toFixed(2)} USDT</span> on the{" "}
            <span className="font-medium">{CRYPTO_CONFIG.network}</span> network to the address below.
            Sending on any other network (ERC-20, TRC-20, SOL) will result in permanent loss of funds.
          </div>
        </div>
      )}

      {/* QR + Address */}
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-[200px_1fr]")}>
        {/* QR Code */}
        <div className="flex flex-col items-center">
          <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-2 bg-white">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="USDT BEP20 deposit QR code" width={200} height={200} className="rounded-md" />
            ) : (
              <div className="h-[200px] w-[200px] flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
            <QrCode className="h-3 w-3" /> Scan with any BEP20 wallet
          </div>
        </div>

        {/* Address + details */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Deposit address ({CRYPTO_CONFIG.network})</Label>
            <div className="mt-1 flex gap-2">
              <Input
                readOnly
                value={CRYPTO_CONFIG.depositAddress}
                className="font-mono text-xs bg-muted/50"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button type="button" size="icon" variant="outline" onClick={copyAddress} className="shrink-0">
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md border bg-muted/30 p-2">
              <div className="text-muted-foreground">Asset</div>
              <div className="font-medium">{CRYPTO_CONFIG.asset}</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-2">
              <div className="text-muted-foreground">Network</div>
              <div className="font-medium">{CRYPTO_CONFIG.network}</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-2">
              <div className="text-muted-foreground">Confirmations required</div>
              <div className="font-medium">{CRYPTO_CONFIG.minConfirmations} blocks</div>
            </div>
            <div className="rounded-md border bg-muted/30 p-2">
              <div className="text-muted-foreground">Est. confirmation</div>
              <div className="font-medium">~{CRYPTO_CONFIG.estimatedConfirmationMinutes} min</div>
            </div>
          </div>

          {showExplorer && (
            <a
              href={`${CRYPTO_CONFIG.explorerUrl}/address/${CRYPTO_CONFIG.depositAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> View address on BscScan
            </a>
          )}
        </div>
      </div>

      <Separator />

      {/* TX hash input + confirm */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Transaction hash (optional but recommended)</Label>
          <Input
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="0x... (paste your TX hash to speed up verification)"
            className="mt-1 font-mono text-xs"
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            Paste the TX hash after sending to help us locate your payment faster.
          </p>
        </div>

        <Button onClick={handleSent} disabled={sending} className="w-full">
          {sending ? (
            <>
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" /> I've sent {amount.toFixed(2)} USDT
            </>
          )}
        </Button>
      </div>

      {!compact && (
        <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <div className="text-xs">
              <div className="font-medium">How it works</div>
              <ol className="mt-1 space-y-0.5 text-muted-foreground list-decimal list-inside">
                <li>Send the exact amount of USDT on BEP20 to the address above</li>
                <li>Optionally paste the TX hash to speed up detection</li>
                <li>Click "I've sent" — our watcher confirms on-chain</li>
                <li>Your subscription activates automatically once confirmed (~3 min)</li>
              </ol>
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-amber-700 dark:text-amber-400">Important:</span> Only send USDT on the BEP20 network.
              Sending on ERC-20, TRC-20, or any other network will result in permanent loss.
              Double-check the network in your wallet before confirming.
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground">
              Payment windows stay open for 24 hours. If the price of USDT fluctuates significantly,
              we lock the amount at the rate when the session was created.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Payment status tracker (used after the user submits)
// ---------------------------------------------------------------------

export function CryptoPaymentStatus({ session }: { session: CryptoPaymentSession }) {
  const stages: { key: CryptoPaymentStatus; label: string; icon: React.ElementType }[] = [
    { key: "pending", label: "Awaiting payment", icon: Clock },
    { key: "confirming", label: "Confirming on-chain", icon: RefreshCw },
    { key: "confirmed", label: "Payment confirmed", icon: Check },
  ];
  const currentIdx = stages.findIndex((s) => s.key === session.status);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-muted-foreground">Payment #{session.id.slice(0, 8)}</div>
          <div className="font-semibold">{session.plan} · {session.cycle}</div>
        </div>
        <Badge variant="outline" className={cn(
          "text-xs",
          session.status === "confirmed" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
          session.status === "confirming" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
          session.status === "pending" && "bg-muted text-muted-foreground",
          session.status === "expired" && "bg-red-500/10 text-red-700 dark:text-red-400",
        )}>
          {session.status}
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-6">
        {stages.map((s, i) => {
          const Icon = s.icon;
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-colors",
                  isDone && "bg-emerald-500 border-emerald-500 text-white",
                  isCurrent && "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400",
                  !isDone && !isCurrent && "border-muted bg-background text-muted-foreground"
                )}>
                  <Icon className={cn("h-4 w-4", isCurrent && "animate-spin")} />
                </div>
                <div className={cn("text-[10px] font-medium", isCurrent && "text-amber-600 dark:text-amber-400")}>
                  {s.label}
                </div>
              </div>
              {i < stages.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-1 rounded-full", i < currentIdx ? "bg-emerald-500" : "bg-muted")} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Amount</div>
          <div className="font-medium">{session.amount.toFixed(2)} USDT</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Created</div>
          <div className="font-medium">{new Date(session.createdAt).toLocaleString()}</div>
        </div>
        {session.txHash && (
          <div className="col-span-2">
            <div className="text-xs text-muted-foreground">Transaction</div>
            <a href={`${CRYPTO_CONFIG.explorerUrl}/tx/${session.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-amber-600 dark:text-amber-400 hover:underline break-all">
              {session.txHash}
            </a>
          </div>
        )}
        {session.confirmations !== undefined && (
          <div>
            <div className="text-xs text-muted-foreground">Confirmations</div>
            <div className="font-medium">{session.confirmations} / {CRYPTO_CONFIG.minConfirmations}</div>
          </div>
        )}
      </div>
    </Card>
  );
}
