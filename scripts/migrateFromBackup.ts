import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Connects to the live dev.db

const backupPrisma = new PrismaClient({ // Connects to the backup.db
  datasources: { db: { url: 'file:../prisma/backup.db' } },
});

async function main() {
  console.log('--- Starting final migration script ---');

  // 1. Get all data from the backup
  console.log('Reading data from backup.db...');
  const backupTournaments = await backupPrisma.tournament.findMany();
  const backupUsers = await backupPrisma.user.findMany();
  const backupPlayers = await backupPrisma.player.findMany();
  const backupMatches = await backupPrisma.match.findMany();
  console.log(`Found: ${backupUsers.length} users, ${backupPlayers.length} players, ${backupMatches.length} matches.`);

  // 2. Wipe the live database clean
  console.log('Wiping the live dev.db database clean...');
  await prisma.match.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tournament.deleteMany({});
  console.log('Live database is now empty.');

  // 3. Re-create all records one by one to preserve relationships
  console.log('Rebuilding database from backup data...');

  // Create records in order of dependency: Tournament -> User -> Player -> Match
  for (const tournament of backupTournaments) {
    await prisma.tournament.create({ data: tournament });
  }
  for (const user of backupUsers) {
    await prisma.user.create({ data: user });
  }
  for (const player of backupPlayers) {
    await prisma.player.create({ data: player });
  }
  for (const match of backupMatches) {
    await prisma.match.create({ data: match });
  }
  
  console.log('All records have been re-created.');
  console.log('✅ Migration complete. Your database is now an exact copy of your backup, with the corrected schema.');
}

main()
  .catch((e) => {
    console.error('An error occurred during the migration script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await backupPrisma.$disconnect();
  });
