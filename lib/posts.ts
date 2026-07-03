import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'data/posts');

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentHtml: string;
  date: string;
  author: string;
  tags: string[];
  image: string;
  published: boolean;
}

export async function getAllPostIds() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => ({
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const contentHtml = await marked(content);

    return {
      id: slug,
      slug,
      content,
      contentHtml,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'Anonymous',
      tags: data.tags || [],
      image: data.image || '',
      published: data.published === true,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => getPostBySlug(fileName.replace(/\.md$/, '')))
  );

  return posts
    .filter((post): post is Post => post !== null)
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function savePost(slug: string, post: Omit<Post, 'id' | 'slug' | 'contentHtml'>) {
  const dir = postsDirectory;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const frontMatter = {
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    author: post.author,
    tags: post.tags,
    image: post.image,
    published: post.published,
  };

  const content = matter.stringify(post.content, frontMatter);
  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, content, 'utf8');
}

export async function deletePost(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
