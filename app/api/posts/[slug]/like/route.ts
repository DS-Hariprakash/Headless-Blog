import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory like storage (replace with database in production)
const likesStore: Record<string, Set<string>> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const postId = params.slug;

    if (!likesStore[postId]) {
      likesStore[postId] = new Set();
    }

    return NextResponse.json({
      liked: likesStore[postId].has(userId),
      likes: likesStore[postId].size,
    });
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const postId = params.slug;

    if (!likesStore[postId]) {
      likesStore[postId] = new Set();
    }

    likesStore[postId].add(userId);

    return NextResponse.json({
      liked: true,
      likes: likesStore[postId].size,
    });
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const postId = params.slug;

    if (!likesStore[postId]) {
      likesStore[postId] = new Set();
    }

    likesStore[postId].delete(userId);

    return NextResponse.json({
      liked: false,
      likes: likesStore[postId].size,
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
