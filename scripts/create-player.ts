import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createPlayer() {
  try {
    let user = await prisma.user.findFirst({
      where: { name: 'Jonny Robertson' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Jonny Robertson',
          role: 'PLAYER',
        },
      });
      console.log('Created User:', user.id);
    }

    let player = await prisma.player.findFirst({
      where: { userId: user.id },
    });

    if (!player) {
      player = await prisma.player.create({
        data: {
          userId: user.id,
          status: 'ACTIVE',
        },
      });
      console.log('Created Player:', player.id);
    }

    console.log('Player setup complete for Jonny Robertson.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPlayer();
