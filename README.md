# Toolvex — Free Online Tools Website

Toolvex is a production-ready, fast, accessible, and SEO-optimized web application providing 10 free client-side online tools with zero registration or cloud uploads.

## Included Tools

1. **QR Code Generator** (`/qr-code-generator`) — Custom colors, sizing, error correction, URL/WiFi/vCard modes, PNG & SVG export.
2. **Image Compressor** (`/image-compressor`) — Quality slider, side-by-side comparison, bulk ZIP download.
3. **Image Resizer** (`/image-resizer`) — Width/height controls, aspect ratio lock, percentage scale presets, export format selection.
4. **JPG to PNG Converter** (`/jpg-to-png`) — Convert JPG/JPEG images to PNG cleanly in browser.
5. **PNG to JPG Converter** (`/png-to-jpg`) — Convert PNG to JPG with background fill color selection.
6. **Image to PDF Converter** (`/image-to-pdf`) — Turn images into PDF documents with reorderable pages, custom margins, and page orientation.
7. **PDF Merger** (`/pdf-merger`) — Combine multiple PDF files into one single PDF document with page reordering.
8. **PDF Compressor** (`/pdf-compressor`) — Reduce PDF document size locally using PDF-Lib stream compression.
9. **Word & Character Counter** (`/word-counter`) — Real-time word/character count, reading time estimation, top keyword density, case converters.
10. **JSON Formatter & Validator** (`/json-formatter`) — Beautify, minify, and validate JSON syntax with error line diagnostics.

## Features & SEO Highlights

- **100% Client-Side Privacy:** No user files or inputs touch cloud servers.
- **Netlify Ready:** Preconfigured with `netlify.toml` and `public/_redirects` for single-page app (SPA) routing.
- **Dynamic SEO Metadata:** Title tags, meta descriptions, Open Graph, Twitter cards, and canonical links.
- **Structured JSON-LD Data:** WebSite, Organization, WebApplication, FAQPage, and BreadcrumbList schemas on every page.
- **Sitemap & Robots:** Built-in `public/sitemap.xml` and `public/robots.txt`.
- **Search Modal:** Fast keyboard shortcut (`Cmd/Ctrl + K`) dialog search.
- **Dark/Light Mode:** Automatic theme toggling with local storage persistence.

## How to Deploy to Netlify

1. **Connect Repository / Upload Folder:**
   - Push this codebase to GitHub/GitLab or drag the build output folder directly to Netlify.

2. **Netlify Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

3. **Configure Your Domain (Optional):**
   - Add environment variable `VITE_SITE_URL` in Netlify Site Settings (e.g. `https://your-custom-domain.com`).

4. **Verify Direct URLs & Sitemap:**
   - Direct URLs like `https://your-site.netlify.app/qr-code-generator` and `https://your-site.netlify.app/sitemap.xml` will work immediately out of the box!
