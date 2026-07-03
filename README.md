# 📝 Headless Blog CMS

A lightweight, fast, and flexible headless CMS built with Next.js for creating modern blogs. Features a beautiful admin interface, Markdown support, image optimization, and SEO capabilities.

## Features

### Core Features
- ✅ **Next.js 14 + React 18** - Modern, performant React framework
- ✅ **Admin CRUD Interface** - Create, read, update, delete posts easily
- ✅ **Markdown Support** - Write posts in Markdown with full formatting
- ✅ **Image Uploads** - Upload and optimize images automatically
- ✅ **Image Optimization** - Automatic WebP conversion with multiple sizes
- ✅ **SEO Ready** - Built-in sitemaps, robots.txt, and meta tags
- ✅ **ISR (Incremental Static Regeneration)** - Automatic cache revalidation

### Advanced Features
- 🎯 **Responsive Design** - Beautiful UI that works on all devices
- 🔄 **ISR Pipeline** - Automatic page regeneration on content changes
- 🖼️ **Image Pipeline** - Sharp-powered optimization (thumbnail, medium, large)
- 📱 **Mobile Admin** - Full admin functionality on mobile
- 🎨 **Modern Styling** - CSS modules with gradient design
- 🔍 **SEO Metadata** - OpenGraph and Twitter card support

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd Headless-Blog
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=My Blog
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Directory Structure

```
Headless-Blog/
├── app/
│   ├── api/                 # API routes
│   │   ├── admin/          # Admin endpoints
│   │   │   ├── posts/      # Post CRUD endpoints
│   │   │   └── upload/     # Image upload endpoint
│   │   ├── sitemap/        # Sitemap.xml generation
│   │   └── robots/         # Robots.txt generation
│   ├── admin/              # Admin interface
│   │   ├── components/     # Admin components
│   │   ├── posts/          # Post creation/editing
│   │   └── page.tsx        # Admin dashboard
│   ├── posts/              # Public blog posts
│   │   └── [slug]/         # Dynamic post page with ISR
│   ├── globals.css         # Global styles
│   └── page.tsx            # Home page
├── lib/
│   ├── posts.ts            # Post file operations
│   ├── image-optimizer.ts  # Image optimization utility
│   └── seo.ts              # SEO utilities
├── data/
│   └── posts/              # Post markdown files
├── public/
│   └── uploads/            # Optimized images
├── package.json            # Dependencies
├── next.config.js          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## Usage

### Creating a Post

1. **Via Admin Interface**
   - Go to http://localhost:3000/admin
   - Click "New Post"
   - Fill in the form:
     - Title (required)
     - Excerpt
     - Content (Markdown)
     - Author
     - Date
     - Tags
     - Featured Image (optional)
   - Click "Create Post"

2. **Manual (Markdown File)**
   - Create a file in `data/posts/{slug}.md`
   - Add front matter with metadata
   - Write content in Markdown
   - Save and refresh

### Post Format

Posts are stored as Markdown files with YAML front matter:

```markdown
---
title: My Awesome Post
excerpt: A brief description
author: John Doe
date: 2026-07-02
tags:
  - javascript
  - blog
image: /uploads/image-medium.webp
published: true
---

# Content starts here

Your Markdown content...
```

### Front Matter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | ✅ | Post title |
| excerpt | string | ❌ | Short summary |
| author | string | ❌ | Author name |
| date | string | ❌ | ISO date (YYYY-MM-DD) |
| tags | array | ❌ | Tag list |
| image | string | ❌ | Featured image URL |
| published | boolean | ❌ | Publish status (default: false) |

### Markdown Support

Full Markdown support including:
- Headings (h1-h6)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Blockquotes
- Links and images
- Bold, italic, strikethrough
- Tables
- Horizontal rules

## API Endpoints

### Posts API

**Get all posts**
```
GET /api/admin/posts
```

**Create post**
```
POST /api/admin/posts
Content-Type: application/json

{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "author": "...",
  "date": "2026-07-02",
  "tags": ["tag1"],
  "image": "...",
  "published": true
}
```

**Get single post**
```
GET /api/admin/posts/{slug}
```

**Update post**
```
PUT /api/admin/posts/{slug}
Content-Type: application/json
```

**Delete post**
```
DELETE /api/admin/posts/{slug}
```

### Image Upload API

**Upload image**
```
POST /api/admin/upload
Content-Type: multipart/form-data

