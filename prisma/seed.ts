import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// The full, correct draw structure
const correctDraw = [
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
  // Area Qualifiers
  { drawOrder: 23, round: 'AREA_QUALIFIER', p1: 'Winner(R3-1)', p2: null },
  { drawOrder: 24, round: 'AREA_QUALIFIER', p1: 'Winner(R3-2)', p2: null },
  { drawOrder: 25, round: 'AREA_QUALIFIER', p1: 'Winner(R3-3)', p2: null },
  { drawOrder: 26, round: 'AREA_QUALIFIER', p1: 'Winner(R3-4)', p2: null },
];

async function main() {
    console.log('Starting the definitive seed script...');

    // Create Admin User
    const password = await bcrypt.hash('password', 10);
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: { email: 'admin@example.com', name: 'Tournament Admin', role: 'ADMIN', passwordHash: password },
    });
    console.log('Admin user created/verified.');

    // Create Tournament
    const tournament = await prisma.tournament.create({
        data: { name: 'SPA Scottish Singles - Area Qualifier', startDate: new Date() },
    });
    console.log(`Created tournament: "${tournament.name}"`);

    // Create all players and placeholders from the draw structure
    const playerMap = new Map<string, { id: string }>();
    const playerNamesInDraw = new Set<string>();
    correctDraw.forEach(m => {
        if (m.p1) playerNamesInDraw.add(m.p1);
        if (m.p2) playerNamesInDraw.add(m.p2);
    });

    for (const name of playerNamesInDraw) {
        const isPlaceholder = name.startsWith('Winner(');
        const user = await prisma.user.create({
            data: {
                name,
                role: isPlaceholder ? 'PLACEHOLDER' : 'PLAYER',
                email: isPlaceholder ? `${name.replace(/[()\s-]/g, '')}@placeholder.com` : null,
            },
        });
        const player = await prisma.player.create({ data: { userId: user.id } });
        playerMap.set(name, player);
    }
    console.log(`Created ${playerMap.size} player/placeholder records.`);

    // Create all 26 matches
    for (const matchData of correctDraw) {
        const player1Id = matchData.p1 ? playerMap.get(matchData.p1)!.id : null;
        const player2Id = matchData.p2 ? playerMap.get(matchData.p2)!.id : null;
        await prisma.match.create({
            data: {
                tournamentId: tournament.id,
                drawOrder: matchData.drawOrder,
                round: matchData.round,
                status: matchData.round === 'AREA_QUALIFIER' ? 'BYE' : 'PENDING',
                player1Id,
                player2Id,
            },
        });
    }
    console.log('Successfully created all 26 matches.');
    console.log('Seed script finished successfully.');
}

main()
    .catch(async (e) => {
        console.error('Error running seed script:', e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
