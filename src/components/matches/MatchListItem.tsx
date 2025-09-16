'use client'; // <-- IMPORTANT: Makes this a Client Component

import type { MatchWithPlayers } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation'; // <-- Import the router
import { useEffect } from 'react'; // <-- Import useEffect

export function MatchListItem({ match }: { match: MatchWithPlayers }) {
    const { player1, player2, scorePlayer1, scorePlayer2, status } = match;
    const router = useRouter(); // <-- Initialize the router

    // --- LIVE UPDATE LOGIC ---
    useEffect(() => {
        // Only set up a refresh interval if this specific match is IN_PROGRESS
        if (status === 'IN_PROGRESS') {
        const interval = setInterval(() => {
            // This command tells Next.js to re-fetch data from the server
            // without a full page reload.
            router.refresh();
        }, 3000); // Refresh every 3 seconds (adjust as needed)

        // This is a cleanup function to stop refreshing when it's no longer needed
        return () => clearInterval(interval);
        }
    }, [router, status]);
    // ------------------------

    const getStatusBadge = () => {
        if (status === 'IN_PROGRESS') {
            return <div className="absolute top-2 right-2 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full animate-pulse">LIVE</div>;
        }
        return null;
    }

    return (
        <Link href={`/match/${match.id}/score`} className="block w-full max-w-sm">
            <Card className="w-full h-full bg-card/50 backdrop-blur-sm hover:bg-card/75 transition-colors">
                <CardHeader className="relative">
                    <CardTitle className="text-base">{match.round.replace('_', ' ')}</CardTitle>
                    {getStatusBadge()}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={player1?.user?.image ?? ''} alt={player1?.user?.name ?? 'Player 1'} />
                                <AvatarFallback>{player1?.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{player1?.user?.name ?? 'TBD'}</span>
                        </div>
                        <div className="font-semibold text-lg">{scorePlayer1 ?? 0}</div>
                    </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={player2?.user?.image ?? ''} alt={player2?.user?.name ?? 'Player 2'} />
                                <AvatarFallback>{player2?.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{player2?.user?.name ?? 'TBD'}</span>
                        </div>
                        <div className="font-semibold text-lg">{scorePlayer2 ?? 0}</div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