File: <image-file>
```

Returns:
```json
{
  "url": "/uploads/image-medium.webp"
}
```

### SEO API

**Sitemap**
```
GET /sitemap.xml
```

**Robots.txt**
```
GET /robots.txt
```

## Building for Production

### Static Export
```bash
npm run export
```

This generates a static site in the `out/` directory suitable for deployment.

### With ISR
For dynamic content updates without rebuilding, deploy to Vercel:

```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t headless-blog .
docker run -p 3000:3000 headless-blog
```

## Image Optimization

Images are automatically optimized into multiple sizes:

- **thumbnail** (300x300, quality 70)
- **medium** (800x600, quality 75)
- **large** (1200x900, quality 80)
- **original** (quality 85)

All images are converted to WebP format for better compression.

## ISR (Incremental Static Regeneration)

Posts use ISR with a 60-second revalidation interval:

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

This means:
- Pages are pre-rendered at build time
- On-demand requests after deployment are served instantly
- Pages are regenerated in the background after 60 seconds
- Fresh content is served to next visitors

## SEO

The CMS includes built-in SEO support:

- **Meta Tags** - Automatic title, description, keywords
- **OpenGraph** - Facebook/LinkedIn sharing preview
- **Twitter Cards** - Twitter sharing preview
- **Sitemap** - Automatic sitemap generation
- **Robots.txt** - Search engine crawling configuration
- **Structured Data** - Article schema markup

Each post automatically generates:
- Canonical URL
- OpenGraph tags with featured image
- Twitter card with summary
- Publish date structured data

## Performance

Optimizations included:

- Static site generation
- Image optimization (WebP, multiple sizes)
- CSS modules for scoped styling
- Font subsetting
- Gzip compression
- Browser caching headers
- ISR for instant updates

## Customization

### Styling

Global styles are in `app/globals.css`. Component styles use CSS modules:
- `app/page.module.css` - Home page
- `app/posts/[slug]/post.module.css` - Post page
- `app/admin/components/editor.module.css` - Admin editor

### Theme

Edit the gradient colors in component CSS files:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Image Sizes

Edit `lib/image-optimizer.ts` to customize image optimization:

```typescript
const imageSizes: Record<string, ImageSize> = {
  thumbnail: { width: 300, height: 300, quality: 70 },
  medium: { width: 800, height: 600, quality: 75 },
  large: { width: 1200, height: 900, quality: 80 },
};
```

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

Set environment variables in Vercel dashboard.

### Netlify
```bash
npm run build
netlify deploy --prod --dir=.next
```

### Docker
```bash
docker build -t headless-blog .
docker run -e NEXT_PUBLIC_SITE_URL=https://yourdomain.com -p 3000:3000 headless-blog
```

### Self-Hosted
```bash
npm install
npm run build
npm start
```

## Troubleshooting

### Posts not showing
- Check `data/posts/` directory exists
- Ensure posts have `published: true` in front matter
- Restart dev server

### Images not optimizing
- Check `public/uploads/` directory exists and is writable
- Verify Sharp is properly installed: `npm list sharp`
- Check file size < 5MB

### ISR not working
- Ensure deployed to platform supporting ISR (Vercel)
- Check `export const revalidate = 60;` is set
- Wait 60 seconds after publishing for regeneration

## Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run export       # Build static export
```

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Markdown**: gray-matter, marked
- **Image Processing**: Sharp
- **HTTP Client**: Axios

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues, questions, or suggestions:
- Open an GitHub issue
- Check the [FAQ](#faq) section below

## FAQ

**Q: Can I use a database instead of Markdown files?**
A: Yes! Replace `lib/posts.ts` with your database queries. The API routes will work the same.

**Q: How do I add comments?**
A: Add a third-party service like Disqus, Utterances, or Giscus to post pages.

**Q: Can I customize the admin interface?**
A: Yes, all admin components are in `app/admin/`. Edit as needed.

**Q: Is this production-ready?**
A: Yes, but add authentication for the admin panel in production. See Next.js auth docs.

**Q: How do I add authentication?**
A: Use NextAuth.js or another auth provider. Protect routes in `app/api/admin/*`.

---

Made with ❤️ by the community