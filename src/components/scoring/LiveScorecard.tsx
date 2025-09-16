'use client';
import { useTransition } from 'react';
// Removed unused import: useRouter
import type { MatchWithPlayers } from '@/lib/data';
import { awardFrame, resetMatch, undoFrame } from '@/app/actions/scoringActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { Loader2, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function LiveScorecard({ match, currentUserId, isAdmin }: { match: MatchWithPlayers, currentUserId: string, isAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();
  const handleAction = (action: () => Promise<{ success?: string; error?: string }>) => {
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };
  const handleAwardFrame = (winningPlayerId: string | null) => {
    if (!winningPlayerId) return;
    handleAction(() => awardFrame(match.id, winningPlayerId));
  };
  const handleResetMatch = () => {
    handleAction(() => resetMatch(match.id));
  };
  const handleUndoFrame = (playerIdToDecrement: string | null) => {
    if (!playerIdToDecrement) return;
    handleAction(() => undoFrame(match.id, playerIdToDecrement));
  };
  const canScore = isAdmin || (currentUserId && (currentUserId === match.player1?.userId || currentUserId === match.player2?.userId));
  const score1 = match.scorePlayer1 ?? 0;
  const score2 = match.scorePlayer2 ?? 0;
  const isMatchOver = score1 >= 7 || score2 >= 7 || match.status === 'COMPLETED';
  const hasPlayers = !!match.player1Id && !!match.player2Id;
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {match.round.replace('_', ' ')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-around items-center text-center gap-4 sm:gap-0 mb-8">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-muted">
                {match.player1?.user?.image && <AvatarImage src={match.player1.user.image} alt={match.player1.user.name ?? 'Player 1'} />}
                <AvatarFallback>{match.player1?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-semibold">{match.player1?.user?.name ?? 'TBD'}</h3>
            </div>
            <div className="text-5xl sm:text-6xl font-bold my-4 sm:my-0">
              <span>{score1}</span> - <span>{score2}</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-muted">
                {match.player2?.user?.image && <AvatarImage src={match.player2.user.image} alt={match.player2.user.name ?? 'Player 2'} />}
                <AvatarFallback>{match.player2?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-semibold">{match.player2?.user?.name ?? 'TBD'}</h3>
            </div>
          </div>
          {isMatchOver ? (
            <div className="text-center pt-8 space-y-4">
              <div className="text-primary font-bold text-2xl p-4 bg-primary/10 rounded-md">
                Match Completed
              </div>
              <p className="text-muted-foreground">The winner will advance to the next round automatically.</p>
              <Button asChild size="lg" className="!mt-6">
                <Link href="/draw">Back to Tournament Draw</Link>
              </Button>
            </div>
          ) : hasPlayers && canScore ? (
            <div className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button size="lg" className="py-8 text-lg" onClick={() => handleAwardFrame(match.player1Id)} disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                  Award Frame to {match.player1?.user?.name ?? 'Player 1'}
                </Button>
                <Button size="lg" className="py-8 text-lg" onClick={() => handleAwardFrame(match.player2Id)} disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                  Award Frame to {match.player2?.user?.name ?? 'Player 2'}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
                <Button variant="outline" onClick={() => handleUndoFrame(match.player1Id)} disabled={isPending || score1 === 0} size="sm">
                  <Undo2 className="mr-2 h-4 w-4" /> Undo {match.player1?.user?.name}&apos;s last frame
                </Button>
                <Button variant="outline" onClick={() => handleUndoFrame(match.player2Id)} disabled={isPending || score2 === 0} size="sm">
                  <Undo2 className="mr-2 h-4 w-4" /> Undo {match.player2?.user?.name}&apos;s last frame
                </Button>
              </div>
              <div className="text-center mt-4">
                <Button asChild variant="link">
                  <Link href="/draw">Back to Draw</Link>
                </Button>
              </div>
            </div>
          ) : hasPlayers ? (
            <p className="text-center text-muted-foreground mt-8">You are not authorized to score this match.</p>
          ) : (
            <p className="text-center text-muted-foreground mt-8">Players have not yet been assigned to this match.</p>
          )}
        </CardContent>
      </Card>
      {isAdmin && (
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Admin Options</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isPending}>
                  Reset Match
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will reset the match score to 0-0 and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetMatch}>
                    Yes, Reset Match
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
