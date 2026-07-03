# Architecture Guide - Headless Blog CMS

## Overview

The Headless Blog CMS is built on Next.js 14 with the App Router, using a file-based approach for content storage and a modern React frontend for administration.

```
┌─────────────────────────────────────────────────────┐
│          Headless Blog CMS Architecture             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐         ┌──────────────────┐ │
│  │   Admin UI       │         │  Public Site     │ │
│  ├──────────────────┤         ├──────────────────┤ │
│  │  Create Post     │         │  View Posts      │ │
│  │  Edit Post       │         │  Browse Tags     │ │
│  │  Upload Images   │         │  Share via Meta  │ │
│  │  Manage Content  │         │  SEO Optimized   │ │
│  └────────┬─────────┘         └────────┬─────────┘ │
│           │                           │            │
│           └─────────────┬─────────────┘            │
│                         │                          │
│           ┌─────────────▼────────────┐            │
│           │    API Routes            │            │
│           ├─────────────────────────┤            │
│           │ /api/admin/posts        │            │
│           │ /api/admin/upload       │            │
│           │ /api/sitemap            │            │
│           │ /api/robots             │            │
│           └─────────────┬────────────┘            │
│                         │                          │
│           ┌─────────────▼────────────┐            │
│           │   Core Libraries         │            │
│           ├─────────────────────────┤            │
│           │ lib/posts.ts            │            │
│           │ lib/image-optimizer.ts  │            │
│           │ lib/seo.ts              │            │
│           └─────────────┬────────────┘            │
│                         │                          │
│           ┌─────────────▼────────────┐            │
│           │   Data Storage          │            │
│           ├─────────────────────────┤            │
│           │ data/posts/*.md         │            │
│           │ public/uploads/*        │            │
│           └─────────────────────────┘            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Directory Structure

### `/app` - Main Application

The main application using Next.js 14 App Router:

- **`/app/layout.tsx`** - Root layout with global metadata and viewport
- **`/app/page.tsx`** - Home page with blog post listing
- **`/app/globals.css`** - Global styles and utilities

### `/app/posts` - Public Blog Pages

Dynamic post pages with ISR:

- **`/app/posts/[slug]/page.tsx`** - Individual post page
- **`/app/posts/[slug]/post.module.css`** - Post styling
- Uses `generateStaticParams()` for SSG
- Uses `generateMetadata()` for SEO
- ISR with 60-second revalidation

### `/app/admin` - Admin Interface

Full-featured admin panel:

- **`/app/admin/page.tsx`** - Admin dashboard with post list
- **`/app/admin/posts/create/page.tsx`** - Create new post page
- **`/app/admin/posts/[slug]/edit/page.tsx`** - Edit existing post page
- **`/app/admin/components/PostEditor.tsx`** - Reusable editor component

Features:
- Client-side form handling with React hooks
- Real-time validation
- Image upload with preview
- Tag management
- Draft/Publish toggle

### `/app/api` - API Routes

REST API endpoints for all operations:

#### Admin Routes
- **`POST /api/admin/posts`** - Create post
- **`GET /api/admin/posts`** - List all posts
- **`GET /api/admin/posts/[slug]`** - Get single post
- **`PUT /api/admin/posts/[slug]`** - Update post
- **`DELETE /api/admin/posts/[slug]`** - Delete post
- **`POST /api/admin/upload`** - Upload and optimize images

#### SEO Routes
- **`GET /api/sitemap`** - Generate sitemap.xml
- **`GET /api/robots`** - Generate robots.txt

### `/lib` - Core Libraries

Shared utilities:

#### `posts.ts`
- File-based post management
- YAML front-matter parsing with gray-matter
- Markdown rendering with marked
- CRUD operations

**Key Exports:**
```typescript
export async function getAllPosts(): Promise<Post[]>
export async function getPostBySlug(slug: string): Promise<Post | null>
export async function getAllPostIds()
export async function savePost(slug: string, post: PostData)
export async function deletePost(slug: string)
```

#### `image-optimizer.ts`
- Image upload handling
- WebP conversion
- Multi-size optimization (thumbnail, medium, large, original)
- Using Sharp for efficient processing

**Image Sizes:**
- **thumbnail**: 300x300px, quality 70
- **medium**: 800x600px, quality 75
- **large**: 1200x900px, quality 80
- **original**: preserved quality 85

#### `seo.ts`
- Sitemap generation
- Robots.txt generation
- Meta tag generation
- OpenGraph support

### `/data` - Content Storage

Markdown files with YAML front matter:

```
data/
└── posts/
    ├── welcome.md
    ├── first-post.md
    └── another-post.md
```

**Post File Format:**
```markdown
---
title: Post Title
excerpt: Brief description
author: Author Name
date: 2026-07-02
tags:
  - tag1
  - tag2
image: /uploads/image-medium.webp
published: true
---

# Markdown content starts here...
```

### `/public` - Static Assets

- **`/public/uploads/`** - Optimized images with hash filenames
  - `image-name-thumbnail.webp`
  - `image-name-medium.webp`
  - `image-name-large.webp`
  - `image-name-original.webp`

## Data Flow

### Creating a Post

```
Admin UI (PostEditor)
  ↓
fetch POST /api/admin/posts
  ↓
Route handler validates data
  ↓
savePost() writes to data/posts/{slug}.md
  ↓
Returns slug and timestamp
  ↓
Redirect to /admin (ISR triggers revalidation)
  ↓
Homepage fetches updated post list
```

### Uploading an Image

```
Admin UI (file input)
  ↓
