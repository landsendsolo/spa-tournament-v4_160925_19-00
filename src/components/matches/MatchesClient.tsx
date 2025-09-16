'use client';

import { useState, useEffect } from 'react';
import { MatchListItem } from '@/components/matches/MatchListItem';
import type { MatchWithPlayers } from '@/lib/data';

export function MatchesClient({ initialMatches }: { initialMatches: MatchWithPlayers[] }) {
  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/matches?type=live');
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    }, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map(match => (
        <MatchListItem key={match.id} match={match} />
      ))}
    </div>
  );
}
