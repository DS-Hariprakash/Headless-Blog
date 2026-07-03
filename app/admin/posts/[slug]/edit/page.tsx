'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PostEditor from '../../../components/PostEditor';
import styles from '../../create/page.module.css';

interface PostData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  image: string;
  published: boolean;
}

export default function EditPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/admin/posts/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        setPostData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/admin">← Back to Admin</Link>
          <h1>Error</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          {error || 'Post not found'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin">← Back to Admin</Link>
        <h1>Edit Post</h1>
      </header>

      <main className={styles.main}>
        <PostEditor slug={slug} initialData={postData} />
      </main>
    </div>
  );
}
