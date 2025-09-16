import { getLiveAndRecentMatches } from "@/lib/data";
import type { MatchWithPlayers } from "@/lib/data";
import { MatchesClient } from "@/components/matches/MatchesClient";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const matches = await getLiveAndRecentMatches();
  return (
    <div>
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Live & Recent Matches
        </h2>
        <p className="text-muted-foreground">
          View matches that are in progress or have recently finished.
        </p>
      </div>
      {matches.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <p>There are no live or recently completed matches.</p>
        </div>
      ) : (
        <MatchesClient initialMatches={matches as MatchWithPlayers[]} />
      )}
    </div>
  );
}
