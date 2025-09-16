'use client';
import type { MatchWithPlayers } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BracketMatch } from './BracketMatch';
import { useState, useEffect } from 'react';

export function TournamentBracket({ initialMatches }: { initialMatches: MatchWithPlayers[] }) {
  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/matches?type=draw');
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    }, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const rounds = new Map<string, MatchWithPlayers[]>();
  const roundOrder = [
    'ROUND_1',
    'ROUND_2',
    'ROUND_3',
    'AREA_QUALIFIER',
  ] as const;

  for (const roundName of roundOrder) {
    const matchesInRound = matches.filter(m => m.round === roundName);
    if (matchesInRound.length > 0) {
      rounds.set(roundName, matchesInRound);
    }
  }

  const formatRoundName = (round: string) => {
    if (round === 'AREA_QUALIFIER') {
      return 'Area Qualifiers';
    }
    return round.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const formatShortRoundName = (round: string) => {
    if (round === 'AREA_QUALIFIER') {
      return 'AQ';
    }
    return round.replace('ROUND_', 'R');
  };

  if (rounds.size === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No matches are available at this time.</p>
      </div>
    );
  }

  const firstRound = Array.from(rounds.keys())[0];
  return (
    <>
      {/* Mobile View: Tabbed Interface */}
      <div className="md:hidden">
        <Tabs defaultValue={firstRound} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${rounds.size}, minmax(0, 1fr))` }}>
            {Array.from(rounds.keys()).map((round) => (
              <TabsTrigger key={round} value={round}>{formatShortRoundName(round)}</TabsTrigger>
            ))}
          </TabsList>
          {Array.from(rounds.entries()).map(([round, matchesInRound]) => (
            <TabsContent key={round} value={round} className="mt-4">
              <div className="space-y-4">
                {matchesInRound.map(match => <BracketMatch key={match.id} match={match} />)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Desktop View: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8">
        {Array.from(rounds.entries()).map(([roundName, matchesInRound]) => (
          <div key={roundName} className="flex flex-col">
            <h3 className="text-base lg:text-lg font-semibold text-center mb-6">{formatRoundName(roundName)}</h3>
            <div className="flex flex-col flex-grow justify-around">
              {matchesInRound.map(match => (
                <BracketMatch key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
