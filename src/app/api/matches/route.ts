import { NextRequest, NextResponse } from 'next/server';
import { getLiveAndRecentMatches, getMatches } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  if (type === 'draw') {
    const matches = await getMatches();
    return NextResponse.json(matches);
  } else if (type === 'live') {
    const matches = await getLiveAndRecentMatches();
    return NextResponse.json(matches);
  }
  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
