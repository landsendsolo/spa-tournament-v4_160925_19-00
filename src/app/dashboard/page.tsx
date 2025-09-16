import { ArrangeMatchDialog } from "@/components/dashboard/ArrangeMatchDialog";
import { auth } from "@/lib/auth";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Trophy, ListOrdered, BarChart4 } from "lucide-react";
import prisma from "@/lib/prisma";
import type { Match, Player, User as PrismaUser } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, MapPin } from "lucide-react";
import type { Session } from "next-auth";

export const dynamic = 'force-dynamic';

interface MatchWithPlayers extends Match {
  player1: (Player & { user: PrismaUser }) | null;
  player2: (Player & { user: PrismaUser }) | null;
  winner: (Player & { user: PrismaUser }) | null;
}

interface PlayerData {
  player: { id: string; user: PrismaUser } | null;
  upcomingMatch: MatchWithPlayers | null;
  recentResults: MatchWithPlayers[];
}

async function getPlayerData(userId: string): Promise<PlayerData> {
    const player = await prisma.player.findUnique({
        where: { userId },
        include: { user: true },
    });

    const allCompletedMatches = player ? await prisma.match.findMany({
        where: { status: 'COMPLETED', OR: [{ player1Id: player.id }, { player2Id: player.id }] },
        include: {
            player1: { include: { user: true } },
            player2: { include: { user: true } },
            winner: { include: { user: true } },
        },
        orderBy: { updatedAt: 'desc' },
    }) : [];

    const upcomingMatch = player ? await prisma.match.findFirst({
        where: { status: 'PENDING', OR: [{ player1Id: player.id }, { player2Id: player.id }] },
        include: {
            player1: { include: { user: true } },
            player2: { include: { user: true } }
        },
        orderBy: { drawOrder: 'asc' },
    }) : null;

    return {
        player,
        upcomingMatch: upcomingMatch as MatchWithPlayers | null,
        recentResults: allCompletedMatches
    };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return <GuestView />;
  }

  if (session.user.role === 'ADMIN') {
    return <AdminView user={session.user} />;
  }

  try {
      const playerData = await getPlayerData(session.user.id);
      if (!playerData.player) {
        return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold">Welcome, {session.user.name}</h2>
              <p className="mt-4 text-muted-foreground">Your player profile could not be found in the tournament data.</p>
            </div>
        );
      }
      return <PlayerView playerData={playerData} user={session.user} />;
  } catch (error) {
      console.error("Error fetching player data for dashboard:", error);
      return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold">Welcome, {session.user.name}</h2>
            <p className="mt-4 text-destructive">Could not load player data. Please try again later.</p>
          </div>
      );
  }
}

function GuestView() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <Image
        src="/spa_logo.jpg"
        alt="SPA Tournament Logo"
        width={128}
        height={128}
        className="rounded-full border border-primary mb-8 object-cover"
      />
      <h2 className="text-4xl font-bold mb-4">SPA Scottish Singles Area Draw</h2>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/draw"><ListOrdered className="mr-2 h-4 w-4" />View Tournament Draw</Link>
        </Button>
        <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/matches"><BarChart4 className="mr-2 h-4 w-4" />View Live Matches</Link>
        </Button>
      </div>
      <div className="w-full max-w-lg border-t my-8"></div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
            <Link href="/signin"><LogIn className="mr-2 h-4 w-4" />Sign In</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="/register">
            <UserPlus className="mr-2 h-4 w-4" />
            Player Registration
          </Link>
        </Button>
      </div>
    </div>
  );
}

