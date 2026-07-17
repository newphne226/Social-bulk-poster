// Prisma seed script - run with: npx prisma db seed
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create plans
  const freePlan = await prisma.plan.upsert({
    where: { name: 'Free' },
    update: {},
    create: {
      name: 'Free',
      tier: 'FREE',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Perfect for individuals testing the waters of social media automation.',
      features: JSON.stringify([
        '1 social platform',
        '1 connected account',
        '10 scheduled posts',
        'Basic dashboard',
        'Community support',
      ]),
      limits: JSON.stringify({
        maxPlatforms: 1,
        maxAccountsPerPlatform: 1,
        maxScheduledPosts: 10,
        maxMediaStorageMB: 50,
      }),
      isActive: true,
      isPublic: true,
      sortOrder: 0,
    },
  });

  const silverPlan = await prisma.plan.upsert({
    where: { name: 'Silver' },
    update: {},
    create: {
      name: 'Silver',
      tier: 'SILVER',
      priceMonthly: 300, // $3.00
      priceYearly: 3000, // $30.00
      description: 'Scale your content with multi-account management and bulk scheduling.',
      features: JSON.stringify([
        '2 social platforms',
        'Up to 10 accounts per platform',
        'Unlimited scheduled posts',
        'Bulk scheduling',
        'Calendar view',
        'Media library',
        'Email support',
      ]),
      limits: JSON.stringify({
        maxPlatforms: 2,
        maxAccountsPerPlatform: 10,
        maxScheduledPosts: -1,
        maxMediaStorageMB: 2048,
      }),
      isActive: true,
      isPublic: true,
      sortOrder: 1,
    },
  });

  const vipProPlan = await prisma.plan.upsert({
    where: { name: 'VIP Pro' },
    update: {},
    create: {
      name: 'VIP Pro',
      tier: 'VIP_PRO',
      priceMonthly: 1000, // $10.00
      priceYearly: 10000, // $100.00
      description: 'Unlock the full power of AI, analytics, and team collaboration.',
      features: JSON.stringify([
        'Unlimited platforms',
        'Up to 100 accounts per platform',
        'Unlimited scheduling & media',
        'AI features (caption, hashtag, emoji)',
        'Advanced analytics',
        'Priority queue',
        'Advanced scheduling',
        'Team workspace',
        'API access',
        'Priority support',
      ]),
      limits: JSON.stringify({
        maxPlatforms: -1,
        maxAccountsPerPlatform: 100,
        maxScheduledPosts: -1,
        maxMediaStorageMB: 20480,
      }),
      isActive: true,
      isPublic: true,
      sortOrder: 2,
    },
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { name: 'Enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      tier: 'ENTERPRISE',
      priceMonthly: 0, // Custom pricing
      priceYearly: 0,
      description: 'Custom solutions for large organizations with dedicated support.',
      features: JSON.stringify([
        'Unlimited platforms',
        'Up to 1000 accounts per platform',
        'Unlimited scheduling & media',
        'AI features (caption, hashtag, emoji)',
        'Advanced analytics',
        'Priority queue',
        'Advanced scheduling',
        'Team workspace',
        'API access',
        'Priority support',
        'SSO',
        'Custom branding',
        'Dedicated manager',
      ]),
      limits: JSON.stringify({
        maxPlatforms: -1,
        maxAccountsPerPlatform: 1000,
        maxScheduledPosts: -1,
        maxMediaStorageMB: 102400,
      }),
      isActive: true,
      isPublic: false,
      sortOrder: 3,
    },
  });

  console.log('✅ Plans created:', { freePlan, silverPlan, vipProPlan, enterprisePlan });

  // Create platform settings
  const platforms = [
    { platform: 'facebook', isEnabled: true, isPublic: true, config: JSON.stringify({}) },
    { platform: 'instagram', isEnabled: true, isPublic: true, config: JSON.stringify({}) },
    { platform: 'x', isEnabled: true, isPublic: true, config: JSON.stringify({}) },
    { platform: 'linkedin', isEnabled: true, isPublic: true, config: JSON.stringify({}) },
    { platform: 'pinterest', isEnabled: true, isPublic: true, config: JSON.stringify({}) },
  ];

  for (const p of platforms) {
    await prisma.platformSetting.upsert({
      where: { platform: p.platform },
      update: p,
      create: p,
    });
  }

  console.log('✅ Platform settings created');

  // Create AI settings
  await prisma.aISetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      provider: 'zai',
      model: 'glm-4.5',
      temperature: 0.7,
      maxTokens: 1000,
      isEnabled: true,
      dailyLimit: 1000,
      config: JSON.stringify({}),
    },
  });

  console.log('✅ AI settings created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });