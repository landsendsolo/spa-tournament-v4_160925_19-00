import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
// --- THIS IS THE FIX ---
// We've added a 'Test Player' to the list of participants to be created.
const playerNames = [
    // Real Players
    'Steven Griggs', 'Andy Moffat', 'Neil Cochrane', 'Sandy Drysdale', 'Andy Lammie', 'Graham Campbell',
    'Callum Brown', 'Stevie Stores', 'Paul Hamilton', 'Steven Kirkpatrick', 'Dan Thom', 'Paul Harkness',
    'Daniel Wylie', 'Sean Trainor', 'Gavin Hunter', 'Jonny Robertson', 'Steven Couper', 'Nathan Maloney',
    'Mark Lockhart', 'Scott Johnston', 'Owen Bruce', 'Ross Turley', 'Tam Corsan', 'Ross Hutchison',
    'Jayde Devlin', 'Kevin Galligan',
    // Placeholder Players
    'Winner(R1-1)', 'Winner(R1-2)', 'Winner(R1-3)', 'Winner(R1-4)', 'Winner(R1-5)',
    'Winner(R1-6)', 'Winner(R1-7)', 'Winner(R1-8)', 'Winner(R1-9)', 'Winner(R1-10)',
    'Winner(R2-1)', 'Winner(R2-2)', 'Winner(R2-3)', 'Winner(R2-4)', 'Winner(R2-5)',
    'Winner(R2-6)', 'Winner(R2-7)', 'Winner(R2-8)',
    'Winner(R3-1)', 'Winner(R3-2)', 'Winner(R3-3)', 'Winner(R3-4)',
    // Test Player for Admin
    'Test Player',
];
async function seedAdminUser() {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingAdmin) {
        console.log('[INFO] Admin user already exists. Skipping.');
        return;
    }
    console.log('[INFO] Creating admin user...');
    const hashedPassword = await bcrypt.hash('password', 12);
    await prisma.user.create({
        data: {
            name: 'Admin',
            email: adminEmail,
            passwordHash: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('[OK] Admin user created successfully (email: admin@example.com, pass: password).');
}
async function seedTournament() {
    const existingTournament = await prisma.tournament.findFirst({
        where: { name: 'SPA Scottish Singles - Area Qualifier' }
    });
    if (existingTournament) {
        console.log(`[INFO] Tournament "${existingTournament.name}" already exists. Skipping.`);
        return;
    }
    console.log('[INFO] Creating new tournament...');
    await prisma.tournament.create({
        data: {
            name: 'SPA Scottish Singles - Area Qualifier',
            startDate: new Date('2025-09-13T10:00:00Z'),
            status: 'UPCOMING',
        },
    });
    console.log('[OK] New tournament created successfully.');
}
async function seedPlayers() {
    const existingUsers = await prisma.user.findMany({
        where: { name: { in: playerNames } }
    });
    const existingNames = new Set(existingUsers.map(u => u.name).filter((name) => name !== null));
    const newPlayerNames = playerNames.filter(name => !existingNames.has(name));
    if (newPlayerNames.length === 0) {
        console.log('[INFO] All players and placeholders already exist. Skipping.');
        return;
    }
    console.log(`[INFO] Seeding ${newPlayerNames.length} new players and placeholders...`);
    for (const name of newPlayerNames) {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({ data: { name, role: 'PLAYER' } });
            await tx.player.create({ data: { userId: user.id } });
        });
        console.log(`[OK] Created participant: ${name}`);
    }
}
async function main() {
    console.log('--- Starting Seeding Script ---');
    await seedAdminUser();
    await seedTournament();
    await seedPlayers();
    console.log('--- Seeding Complete ---');
}
main()
    .catch((e) => {
    console.error('[FATAL] An error occurred during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
