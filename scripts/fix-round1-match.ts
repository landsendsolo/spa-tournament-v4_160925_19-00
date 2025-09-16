import { prisma } from "@/lib/prisma";

async function fixRound1Match() {
  const gavinHunter = await prisma.player.findFirst({
    where: { name: "Gavin Hunter" },
  });
  if (!gavinHunter) {
    console.error("Gavin Hunter not found in Player table");
    return;
  }

  const match = await prisma.match.findFirst({
    where: {
      round: 1,
      OR: [
        { player1Id: gavinHunter.id },
        { player2Id: gavinHunter.id },
      ],
    },
  });

  if (match) {
    await prisma.match.update({
      where: { id: match.id },
      data: {
        player2Id: "98a17de0-dd20-416d-8442-b0de5181dfce", // Jonny Robertson
        score: "0 - 7",
        status: "COMPLETED",
        winnerId: "98a17de0-dd20-416d-8442-b0de5181dfce", // Jonny Robertson
      },
    });
    console.log("Match updated successfully");
  } else {
    console.error("Match not found for Gavin Hunter in Round 1");
  }
}

fixRound1Match().then(() => prisma.$disconnect());
