'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './editor.module.css';

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

interface PostEditorProps {
  slug?: string;
  initialData?: PostData;
}

export default function PostEditor({ slug, initialData }: PostEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const defaultDate = new Date().toISOString().split('T')[0];
  
  // Use a function to ensure type safety
  const getInitialValue = <K extends keyof PostData>(key: K): PostData[K] => {
    const value = initialData?.[key];
    const defaults: PostData = {
      title: '',
      excerpt: '',
      content: '',
      author: session?.user?.name ?? '',
      date: defaultDate,
      tags: [],
      image: '',
      published: false,
    };
    return (value !== undefined ? value : defaults[key]) as PostData[K];
  };
  
  const [formData, setFormData] = useState<PostData>({
    title: getInitialValue('title'),
    excerpt: getInitialValue('excerpt'),
    content: getInitialValue('content'),
    author: getInitialValue('author'),
    date: getInitialValue('date'),
    tags: getInitialValue('tags'),
    image: getInitialValue('image'),
    published: getInitialValue('published'),
  });
  
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user?.name && !initialData?.author) {
      setFormData((prev) => ({ ...prev, author: session.user.name }));
    }
  }, [session, initialData?.author]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setLoading(true);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));
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
    if (!session) {
      setError('Please sign in to create a post');
      return;
    }

    try {
      setLoading(true);
      const method = slug ? 'PUT' : 'POST';
      const url = slug
        ? `/api/admin/posts/${slug}`
        : '/api/admin/posts';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save post');
      router.push(slug ? '/admin' : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editor}>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post title"
            required
            className="retro-input"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
              className="retro-input"
              readOnly={!!session?.user?.name}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="retro-input"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Short summary of the post"
            rows={3}
            className="retro-input"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Content (Markdown)</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content here..."
            rows={15}
            className="retro-input"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Image</label>
          <div className={styles.imageUpload}>
            {formData.image && (
              <div className={styles.imagePreview}>
                <img src={formData.image} alt="Preview" />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, image: '' }))
                  }
                  className={styles.removeImage}
                >
                  Remove
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Tags</label>
          <div className={styles.tagsInput}>
            <div className={styles.tagsList}>
              {formData.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className={styles.tagRemove}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className={styles.tagInput}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag and press Enter"
                className="retro-input"
              />
              <button type="button" onClick={handleAddTag} className="retro-btn">
                Add
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span style={{ marginLeft: '8px' }}>Publish this post</span>
          </label>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={loading}
            className="game-btn"
          >
            {loading ? 'Saving...' : slug ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="retro-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
