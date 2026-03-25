import { getAuthUrl } from '@/lib/google-calendar';
import { NextResponse } from 'next/server';

export async function GET() {
  const url = getAuthUrl();
  console.log('--- GENERATING GOOGLE AUTH URL ---');
  console.log('URL:', url);
  return NextResponse.redirect(url);
}
