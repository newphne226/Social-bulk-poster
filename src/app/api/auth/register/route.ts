// POST /api/auth/register — creates a real user in the Prisma database.
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import crypto from "crypto";

// Stateless token: base64url(userId:expiresAt:signature)
// No in-memory store needed — works on Vercel serverless.
const SECRET = process.env.TOKEN_SECRET || "sp-demo-secret-key-change-in-production";

export function generateToken(userId: string, remember = false): string {
  const expiresAt = Date.now() + (remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
  const payload = `${userId}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  const token = Buffer.from(`${payload}:${signature}`).toString("base64url");
  return `sp_${token}`;
}

export function verifyToken(token: string): { userId: string; expiresAt: number } | null {
  try {
    if (!token.startsWith("sp_")) return null;
    const decoded = Buffer.from(token.slice(3), "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;

    const [userId, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

    // Verify signature
    const payload = `${userId}:${expiresAt}`;
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
    if (signature !== expected) return null;

    return { userId, expiresAt };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password, name } = body ?? {};

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Name, email, and password are all required." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const trimmedName = String(name).trim();

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long." },
      { status: 400 }
    );
  }
  if (password.length > 128) {
    return NextResponse.json(
      { error: "Password must be 128 characters or fewer." },
      { status: 400 }
    );
  }

  if (trimmedName.length < 2) {
    return NextResponse.json(
      { error: "Name must be at least 2 characters." },
      { status: 400 }
    );
  }
  if (trimmedName.length > 80) {
    return NextResponse.json(
      { error: "Name must be 80 characters or fewer." },
      { status: 400 }
    );
  }

  try {
    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in instead." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          name: trimmedName,
          passwordHash,
          role: "USER",
          status: "ACTIVE",
          approvalStatus: "PENDING",
          emailVerified: new Date(),
          lastLoginAt: new Date(),
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}`,
        },
      });

      await tx.userSettings.create({
        data: {
          userId: newUser.id,
          timezone: "Asia/Dhaka",
        },
      });

      const freePlan = await tx.plan.findFirst({
        where: { tier: "FREE" },
      });
      if (freePlan) {
        await tx.subscription.create({
          data: {
            userId: newUser.id,
            planId: freePlan.id,
            status: "ACTIVE",
            billingCycle: "MONTHLY",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });
      }

      // Notify all admins about new user registration
      const admins = await tx.user.findMany({
        where: { role: "ADMIN", status: "ACTIVE" },
        select: { id: true },
      });

      for (const admin of admins) {
        await tx.notification.create({
          data: {
            userId: admin.id,
            type: "SYSTEM",
            title: "New User Registration",
            body: `${trimmedName} (${normalizedEmail}) registered via the extension and is awaiting approval.`,
            data: JSON.stringify({ userId: newUser.id, action: "approval_required" }),
          },
        });
      }

      return newUser;
    });

    const remember = body?.remember === true;
    const token = generateToken(user.id, remember);

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          plan: "FREE",
          createdAt: user.createdAt.toISOString(),
        },
        subscription: {
          plan: "FREE",
          status: "ACTIVE",
          billingCycle: "MONTHLY",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[auth/register] error", err);
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
