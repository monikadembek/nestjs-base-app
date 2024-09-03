import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const saltRounds = 10;

async function main() {
  const user1password = await bcrypt.hash('admin', saltRounds);
  const user2password = await bcrypt.hash('password', saltRounds);

  const user1data = {
    name: 'Mina',
    password: user1password,
    email: 'monika.dembek@gmail.com',
  };

  const user2data = {
    name: 'Monika Cybercom',
    password: user2password,
    email: 'monika.cybercom@gmail.com',
  };

  const user1 = await prisma.user.create({
    data: user1data,
  });

  const user2 = await prisma.user.create({
    data: user2data,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
