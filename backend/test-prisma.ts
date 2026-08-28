import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Successfully connected to Prisma! Users found:", users.length);
  } catch (error) {
    console.error("Prisma Connection Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
