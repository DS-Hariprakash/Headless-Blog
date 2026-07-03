'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import GoogleLogin from '@/app/components/GoogleLogin';

interface Post {
  slug: string;
  title: string;
  author: string;
  date: string;
  published: boolean;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/admin/posts');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: '#ffd700' }}>
        <p>LOADING...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <main style={{ padding: '48px', textAlign: 'center' }}>
        <div className="header">
          <h1>ADMIN PANEL</h1>
          <p style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '16px' }}>
            SIGN IN TO MANAGE POSTS
          </p>
        </div>
        <div style={{ marginTop: '32px' }}>
          <GoogleLogin />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="header">
        <h1>ADMIN PANEL</h1>
        <p style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '16px' }}>
          MANAGE YOUR ADVENTURES
        </p>
        <div style={{ marginTop: '24px' }}>
          <GoogleLogin />
        </div>
      </div>

      <nav className="navbar">
        <Link href="/">🏠 BACK TO HOME</Link>
        <Link href="/admin/posts/create">✍️ CREATE NEW POST</Link>
      </nav>

      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#ffd700', marginBottom: '16px' }}>
          📜 YOUR POSTS
        </h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#bdc3c7' }}>LOADING POSTS...</p>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#bdc3c7' }}>
            <p>NO POSTS YET</p>
            <p style={{ fontSize: '0.8rem', marginTop: '16px' }}>
              CREATE YOUR FIRST ADVENTURE
            </p>
            <Link href="/admin/posts/create" className="game-btn" style={{ marginTop: '24px', display: 'inline-block' }}>
              CREATE POST
            </Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.slug} className="post-card">
                <h3 style={{ color: '#ffd700', fontSize: '1rem', marginBottom: '8px' }}>
                  {post.title}
                </h3>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.6rem', color: '#bdc3c7', marginBottom: '12px' }}>
                  <span>👤 {post.author}</span>
                  <span>📅 {new Date(post.date).toLocaleDateString()}</span>
                  <span style={{ color: post.published ? '#2ecc71' : '#e74c3c' }}>
                    {post.published ? '🟢 PUBLISHED' : '🔴 DRAFT'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/admin/posts/${post.slug}/edit`} className="retro-btn">
                    EDIT
                  </Link>
                  <Link href={`/posts/${post.slug}`} className="retro-btn">
                    VIEW
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Ⓒ PIXEL KINGDOM ADMIN</p>
      </footer>
    </main>
  );
}
