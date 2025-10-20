# Lighthouse Performance Documentation

## Overview

This document tracks Lighthouse audit scores for Peace PWA and provides optimization strategies to meet production-grade performance targets.

## Current Targets (Phase 1-3)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| PWA | ≥ 95 | TBD | 🔄 Testing |
| Performance | ≥ 90 | TBD | 🔄 Testing |
| Accessibility | ≥ 95 | TBD | 🔄 Testing |
| Best Practices | ≥ 95 | TBD | 🔄 Testing |
| SEO | ≥ 90 | TBD | 🔄 Testing |

## How to Run Lighthouse

### Chrome DevTools

1. Open Chrome DevTools (F12)
2. Navigate to **Lighthouse** tab
3. Select device: **Mobile** (primary target)
4. Check all categories:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
   - Progressive Web App
5. Click **Analyze page load**
6. Review results and recommendations

### CLI (Automated)

```bash
npm install -g lighthouse

# Run lighthouse
lighthouse https://your-peace-app.com --view --output html,json

# Mobile
lighthouse https://your-peace-app.com --preset=mobile --view

# Desktop
lighthouse https://your-peace-app.com --preset=desktop --view
```

## PWA Checklist (Target: ≥ 95)

### Required

- [x] Registers a service worker (`/sw.js`)
- [x] Responds with 200 when offline (`/offline.html`)
- [x] Web app manifest with required fields
- [x] Configured for custom splash screen
- [x] Sets theme color via meta tag
- [x] Content sized for viewport
- [x] Has `<meta name="viewport">` tag

### Recommended

- [x] Provides Apple Touch Icon (180x180)
- [x] Maskable icon provided in manifest
- [x] Current page responds with 200 when offline
- [ ] Page load fast enough on mobile (HTTPS required for full score)
- [ ] Start URL responds with 200 when offline

### Not Yet Implemented

- [ ] Installable via HTTPS (localhost exempt)
- [ ] Uses HTTPS (production requirement)
- [ ] Redirects HTTP to HTTPS

## Performance Checklist (Target: ≥ 90)

### Core Web Vitals

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | Largest element visible time |
| **FID** (First Input Delay) | ≤ 100ms | Time to interactivity |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Visual stability |

### Optimizations Implemented

#### Phase 1-3
- [x] Service worker caching
- [x] Static asset caching (cache-first)
- [x] Image caching (stale-while-revalidate)
- [x] Offline fallback page
- [x] Manifest with icons
- [x] Semantic HTML structure

#### Phase 4 (Planned)
- [ ] Code splitting (React.lazy for heavy routes)
- [ ] Image optimization (srcset, lazy load)
- [ ] Preconnect to origin (`<link rel="preconnect">`)
- [ ] DNS-prefetch for APIs
- [ ] Font optimization (font-display: swap)
- [ ] Critical CSS inline
- [ ] Defer non-critical JavaScript
- [ ] Minify CSS/JS (Vite handles this)
- [ ] Tree-shake unused code
- [ ] Use CDN for static assets

### Performance Budget

| Resource Type | Budget | Current |
|--------------|--------|---------|
| Total page size | ≤ 500 KB | TBD |
| JavaScript | ≤ 200 KB | TBD |
| CSS | ≤ 50 KB | TBD |
| Images | ≤ 200 KB | TBD |
| Fonts | ≤ 50 KB | TBD |

## Accessibility Checklist (Target: ≥ 95)

### Implemented

- [x] Semantic HTML (`<header>`, `<main>`, `<nav>`, etc.)
- [x] Alt text on all images
- [x] Proper heading hierarchy (h1 → h2 → h3)
- [x] Focus indicators on interactive elements
- [x] ARIA labels where needed
- [x] Color contrast meets WCAG AA
- [x] Keyboard navigation support
- [x] Screen reader friendly
- [x] Touch target size ≥ 44x44px
- [x] Respects prefers-reduced-motion

### To Verify

- [ ] Form labels and error messages
- [ ] Skip to main content link
- [ ] ARIA live regions for dynamic content
- [ ] No auto-playing audio/video

## Best Practices Checklist (Target: ≥ 95)

### Security

- [ ] Uses HTTPS (production)
- [x] No insecure mixed content
- [x] CSP headers (Vite default)
- [x] No vulnerable libraries (keep dependencies updated)

### Modern Standards

- [x] Uses modern JavaScript (ES6+)
- [x] Avoids deprecated APIs
- [x] Proper error handling
- [x] Console logs removed in production

### Resource Loading

