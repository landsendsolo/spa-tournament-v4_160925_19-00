import prisma from "../src/lib/prisma.ts";

async function resetAllPlayers() {
  console.log("Starting to reset all players from playerMap...");

  const playerMap = new Map<string, { mobile: string; code: string }>([
    ["andy lammie", { mobile: "07920115853", code: "7SS81N" }],
    ["andy moffat", { mobile: "07376135923", code: "7TJ9FR" }],
    ["callum brown", { mobile: "07909957995", code: "JJYSQT" }],
    ["dan thom", { mobile: "07734859989", code: "8G2G1P" }],
    ["daniel wylie", { mobile: "07787426226", code: "LP7U9Q" }],
    ["gavin hunter", { mobile: "07494795635", code: "3K7S0U" }],
    ["graham campbell", { mobile: "07780912377", code: "IK9AP2" }],
    ["jayde devlin", { mobile: "07901730898", code: "IVJT9H" }],
    ["jonny robertson", { mobile: "07749403710", code: "FXC0DK" }],
    ["kevin galligan", { mobile: "07530560632", code: "G704C2" }],
    ["mark lockhart", { mobile: "07479868816", code: "BCS6U8" }],
    ["nathan maloney", { mobile: "07841570461", code: "U3NST9" }],
    ["neil cochrane", { mobile: "07386389217", code: "GI4KMF" }],
    ["owen bruce", { mobile: "07379926426", code: "X2PKU0" }],
    ["paul hamilton", { mobile: "07530282287", code: "I90P0T" }],
    ["paul harkness", { mobile: "07955904412", code: "JRNE9H" }],
    ["ross hutchison", { mobile: "07808118980", code: "ILYXOU" }],
    ["ross turley", { mobile: "07827933305", code: "WZVXKK" }],
    ["sandy drysdale", { mobile: "07971486652", code: "9ZDEPW" }],
    ["scott johnston", { mobile: "07769804891", code: "ZH3DBL" }],
    ["sean trainor", { mobile: "07874761436", code: "6SJ1JT" }],
    ["steven couper", { mobile: "07950576369", code: "ZFSKX0" }],
    ["steven griggs", { mobile: "07706143829", code: "M97HW0" }],
    ["steven kirkpatrick", { mobile: "07729513787", code: "E8JL8J" }],
    ["stevie stores", { mobile: "07920855624", code: "9ERLGC" }],
    ["tam corsan", { mobile: "07810663947", code: "X5KD78" }],
    ["test player", { mobile: "07000000000", code: "TESTER" }],
  ]);

  for (const [name, { mobile, code }] of playerMap) {
    console.log(`Processing ${name} (Mobile: ${mobile})`);
    const normalizedName = name.trim().toLowerCase();
    let user = await prisma.user.findUnique({
      where: { mobile },
    });

    if (user) {
      console.log(`Found existing User for ${name} with ID: ${user.id}`);
      // Clear passwordHash to reset registration
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: null },
      });
      console.log(`Cleared passwordHash for ${name}`);
    } else {
      console.log(`No User found for ${name}. Creating a new one...`);
      user = await prisma.user.create({
        data: {
          name: normalizedName,
          mobile,
          role: "PLAYER", // Default role for all
        },
      });
      console.log(`Created User for ${name} with ID: ${user.id}`);
    }

    // Ensure Player record exists
    const existingPlayer = await prisma.player.findUnique({
      where: { userId: user.id },
    });
    if (!existingPlayer) {
      console.log(`No Player record found for ${name}. Creating one...`);
      await prisma.player.create({
        data: {
          userId: user.id,
          status: "ACTIVE",
        },
      });
      console.log(`Created Player record for ${name} with userId: ${user.id}`);
    } else {
      console.log(
        `Player record already exists for ${name} with status: ${existingPlayer.status}`,
      );
    }
  }

  console.log(
    "Player registration reset completed for all players in playerMap.",
  );
  await prisma.$disconnect();
}

resetAllPlayers().catch((error) => {
  console.error("Error resetting player registrations:", error);
  prisma.$disconnect();
  process.exit(1);
});
