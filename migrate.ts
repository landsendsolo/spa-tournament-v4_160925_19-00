import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import BetterSqlite3 from 'better-sqlite3';

interface MigrationReport {
  migrated: { players: number; matches: number };
  errors: string[];
  warnings: string[];
  success: boolean;
}

// Interfaces for old database tables
interface OldPlayer {
  id: string;
  name: string;
  email?: string;
  seed?: string;
  status?: string;
}

interface OldMatch {
  id: string;
  round?: string;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  scorePlayer1?: number;
  scorePlayer2?: number;
  status?: string;
  scheduledTime?: string;
  location?: string;
}

interface OldFrame {
  frameNumber: number;
  winnerId?: string;
}

// Map old round values to valid Match.round strings
const roundMap: Record<string, string> = {
  'R1': 'ROUND_1',
  'R2': 'ROUND_2',
  'R3': 'ROUND_2',
  'QF': 'QUARTERFINAL',
  'SF': 'SEMIFINAL',
  'F': 'FINAL',
  '3RD': 'THIRD_PLACE',
};

// Map old status values to valid Match.status strings
const statusMap: Record<string, string> = {
  'PENDING': 'PENDING',
  'IN_PROGRESS': 'IN_PROGRESS',
  'COMPLETED': 'COMPLETED',
};

async function main(dryRun: boolean = false) {
  const report: MigrationReport = { migrated: { players: 0, matches: 0 }, errors: [], warnings: [], success: true };
  const prisma = new PrismaClient();
  const oldDbPath = '/root/temp_backup/app/prisma/tournament.db';
  console.log(`Using: ${oldDbPath}`);
  const oldDb = BetterSqlite3(oldDbPath);

  try {
    await prisma.$transaction(async (tx) => {
      // Query Player table with explicit typing
      const oldPlayers = oldDb.prepare('SELECT * FROM Player').all() as OldPlayer[];

      for (const oldPlayer of oldPlayers) {
        if (!oldPlayer.name) {
          report.warnings.push(`Player ${oldPlayer.id} no name - skip`);
          continue;
        }
        const newUserId = crypto.randomUUID();
        const newPlayerId = crypto.randomUUID();
        try {
          await tx.user.create({
            data: {
              id: newUserId,
              name: oldPlayer.name,
              email: oldPlayer.email || `${oldPlayer.name.toLowerCase().replace(/ /g, '')}@example.com`,
              role: 'PLAYER',
            },
          });
          await tx.player.create({
            data: {
              id: newPlayerId,
              userId: newUserId,
              seed: oldPlayer.seed,
              status: oldPlayer.status === 'eliminated' ? 'ELIMINATED' : 'ACTIVE',
            },
          });
          report.migrated.players++;
        } catch (e: any) {
          report.errors.push(`Player ${oldPlayer.id}: ${e.message}`);
          report.success = false;
        }
      }

      // Query Fixture table with explicit typing
      const oldMatches = oldDb.prepare('SELECT * FROM Fixture').all() as OldMatch[];

      for (const oldMatch of oldMatches) {
        const player1 = await tx.player.findFirst({ where: { seed: oldMatch.player1Id } });
        const player2 = await tx.player.findFirst({ where: { seed: oldMatch.player2Id } });
        const winner = oldMatch.winnerId ? await tx.player.findFirst({ where: { seed: oldMatch.winnerId } }) : null;

        if (!player1 || !player2) {
          report.warnings.push(`Match ${oldMatch.id} invalid players - skip`);
          continue;
        }

        try {
          const round = oldMatch.round
            ? roundMap[oldMatch.round.toUpperCase().replace(/ /g, '_')] ?? 'ROUND_1'
            : 'ROUND_1';
          const status = oldMatch.status
            ? statusMap[oldMatch.status.toUpperCase()] ?? 'PENDING'
            : 'PENDING';

          const newMatch = await tx.match.create({
            data: {
              tournamentId: '6870c90e-fe37-4625-95c0-4e12218e1bdb',
              round,
              player1Id: player1.id,
              player2Id: player2.id,
              scorePlayer1: oldMatch.scorePlayer1 || 0,
              scorePlayer2: oldMatch.scorePlayer2 || 0,
              winnerId: winner?.id,
              status,
              scheduledTime: oldMatch.scheduledTime ? new Date(oldMatch.scheduledTime) : undefined,
              location: oldMatch.location,
              drawOrder: parseInt(oldMatch.id, 10) || 0, // Derive drawOrder; adjust if needed
            },
          });

          const oldFrames = oldDb.prepare('SELECT * FROM Frame WHERE fixtureId = ?').all(oldMatch.id) as OldFrame[];
          if (oldFrames.length) {
            await tx.result.create({
              data: {
                matchId: newMatch.id,
                frameDetails: oldFrames.map(f => ({ frame: f.frameNumber, winner: f.winnerId })),
              },
            });
          }
          report.migrated.matches++;
        } catch (e: any) {
          report.errors.push(`Match ${oldMatch.id}: ${e.message}`);
          report.success = false;
        }
      }

      if (dryRun) throw new Error('Dry run rollback');
    });

    oldDb.close();
  } catch (e: any) {
    report.success = false;
    report.errors.push(`Error: ${e.message}`);
    if (e.message.includes('connection')) {
      console.log('Retrying...');
      return main(dryRun);
    }
  } finally {
    fs.writeFileSync('migration-report.json', JSON.stringify(report, null, 2));
    console.log('Report in migration-report.json');
    await prisma.$disconnect();
    oldDb.close();
  }
}

const isDryRun = process.argv.includes('--dry-run');
main(isDryRun);
