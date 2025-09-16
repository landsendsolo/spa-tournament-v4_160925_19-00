import prisma from '@/lib/prisma';

// This type definition ensures our draw data is consistent.
type DrawEntry = {
  drawOrder: number;
  round: string;
  p1: string | null;
  p2: string | null;
};

// This array now defines the ENTIRE, CORRECT 26-match draw, including Round 3.
const correctDraw: DrawEntry[] = [
  // Round 1
  { drawOrder: 1, round: 'ROUND_1', p1: 'Steven Griggs', p2: 'Andy Moffat' },
  { drawOrder: 2, round: 'ROUND_1', p1: 'Neil Cochrane', p2: 'Sandy Drysdale' },
  { drawOrder: 3, round: 'ROUND_1', p1: 'Andy Lammie', p2: 'Graham Campbell' },
  { drawOrder: 4, round: 'ROUND_1', p1: 'Callum Brown', p2: 'Stevie Stores' },
  { drawOrder: 5, round: 'ROUND_1', p1: 'Paul Hamilton', p2: 'Steven Kirkpatrick' },
  { drawOrder: 6, round: 'ROUND_1', p1: 'Dan Thom', p2: 'Paul Harkness' },
  { drawOrder: 7, round: 'ROUND_1', p1: 'Daniel Wylie', p2: 'Sean Trainor' },
  { drawOrder: 8, round: 'ROUND_1', p1: 'Gavin Hunter', p2: 'Jonny Robertson' },
  { drawOrder: 9, round: 'ROUND_1', p1: 'Steven Couper', p2: 'Nathan Maloney' },
  { drawOrder: 10, round: 'ROUND_1', p1: 'Mark Lockhart', p2: 'Scott Johnston' },
  // Round 2
  { drawOrder: 11, round: 'ROUND_2', p1: 'Owen Bruce', p2: 'Winner(R1-1)' },
  { drawOrder: 12, round: 'ROUND_2', p1: 'Ross Turley', p2: 'Winner(R1-2)' },
  { drawOrder: 13, round: 'ROUND_2', p1: 'Tam Corsan', p2: 'Winner(R1-3)' },
  { drawOrder: 14, round: 'ROUND_2', p1: 'Ross Hutchison', p2: 'Winner(R1-4)' },
  { drawOrder: 15, round: 'ROUND_2', p1: 'Winner(R1-5)', p2: 'Winner(R1-6)' },
  { drawOrder: 16, round: 'ROUND_2', p1: 'Jayde Devlin', p2: 'Winner(R1-7)' },
  { drawOrder: 17, round: 'ROUND_2', p1: 'Winner(R1-8)', p2: 'Winner(R1-9)' },
  { drawOrder: 18, round: 'ROUND_2', p1: 'Kevin Galligan', p2: 'Winner(R1-10)' },
  // Round 3
  { drawOrder: 19, round: 'ROUND_3', p1: 'Winner(R2-1)', p2: 'Winner(R2-2)' },
  { drawOrder: 20, round: 'ROUND_3', p1: 'Winner(R2-3)', p2: 'Winner(R2-4)' },
  { drawOrder: 21, round: 'ROUND_3', p1: 'Winner(R2-5)', p2: 'Winner(R2-6)' },
  { drawOrder: 22, round: 'ROUND_3', p1: 'Winner(R2-7)', p2: 'Winner(R2-8)' },
  // Area Qualifiers (Round 4) - These are single-player slots representing the winners.
  { drawOrder: 23, round: 'AREA_QUALIFIER', p1: 'Winner(R3-1)', p2: null },
  { drawOrder: 24, round: 'AREA_QUALIFIER', p1: 'Winner(R3-2)', p2: null },
  { drawOrder: 25, round: 'AREA_QUALIFIER', p1: 'Winner(R3-3)', p2: null },
  { drawOrder: 26, round: 'AREA_QUALIFIER', p1: 'Winner(R3-4)', p2: null },
];

async function main() {
  console.log('--- Starting Tournament Draw Rebuild Script ---');

  const allPlayers = await prisma.player.findMany({ include: { user: true } });
  const playerMap = new Map<string, string>();
  allPlayers.forEach(p => {
    if (p.user.name) {
      playerMap.set(p.user.name, p.id);
    }
  });
  console.log(`[OK] Loaded ${playerMap.size} unique players into map.`);

  const missingPlayers = new Set<string>();
  correctDraw.forEach(matchData => {
    if (matchData.p1 && !playerMap.has(matchData.p1)) missingPlayers.add(matchData.p1);
    if (matchData.p2 && !playerMap.has(matchData.p2)) missingPlayers.add(matchData.p2);
  });
  if (missingPlayers.size > 0) {
    console.error(`[ERROR] Missing players in DB for draw: \n - ${[...missingPlayers].join('\n - ')}\nPlease ensure they are in the seed script. Aborting.`);
    process.exit(1);
  }
  console.log('[OK] All required players found.');

  const tournaments = await prisma.tournament.findMany({
    where: { name: 'SPA Scottish Singles - Area Qualifier' }
  });
  if (tournaments.length === 0) {
    console.error('[ERROR] No tournament found. Please run the seed script first. Aborting.');
    process.exit(1);
  }
  if (tournaments.length > 1) {
    console.error('[ERROR] Multiple tournaments found with the same name. Use ID or unique name. Aborting.');
    process.exit(1);
  }
  const tournament = tournaments[0];
  console.log(`[OK] Found tournament: "${tournament.name}"`);

  console.log('\n[INFO] Starting database transaction to rebuild draw...');

  try {
    await prisma.$transaction(async (tx) => {
      const { count } = await tx.match.deleteMany({ where: { tournamentId: tournament.id } });
      console.log(`[OK] Deleted ${count} old matches from this tournament.`);

      const createOperations = correctDraw.map(matchData => {
        const player1Id = matchData.p1 ? playerMap.get(matchData.p1)! : null;
        const player2Id = matchData.p2 ? playerMap.get(matchData.p2)! : null;
        const status = matchData.round === 'AREA_QUALIFIER' ? 'BYE' : 'PENDING';

        return tx.match.create({
          data: {
            tournamentId: tournament.id,
            drawOrder: matchData.drawOrder,
            round: matchData.round,
            player1Id,
            player2Id,
            status,
          }
        });
      });

      await Promise.all(createOperations);
      console.log(`[OK] Created ${createOperations.length} new matches.`);
    });
    
    // --- VERIFICATION IMPROVEMENT ---
    console.log('\n[INFO] Verifying created matches by round...');
    const createdMatches = await prisma.match.findMany({
        where: { tournamentId: tournament.id },
        select: { round: true }
    });
    const roundCounts = createdMatches.reduce((acc, match) => {
        acc[match.round] = (acc[match.round] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    console.log('[OK] Verification complete:', roundCounts);


    console.log('\n[SUCCESS] The tournament draw has been successfully rebuilt.');
  } catch (error) {
    console.error('\n[FATAL] An error occurred during the transaction. No changes were made to the database.');
    console.error(error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('[FATAL] An error occurred during rebuild:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
