import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting the final process to consolidate all duplicate data...');

  const allUsers = await prisma.user.findMany();
  const usersByName = new Map<string, User[]>();
  for (const user of allUsers) {
    if (user.name) {
      if (!usersByName.has(user.name)) {
        usersByName.set(user.name, []);
      }
      usersByName.get(user.name)!.push(user);
    }
  }

  let processedCount = 0;
  for (const [name, users] of usersByName.entries()) {
    if (users.length > 1) {
      console.log(`\nFound duplicate entries for: ${name}`);

      const realUser = users.find(u => u.email || u.passwordHash);
      const placeholderUser = users.find(u => !u.email && !u.passwordHash);

      if (realUser && placeholderUser) {
        const realPlayer = await prisma.player.findUnique({ where: { userId: realUser.id } });
        const placeholderPlayer = await prisma.player.findUnique({ where: { userId: placeholderUser.id } });

        // SCENARIO 1: MERGE - Both real and placeholder users have a player record.
        if (realPlayer && placeholderPlayer) {
          console.log(`  - Found duplicate PLAYER records. Merging...`);
          await prisma.match.updateMany({ where: { player1Id: placeholderPlayer.id }, data: { player1Id: realPlayer.id } });
          await prisma.match.updateMany({ where: { player2Id: placeholderPlayer.id }, data: { player2Id: realPlayer.id } });
          await prisma.match.updateMany({ where: { winnerId: placeholderPlayer.id }, data: { winnerId: realPlayer.id } });
          console.log(`  - Re-assigned all matches.`);
          
          await prisma.player.delete({ where: { id: placeholderPlayer.id } });
          await prisma.user.delete({ where: { id: placeholderUser.id } });
          console.log(`  ✅ SUCCESS: Merged records and deleted duplicates for ${name}.`);
          processedCount++;
        
        // SCENARIO 2: RE-LINK - Only the placeholder user has a player record.
        } else if (placeholderPlayer && !realPlayer) {
          console.log(`  - Found one player record to re-link...`);
          await prisma.player.update({
            where: { id: placeholderPlayer.id },
            data: { userId: realUser.id }
          });
          await prisma.user.delete({ where: { id: placeholderUser.id } });
          console.log(`  ✅ SUCCESS: Re-linked player and deleted placeholder user for ${name}.`);
          processedCount++;
        } else {
            console.log(`  - INFO: No action needed or unknown scenario for ${name}.`);
        }
      }
    }
  }

  console.log(`\nProcess complete. Consolidated records for ${processedCount} players.`);
}

main()
  .catch((e) => {
    console.error('An error occurred:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
