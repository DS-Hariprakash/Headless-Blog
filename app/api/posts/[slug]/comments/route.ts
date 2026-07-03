import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory comment storage (replace with database in production)
interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userImage: string;
  createdAt: string;
}

const commentsStore: Record<string, Comment[]> = {};
let commentIdCounter = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const postId = params.slug;
    const comments = commentsStore[postId] || [];

    return NextResponse.json({
      comments: comments.map((c) => ({
        id: c.id,
        content: c.content,
        userId: c.userId,
        userName: c.userName,
        userImage: c.userImage,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const postId = params.slug;
    if (!commentsStore[postId]) {
      commentsStore[postId] = [];
    }

    const comment: Comment = {
      id: (++commentIdCounter).toString(),
      content,
      userId: session.user.id,
      userName: session.user.name || 'Anonymous',
      userImage: session.user.image || '/avatar.svg',
      createdAt: new Date().toISOString(),
    };

    commentsStore[postId].push(comment);

    return NextResponse.json({
      comment: {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userName: comment.userName,
        userImage: comment.userImage,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