- [x] Efficient cache policy for static assets
- [x] Images have correct dimensions
- [x] No render-blocking resources (Vite handles)
- [x] Preload key resources (fonts, critical CSS)

## SEO Checklist (Target: ≥ 90)

### Implemented

- [x] Valid HTML
- [x] `<title>` tag present and descriptive
- [x] `<meta name="description">` present
- [x] `<meta name="viewport">` configured
- [x] Document has `<html lang="en">`
- [x] Links have descriptive text
- [x] Proper heading structure (h1 on every page)
- [x] Images have alt attributes
- [x] Canonical URL (via manifest start_url)

### Social Media

- [x] Open Graph tags (og:title, og:description, og:image)
- [x] Twitter card tags
- [x] Favicon present

### Mobile SEO

- [x] Tap targets sized appropriately
- [x] Text readable without zooming
- [x] Content sized for viewport
- [x] No horizontal scrolling

## Optimization Strategies

### Phase 4: Code Splitting

```typescript
// Before
import { MeditationPlayer } from "@/pages/MeditationPlayer";

// After (lazy load)
const MeditationPlayer = React.lazy(() => import("@/pages/MeditationPlayer"));

<Suspense fallback={<LoadingSpinner />}>
  <MeditationPlayer />
</Suspense>
```

### Phase 4: Image Optimization

```tsx
// Use srcset for responsive images
<img
  src="/images/hero-lake-800w.jpg"
  srcset="
    /images/hero-lake-400w.jpg 400w,
    /images/hero-lake-800w.jpg 800w,
    /images/hero-lake-1200w.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Peaceful lake at sunset"
  loading="lazy"
/>
```

### Phase 4: Preconnect

```html
<!-- In index.html <head> -->
<link rel="preconnect" href="https://bsjnbnsufdgkrbdqnecz.supabase.co">
<link rel="dns-prefetch" href="https://bsjnbnsufdgkrbdqnecz.supabase.co">
```

### Phase 4: Font Optimization

```css
/* In index.css */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2') format('woff2');
  font-display: swap; /* Shows fallback while loading */
}
```

## Testing Workflow

1. **Local Testing**
   ```bash
   npm run build
   npm run preview
   lighthouse http://localhost:4173 --view
   ```

2. **Staging Testing**
   - Deploy to staging environment
   - Run Lighthouse on HTTPS URL
   - Address any HTTPS-specific issues

3. **Production Testing**
   - Run Lighthouse on production URL
   - Test from multiple locations (slow 3G, 4G)
   - Monitor real user metrics

## Real User Monitoring (RUM)

Consider integrating RUM tools for production:

- **Web Vitals Library**: https://github.com/GoogleChrome/web-vitals
- **Sentry Performance**: Tracks performance in production
- **Google Analytics**: Custom events for load times

```typescript
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

## Common Issues & Fixes

### Issue: Low Performance Score

**Symptoms**: Performance < 90

**Solutions**:
1. Enable compression (Gzip/Brotli)
2. Optimize images (WebP format, compression)
3. Code split heavy routes
4. Remove unused dependencies
5. Enable caching headers

### Issue: PWA Not Passing

**Symptoms**: PWA < 95

**Solutions**:
1. Verify service worker is registered
2. Check manifest has all required fields
3. Ensure offline page works
4. Test on HTTPS (or localhost)
5. Verify icons are correct size/format

### Issue: Accessibility Warnings

**Symptoms**: Accessibility < 95

**Solutions**:
1. Add missing alt text
2. Fix color contrast issues
3. Add ARIA labels to buttons/links
4. Ensure proper heading hierarchy
5. Test with screen reader

## Baseline Scores (To Be Updated)

### Desktop (Localhost)

| Metric | Score | Notes |
|--------|-------|-------|
| PWA | TBD | First run after Phase 3 |
| Performance | TBD | |
| Accessibility | TBD | |
| Best Practices | TBD | |
| SEO | TBD | |

### Mobile (Localhost)

| Metric | Score | Notes |
|--------|-------|-------|
| PWA | TBD | First run after Phase 3 |
| Performance | TBD | |
| Accessibility | TBD | |
| Best Practices | TBD | |
| SEO | TBD | |

### Production (HTTPS)

| Metric | Score | Notes |
|--------|-------|-------|
| PWA | TBD | After deployment |
| Performance | TBD | |
| Accessibility | TBD | |
| Best Practices | TBD | |
| SEO | TBD | |

## Resources

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Status**: Phase 3 Complete - Ready for Testing ✅  
**Next**: Run Lighthouse audits and update baseline scores  
**Version**: v2025.10.20  
**Last Updated**: October 20, 2025
