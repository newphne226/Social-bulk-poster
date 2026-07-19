import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const admin = await db.user.update({
      where: { email: "admin@test.com" },
      data: {
        status: "ACTIVE",
        bannedAt: null,
        suspendedAt: null,
        suspendedReason: null,
        role: "ADMIN",
      },
      select: { id: true, status: true, role: true },
    });
    return NextResponse.json({ ok: true, admin });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
