// GET /api/invoices — list invoices for the current user.
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const INVOICES = [
  { id: "INV-2026-0089", date: "2026-07-01", amount: 10, currency: "usd", status: "paid", plan: "VIP Pro — Monthly", pdfUrl: "https://example.com/invoices/INV-2026-0089.pdf" },
  { id: "INV-2026-0061", date: "2026-06-01", amount: 10, currency: "usd", status: "paid", plan: "VIP Pro — Monthly", pdfUrl: "https://example.com/invoices/INV-2026-0061.pdf" },
  { id: "INV-2026-0033", date: "2026-05-01", amount: 10, currency: "usd", status: "paid", plan: "VIP Pro — Monthly", pdfUrl: "https://example.com/invoices/INV-2026-0033.pdf" },
  { id: "INV-2026-0008", date: "2026-04-01", amount: 3, currency: "usd", status: "paid", plan: "Silver — Monthly", pdfUrl: "https://example.com/invoices/INV-2026-0008.pdf" },
];

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let result = INVOICES;
  if (status) result = result.filter((i) => i.status === status);

  const totalPaid = result
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return NextResponse.json({
    invoices: result,
    total: result.length,
    totalPaid,
  });
}
