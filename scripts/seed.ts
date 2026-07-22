// Seed script — creates the FREE/Silver/VIP Pro plans and a demo admin user.
// Run with: bun run scripts/seed.ts
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";

async function main() {
  console.log("🌱 Seeding database...\n");

  // ----- Plans -----
  console.log("📦 Creating plans...");
  const plans = [
    {
      name: "Free",
      tier: "FREE" as const,
      priceMonthly: 0,
      priceYearly: 0,
      description: "Perfect for individuals testing the waters.",
      features: JSON.stringify(["basic_dashboard", "community_support"]),
      limits: JSON.stringify({
        maxPlatforms: 1,
        maxAccountsPerPlatform: 1,
        maxScheduledPosts: 10,
        maxMediaStorageMB: 50,
      }),
      sortOrder: 0,
      isPublic: true,
    },
    {
      name: "Silver",
      tier: "SILVER" as const,
      priceMonthly: 3,
      priceYearly: 30,
      description: "For creators growing their audience.",
      features: JSON.stringify([
        "basic_dashboard", "bulk_scheduling", "calendar",
        "media_library", "email_support",
      ]),
      limits: JSON.stringify({
        maxPlatforms: 2,
        maxAccountsPerPlatform: 10,
        maxScheduledPosts: -1,
        maxMediaStorageMB: 2048,
      }),
      sortOrder: 1,
      isPublic: true,
    },
    {
      name: "VIP Pro",
      tier: "VIP_PRO" as const,
      priceMonthly: 10,
      priceYearly: 100,
      description: "For agencies and power users.",
      features: JSON.stringify([
        "basic_dashboard", "bulk_scheduling", "calendar", "media_library",
        "ai_features", "analytics", "priority_queue", "advanced_scheduling",
        "team_workspace", "api_access", "priority_support",
      ]),
      limits: JSON.stringify({
        maxPlatforms: -1,
        maxAccountsPerPlatform: 100,
        maxScheduledPosts: -1,
        maxMediaStorageMB: 20480,
      }),
      sortOrder: 2,
      isPublic: true,
    },
    {
      name: "Enterprise",
      tier: "ENTERPRISE" as const,
      priceMonthly: 99,
      priceYearly: 990,
      description: "For large teams and organizations.",
      features: JSON.stringify([
        "basic_dashboard", "bulk_scheduling", "calendar", "media_library",
        "ai_features", "analytics", "priority_queue", "advanced_scheduling",
        "team_workspace", "api_access", "priority_support", "sso",
        "custom_branding", "dedicated_manager",
      ]),
      limits: JSON.stringify({
        maxPlatforms: -1,
        maxAccountsPerPlatform: 1000,
        maxScheduledPosts: -1,
        maxMediaStorageMB: 102400,
      }),
      sortOrder: 3,
      isPublic: false,
    },
  ];

  for (const plan of plans) {
    const existing = await db.plan.findUnique({ where: { name: plan.name } });
    if (existing) {
      await db.plan.update({ where: { id: existing.id }, data: plan });
      console.log(`  ✓ Updated plan: ${plan.name}`);
    } else {
      await db.plan.create({ data: plan });
      console.log(`  ✓ Created plan: ${plan.name}`);
    }
  }

  // ----- Demo admin user -----
  console.log("\n👤 Creating demo admin user...");
  const adminEmail = "alex@smtools.online";
  const adminPassword = "admin123";
  let admin = await db.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await db.user.create({
      data: {
        email: adminEmail,
        name: "Alex Morgan",
        passwordHash: await bcrypt.hash(adminPassword, 10),
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: new Date(),
        lastLoginAt: new Date(),
        avatarUrl: "https://i.pravatar.cc/150?img=12",
      },
    });
    console.log(`  ✓ Created admin: ${adminEmail} / ${adminPassword}`);
  } else {
    // Upgrade to admin + set password
    admin = await db.user.update({
      where: { id: admin.id },
      data: {
        role: "ADMIN",
        passwordHash: await bcrypt.hash(adminPassword, 10),
        status: "ACTIVE",
        emailVerified: new Date(),
      },
    });
    console.log(`  ✓ Updated admin: ${adminEmail} / ${adminPassword}`);
  }

  // Default settings
  const settings = await db.userSettings.findUnique({ where: { userId: admin.id } });
  if (!settings) {
    await db.userSettings.create({
      data: {
        userId: admin.id,
        timezone: "Asia/Dhaka",
      },
    });
  }

  // Subscribe admin to VIP Pro
  const vipPlan = await db.plan.findFirst({ where: { tier: "VIP_PRO" } });
  if (vipPlan) {
    const sub = await db.subscription.findUnique({ where: { userId: admin.id } });
    if (!sub) {
      await db.subscription.create({
        data: {
          userId: admin.id,
          planId: vipPlan.id,
          status: "ACTIVE",
          billingCycle: "MONTHLY",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });
      console.log("  ✓ Subscribed admin to VIP Pro");
    } else {
      await db.subscription.update({
        where: { id: sub.id },
        data: {
          planId: vipPlan.id,
          status: "ACTIVE",
        },
      });
      console.log("  ✓ Updated admin subscription to VIP Pro");
    }
  }

  // ----- Platform settings -----
  console.log("\n🌐 Creating platform settings...");
  const platforms = [
    { platform: "facebook", isEnabled: true, isPublic: true },
    { platform: "instagram", isEnabled: true, isPublic: true },
    { platform: "x", isEnabled: true, isPublic: true },
    { platform: "linkedin", isEnabled: true, isPublic: true },
    { platform: "pinterest", isEnabled: true, isPublic: true },
  ];
  for (const p of platforms) {
    const existing = await db.platformSetting.findUnique({ where: { platform: p.platform } });
    if (!existing) {
      await db.platformSetting.create({ data: p });
      console.log(`  ✓ ${p.platform}`);
    }
  }

  console.log("\n✅ Seed complete!");
  console.log("\n📋 Demo credentials:");
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Role:     ADMIN`);
  console.log(`   Plan:     VIP Pro`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
