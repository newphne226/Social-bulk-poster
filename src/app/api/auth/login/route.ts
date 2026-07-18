// POST /api/auth/login — verifies against the Prisma database.
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateToken } from "../register/route";

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } = body ?? {};

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        subscription: {
          include: { plan: true },
        },
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.status === "BANNED") {
      return NextResponse.json(
        { error: "This account has been banned. Contact support if you believe this is an error." },
        { status: 403 }
      );
    }
    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "This account is suspended. Contact support to restore access." },
        { status: 403 }
      );
    }
    if (user.status === "DELETED" || user.deletedAt) {
      return NextResponse.json(
        { error: "This account has been deleted." },
        { status: 403 }
      );
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const remember = body?.remember === true;
    const token = generateToken(user.id, remember);

    const plan = user.subscription?.plan?.tier ?? "FREE";
    const subscriptionStatus = user.subscription?.status ?? "ACTIVE";

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        plan,
        createdAt: user.createdAt.toISOString(),
      },
      subscription: {
        plan,
        status: subscriptionStatus,
        billingCycle: user.subscription?.billingCycle ?? "MONTHLY",
        currentPeriodEnd: user.subscription?.currentPeriodEnd?.toISOString() ?? null,
        cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd ?? false,
      },
    });
  } catch (err) {
    console.error("[auth/login] error", err);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
