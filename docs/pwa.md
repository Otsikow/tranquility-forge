# Peace PWA Documentation

## Overview

Peace is now a Progressive Web App (PWA), offering native-like experiences with offline capabilities, installability, and enhanced performance.

## Phase 1: Core PWA Setup ✅

### Components Implemented

#### 1. Web App Manifest (`/public/manifest.webmanifest`)

Defines the app's metadata and behavior when installed:

- **Name**: "Peace — Mental Wellbeing"
- **Short Name**: "Peace"
- **Start URL**: `/?source=pwa` (with tracking parameter)
- **Display Mode**: `standalone` (no browser UI)
- **Theme Color**: `#0ea5e9` (Peace blue)
- **Background Color**: `#ffffff` (white)
- **Icons**: Peace leaf logo in multiple sizes (192×192, 256×256, 384×384, 512×512)
  - Purpose: `any maskable` (works in all contexts)
- **Shortcuts**: Quick actions to key features
  - New Journal Entry → `/journal/new`
  - Breathing Exercise → `/breathe`
  - AI Chat → `/chat`

#### 2. Service Worker (`/public/sw.js`)

Implements caching strategies for offline-first experience:

**Caching Strategies:**

| Resource Type | Strategy | Cache | Rationale |
|--------------|----------|-------|-----------|
| HTML documents | Network-first | Dynamic | Fresh content, fallback to cache |
| Static assets (CSS/JS) | Cache-first | Static | Immutable, version-controlled |
| Images | Stale-while-revalidate | Dynamic | Quick display, update in background |
| API GET requests | Network-first | Dynamic | Fresh data, fallback for offline |
| API mutations (POST/PUT/DELETE) | Network-only | None | Data integrity; queuing planned for Phase 2 |

**Cache Management:**

- **Version**: `peace-v1` (prefix for all caches)
- **Static Cache**: Pre-cached assets, long-lived
- **Dynamic Cache**: Runtime-cached resources, refreshed regularly
- **Cleanup**: Old cache versions removed on activation

**Offline Fallback:**

- HTML requests → `/offline.html` when network fails
- API failures return 503 with JSON error for graceful handling

#### 3. Offline Page (`/public/offline.html`)

Lightweight, accessible fallback page:

- Displays Peace logo and friendly message
- "Try Again" button to retry connection
- Respects reduced motion preferences
- Minimal styles (inline CSS, no external dependencies)
- WCAG 2.1 AA compliant

#### 4. Install Prompt Component (`src/components/PWAInstallPrompt.tsx`)

Smart install prompts for different platforms:

**Android/Desktop:**
- Captures `beforeinstallprompt` event
- Shows non-intrusive card with "Install" button
- Dismissible, stores preference in localStorage

**iOS:**
- Detects iOS Safari
- Shows coach-mark with Share button (📤) instructions
- Appears after 3-second delay for better UX
- "Got it" button to dismiss

**Features:**
- Checks if already installed (display-mode: standalone)
- Respects user dismissal preference
- Positioned above bottom navigation (bottom: 20px)
- Responsive design (fixed width on desktop)

#### 5. Update Prompt Component (`src/components/PWAUpdatePrompt.tsx`)

Handles service worker updates:

- Detects when new version is waiting
- Shows toast notification: "Update available"
- Action button to activate update immediately
- Auto-reloads page after activation
- Silent update check every 60 seconds

#### 6. PWA Hook (`src/hooks/usePWA.ts`)

Utility hook for PWA functionality:

- `isInstalled`: Boolean, true if running as installed PWA
- `isSupported`: Boolean, true if service workers are supported
- Registers service worker on mount
- Sets up periodic update checks (every 60 seconds)

### HTML Meta Tags (index.html)

Required PWA and iOS-specific meta tags:

```html
<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.webmanifest">

<!-- Theme Color -->
<meta name="theme-color" content="#0ea5e9">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<!-- iOS Web App -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Peace">

<!-- Favicon -->
<link rel="icon" href="/logo.png" type="image/png">
```

## Installation

### Android (Chrome, Edge, Samsung Internet)

1. Open Peace in browser
2. Look for install banner or "Install Peace" prompt
3. Tap "Install" → App added to home screen
4. Launch from app drawer or home screen

### iOS (Safari only)

1. Open Peace in Safari
2. Tap Share button (📤) at bottom
3. Scroll down, tap "Add to Home Screen"
4. Confirm → App added to home screen
5. Launch like any native app

