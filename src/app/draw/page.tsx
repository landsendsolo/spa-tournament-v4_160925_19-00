import { getMatches, MatchWithPlayers } from '@/lib/data';
import { TournamentBracket } from '@/components/bracket/TournamentBracket';

export default async function DrawPage() {
  let matches: MatchWithPlayers[] = [];
  let error: string | null = null;
  try {
    matches = await getMatches();
  } catch (e) {
    error = 'Failed to load tournament data. Please try again later.';
    console.error('DrawPage Fetch Error:', e);
  }
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">Dumfries Area Draw</h2>
      <div className="mt-8">
        {error ? (
          <div className="text-center py-8">
            <p className="text-destructive font-semibold">Error</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <TournamentBracket initialMatches={matches} />
        )}
      </div>
    </div>
  );
}
