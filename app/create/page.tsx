'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import GoogleLogin from '@/app/components/GoogleLogin';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    tags: [] as string[],
    image: '',
    published: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user?.name) {
      setFormData(prev => ({ ...prev, author: session.user.name }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      setLoading(true);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formDataUpload });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.author.trim()) {
      setError('Author is required');
      return;
    }
    if (!session) {
      setError('Please sign in to publish');
      return;
    }
    try {
      setLoading(true);
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, published: true }),
      });
      if (!res.ok) throw new Error('Failed to create post');
      const data = await res.json();
      router.push(`/posts/${data.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <main style={{ padding: '48px', textAlign: 'center', color: '#ffd700' }}><p>LOADING...</p></main>;
  }

  return (
    <main>
      <div className="header">
        <h1>NEW ADVENTURE</h1>
        <p style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '16px' }}>SHARE YOUR STORY WITH THE KINGDOM</p>
        <div style={{ marginTop: '24px' }}><GoogleLogin /></div>
      </div>
      <nav className="navbar"><Link href="/">🏠 BACK TO KINGDOM</Link></nav>
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="retro-card">
          {error && <div style={{ color: '#e74c3c', marginBottom: '16px', fontSize: '0.8rem' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: '#ffd700', fontSize: '0.8rem' }}>TITLE *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Your adventure title" className="retro-input" required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: '#ffd700', fontSize: '0.8rem' }}>EXCERPT</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Short summary..." rows={3} className="retro-input" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: '#ffd700', fontSize: '0.8rem' }}>YOUR STORY *</label>
              <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Write your adventure..." rows={10} className="retro-input" required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: '#ffd700', fontSize: '0.8rem' }}>AUTHOR *</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Your name" className="retro-input" required readOnly={!!session?.user?.name} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: '#ffd700', fontSize: '0.8rem' }}>IMAGE</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} />
              {formData.image && <div style={{ marginTop: '8px' }}><img src={formData.image} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }} /></div>}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: '#ffd700', fontSize: '0.8rem' }}>TAGS</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddTag()} placeholder="Add a tag" className="retro-input" style={{ flex: 1 }} />
                <button type="button" onClick={handleAddTag} className="retro-btn">ADD</button>
              </div>
              {formData.tags.length > 0 && <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {formData.tags.map(tag => <span key={tag} className="tag">{tag}<button type="button" onClick={() => handleRemoveTag(tag)} style={{ marginLeft: '4px', cursor: 'pointer' }}>×</button></span>)}
              </div>}
            </div>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
              <button type="submit" disabled={loading} className="game-btn" style={{ padding: '16px 48px', fontSize: '1rem' }}>
                {loading ? 'PUBLISHING...' : '🏰 PUBLISH ADVENTURE'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <footer className="footer"><p>Ⓒ PIXEL KINGDOM</p></footer>
    </main>
  );
}
