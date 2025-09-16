import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const targetName = "Jonny Robertson";
  console.log(`Searching for player: ${targetName}`);

  const user = await prisma.user.findFirst({
    where: { name: targetName },
    include: { player: true },
  });

  if (user && user.player) {
    console.log("\n--- Player Found ---");
    console.log(`Name: ${user.name}`);
    console.log(`Player ID: ${user.player.id}`);
    console.log("--------------------\n");
    console.log("Please copy the Player ID from the line above.");
  } else {
    console.error(
      `Error: Could not find a player in the database named '${targetName}'. Please check the name for typos.`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
