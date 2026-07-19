// NOWPayments.io integration
// Docs: https://documenter.getpostman.com/view/7653296/S1a364k8

const NOWPAYMENTS_API = "https://api.nowpayments.io/v1";
const NOWPAYMENTS_SANDBOX = "https://api-sandbox.nowpayments.io/v1";

function getBaseUrl() {
  return process.env.NOWPAYMENTS_SANDBOX === "true" ? NOWPAYMENTS_SANDBOX : NOWPAYMENTS_API;
}

function getApiKey() {
  return process.env.NOWPAYMENTS_API_KEY || "";
}

function getIpnSecret() {
  return process.env.NOWPAYMENTS_IPN_SECRET || "";
}

export interface CreateInvoiceParams {
  priceAmount: number;       // USD amount
  priceCurrency: string;     // "usd"
  payCurrency?: string;      // "btc", "eth", "usdt", etc. — optional, user picks on page
  orderId: string;           // your internal order ID
  orderDescription: string;
  ipnCallbackUrl: string;    // webhook URL
  successUrl?: string;       // redirect after success
  cancelUrl?: string;        // redirect after cancel
}

export interface NowPaymentInvoice {
  id: number;
  token_id: number | null;
  order_id: string;
  order_description: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number | null;
  pay_currency: string | null;
  ipn_callback_url: string;
  success_url: string | null;
  cancel_url: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  pay_address: string | null;
  payment_url: string | null;
}

export interface IPNPayload {
  ipn_id: number;
  payment_id: number;
  payment_status: string;     // "finished", "sending", "failed", "refunded", "expired", "mismatch"
  pay_address: string;
  actually_paid: number;
  actually_paid_currency: string;
  fee: number;
  fee_currency: string;
  outcome_amount: number;
  outcome_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: number;
  created_at: string;
  updated_at: string;
  pay_currency: string;
  api_extra_data: string | null;
  customer_email: string | null;
}

export interface EstimatePriceParams {
  amount: number;            // USD amount
  currency: string;          // "usd"
}

export interface CurrencyInfo {
  id: number;
  name: string;
  code: string;
  logo_url: string;
  minimum_pay_amount: number;
  maximum_pay_amount: number;
  enabled: boolean;
}

// Create an invoice
export async function createInvoice(params: CreateInvoiceParams): Promise<NowPaymentInvoice> {
  const res = await fetch(`${getBaseUrl()}/invoice`, {
    method: "POST",
    headers: {
      "x-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency,
      pay_currency: params.payCurrency || undefined,
      order_id: params.orderId,
      order_description: params.orderDescription,
      ipn_callback_url: params.ipnCallbackUrl,
      success_url: params.successUrl || undefined,
      cancel_url: params.cancelUrl || undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `NOWPayments API error: ${res.status}`);
  }

  return res.json();
}

// Get invoice by ID
export async function getInvoice(invoiceId: number): Promise<NowPaymentInvoice> {
  const res = await fetch(`${getBaseUrl()}/invoice/${invoiceId}`, {
    headers: { "x-api-key": getApiKey() },
  });

  if (!res.ok) throw new Error(`NOWPayments invoice fetch failed: ${res.status}`);
  return res.json();
}

// Get payment by ID
export async function getPayment(paymentId: number): Promise<any> {
  const res = await fetch(`${getBaseUrl()}/payment/${paymentId}`, {
    headers: { "x-api-key": getApiKey() },
  });

  if (!res.ok) throw new Error(`NOWPayments payment fetch failed: ${res.status}`);
  return res.json();
}

// Estimate price (how much crypto for USD amount)
export async function estimatePrice(amount: number, currency: string = "usd"): Promise<any> {
  const res = await fetch(`${getBaseUrl()}/estimate`, {
    method: "POST",
    headers: {
      "x-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, currency }),
  });

  if (!res.ok) throw new Error(`NOWPayments estimate failed: ${res.status}`);
  return res.json();
}

// Get available currencies
export async function getCurrencies(): Promise<CurrencyInfo[]> {
  const res = await fetch(`${getBaseUrl()}/currencies`);
  if (!res.ok) throw new Error(`NOWPayments currencies failed: ${res.status}`);
  const data = await res.json();
  return data.currencies || [];
}

// Verify IPN signature (HMAC-SHA512)
export function verifyIpnSignature(body: string, signature: string): boolean {
  const crypto = require("crypto");
  const secret = getIpnSecret();
  if (!secret) return true; // Skip verification if no secret configured

  const hmac = crypto.createHmac("sha512", secret);
  hmac.update(body);
  const expected = hmac.digest("hex");
  return expected === signature;
}

// Map NOWPayments status to our internal status
export function mapPaymentStatus(npStatus: string): string {
  switch (npStatus) {
    case "finished": return "CONFIRMED";
    case "sending": return "CONFIRMING";
    case "failed": return "FAILED";
    case "refunded": return "REFUNDED";
    case "expired": return "EXPIRED";
    case "mismatch": return "MISMATCH";
    default: return "PENDING";
  }
}

// Plan price mapping
export const PLAN_PRICES: Record<string, Record<string, number>> = {
  SILVER: { monthly: 300, yearly: 3000 },
  VIP_PRO: { monthly: 1000, yearly: 10000 },
  ENTERPRISE: { monthly: 9900, yearly: 99000 },
};

export function getPlanPrice(plan: string, cycle: string): number {
  const prices = PLAN_PRICES[plan];
  if (!prices) return 0;
  return prices[cycle] || prices.monthly;
}