### Desktop (Chrome, Edge)

1. Open Peace in browser
2. Look for install icon (➕) in address bar
3. Click "Install" → App opens in standalone window
4. Access from taskbar/dock or apps menu

## Offline Behavior

### Currently Available Offline:

- Previously visited pages (cached)
- Static assets (CSS, JS, fonts, images)
- Logo and branding
- Offline fallback page

### Requires Network (Phase 1):

- AI chat responses
- New journal entries (will queue in Phase 2)
- Mood submissions (will queue in Phase 2)
- Real-time data updates

### Planned Offline Features (Phase 2+):

- Background Sync for journal entries
- IndexedDB storage for last 200 journals
- Offline mood tracking with sync queue
- Downloaded meditations for offline playback

## Update Flow

1. User opens Peace (installed PWA)
2. Service worker checks for updates in background
3. If new version found:
   - Old version continues running
   - New version downloaded and installed
   - Toast appears: "Update available"
4. User taps "Update":
   - New service worker activates
   - Page reloads automatically
   - User sees latest version

## Testing

### Test PWA Features:

**Install:**
```bash
# Chrome DevTools → Application → Manifest
# Click "Add to home screen"
```

**Offline:**
```bash
# Chrome DevTools → Network → Throttling → Offline
# Navigate around the app
```

**Update:**
```bash
# Make code change
# Rebuild app
# Open installed PWA
# Wait for update notification
```

**Service Worker:**
```bash
# Chrome DevTools → Application → Service Workers
# View caches, offline status, update cycle
```

### Lighthouse Audit:

```bash
# Chrome DevTools → Lighthouse
# Select: PWA, Performance, Accessibility, Best Practices, SEO
# Run audit
```

**Phase 1 Target Scores:**
- PWA: ≥ 90 (full 100 requires HTTPS in production)
- Performance: ≥ 85 (Phase 3 will optimize to ≥90)
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 90

## Troubleshooting

### Service Worker Not Registering:

- Check browser console for errors
- Verify `/sw.js` is accessible (200 status)
- Ensure HTTPS in production (localhost is exempt)
- Clear cache and hard reload (Ctrl+Shift+R)

### Install Prompt Not Showing:

- Must visit site 2+ times over 5+ minutes (Chrome requirement)
- Check if already installed
- Verify manifest is valid (Chrome DevTools → Application → Manifest)
- Check for console errors

### Update Not Working:

- Old service worker may be stuck
- Chrome DevTools → Application → Service Workers → "Unregister"
- Hard reload (Ctrl+Shift+R)
- Re-register on next visit

### iOS Not Installing:

