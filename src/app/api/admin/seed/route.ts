// POST /api/admin/seed — runs migration + seeds admin. Called by login on first request.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";

let migrated = false;

async function runMigration() {
  if (migrated) return;
  try {
    const sqlPath = join(process.cwd(), "prisma", "migration.sql");
    const sql = readFileSync(sqlPath, "utf-8");
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));
    
    const errors: string[] = [];
    for (const stmt of statements) {
      try {
        await db.$executeRawUnsafe(stmt);
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (!msg.includes("already exists")) {
          errors.push(msg.slice(0, 100));
        }
      }
    }
    migrated = true;
    if (errors.length > 0) {
      console.error("[seed] migration errors:", errors);
    }
  } catch (err) {
    console.error("[seed] migration error:", err);
  }
}

async function seedAdmin() {
  try {
    const existing = await db.user.findUnique({
      where: { email: "admin@test.com" },
      select: { id: true },
    });
    if (existing) return;

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

    const plans = [
      { name: "Free", tier: "FREE" as const, priceMonthly: 0, priceYearly: 0, features: "[]", limits: '{"maxPlatforms":1}' },
      { name: "Silver", tier: "SILVER" as const, priceMonthly: 999, priceYearly: 9999, features: "[]", limits: '{"maxPlatforms":3}' },
      { name: "VIP Pro", tier: "VIP_PRO" as const, priceMonthly: 2999, priceYearly: 29999, features: "[]", limits: '{"maxPlatforms":5}' },
      { name: "Enterprise", tier: "ENTERPRISE" as const, priceMonthly: 9999, priceYearly: 99999, features: "[]", limits: '{"maxPlatforms":999}' },
    ];
    for (const p of plans) {
      await db.plan.upsert({ where: { name: p.name }, update: {}, create: p });
    }

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

    // Create platform settings
    const platforms = ["facebook", "instagram", "x", "linkedin", "pinterest"];
    for (const platform of platforms) {
      await db.platformSetting.upsert({
        where: { platform },
        update: {},
        create: { platform, isEnabled: true, isPublic: true },
      });
    }

    console.log("[seed] Admin user + plans created successfully");
  } catch (err) {
    console.error("[seed] admin seed error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await runMigration();
    await seedAdmin();
    return NextResponse.json({ ok: true, message: "Database seeded successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Seed failed", details: String(err) },
      { status: 500 }
    );
  }
}
