import prisma from "@/lib/prisma";
import type { Match, Player, User } from "@prisma/client";

export type MatchWithPlayers = Match & {
  player1: (Player & { user: User }) | null;
  player2: (Player & { user: User }) | null;
  winner: (Player & { user: User }) | null;
};

export async function getMatches(): Promise<MatchWithPlayers[]> {
  const matches = await prisma.match.findMany({
    include: {
      player1: { include: { user: true } },
      player2: { include: { user: true } },
      winner: { include: { user: true } },
    },
    orderBy: {
      drawOrder: "asc",
    },
  });
  return matches.map((match) => ({
    ...match,
    scoreDisplay: `${match.scorePlayer1 || 0}-${match.scorePlayer2 || 0}`,
  })) as MatchWithPlayers[];
}

export async function getLiveAndRecentMatches(options?: {
  hoursAgo?: number;
  limit?: number;
}): Promise<MatchWithPlayers[]> {
  const hoursAgo = options?.hoursAgo ?? 24;
  const limit = options?.limit ?? 50;
  const timeWindow = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { status: "IN_PROGRESS" },
        {
          status: "COMPLETED",
          updatedAt: {
            gte: timeWindow,
          },
        },
      ],
    },
    include: {
      player1: { include: { user: true } },
      player2: { include: { user: true } },
      winner: { include: { user: true } },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: limit,
  });
  return matches.map((match) => ({
    ...match,
    scoreDisplay: `${match.scorePlayer1 || 0}-${match.scorePlayer2 || 0}`,
  })) as MatchWithPlayers[];
}
