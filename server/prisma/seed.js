import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const salesPassword = await bcrypt.hash('sales123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@travelpro.com' },
    update: {},
    create: {
      email: 'admin@travelpro.com',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: 'sales@travelpro.com' },
    update: {},
    create: {
      email: 'sales@travelpro.com',
      username: 'sales',
      password: salesPassword,
      role: 'sales',
    },
  });

  console.log({ admin, sales });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 