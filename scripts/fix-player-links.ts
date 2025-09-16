import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

// Define a type for a User that includes their potential Player record
type UserWithPlayer = User & { player: { id: string } | null };

async function main() {
  console.log("Starting the process to fix player links...");

  // 1. Get all users from the database
  const allUsers = await prisma.user.findMany();

  // 2. Group users by their name to find duplicates
  const usersByName = new Map<string, User[]>();
  for (const user of allUsers) {
    if (user.name) {
      if (!usersByName.has(user.name)) {
        usersByName.set(user.name, []);
      }
      usersByName.get(user.name)!.push(user);
    }
  }

  // 3. Iterate through the groups and process duplicates
  let fixedCount = 0;
  for (const [name, users] of usersByName.entries()) {
    if (users.length > 1) {
      console.log(`\nFound duplicate entries for: ${name}`);

      // Identify the "real" user (has email/pass) and the "placeholder"
      const realUser = users.find((u) => u.email || u.passwordHash);
      const placeholderUser = users.find((u) => !u.email && !u.passwordHash);

      if (realUser && placeholderUser) {
        console.log(`  - Real user ID: ${realUser.id}`);
        console.log(`  - Placeholder user ID: ${placeholderUser.id}`);

        // Find the Player record linked to the placeholder user
        const playerToUpdate = await prisma.player.findUnique({
          where: { userId: placeholderUser.id },
        });

        if (playerToUpdate) {
          // Update the Player record to point to the "real" user's ID
          await prisma.player.update({
            where: { id: playerToUpdate.id },
            data: { userId: realUser.id },
          });
          console.log(
            `  ✅ SUCCESS: Player record ${playerToUpdate.id} is now linked to the real user.`,
          );
          fixedCount++;
        } else {
          console.log(
            `  - INFO: No player record was linked to the placeholder user. Nothing to fix.`,
          );
        }
      } else {
        console.log(
          `  - WARNING: Could not clearly identify real vs. placeholder user for ${name}. Skipping.`,
        );
      }
    }
  }

  console.log(`\nProcess complete. Fixed the links for ${fixedCount} players.`);
}

main()
  .catch((e) => {
    console.error("An error occurred:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