fetch POST /api/admin/upload (multipart/form-data)
  ↓
Route handler receives file
  ↓
optimizeImage() processes with Sharp
  ↓
Multiple WebP versions created in public/uploads/
  ↓
Returns medium-size URL: /uploads/filename-medium.webp
  ↓
URL inserted into editor
```

### Rendering a Post

```
User visits /posts/[slug]
  ↓
SSG at build time OR
On-demand if not pre-rendered
  ↓
getPostBySlug() reads from data/posts/{slug}.md
  ↓
Front matter extracted with gray-matter
  ↓
Markdown rendered to HTML with marked
  ↓
generateMetadata() creates SEO tags
  ↓
Page rendered with ISR revalidation
```

### Publishing Posts

**Static Generation (Build Time):**
- `npm run build` calls `generateStaticParams()`
- All posts with `published: true` pre-rendered
- Results cached for instant delivery

**ISR (Incremental Static Regeneration):**
- `export const revalidate = 60`
- Background regeneration after 60 seconds
- New content appears without rebuilding
- Existing users get cached version instantly

## Key Technologies

### Frontend
- **React 18** - UI components
- **Next.js 14 App Router** - Framework and routing
- **CSS Modules** - Component-scoped styling
- **Marked** - Markdown to HTML conversion

### Backend
- **Node.js File System** - Content storage
- **gray-matter** - YAML front-matter parsing
- **Sharp** - Image optimization

### Build & Deployment
- **TypeScript** - Type safety
- **Next.js Build System** - Compilation and optimization
- **Vercel** - Recommended deployment platform (supports ISR)

## Performance Optimizations

### 1. Static Generation
- Posts pre-rendered at build time
- Served as static HTML instantly
- No runtime processing needed

### 2. Incremental Static Regeneration (ISR)
- 60-second revalidation interval
- Background updates don't block users
- Fresh content without rebuilding

### 3. Image Optimization
- Automatic WebP conversion (smaller file size)
- Multiple sizes for different devices
- Sharp for efficient processing
- Quality adjusted per size

### 4. Code Splitting
- CSS Modules prevent style conflicts
- Dynamic imports for admin features
- Lazy loading of components

### 5. Metadata Optimization
- OpenGraph tags for social sharing
- Twitter cards for better previews
- Structured data for search engines
- Canonical URLs to prevent duplicates

## Security Considerations

### Current Implementation
- File-based storage (no external dependencies)
- Simple API validation
- Uploaded files stored in public directory

### Recommended for Production
1. **Add Authentication**
   ```typescript
   // Use NextAuth.js or similar
   import { getServerSession } from "next-auth"
   ```

2. **Validate Input**
   ```typescript
   import { z } from 'zod'
   const postSchema = z.object({
     title: z.string().min(1).max(200),
     content: z.string().min(10),
     // ...
   })
   ```

3. **Rate Limiting**
   ```typescript
   // Use Vercel Rate Limiting or similar
   ```

4. **Secure Image Handling**
   - Scan uploaded files for malware
   - Validate MIME types strictly
   - Sanitize filenames

## Extensibility

### Adding Authentication
```typescript
// /middleware.ts
import { auth } from "@/app/auth"

export function middleware(request: NextRequest) {
  const session = auth()
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    return redirect('/login')
  }
}
```

### Using a Database
```typescript
// Replace lib/posts.ts
import { db } from "@/lib/db"

export async function getPostBySlug(slug: string) {
  return await db.post.findUnique({ where: { slug } })
}
```

### Adding Comments
```typescript
// Add to [slug]/page.tsx
import { Comments } from '@/components/Comments'

export default function PostPage({ post }) {
  return (
    <>
      <article>{post.content}</article>
      <Comments slug={post.slug} />
    </>
  )
}
```

### Custom Markdown Plugins
```typescript
// Update lib/posts.ts
import { marked } from 'marked'

marked.use({
  renderer: {
    image: (token) => `<img src="${token.href}" alt="${token.text}" loading="lazy" />`
  }
})
```

## Deployment Strategies

### Vercel (Recommended)
- Native support for ISR
- Automatic deployments from Git
- Built-in analytics and monitoring
- Environment variables in dashboard

### Self-Hosted (Docker)
- Full control over infrastructure
- Build once with `docker build`
- Deploy anywhere with Docker
- Use load balancers for scaling

### Static Export (Netlify, GitHub Pages)
- `npm run export` creates static site
- No server required
- Fastest possible performance
- Limited to static content only

## Monitoring & Maintenance

### Key Metrics to Track
- Page load time (Core Web Vitals)
- ISR regeneration time
- Image optimization success rate
- SEO ranking and impressions

### Regular Maintenance
- Update dependencies: `npm update`
- Security audits: `npm audit`
- Content backups: `git commit && git push`
- Monitor build times

## Future Enhancement Ideas

1. **Search Functionality**
   - Add full-text search with Algolia
   - Client-side filtering with fuse.js

2. **Comments System**
   - Integrate Giscus (GitHub-based)
   - Add Disqus or Utterances

3. **Analytics**
   - Track pageviews with PostHog
   - SEO monitoring with Google Search Console

4. **Internationalization (i18n)**
   - Support multiple languages
   - Translated post slugs

5. **Newsletter Integration**
   - Subscribe form with Mailchimp/ConvertKit
   - Email digest functionality

6. **Social Features**
   - Social sharing buttons
   - Author profiles and bios
   - Related posts suggestions

---

For more details, see [README.md](./README.md)
