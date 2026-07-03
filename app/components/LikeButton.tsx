'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      const checkLike = async () => {
        try {
          const res = await fetch(`/api/posts/${postId}/like`);
          if (res.ok) {
            const data = await res.json();
            setLiked(data.liked);
            setLikes(data.likes);
          }
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      };
      checkLike();
    }
  }, [postId, session]);

  const handleLike = async () => {
    if (!session) {
      alert('Please sign in to like this post!');
      return;
    }
    
    setLoading(true);
    try {
      const method = liked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/posts/${postId}/like`, { method });
      
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setLiked(data.liked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`like-btn ${liked ? 'liked' : ''}`}
      disabled={loading}
      title={session ? (liked ? 'Unlike' : 'Like') : 'Sign in to like'}
    >
      {liked ? '❤️' : '🤍'}
      <span style={{ marginLeft: '4px', fontSize: '0.8rem' }}>
        {likes}
      </span>
    </button>
  );
}
