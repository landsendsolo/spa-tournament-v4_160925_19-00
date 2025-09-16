import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting the process to merge duplicate players...");

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

  let mergedCount = 0;
  for (const [name, users] of usersByName.entries()) {
    if (users.length > 1) {
      console.log(`\nFound duplicate entries for: ${name}`);

      const realUser = users.find((u) => u.email || u.passwordHash);
      const placeholderUser = users.find((u) => !u.email && !u.passwordHash);

      if (realUser && placeholderUser) {
        const realPlayer = await prisma.player.findUnique({
          where: { userId: realUser.id },
        });
        const placeholderPlayer = await prisma.player.findUnique({
          where: { userId: placeholderUser.id },
        });

        if (realPlayer && placeholderPlayer) {
          console.log(`  - Real player ID: ${realPlayer.id}`);
          console.log(`  - Placeholder player ID: ${placeholderPlayer.id}`);

          // Re-assign all matches from the placeholder player to the real player
          await prisma.match.updateMany({
            where: { player1Id: placeholderPlayer.id },
            data: { player1Id: realPlayer.id },
          });
          await prisma.match.updateMany({
            where: { player2Id: placeholderPlayer.id },
            data: { player2Id: realPlayer.id },
          });
          await prisma.match.updateMany({
            where: { winnerId: placeholderPlayer.id },
            data: { winnerId: realPlayer.id },
          });
          console.log(`  - Re-assigned all matches.`);

          // Delete the now-obsolete placeholder records
          await prisma.player.delete({ where: { id: placeholderPlayer.id } });
          await prisma.user.delete({ where: { id: placeholderUser.id } });
          console.log(
            `  ✅ SUCCESS: Merged records and deleted duplicates for ${name}.`,
          );
          mergedCount++;
        } else if (placeholderPlayer && !realPlayer) {
          // This is the original scenario: just re-link the player
          await prisma.player.update({
            where: { id: placeholderPlayer.id },
            data: { userId: realUser.id },
          });
          await prisma.user.delete({ where: { id: placeholderUser.id } });
          console.log(
            `  ✅ SUCCESS: Re-linked player and deleted placeholder user for ${name}.`,
          );
          mergedCount++;
        }
      }
    }
  }

  console.log(
    `\nProcess complete. Merged or fixed records for ${mergedCount} players.`,
  );
}

main()
  .catch((e) => {
    console.error("An error occurred:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
