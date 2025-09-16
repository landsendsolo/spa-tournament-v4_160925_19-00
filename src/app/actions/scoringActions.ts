"use server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const progressionMap: { [key: number]: string } = {
  1: "Winner(R1-1)",
  2: "Winner(R1-2)",
  3: "Winner(R1-3)",
  4: "Winner(R1-4)",
  5: "Winner(R1-5)",
  6: "Winner(R1-6)",
  7: "Winner(R1-7)",
  8: "Winner(R1-8)",
  9: "Winner(R1-9)",
  10: "Winner(R1-10)",
  11: "Winner(R2-1)",
  12: "Winner(R2-2)",
  13: "Winner(R2-3)",
  14: "Winner(R2-4)",
  15: "Winner(R2-5)",
  16: "Winner(R2-6)",
  17: "Winner(R2-7)",
  18: "Winner(R2-8)",
  19: "Winner(R3-1)",
  20: "Winner(R3-2)",
  21: "Winner(R3-3)",
  22: "Winner(R3-4)",
};

function revalidateAllPaths(matchId: string) {
  revalidatePath("/draw");
  revalidatePath("/matches");
  revalidatePath(`/match/${matchId}/score`);
  revalidatePath("/");
}

async function undoProgression(
  tx: Prisma.TransactionClient,
  matchToUndo: { id: string; drawOrder: number; winnerId: string | null },
) {
  if (!matchToUndo.winnerId) return;
  const placeholderName = progressionMap[matchToUndo.drawOrder];
  if (!placeholderName) return;
  const nextMatch = await tx.match.findFirst({
    where: {
      drawOrder: { gt: matchToUndo.drawOrder },
      OR: [
        { player1Id: matchToUndo.winnerId },
        { player2Id: matchToUndo.winnerId },
      ],
    },
    orderBy: { drawOrder: "asc" },
  });
  if (nextMatch) {
    const newPlaceholderUser = await tx.user.create({
      data: { name: placeholderName, role: "PLACEHOLDER" },
    });
    const newPlaceholderPlayer = await tx.player.create({
      data: { userId: newPlaceholderUser.id },
    });
    let updateData: { player1Id?: string; player2Id?: string } = {};
    if (nextMatch.player1Id === matchToUndo.winnerId) {
      updateData = { player1Id: newPlaceholderPlayer.id };
    } else if (nextMatch.player2Id === matchToUndo.winnerId) {
      updateData = { player2Id: newPlaceholderPlayer.id };
    }
    if (Object.keys(updateData).length > 0) {
      await tx.match.update({ where: { id: nextMatch.id }, data: updateData });
    }
  }
}

