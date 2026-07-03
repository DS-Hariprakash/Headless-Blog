# Development Guide

## Getting Started

### Prerequisites
- Node.js 18.17.0 or higher
- npm, yarn, or pnpm
- Git

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd Headless-Blog

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

- Hot reload enabled for instant updates
- TypeScript checking in real-time
- Console logs and errors displayed immediately

### Building for Production

```bash
npm run build
npm start
```

This creates an optimized production build in `.next/` directory.

### Running Linting

```bash
npm run lint
```

Checks code quality and TypeScript errors.

### Static Export

```bash
npm run export
```

Creates a fully static site in `out/` directory (no server required).

## Project Structure Explained

### Key Directories

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (/)
│   ├── globals.css        # Global styles
│   ├── admin/             # Admin interface
│   ├── api/               # API routes
│   └── posts/             # Blog post pages
├── lib/                   # Shared utilities
│   ├── posts.ts          # Post file operations
│   ├── image-optimizer.ts # Image processing
│   └── seo.ts            # SEO utilities
├── data/                  # Content storage
│   └── posts/            # Markdown posts
├── public/                # Static assets
│   └── uploads/          # Optimized images
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## Code Patterns

### Creating a New API Endpoint

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const data = { message: 'Hello World' };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process body...
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
```

### Adding a New Page Component

```typescript
// app/example/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Example Page',
  description: 'This is an example page',
};

export default function ExamplePage() {
  return (
    <main>
      <h1>Example</h1>
      <p>Your content here</p>
    </main>
  );
}
```

### Creating a New Utility Function

```typescript
// lib/example.ts
export function exampleFunction(input: string): string {
  return input.toUpperCase();
}

export async function exampleAsyncFunction(id: number): Promise<Data> {
  // Implement logic
  return data;
}
```

### Using Client-Side State

```typescript
'use client'; // Mark as client component

import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/endpoint');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return <div>{/* Render data */}</div>;
}
```

## Extending the CMS

### Adding a New Feature to Posts

**Step 1: Update the Post interface** (`lib/posts.ts`)

```typescript
export interface Post {
  // ... existing fields
  newField: string;
}
```

**Step 2: Update the editor** (`app/admin/components/PostEditor.tsx`)

```typescript
const [formData, setFormData] = useState<PostData>({
  // ... existing fields
  newField: '',
});

// In form:
<div className={styles.formGroup}>
  <label htmlFor="newField">New Field</label>
  <input
    type="text"
    id="newField"
    name="newField"
    value={formData.newField}
    onChange={handleChange}
  />
</div>
```

**Step 3: Update the front matter in posts**

```markdown
---
title: Example
newField: value
---

Content here...
```

### Adding Custom Markdown Processing

Update `lib/posts.ts` to add custom Markdown extensions:

```typescript
import { marked } from 'marked';

// Add custom renderer
marked.use({
  renderer: {
    heading: (token) => {
      return `<h${token.depth} id="section-${token.text}">
        ${token.text}
      </h${token.depth}>`;
    },
  },
});

export async function getPostBySlug(slug: string) {
  // ... existing code
  const contentHtml = await marked(content);
  // Now uses custom renderer
}
```

### Adding Database Support

Replace `lib/posts.ts` with database queries:

```typescript
import { db } from '@/lib/db';

export async function getAllPosts(): Promise<Post[]> {
  return await db.post.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return await db.post.findUnique({
    where: { slug },
  });
}

export async function savePost(slug: string, post: PostData) {
  return await db.post.upsert({
    where: { slug },
    update: post,
    create: { slug, ...post },
  });
}
```

### Adding Authentication

**Step 1: Install NextAuth.js**

```bash
npm install next-auth
```

**Step 2: Create auth configuration** (`app/auth.ts`)

```typescript
import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
};
```

**Step 3: Protect admin routes** (`middleware.ts`)

```typescript
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

## Testing Your Changes

### Manual Testing

1. Create a test post in `/data/posts/test.md`
2. Run `npm run dev`
3. Visit `http://localhost:3000`
4. Check the post appears
5. Try editing it in admin panel
6. Verify changes persist

### Building for Production

```bash
npm run build
```

Check for:
- No TypeScript errors
- No build warnings
- All pages generated correctly
- Bundle size reasonable (~100KB+gzip)

## Performance Tips

### 1. Image Optimization
- Always upload images through admin panel
- Use descriptive filenames
- Let Sharp optimize automatically
- Don't manually edit `public/uploads/`

### 2. Code Splitting
- Use `'use client'` only when necessary
- Keep API routes lightweight
- Use dynamic imports for large components

### 3. Database Efficiency
- Add indexes on frequently queried fields
- Cache expensive operations
- Use pagination for large datasets
- Monitor query performance

### 4. Markdown Optimization
- Keep posts reasonably sized
- Use headings for structure
- Add images with appropriate sizes
- Use code blocks for technical content

## Common Tasks

### Adding a New Admin Section

```typescript
// app/admin/settings/page.tsx
import Link from 'next/link';
import styles from './page.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin">← Back to Admin</Link>
        <h1>Settings</h1>
      </header>
      <main className={styles.main}>
        {/* Settings form */}
      </main>
    </div>
  );
}
```

### Adding a Tag Filter to Home Page

```typescript
// In app/page.tsx
import { getAllPosts } from '@/lib/posts';

export default async function Home(
  { searchParams }: { searchParams: { tag?: string } }
) {
  let posts = await getAllPosts();
  
  if (searchParams.tag) {
    posts = posts.filter(post =>
      post.tags.includes(searchParams.tag)
    );
  }

  return (
    <main>
      {/* Render posts */}
    </main>
  );
}
```

### Adding Meta Tags to Posts

Update `app/posts/[slug]/page.tsx`:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}
```

## Debugging

### Enable Debug Logging

```typescript
// In any file
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### Check Build Output

```bash
npm run build 2>&1 | grep -i error
```

### Inspect Bundle

```bash
npm run build -- --debug
```

### Network Debugging

Use browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Make a request
4. Check response status and body

## Common Issues & Solutions

### Issue: Posts not appearing
**Solution:**
- Ensure `published: true` in front matter
- Check file is in `data/posts/` directory
- Verify filename is lowercase with hyphens
- Run `npm run build` to regenerate

### Issue: Images not optimizing
**Solution:**
- Check `public/uploads/` directory exists
- Verify file size < 5MB
- Ensure Sharp is installed: `npm list sharp`
- Check browser console for errors

### Issue: Slow build time
**Solution:**
- Reduce number of posts
- Optimize images before upload
- Use `npm run build -- --debug` to identify bottleneck
- Consider static export instead of full build

### Issue: TypeScript errors
**Solution:**
- Run `npm run build` to see all errors
- Check `tsconfig.json` is correct
- Ensure types are imported: `import { Post } from '@/lib/posts'`
- Use `as` for type assertions sparingly

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test with `npm run build`
5. Commit: `git commit -am 'Add feature'`
6. Push: `git push origin feature-name`
7. Submit a pull request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Sharp Image Library](https://sharp.pixelplumbing.com/)

---

Happy coding! 🚀
