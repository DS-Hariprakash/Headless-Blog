import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import GoogleLogin from '@/app/components/GoogleLogin';

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <main>
      <div className="header">
        <h1>ALL ADVENTURES</h1>
        <p style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '16px' }}>
          EXPLORE THE KINGDOM'S STORIES
        </p>
        <div style={{ marginTop: '24px' }}>
          <GoogleLogin />
        </div>
      </div>

      <nav className="navbar">
        <Link href="/">🏠 BACK TO KINGDOM</Link>
        <Link href="/create">✍️ SHARE YOUR ADVENTURE</Link>
      </nav>

      <div style={{ padding: '24px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#bdc3c7' }}>
            <p>NO ADVENTURES FOUND</p>
            <p style={{ fontSize: '0.8rem', marginTop: '16px' }}>
              BE THE FIRST TO SHARE A STORY
            </p>
            <Link href="/create" className="game-btn" style={{ marginTop: '24px', display: 'inline-block' }}>
              CREATE ADVENTURE
            </Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <Link href={`/posts/${post.slug}`} key={post.slug} className="post-card">
                <h3 style={{ color: '#ffd700', fontSize: '1rem', marginBottom: '8px' }}>
                  {post.title}
                </h3>
                {post.image && (
                  <div style={{ marginBottom: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <p style={{ fontSize: '0.7rem', color: '#bdc3c7', lineHeight: '1.4', marginBottom: '12px' }}>
                  {post.excerpt || post.content.substring(0, 100) + '...'}
                </p>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.6rem', color: '#bdc3c7' }}>
                  <span>👤 {post.author}</span>
                  <span>📅 {new Date(post.date).toLocaleDateString()}</span>
                </div>
                {post.tags.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Ⓒ 2024 PIXEL KINGDOM | EXPLORE MORE ADVENTURES</p>
      </footer>
    </main>
  );
}
