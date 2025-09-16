import prisma from "/home/ubuntu/spa-tournament-v4-final/src/lib/prisma";
async function fixPlayerRecords() {
  console.log("Starting to fix Player records...");
  const users = await prisma.user.findMany({
    where: {
      role: "PLAYER",
      passwordHash: { not: null },
    },
    include: { player: true },
  });
  for (const user of users) {
    const userName = user.name || "Unnamed";
    console.log("Checking user: " + userName + " (ID: " + user.id + ")");
    if (!user.player) {
      console.log(
        "No Player record found for " + userName + ". Creating one...",
      );
      await prisma.player.create({
        data: {
          userId: user.id,
          status: "ACTIVE",
          seed: user.registrationCode || null, // Use user.registrationCode for seed
        },
      });
      console.log(
        "Created Player record for " + userName + " with userId: " + user.id,
      );
    } else {
      console.log(
        "Player record already exists for " +
          userName +
          " with status: " +
          user.player.status,
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
