import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPostBySlug, savePost, deletePost } from '@/lib/posts';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(
      posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        author: post.author,
        date: post.date,
        published: post.published,
      }))
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, content, author, date, tags, image, published } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    await savePost(slug, {
      title,
      excerpt,
      content,
      author,
      date,
      tags,
      image,
      published,
    });

    return NextResponse.json({ slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
