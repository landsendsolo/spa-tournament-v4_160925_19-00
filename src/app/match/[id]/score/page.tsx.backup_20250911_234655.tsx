import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { LiveScorecard } from '@/components/scoring/LiveScorecard';
import type { MatchWithPlayers } from '@/lib/data';

type MatchScorePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MatchScorePage({ params }: MatchScorePageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      player1: { include: { user: true } },
      player2: { include: { user: true } },
      winner: { include: { user: true } },
    },
  });
  if (!match) {
    notFound();
  }
  return (
    <LiveScorecard
      match={match as MatchWithPlayers}
      currentUserId={session.user.id}
      isAdmin={session.user.role === 'ADMIN'}
    />
  );
}

export const dynamic = 'force-dynamic';
