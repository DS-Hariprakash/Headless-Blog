import { getPostBySlug, getAllPostIds } from '@/lib/posts';
import { generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import GoogleLogin from '@/app/components/GoogleLogin';
import LikeButton from '@/app/components/LikeButton';
import CommentSection from '@/app/components/CommentSection';

export const revalidate = 60;

export async function generateStaticParams() {
  const ids = await getAllPostIds();
  return ids;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Adventure Not Found',
    };
  }

  const seo = generateSEOMetadata(post, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'article',
      images: [seo.image],
      url: seo.url,
      authors: [seo.author],
      publishedTime: seo.publishedDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
    authors: [{ name: seo.author }],
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return (
      <main>
        <div className="header">
          <h1>ADVENTURE NOT FOUND</h1>
          <p style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '16px' }}>
            THE QUEST YOU SEEK HAS VANISHED
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <Link href="/" className="game-btn">
            RETURN TO KINGDOM
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="header">
        <h1 style={{ fontSize: '1.5rem' }}>{post.title}</h1>
        <p style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '16px' }}>
          AN ADVENTURE BY {post.author.toUpperCase()}
        </p>
        <div style={{ marginTop: '24px' }}>
          <GoogleLogin />
        </div>
      </div>

      <nav className="navbar">
        <Link href="/">🏠 BACK TO KINGDOM</Link>
        <Link href="/posts">📜 ALL ADVENTURES</Link>
      </nav>

      <article style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="retro-card">
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: '#bdc3c7', marginBottom: '16px' }}>
            <span>📅 {new Date(post.date).toLocaleDateString()}</span>
            <span>👤 {post.author}</span>
            {post.tags.length > 0 && (
              <div style={{ marginLeft: 'auto' }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {post.image && (
            <div style={{ marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #2c3e50' }}>
              <img
                src={post.image}
                alt={post.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )}

          {post.excerpt && (
            <p style={{ fontSize: '0.9rem', color: '#ffd700', marginBottom: '16px', fontStyle: 'italic' }}>
              {post.excerpt}
            </p>
          )}

          <div
            style={{ fontSize: '0.8rem', lineHeight: '1.6', color: '#bdc3c7' }}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div style={{ marginTop: '24px', borderTop: '1px solid #2c3e50', paddingTop: '16px', display: 'flex', gap: '16px' }}>
            <LikeButton postId={post.slug} initialLikes={0} />
            <span style={{ color: '#bdc3c7', fontSize: '0.8rem' }}>
              👁️ 127 VIEWS
            </span>
          </div>
        </div>

        <CommentSection postId={post.slug} />
      </article>

      <div style={{ textAlign: 'center', padding: '24px' }}>
        <Link href="/" className="game-btn">
          BACK TO KINGDOM
        </Link>
      </div>

      <footer className="footer">
        <p>Ⓒ PIXEL KINGDOM | SHARE YOUR ADVENTURES</p>
      </footer>
    </main>
  );
}