function AdminView({ user }: { user: Session["user"] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Welcome back, Admin {user.name}!</h2>
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Admin Tools</CardTitle>
          <CardDescription>Manage tournaments, users, and system settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Button asChild>
            <Link href="/draw">Manage Tournaments</Link>
          </Button>
          <Button disabled>User Management (Coming Soon)</Button>
          <Button disabled>View Analytics (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PlayerView({ playerData, user }: { playerData: PlayerData, user: Session["user"] }) {
    const { player, upcomingMatch, recentResults } = playerData;
    const wins = recentResults.filter(m => m.winnerId === player!.id).length;
    const losses = recentResults.length - wins;

    return (
        <div>
          <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-16 w-16">
                  <AvatarImage src={user.image || ''} alt={user.name || 'Player'} />
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                  <h2 className="text-3xl font-bold">Welcome back, {user.name}!</h2>
                  <p className="text-muted-foreground">Here&apos;s your dashboard overview.</p>
              </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                  {upcomingMatch ? (
                      <Card className="bg-card/50 backdrop-blur-sm">
                          <CardHeader>
                              <CardTitle>Your Next Match</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <div className="flex items-center justify-around text-center">
                                  <div className="flex flex-col items-center gap-2">
                                      <Avatar className="h-20 w-20">
                                          <AvatarImage src={upcomingMatch.player1?.user.image || ''} />
                                          <AvatarFallback>{upcomingMatch.player1?.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <span className="font-semibold">{upcomingMatch.player1?.user.name}</span>
                                  </div>
                                  <div className="text-2xl font-bold text-muted-foreground">VS</div>
                                  <div className="flex flex-col items-center gap-2">
                                      <Avatar className="h-20 w-20">
                                          <AvatarImage src={upcomingMatch.player2?.user.image || ''} />
                                          <AvatarFallback>{upcomingMatch.player2?.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <span className="font-semibold">{upcomingMatch.player2?.user.name}</span>
                                  </div>
                              </div>
                              <div className="mt-6 text-center text-muted-foreground space-y-2">
                                  <p className="flex items-center justify-center gap-2"><Trophy className="h-4 w-4"/> {upcomingMatch.round.replace('_', ' ')}</p>
                                  <p className="flex items-center justify-center gap-2"><Calendar className="h-4 w-4"/> {upcomingMatch.scheduledTime ? new Date(upcomingMatch.scheduledTime).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : 'TBD'}</p>
                                  <p className="flex items-center justify-center gap-2"><MapPin className="h-4 w-4"/> {upcomingMatch.location || 'TBD'}</p>
                              </div>

                              {/* --- THIS IS THE NEWLY ADDED SECTION --- */}
                              <div className="mt-6 flex justify-center">
                                <ArrangeMatchDialog matchId={upcomingMatch.id} />
                              </div>
                              {/* --- END OF NEW SECTION --- */}

                          </CardContent>
                      </Card>
                  ) : (
                      <Card className="bg-card/50 backdrop-blur-sm">
                          <CardHeader>
                              <CardTitle>No Upcoming Matches</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-muted-foreground">There are no matches scheduled for you at the moment. Check the main Draw for tournament updates.</p>
                          </CardContent>
                      </Card>
                  )}
                  <Card className="bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                          <CardTitle>Recent Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Opponent</TableHead>
                                      <TableHead>Result</TableHead>
                                      <TableHead>Score</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {recentResults.map((match: MatchWithPlayers) => {
                                      const opponent = match.player1Id === player!.id ? match.player2 : match.player1;
                                      const isWinner = match.winnerId === player!.id;
                                      const playerScore = match.player1Id === player!.id ? match.scorePlayer1 : match.scorePlayer2;
                                      const opponentScore = match.player1Id === player!.id ? match.scorePlayer2 : match.scorePlayer1;
                                      return (
                                          <TableRow key={match.id}>
                                              <TableCell>{opponent?.user.name}</TableCell>
                                              <TableCell className={isWinner ? 'text-green-500' : 'text-red-500'}>
                                                  {isWinner ? 'Win' : 'Loss'}
                                              </TableCell>
                                              <TableCell>{playerScore} - {opponentScore}</TableCell>
                                          </TableRow>
                                      );
                                  })}
                              </TableBody>
                          </Table>
                      </CardContent>
                  </Card>
              </div>
              <div className="lg:col-span-1 space-y-8">
                  <Card className="bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                          <CardTitle>Player Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="flex justify-between"><span>Wins:</span> <strong>{wins}</strong></div>
                          <div className="flex justify-between"><span>Losses:</span> <strong>{losses}</strong></div>
                      </CardContent>
                  </Card>
                  <Card className="bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                          <CardTitle>Quick Links</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-2">
                          <Button asChild variant="outline"><Link href="/draw">View Full Draw</Link></Button>
                          <Button variant="outline" disabled>Edit Profile (Coming Soon)</Button>
                          <Button variant="outline" disabled>Setup Notifications (Coming Soon)</Button>
                      </CardContent>
                  </Card>
              </div>
          </div>
        </div>
    );
}