- **Must use Safari** (Chrome/Firefox on iOS don't support PWA install)
- Check for "Add to Home Screen" in Share menu
- Ensure manifest is valid
- Verify apple-touch-icon exists

## Browser Support

### Fully Supported:

- Chrome 80+ (Android, Desktop, iOS)
- Edge 80+ (Desktop)
- Samsung Internet 12+
- Safari 14+ (iOS, macOS)

### Partially Supported:

- Firefox (Desktop): Service workers ✅, Install ❌
- Opera (Desktop, Mobile): Full support

### Not Supported:

- Internet Explorer (end-of-life)
- Legacy browsers (<2019)

## Security & Privacy

- Service worker only caches public assets
- User-specific data not cached (auth required)
- API responses cached per-user (scoped)
- Offline mutations queued securely (Phase 2)
- No tracking in PWA parameters

## Phase Status

### Phase 1: Core PWA Setup ✅
- Web app manifest with icons and shortcuts
- Service worker with caching strategies
- Offline fallback page
- Install prompts (Android, iOS, Desktop)
- Update notification system

### Phase 2: Push Notifications & Background Sync ✅
- Web Push API with VAPID authentication
- Background sync for write operations
- Push notification preferences UI
- Sync queue with retry logic
- Periodic background sync (Chrome)

### Phase 3: Offline Data & Media ✅
- IndexedDB for journals (last 200 entries)
- IndexedDB for moods (60 days)
- Meditation downloads with offline playback
- LRU eviction for storage management
- Download manager UI with quota monitoring
- Storage statistics and cleanup

### Phase 4: Performance Optimization (Planned)
- Code splitting for heavy routes
- Image optimization (srcset, lazy load, WebP)
- Preconnect/DNS-prefetch for APIs
- Font optimization (font-display: swap)
- Critical CSS inline
- Target: Lighthouse Performance ≥90

## Offline Data Features (Phase 3)

### IndexedDB Storage

Peace uses IndexedDB for robust offline data storage:

**Database**: `PeaceOfflineDB`

**Stores**:
- `journals`: Last 200 journal entries
- `moods`: Last 60 days of mood tracking
- `meditations`: Downloaded audio files as Blobs
- `metadata`: Storage statistics and cleanup info

### Journals Offline

```typescript
import { saveJournalOffline, getOfflineJournals } from "@/lib/offlineStorage";

// Save journal offline
await saveJournalOffline({
  id: '...',
  title: 'My Entry',
  content: '...',
  mood: 4,
  created_at: new Date().toISOString(),
});

// Retrieve offline journals
const journals = await getOfflineJournals(200); // Last 200
```

**Features**:
- Automatic LRU eviction (keeps last 200)
- Sync status tracking
- Size monitoring

### Moods Offline

```typescript
import { saveMoodOffline, getOfflineMoods } from "@/lib/offlineStorage";

// Save mood offline
await saveMoodOffline({
  id: '...',
  mood: 5,
  note: 'Feeling great!',
  created_at: new Date().toISOString(),
});

// Retrieve last 60 days
const moods = await getOfflineMoods(60);
```

**Features**:
- Rolling 60-day window
- Automatic cleanup of old entries
- Sync status tracking

### Meditation Downloads

```typescript
import {
  downloadMeditationOffline,
  getOfflineMeditation,
  isMeditationDownloaded,
  deleteMeditationOffline
} from "@/lib/offlineStorage";

// Check if downloaded
const isDownloaded = await isMeditationDownloaded(meditationId);

// Download for offline
await downloadMeditationOffline(
  meditationId,
  'Peaceful Sleep',
  'https://audio-url.com/file.mp3'
);

// Get offline audio
const audioBlob = await getOfflineMeditation(meditationId);
const url = URL.createObjectURL(audioBlob);

// Delete download
await deleteMeditationOffline(meditationId);
```

**Features**:
- Full audio file download
- LRU eviction when quota exceeded
- Last accessed timestamp tracking
- Storage quota management

### Storage Quotas

**Limits**:
- Total storage: 200 MB
- Journals: 10 MB
- Moods: 1 MB  
- Meditations: 100 MB each

**Quota Management**:
```typescript
import { getStorageStats, checkStorageQuota } from "@/lib/offlineStorage";

// Get Peace storage stats
const stats = await getStorageStats();
console.log(stats.total.percentUsed); // 45.2

// Get browser storage quota
const quota = await checkStorageQuota();
console.log(quota.usage, quota.quota);
```

**LRU Eviction**:
- Automatically removes least recently accessed meditations
- Frees space when quota exceeded
- User notified before large downloads

### Using Offline Hooks

**useOfflineJournals**:
```typescript
import { useOfflineJournals } from "@/hooks/useOfflineJournals";

const { journals, isLoading, isOnline, createJournal, refreshJournals } = useOfflineJournals();

// Create journal (auto-syncs if online)
await createJournal({
  id: uuidv4(),
  title: 'Test',
  content: 'Content',
  created_at: new Date().toISOString(),
});
```

**useOfflineMeditation**:
```typescript
import { useOfflineMeditation } from "@/hooks/useOfflineMeditation";

const {
  isDownloaded,
  isDownloading,
  download,
  remove,
  getAudioUrl
} = useOfflineMeditation(meditationId, audioUrl, title);

// Download meditation
await download();

// Get audio URL (offline or online)
const audioSrc = getAudioUrl();
```

### Download Manager UI

**Component**: `<DownloadManager />`

**Features**:
- Storage overview with progress bars
- Downloaded meditations list
- Delete individual downloads
- Clear all offline data
- Browser quota display
- Storage statistics (journals, moods, meditations)

**Usage**:
```tsx
import { DownloadManager } from "@/components/DownloadManager";

// In settings page
<DownloadManager />
```

## Next Steps

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Training](https://web.dev/learn/pwa/)
- [Chrome: PWA Install Criteria](https://web.dev/install-criteria/)
- [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

---

**Status**: Phase 1 Complete ✅  
**Version**: v2025.10.20  
**Last Updated**: October 20, 2025
