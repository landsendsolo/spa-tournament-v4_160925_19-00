import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listPlayers() {
  console.log("Fetching players...");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      mobile: true, // Also select the mobile number
    },
    orderBy: {
      name: "asc",
    },
  });

  if (users.length === 0) {
    console.log("No players found in the database.");
    return;
  }

  console.log("--- Player List with Mobile Length Check ---");
  users.forEach((user) => {
    // Check the length of the mobile number string
    const mobileLength = user.mobile ? user.mobile.length : "N/A";
    console.log(
      `Name: ${user.name.padEnd(20)} | Mobile: ${user.mobile} \t| Length: ${mobileLength}`,
    );
  });
  console.log("------------------------------------------");
}

listPlayers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
