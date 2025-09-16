import type { MatchWithPlayers } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function BracketMatch({ match }: { match: MatchWithPlayers }) {
  const { player1, player2, scorePlayer1, scorePlayer2, winnerId, status } = match;

  const scoreDisplay = status === 'COMPLETED' ? `${scorePlayer1 ?? 0}-${scorePlayer2 ?? 0}` : '-';

  const renderPlayer = (player: MatchWithPlayers['player1'] | MatchWithPlayers['player2'], isPlayer1: boolean) => {
    const isBye = status === 'BYE';
    if (isBye && player) {
      return (
        <div className="flex flex-col justify-start p-2 h-auto">
          <div className="flex items-center gap-3 mt-1">
            <Avatar className="h-8 w-8">
              {player.user?.image && <AvatarImage src={player.user.image} alt={player.user?.name ?? 'Player'} />}
              <AvatarFallback>{player.user?.name?.charAt(0).toUpperCase() ?? 'Q'}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-primary break-words">{player.user?.name ?? 'Qualifier'}</span>
          </div>
        </div>
      );
    }
    if (!player) {
      return (
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-muted"><AvatarFallback>?</AvatarFallback></Avatar>
            <span className="font-medium text-muted-foreground italic">TBD</span>
          </div>
          <div className="font-semibold text-lg">-</div>
        </div>
      );
    }
    const isWinner = player.id === winnerId;
    const textColor = isWinner ? 'text-foreground' : 'text-muted-foreground';
    return (
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {player.user?.image && <AvatarImage src={player.user.image} alt={player.user?.name ?? 'Player'} />}
            <AvatarFallback>{player.user?.name?.charAt(0).toUpperCase() ?? 'P'}</AvatarFallback>
          </Avatar>
          <span className={`font-medium ${isWinner ? 'font-bold' : ''} ${textColor}`}>
            {player.user?.name ?? 'Unknown Player'}
          </span>
        </div>
        <div className={`font-semibold text-lg ${isWinner ? 'font-bold' : ''} ${textColor}`}>
          {scoreDisplay.split('-')[isPlayer1 ? 0 : 1]}
        </div>
      </div>
    );
  };

  if (status === 'BYE') {
    return (
      <Card className="bg-[hsl(var(--qualified-card-bg))]/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-2">{renderPlayer(player1, true)}</CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/match/${match.id}/score`} className="block">
      <Card className="bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors">
        <CardContent className="p-3 space-y-2">
          {renderPlayer(player1, true)}
          {renderPlayer(player2, false)}
        </CardContent>
      </Card>
    </Link>
  );
}
