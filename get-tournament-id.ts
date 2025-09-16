import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tournament = await prisma.tournament.findFirst({ where: { name: 'Sample Tournament' } });
  console.log(tournament?.id);
}

main().finally(() => prisma.$disconnect());
