import { PrismaClient } from '@prisma/client';

// Main client connects to the new, clean database
const prisma = new PrismaClient();

// Backup client connects to your old database file
const backupPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:../prisma/backup.db',
    },
  },
});

async function main() {
  console.log('Starting score restoration process...');

  // --- THIS IS THE FIX (Part 1) ---
  // First, get the ID of the tournament in the NEW database.
  const newTournament = await prisma.tournament.findFirst();
  if (!newTournament) {
    console.error('Error: No tournament found in the new database. Cannot restore scores.');
    return;
  }
  const newTournamentId = newTournament.id;
  console.log(`Found new tournament with ID: ${newTournamentId}`);
  
  const backupMatches = await backupPrisma.match.findMany();
  console.log(`Found ${backupMatches.length} matches in the backup.`);

  let updatedCount = 0;
  let failedCount = 0;

  for (const backupMatch of backupMatches) {
    try {
      // --- THIS IS THE FIX (Part 2) ---
      // We now find the match using the NEW tournamentId and the stable drawOrder.
      await prisma.match.update({
        where: {
          tournamentId_drawOrder: {
            tournamentId: newTournamentId, // Use the ID from the new database
            drawOrder: backupMatch.drawOrder,
          }
        },
        data: {
          scorePlayer1: backupMatch.scorePlayer1,
          scorePlayer2: backupMatch.scorePlayer2,
          status: backupMatch.status,
          winnerId: backupMatch.winnerId,
        },
      });
      updatedCount++;
    } catch (error) {
      failedCount++;
      // console.warn(`Could not update match with drawOrder ${backupMatch.drawOrder}. Skipping.`);
    }
  }

  console.log(`✅ Successfully updated ${updatedCount} matches.`);
  if (failedCount > 0) {
    console.log(`- Skipped ${failedCount} matches that could not be found in the new draw.`);
  }
}

main()
  .catch((e) => {
    console.error('An error occurred during the restoration script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await backupPrisma.$disconnect();
  });
