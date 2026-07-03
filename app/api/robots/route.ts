import { NextResponse } from 'next/server';
import { generateRobotsTxt } from '@/lib/seo';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const robotsTxt = generateRobotsTxt(baseUrl);

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
