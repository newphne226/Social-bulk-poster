// POST /api/auth/login — verifies against the Prisma database.
// Auto-seeds admin + plans on first run.
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateToken } from "../register/route";

async function ensureSeeded() {
  try {
    const count = await db.user.count();
    if (count > 0) return;

    // Empty DB — seed plans + admin
    const plans = [
      { name: "Free", tier: "FREE" as const, priceMonthly: 0, priceYearly: 0, features: "[]", limits: '{"maxPlatforms":1,"maxAccountsPerPlatform":1,"maxScheduledPosts":10}' },
      { name: "Silver", tier: "SILVER" as const, priceMonthly: 999, priceYearly: 9999, features: "[]", limits: '{"maxPlatforms":3,"maxAccountsPerPlatform":5,"maxScheduledPosts":100}' },
      { name: "VIP Pro", tier: "VIP_PRO" as const, priceMonthly: 2999, priceYearly: 29999, features: "[]", limits: '{"maxPlatforms":5,"maxAccountsPerPlatform":20,"maxScheduledPosts":1000}' },
      { name: "Enterprise", tier: "ENTERPRISE" as const, priceMonthly: 9999, priceYearly: 99999, features: "[]", limits: '{"maxPlatforms":999,"maxAccountsPerPlatform":999,"maxScheduledPosts":99999}' },
    ];
    for (const p of plans) {
      await db.plan.upsert({ where: { name: p.name }, update: {}, create: p });
    }

    const hash = await bcrypt.hash("admin123", 10);
    const admin = await db.user.create({
      data: {
        email: "admin@test.com",
        name: "Admin",
        passwordHash: hash,
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: new Date(),
        lastLoginAt: new Date(),
        avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
      },
    });

    const freePlan = await db.plan.findFirst({ where: { tier: "FREE" } });
    if (freePlan) {
      await db.subscription.create({
        data: {
          userId: admin.id,
          planId: freePlan.id,
          status: "ACTIVE",
          billingCycle: "MONTHLY",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });
    }
    console.log("[auth/login] Seeded admin user and plans");
  } catch (err: any) {
    console.error("[auth/login] Seed error (non-fatal):", err?.message || err);
  }
}

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
    await ensureSeeded();

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        subscription: { include: { plan: true } },
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.status === "BANNED") {
      return NextResponse.json({ error: "This account has been banned." }, { status: 403 });
    }
    if (user.status === "SUSPENDED") {
      return NextResponse.json({ error: "This account is suspended." }, { status: 403 });
    }
    if (user.status === "DELETED" || user.deletedAt) {
      return NextResponse.json({ error: "This account has been deleted." }, { status: 403 });
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

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
  } catch (err: any) {
    console.error("[auth/login] error", err);
    return NextResponse.json(
      { error: "Login failed. Please try again.", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
