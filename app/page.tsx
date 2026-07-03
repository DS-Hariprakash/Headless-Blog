import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import GoogleLogin from '@/app/components/GoogleLogin';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main>
      {/* Hero Section */}
      <div className="header">
        <h1>PIXEL KINGDOM</h1>
        <p style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '16px' }}>
          SHARE YOUR ADVENTURES WITH THE WORLD
        </p>
        <div style={{ marginTop: '24px' }}>
          <GoogleLogin />
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <Link href="/">🏠 HOME</Link>
        <Link href="/posts">📜 ALL POSTS</Link>
        <Link href="/admin">⚙️ ADMIN</Link>
        <Link href="/create">✍️ CREATE POST</Link>
      </nav>

      {/* Featured Posts */}
      <section style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#ffd700', marginBottom: '16px', textAlign: 'center' }}>
          🏆 LATEST ADVENTURES
        </h2>
        
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#bdc3c7' }}>
            <p>NO ADVENTURES YET</p>
            <p style={{ fontSize: '0.8rem', marginTop: '16px' }}>
              BE THE FIRST TO SHARE YOUR STORY
            </p>
            <Link href="/create" className="game-btn" style={{ marginTop: '24px', display: 'inline-block' }}>
              START ADVENTURE
            </Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.slice(0, 6).map((post) => (
              <Link href={`/posts/${post.slug}`} key={post.slug} className="post-card">
                <h3 style={{ color: '#ffd700', fontSize: '1rem', marginBottom: '8px' }}>
                  {post.title}
                </h3>
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                  />
                )}
                <p style={{ fontSize: '0.7rem', color: '#bdc3c7', lineHeight: '1.4' }}>
                  {post.excerpt || post.content.substring(0, 100) + '...'}
                </p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', fontSize: '0.6rem' }}>
                  <span>👤 {post.author}</span>
                  <span>📅 {new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section style={{ textAlign: 'center', padding: '48px 24px', background: '#0f3460', margin: '24px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#ffd700', marginBottom: '16px' }}>
          JOIN THE KINGDOM
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#bdc3c7', maxWidth: '400px', margin: '0 auto 24px' }}>
          SIGN IN WITH GOOGLE TO SHARE YOUR ADVENTURES AND INTERACT WITH OTHERS
        </p>
        <GoogleLogin />
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>Ⓒ 2024 PIXEL KINGDOM | BUILT WITH ✨ AND RETRO VIBES</p>
      </footer>
    </main>
  );
}
