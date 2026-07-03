'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userImage: string;
  createdAt: string;
}

export default function CommentSection({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('Please sign in to comment!');
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments(prev => [...prev, data.comment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <h3 style={{ fontSize: '1rem', color: '#ffd700', marginBottom: '16px' }}>
        💬 COMMENTS ({comments.length})
      </h3>

      {session && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="retro-input"
            rows={3}
            style={{ fontSize: '0.8rem', width: '100%' }}
          />
          <button
            type="submit"
            className="retro-btn"
            disabled={loading || !newComment.trim()}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'POSTING...' : 'POST COMMENT'}
          </button>
        </form>
      )}
      {!session && (
        <p style={{ color: '#bdc3c7', fontSize: '0.8rem', marginBottom: '16px' }}>
          Sign in with Google to leave a comment
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <img
                src={comment.userImage || '/avatar.svg'}
                alt={comment.userName}
                className="user-avatar"
                style={{ width: 32, height: 32 }}
              />
              <div>
                <span style={{ fontWeight: 'bold', color: '#ffd700', fontSize: '0.8rem' }}>
                  {comment.userName}
                </span>
                <span style={{ fontSize: '0.6rem', color: '#bdc3c7', marginLeft: '8px' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#bdc3c7', lineHeight: '1.4' }}>
              {comment.content}
            </p>
          </div>
        ))}
        {comments.length === 0 && (
          <p style={{ color: '#bdc3c7', fontSize: '0.8rem', textAlign: 'center' }}>
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
