import { Post } from './posts';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  url: string;
  author: string;
  publishedDate: string;
  updatedDate?: string;
  type: 'article' | 'website';
}

export function generateSEOMetadata(post: Post, baseUrl: string): SEOMetadata {
  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    keywords: post.tags,
    image: post.image || '/default-og-image.png',
    url: `${baseUrl}/posts/${post.slug}`,
    author: post.author,
    publishedDate: post.date,
    type: 'article',
  };
}

export function generateSitemap(posts: Post[], baseUrl: string): string {
  const urls = [
    {
      loc: baseUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '1.0',
    },
    ...posts.map((post) => ({
      loc: `${baseUrl}/posts/${post.slug}`,
      lastmod: post.date.split('T')[0],
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

export function generateRobotsTxt(baseUrl: string): string {
  return `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`;
}
