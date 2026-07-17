const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin',
      passwordHash: hash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date(),
      lastLoginAt: new Date(),
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
    },
  });
  const freePlan = await prisma.plan.findFirst({ where: { tier: 'FREE' } });
  if (freePlan) {
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {},
      create: { 
        userId: user.id, 
        planId: freePlan.id, 
        status: 'ACTIVE', 
        billingCycle: 'MONTHLY', 
        currentPeriodStart: new Date(), 
        currentPeriodEnd: new Date(Date.now() + 365*24*60*60*1000) 
      },
    });
  }
  console.log('Admin created:', user.email, '| Role:', user.role);
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());