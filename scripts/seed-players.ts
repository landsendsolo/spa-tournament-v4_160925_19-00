import prisma from '@/lib/prisma';

// This array now contains all 26 real players AND 22 placeholders for the full draw structure.
const playerNames = [
  // Real Players
  'Steven Griggs', 'Andy Moffat', 'Neil Cochrane', 'Sandy Drysdale', 'Andy Lammie', 'Graham Campbell', 
  'Callum Brown', 'Stevie Stores', 'Paul Hamilton', 'Steven Kirkpatrick', 'Dan Thom', 'Paul Harkness', 
  'Daniel Wylie', 'Sean Trainor', 'Gavin Hunter', 'Jonny Robertson', 'Steven Couper', 'Nathan Maloney', 
  'Mark Lockhart', 'Scott Johnston', 'Owen Bruce', 'Ross Turley', 'Tam Corsan', 'Ross Hutchison', 
  'Jayde Devlin', 'Kevin Galligan',
  // Placeholder Players for future rounds
  'Winner(R1-1)', 'Winner(R1-2)', 'Winner(R1-3)', 'Winner(R1-4)', 'Winner(R1-5)',
  'Winner(R1-6)', 'Winner(R1-7)', 'Winner(R1-8)', 'Winner(R1-9)', 'Winner(R1-10)',
  'Winner(R2-1)', 'Winner(R2-2)', 'Winner(R2-3)', 'Winner(R2-4)', 'Winner(R2-5)',
  'Winner(R2-6)', 'Winner(R2-7)', 'Winner(R2-8)',
  // Placeholders for the 4 Area Qualifiers (Winners of Round 3)
  'Winner(R3-1)', 'Winner(R3-2)', 'Winner(R3-3)', 'Winner(R3-4)',
];

async function main() {
  console.log('--- Starting Player Seeding Script ---');
  
  // This will ensure we don't create duplicate users if the script is run multiple times.
  const existingUsers = await prisma.user.findMany({
    where: {
      name: {
        in: playerNames
      }
    }
  });

  const existingNames = new Set(existingUsers.map(u => u.name).filter((name): name is string => name !== null));
  const newPlayerNames = playerNames.filter(name => name && !existingNames.has(name));

  if (newPlayerNames.length === 0) {
    console.log('[INFO] All players already exist in the database. No new players were seeded.');
  } else {
    console.log(`[INFO] Seeding ${newPlayerNames.length} new players...`);
    for (const name of newPlayerNames) {
      // Use a transaction to ensure both User and Player are created, or neither is.
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: { name, role: 'PLAYER' },
        });
        await tx.player.create({
          data: { userId: user.id },
        });
      });
      console.log(`[OK] Created player: ${name}`);
    }
  }

  console.log('--- Seeding Complete ---');
}

main()
  .catch(async (e) => {
    console.error('[FATAL] An error occurred during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