export async function awardFrame(matchId: string, winningPlayerId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be logged in." };
  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        player1: { select: { userId: true } },
        player2: { select: { userId: true } },
      },
    });
    if (!match) return { error: "Match not found." };
    const isPlayerInMatch =
      session.user.id === match.player1?.userId ||
      session.user.id === match.player2?.userId;
    if (session.user.role !== "ADMIN" && !isPlayerInMatch)
      return { error: "You are not authorized to score this match." };
    if (match.status === "COMPLETED")
      return { error: "This match is already completed." };
    await prisma.$transaction(async (tx) => {
      let newScorePlayer1 = match.scorePlayer1 ?? 0;
      let newScorePlayer2 = match.scorePlayer2 ?? 0;
      if (winningPlayerId === match.player1Id) newScorePlayer1++;
      else if (winningPlayerId === match.player2Id) newScorePlayer2++;
      else throw new Error("Winning player is not part of this match.");
      const isWinner = newScorePlayer1 >= 7 || newScorePlayer2 >= 7;
      const winnerId = isWinner
        ? newScorePlayer1 >= 7
          ? match.player1Id
          : match.player2Id
        : null;
      await tx.match.update({
        where: { id: matchId },
        data: {
          scorePlayer1: newScorePlayer1,
          scorePlayer2: newScorePlayer2,
          status: isWinner ? "COMPLETED" : "IN_PROGRESS",
          winnerId,
        },
      });
      if (isWinner && winnerId) {
        const placeholderName = progressionMap[match.drawOrder];
        if (placeholderName) {
          const placeholderUser = await tx.user.findFirst({
            where: { name: placeholderName },
          });
          if (placeholderUser) {
            const placeholderPlayer = await tx.player.findFirst({
              where: { userId: placeholderUser.id },
            });
            if (placeholderPlayer) {
              const nextMatch = await tx.match.findFirst({
                where: {
                  OR: [
                    { player1Id: placeholderPlayer.id },
                    { player2Id: placeholderPlayer.id },
                  ],
                },
              });
              if (nextMatch) {
                const updateData =
                  nextMatch.player1Id === placeholderPlayer.id
                    ? { player1Id: winnerId }
                    : { player2Id: winnerId };
                await tx.match.update({
                  where: { id: nextMatch.id },
                  data: updateData,
                });
                await tx.player.delete({ where: { id: placeholderPlayer.id } });
                await tx.user.delete({ where: { id: placeholderUser.id } });
              }
            }
          } else {
            console.warn(
              `[Progression] Placeholder user "${placeholderName}" not found. Cannot progress winner.`,
            );
          }
        }
      }
    });
    revalidateAllPaths(matchId);
    return { success: "Frame awarded." };
  } catch (error) {
    console.error("Error in awardFrame:", error);
    return { error: "An unexpected error occurred while awarding the frame." };
  }
}

export async function resetMatch(matchId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "You are not authorized." };
  }
  try {
    await prisma.$transaction(async (tx) => {
      const matchToReset = await tx.match.findUnique({
        where: { id: matchId },
      });
      if (!matchToReset) throw new Error("Match not found.");
      if (matchToReset.status === "COMPLETED") {
        await undoProgression(tx, matchToReset);
      }
      await tx.match.update({
        where: { id: matchId },
        data: {
          scorePlayer1: 0,
          scorePlayer2: 0,
          status: "PENDING",
          winnerId: null,
        },
      });
    });
    revalidateAllPaths(matchId);
    return { success: "Match has been reset." };
  } catch (error) {
    console.error("Error in resetMatch:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function undoFrame(matchId: string, playerId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be logged in." };
  try {
    await prisma.$transaction(async (tx) => {
      const matchToUndo = await tx.match.findUnique({
        where: { id: matchId },
        include: {
          player1: { select: { userId: true } },
          player2: { select: { userId: true } },
        },
      });
      if (!matchToUndo) throw new Error("Match not found.");
      const isPlayerInMatch =
        session.user.id === matchToUndo.player1?.userId ||
        session.user.id === matchToUndo.player2?.userId;
      if (session.user.role !== "ADMIN" && !isPlayerInMatch)
        throw new Error("Not authorized.");
      const wasCompleted = matchToUndo.status === "COMPLETED";
      let newScorePlayer1 = matchToUndo.scorePlayer1 ?? 0;
      let newScorePlayer2 = matchToUndo.scorePlayer2 ?? 0;
      if (playerId === matchToUndo.player1Id && newScorePlayer1 > 0)
        newScorePlayer1--;
      else if (playerId === matchToUndo.player2Id && newScorePlayer2 > 0)
        newScorePlayer2--;
      else throw new Error("Cannot undo frame.");
      const newStatus = wasCompleted ? "IN_PROGRESS" : matchToUndo.status;
      await tx.match.update({
        where: { id: matchId },
        data: {
          scorePlayer1: newScorePlayer1,
          scorePlayer2: newScorePlayer2,
          status: newStatus,
          winnerId: null,
        },
      });
      if (wasCompleted) {
        await undoProgression(tx, matchToUndo);
      }
    });
    revalidateAllPaths(matchId);
    return { success: "Last frame undone." };
  } catch (error) {
    console.error("Error in undoFrame:", error);
    return { error: "An unexpected error occurred." };
  }
}
