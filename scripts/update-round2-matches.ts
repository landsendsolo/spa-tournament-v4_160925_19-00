import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateRound2Matches() {
  try {
    const tournament = await prisma.tournament.findFirst();
    if (!tournament) throw new Error('No tournament found');

    const matches = [
      { player1: 'Owen Bruce', player2: 'Andy Moffat', score1: 6, score2: 7, status: 'COMPLETED', drawOrder: 11 },
      { player1: 'Ross Turley', player2: 'Neil Cochrane', score1: 7, score2: 0, status: 'COMPLETED', drawOrder: 12 },
      { player1: 'Tam Corsan', player2: 'Graham Campbell', score1: 7, score2: 5, status: 'COMPLETED', drawOrder: 13 },
      { player1: 'Ross Hutchison', player2: 'Stevie Stores', score1: 6, score2: 7, status: 'COMPLETED', drawOrder: 14 },
      { player1: 'Steven Kirkpatrick', player2: 'Dan Thom', score1: 7, score2: 4, status: 'COMPLETED', drawOrder: 15 },
      { player1: 'Jayde Devlin', player2: 'Daniel Wylie', score1: 7, score2: 6, status: 'COMPLETED', drawOrder: 16 },
      { player1: 'Steven Couper', player2: 'Jonny Robertson', score1: 7, score2: 0, status: 'PENDING', drawOrder: 17 },
      { player1: 'Kevin Galligan', player2: 'Mark Lockhart', score1: 7, score2: 1, status: 'COMPLETED', drawOrder: 18 },
    ];

    for (const match of matches) {
      const player1 = await prisma.player.findFirst({
        where: { user: { name: match.player1 } },
      });
      const player2 = await prisma.player.findFirst({
        where: { user: { name: match.player2 } },
      });

      if (!player1 || !player2) {
        console.log(`Skipping match: ${match.player1} vs ${match.player2} - player not found`);
        continue;
      }

      const existingMatch = await prisma.match.findFirst({
        where: { round: 'ROUND_2', drawOrder: match.drawOrder },
      });

      if (existingMatch) {
        await prisma.match.update({
          where: { id: existingMatch.id },
          data: {
            player1Id: player1.id,
            player2Id: player2.id,
            scorePlayer1: match.score1,
            scorePlayer2: match.score2,
            status: match.status,
          },
        });
        console.log(`Updated match: ${match.player1} vs ${match.player2}`);
      } else {
        await prisma.match.create({
          data: {
            id: crypto.randomUUID(),
            tournamentId: tournament.id,
            drawOrder: match.drawOrder,
            round: 'ROUND_2',
            player1Id: player1.id,
            player2Id: player2.id,
            scorePlayer1: match.score1,
            scorePlayer2: match.score2,
            status: match.status,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log(`Created match: ${match.player1} vs ${match.player2}`);
      }
    }

    console.log('Round 2 matches updated.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRound2Matches();
