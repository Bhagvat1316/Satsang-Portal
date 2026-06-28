const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial admin user...');

  const adminPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { userId: 'ADMIN001' },
    update: {},
    create: {
      userId: 'ADMIN001',
      username: 'admin',
      fullName: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  console.log('Seed completed successfully.');
  console.log('Admin User:', adminUser.userId);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
