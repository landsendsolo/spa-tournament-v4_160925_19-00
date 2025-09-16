import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all players...');
  const players = await prisma.player.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  console.log('--- Player List ---');
  for (const player of players) {
    // We check if user and user.name exist to avoid errors
    const playerName = player.user?.name || 'Name Not Found';
    console.log(`${playerName}: ${player.id}`);
  }
  console.log('-------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
