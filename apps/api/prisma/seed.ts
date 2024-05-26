import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();

  const passwordHash = await hash('admin-goiabada', 6);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: passwordHash,
    },
  });
}

seed().then(() => {
  console.log('Database seeded!');
});
