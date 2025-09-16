import prisma from "../src/lib/prisma.ts";

async function fixPlayerRecords() {
  console.log(
    "Starting to fix Player records for all registered users with role PLAYER...",
  );

  // Find all registered players (with passwordHash and role PLAYER)
  const users = await prisma.user.findMany({
    where: {
      role: "PLAYER",
      passwordHash: { not: null }, // Ensure only registered users are processed
    },
    include: { player: true },
  });

  console.log(`Found ${users.length} registered users with role PLAYER:`);
  for (const [index, user] of users.entries()) {
    console.log(
      `[${index + 1}] User: ${user.name || "Unnamed"} (ID: ${user.id})`,
    );
    if (!user.player) {
      console.log(`No Player record found for ${user.name}. Creating one...`);
      await prisma.player.create({
        data: {
          userId: user.id,
          status: "ACTIVE",
        },
      });
      console.log(
        `Created Player record for ${user.name} with userId: ${user.id}`,
      );
    } else {
      console.log(
        `Player record already exists for ${user.name} with status: ${user.player.status}`,
      );
    }
  }

  console.log("Player record fix completed.");
  await prisma.$disconnect();
}

fixPlayerRecords().catch((error) => {
  console.error("Error fixing Player records:", error);
  prisma.$disconnect();
  process.exit(1);
});
