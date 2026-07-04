// POST /api/auth/register — creates a real user in the Prisma database.
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// In-memory token store for the demo (production: use JWT or NextAuth sessions).
// Map: token -> { userId, issuedAt, expiresAt }
const activeTokens = new Map<string, { userId: string; issuedAt: number; expiresAt: number }>();

// Export so login route can read/write the same store
export { activeTokens };

export function generateToken(userId: string, remember = false): string {
  const token = `sp_${Buffer.from(`${userId}:${Date.now()}:${Math.random()}`).toString("base64url")}`;
  activeTokens.set(token, {
    userId,
    issuedAt: Date.now(),
    expiresAt: Date.now() + (remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
  });
  return token;
}

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password, name } = body ?? {};

  // ----- Validation -----
  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Name, email, and password are all required." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const trimmedName = String(name).trim();

  // Email format
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // Password strength
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
    // ----- Check if user already exists -----
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

    // ----- Hash password -----
    const passwordHash = await bcrypt.hash(password, 10);

    // ----- Create user + default settings in a transaction -----
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          name: trimmedName,
          passwordHash,
          role: "USER",
          status: "ACTIVE",
          emailVerified: new Date(), // demo: auto-verify. Production: send email.
          lastLoginAt: new Date(),
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}`,
        },
      });

      // Create default user settings (safe-posting defaults)
      await tx.userSettings.create({
        data: {
          userId: newUser.id,
          timezone: "Asia/Dhaka",
        },
      });

      // Find or create the FREE plan and subscribe the user
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

      return newUser;
    });

    // ----- Generate auth token -----
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
    // Prisma unique constraint violation
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
