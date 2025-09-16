import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

// --- Defining specific interfaces for the old data shapes ---
interface OldPlayer {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  seed?: number;
}

interface OldMatch {
  id: string;
  round: string;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  scorePlayer1?: number;
  scorePlayer2?: number;
  scheduledTime?: string;
  location?: string;
}

// Define a type for the keys of roundMap to satisfy TypeScript's strict rules
type OldRound = 'R1' | 'R2' | 'R3' | 'QF' | 'SF' | 'F' | '3RD';
const roundMap: Record<OldRound, string> = {
  'R1': 'ROUND_1',
  'R2': 'ROUND_2',
  'R3': 'ROUND_2',
  'QF': 'QUARTERFINAL',
  'SF': 'SEMIFINAL',
  'F': 'FINAL',
  '3RD': 'THIRD_PLACE',
};

async function main() {
  const oldPlayers = JSON.parse(fs.readFileSync('players.json', 'utf8')) as OldPlayer[];
  const oldMatches = JSON.parse(fs.readFileSync('fixtures.json', 'utf8')) as OldMatch[];

  // --- Use a Map keyed by player ID for efficient O(1) lookups ---
  const playerMap = new Map<string, OldPlayer>(oldPlayers.map(p => [p.id, p]));

  let userSuccess = 0, playerSuccess = 0, matchSuccess = 0;
  let userFails = 0, playerFails = 0, matchFails = 0;
  let userSkips = 0, matchSkips = 0;

  console.log('Starting migration within a database transaction...');
  try {
    await prisma.$transaction(async (tx) => {
      console.log('--- Migrating Users ---');
      for (const oldPlayer of oldPlayers) {
        if (!oldPlayer.email || !oldPlayer.name) {
          console.error(`Skipping user with ID ${oldPlayer.id} due to missing name or email.`);
          userSkips++;
          continue;
        }
        try {
          await tx.user.upsert({
            where: { email: oldPlayer.email },
            update: {},
            create: {
              id: oldPlayer.id,
              name: oldPlayer.name,
              email: oldPlayer.email,
              mobile: oldPlayer.mobile,
              role: 'PLAYER',
            },
          });
          userSuccess++;
        } catch (e) {
          console.error(`Failed to migrate user ${oldPlayer.id} (${oldPlayer.name}):`, e);
          userFails++;
        }
      }

      console.log('--- Migrating Player Profiles ---');
      for (const oldPlayer of oldPlayers) {
        try {
          await tx.player.upsert({
            where: { userId: oldPlayer.id },
            update: {},
            create: {
              id: oldPlayer.id,
              userId: oldPlayer.id,
              seed: oldPlayer.seed?.toString(),
            },
          });
          playerSuccess++;
        } catch (e) {
          console.error(`Failed to migrate player profile for ${oldPlayer.id}:`, e);
          playerFails++;
        }
      }

      console.log('--- Migrating Matches ---');
      for (const oldMatch of oldMatches) {
        const player1 = playerMap.get(oldMatch.player1Id);
        const player2 = playerMap.get(oldMatch.player2Id);
        const winner = oldMatch.winnerId ? playerMap.get(oldMatch.winnerId) : undefined;

        if (oldMatch.winnerId && !winner) {
          console.warn(`Match ${oldMatch.id} has winnerId ${oldMatch.winnerId}, but no matching player was found by ID. Winner will be set to undefined.`);
        }

        if (!player1) console.log(`No player1 for match ${oldMatch.id}, searched ID: ${oldMatch.player1Id} (type: ${typeof oldMatch.player1Id})`);
        if (!player2) console.log(`No player2 for match ${oldMatch.id}, searched ID: ${oldMatch.player2Id}`);

        if (player1 && player2) {
          try {
            let scheduledDate: Date | undefined = undefined;
            if (oldMatch.scheduledTime) {
              const parsedDate = new Date(oldMatch.scheduledTime);
              if (isNaN(parsedDate.getTime())) {
                throw new Error(`Invalid date format: ${oldMatch.scheduledTime}`);
              }
              scheduledDate = parsedDate;
            }

            let status: string = 'PENDING';
            if (oldMatch.winnerId && winner) {
              status = 'COMPLETED';
            } else if ((oldMatch.scorePlayer1 ?? 0) > 0 || (oldMatch.scorePlayer2 ?? 0) > 0) {
              status = 'IN_PROGRESS';
            }

            await tx.match.create({
              data: {
                tournamentId: '6870c90e-fe37-4625-95c0-4e12218e1bdb',
                round: roundMap[oldMatch.round.toUpperCase() as OldRound] ?? 'ROUND_1',
                player1Id: player1.id,
                player2Id: player2.id,
                scorePlayer1: oldMatch.scorePlayer1 || 0,
                scorePlayer2: oldMatch.scorePlayer2 || 0,
                status,
                winnerId: winner?.id ?? undefined,
                scheduledTime: scheduledDate,
                location: oldMatch.location || 'TBC',
                drawOrder: parseInt(oldMatch.id, 10) || 0, // Derive drawOrder from match ID; adjust if needed
              },
            });
            matchSuccess++;
          } catch (e) {
            console.error(`Failed to migrate match ${oldMatch.id}:`, e);
            matchFails++;
          }
        } else {
          console.warn(`Skipping match ${oldMatch.id} due to missing player(s) by ID lookup.`);
          matchSkips++;
        }
      }

      if (userFails > 0 || playerFails > 0 || matchFails > 0) {
        throw new Error(`Migration had failures: Users ${userFails}, Players ${playerFails}, Matches ${matchFails}. Rolling back transaction.`);
      }
    });
    console.log('Transaction successful. Full migration complete.');
  } catch (error) {
    console.error('The migration transaction failed and has been rolled back.', error);
  } finally {
    console.log('\n--- MIGRATION SUMMARY ---');
    console.log(`Users: ${userSuccess} succeeded, ${userFails} failed, ${userSkips} skipped out of ${oldPlayers.length} total.`);
    console.log(`Players: ${playerSuccess} succeeded, ${playerFails} failed out of ${oldPlayers.length} total.`);
    console.log(`Matches: ${matchSuccess} succeeded, ${matchFails} failed, ${matchSkips} skipped out of ${oldMatches.length} total.`);
    console.log('-------------------------\n');
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('An unexpected error occurred in the main execution block:', e);
  process.exit(1);
});
