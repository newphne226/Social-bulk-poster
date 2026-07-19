import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const { note } = body;

  if (!note || typeof note !== "string" || note.trim().length === 0) {
    return NextResponse.json({ error: "Note is required" }, { status: 400 });
  }

  const customerNote = await db.customerNote.create({
    data: {
      userId: id,
      adminId: auth.user.id,
      body: note.trim(),
    },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({
    note: {
      id: customerNote.id,
      body: customerNote.body,
      adminName: customerNote.user.name ?? customerNote.user.email,
      createdAt: customerNote.createdAt.toISOString(),
    },
  }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const noteId = searchParams.get("noteId");

  if (!noteId) {
    return NextResponse.json({ error: "noteId is required" }, { status: 400 });
  }

  await db.customerNote.delete({ where: { id: noteId } });

  return NextResponse.json({ ok: true });
}
