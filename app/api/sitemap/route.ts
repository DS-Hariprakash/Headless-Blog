import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { generateSitemap } from '@/lib/seo';

export async function GET() {
  try {
    const posts = await getAllPosts();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const sitemap = generateSitemap(posts, baseUrl);

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 });
  }
}
