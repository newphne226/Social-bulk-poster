import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const { action, reason } = body;

  const user = await db.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "approve") {
    await db.user.update({
      where: { id },
      data: {
        approvalStatus: "APPROVED",
        approvedAt: new Date(),
        approvedBy: auth.user.id,
      },
    });

    // Notify the user
    await db.notification.create({
      data: {
        userId: id,
        type: "SYSTEM",
        title: "Account Approved",
        body: "Your account has been approved by an admin. You can now use the extension.",
        data: JSON.stringify({ action: "account_approved" }),
      },
    });

    return NextResponse.json({ ok: true, status: "APPROVED" });
  }

  if (action === "reject") {
    await db.user.update({
      where: { id },
      data: {
        approvalStatus: "REJECTED",
        rejectedAt: new Date(),
        rejectedReason: reason || "Rejected by admin",
      },
    });

    // Notify the user
    await db.notification.create({
      data: {
        userId: id,
        type: "SYSTEM",
        title: "Account Rejected",
        body: reason ? `Your account has been rejected. Reason: ${reason}` : "Your account has been rejected. Please contact support.",
        data: JSON.stringify({ action: "account_rejected" }),
      },
    });

    return NextResponse.json({ ok: true, status: "REJECTED" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
