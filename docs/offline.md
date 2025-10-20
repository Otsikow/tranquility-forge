# Offline & Background Sync Documentation

## Overview

Peace provides robust offline functionality with background synchronization, ensuring users can continue journaling, tracking moods, and accessing content even without internet connectivity.

## Architecture

### Components

1. **Service Worker** (`public/sw.js`)
   - Intercepts network requests
   - Implements caching strategies
   - Handles background sync events

2. **Background Sync Library** (`src/lib/backgroundSync.ts`)
   - Manages operation queue
   - Coordinates sync registration
   - Provides status APIs

3. **IndexedDB Storage** (`PeaceDB`)
   - Stores queued operations
   - Persists offline data
   - Manages local state

4. **Sync Queue Table** (`sync_queue`)
   - Server-side operation log
   - Tracks sync status
   - Enables retry logic

## Caching Strategies

### Strategy Matrix

| Resource Type | Strategy | Cache | Rationale |
|--------------|----------|-------|-----------|
| HTML Pages | Network-first | Dynamic | Fresh content priority |
| JavaScript/CSS | Cache-first | Static | Version-controlled assets |
| Images | Stale-while-revalidate | Dynamic | Quick display + updates |
| API GET | Network-first | Dynamic | Fresh data with fallback |
| API POST/PUT/DELETE | Network-only + Queue | None | Queue for background sync |
| Audio (meditations) | Cache-first + Range | Dynamic | Offline playback support |

### Cache Lifecycle

```javascript
// Caches created
'peace-v2-static'  // Long-lived, version-controlled
'peace-v2-dynamic' // Short-lived, frequently updated

// Cleanup on activate
Old versions automatically removed
```

## Background Sync

### How It Works

1. **User Action Offline**:
   - Operation fails due to no network
   - Added to IndexedDB queue
   - Background sync registered

2. **Network Restored**:
   - Service worker wakes up
   - Processes queued operations
   - Removes successful operations

3. **Retry Logic**:
   - Failed operations remain in queue
   - Next sync attempt tries again
   - Manual retry available in UI

### Supported Operations

#### Journal Entries

```typescript
// Create new entry offline
await queueOperation('/api/journals', 'POST', {
  title: 'My Entry',
  content: '...',
  mood: 4
});
```

#### Mood Tracking

```typescript
// Log mood offline
await queueOperation('/api/moods', 'POST', {
  mood: 5,
  note: 'Feeling great!'
});
```

#### Chat Messages

```typescript
// Send message offline
await queueOperation('/api/chat', 'POST', {
  message: 'Tell me about anxiety',
  context: []
});
```

### Implementation

#### Queuing an Operation

```typescript
import { queueOperation } from "@/lib/backgroundSync";

try {
  await fetch('/api/journals', { method: 'POST', body });
} catch (error) {
  // Network failed, queue for later
  await queueOperation('/api/journals', 'POST', body, headers);
  toast.info("Saved offline - will sync when online");
}
```

#### Checking Queue Status

```typescript
import { getQueueSize } from "@/lib/backgroundSync";

const pendingOps = await getQueueSize();
console.log(`${pendingOps} operations pending sync`);
```

#### Manual Sync Trigger

```typescript
if ('serviceWorker' in navigator) {
  const registration = await navigator.serviceWorker.ready;
  await registration.sync.register('peace-write-ops');
}
```

## IndexedDB Schema

### Database: `PeaceDB`

#### Store: `syncQueue`

```typescript
interface QueuedOperation {
  id: string;           // UUID
  request: {
    url: string;        // API endpoint
    method: string;     // HTTP method
    body?: any;         // Request payload
    headers?: object;   // Request headers
  };
  timestamp: number;    // Queue time
}
```

### Operations

```typescript
// Add to queue
const db = await openDB();
await db.transaction('syncQueue', 'readwrite')
  .objectStore('syncQueue')
  .add(operation);

// Get all queued
const operations = await db.transaction('syncQueue', 'readonly')
  .objectStore('syncQueue')
  .getAll();

// Remove after sync
await db.transaction('syncQueue', 'readwrite')
  .objectStore('syncQueue')
  .delete(operationId);
```

## Service Worker Sync Event

### Event Handler

```javascript
self.addEventListener('sync', (event) => {
  if (event.tag === 'peace-write-ops') {
    event.waitUntil(processQueue());
  }
});
```

### Process Queue

```javascript
async function processQueue() {
  const db = await openDB();
  const operations = await db.transaction('syncQueue')
    .objectStore('syncQueue')
    .getAll();
  
  for (const op of operations) {
    try {
      await retryOperation(op);
      await removeFromQueue(op.id);
    } catch (error) {
      console.error('Sync failed:', op.id, error);
      // Keep in queue for next attempt
    }
  }
}
```

### Retry Operation

```javascript
async function retryOperation(op) {
  const { url, method, body, headers } = op.request;
  
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response;
}
```

## Periodic Background Sync

### Feature Support

Periodic Background Sync allows automatic data refresh even when app is closed.

**Support**:
- Chrome 80+ ✅
- Edge 80+ ✅
- Safari ❌
- Firefox ❌

### Registration

```javascript
// Request permission first
const status = await navigator.permissions.query({
  name: 'periodic-background-sync',
});

if (status.state === 'granted') {
  const registration = await navigator.serviceWorker.ready;
  
  await registration.periodicSync.register('refresh-affirmations', {
    minInterval: 24 * 60 * 60 * 1000, // 24 hours
  });
}
```

### Event Handler

```javascript
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-affirmations') {
    event.waitUntil(refreshAffirmations());
  }
});

async function refreshAffirmations() {
  const response = await fetch('/api/affirmations/daily');
  const data = await response.json();
  
  // Update cache
  const cache = await caches.open('peace-v2-dynamic');
  await cache.put('/api/affirmations/daily', 
    new Response(JSON.stringify(data))
  );
}
```

## UI Components

### Sync Status Indicator

```tsx
import { SyncStatus } from "@/components/SyncStatus";

// Shows online/offline state
// Displays queue size
// Allows manual sync trigger
<SyncStatus />
```

### Features

- **Online**: Green badge, "Synced"
- **Syncing**: Blue badge, "Syncing (3)"
- **Offline**: Red badge, "Offline"
- **Popover**: Queue details and actions

## Offline Capabilities

### Currently Available Offline

✅ View previously visited pages
✅ View cached journal entries (last session)
✅ View mood history (cached)
✅ Access affirmations (cached)
✅ Browse meditations list
✅ View profile settings

### Limited Offline

⚠️ New journal entries (queued for sync)
⚠️ Mood submissions (queued for sync)
⚠️ Chat messages (queued for sync)
⚠️ Profile updates (queued for sync)

### Requires Network

❌ AI chat responses (real-time processing)
❌ New meditation downloads
❌ Image uploads
❌ Authentication (initial login)

## Best Practices

### For Developers

1. **Always Queue Write Operations**:
```typescript
try {
  await apiCall();
} catch (error) {
  if (!navigator.onLine) {
    await queueOperation(...);
  }
}
```

2. **Show Sync Status**:
```tsx
<SyncStatus /> // Always visible in header
```

3. **Provide Feedback**:
```typescript
toast.info("Saved offline - will sync when online");
```

4. **Handle Conflicts**: Last-write-wins strategy
   - Consider timestamps
   - Server authoritative
   - Notify on conflict

### For Users

1. **Check Sync Status**: Look for badge in header
2. **Wait for Sync**: Let pending operations complete
3. **Manual Sync**: Tap sync badge → "Check"
4. **Clear Queue**: If stuck, use "Clear" (data lost)

## Testing

### Simulate Offline

```javascript
// Chrome DevTools → Network → Offline
// Make changes while offline
// Toggle back online
// Verify sync occurs
```

### Test Queue

```javascript
// Console
import { queueOperation, getQueueSize } from "@/lib/backgroundSync";

await queueOperation('/test', 'POST', { data: 'test' });
const size = await getQueueSize();
console.log('Queue size:', size);
```

### Verify Sync

```javascript
// Chrome DevTools → Application → Background Sync
// Check registered sync events
// Trigger manual sync
```

## Limitations

### Browser Support

| Browser | Background Sync | Periodic Sync |
|---------|----------------|---------------|
| Chrome 49+ | ✅ Yes | ✅ Yes (80+) |
| Firefox | ❌ No | ❌ No |
| Safari | ❌ No | ❌ No |
| Edge 79+ | ✅ Yes | ✅ Yes |

### Constraints

- **Queue Size**: No hard limit, but IndexedDB quota (~50MB typical)
- **Retry Limit**: No automatic limit (manual clear needed)
- **Sync Timing**: Browser-controlled (not immediate)
- **Battery**: May be delayed if battery saver active

## Troubleshooting

### Operations Not Syncing

**Symptom**: Queue size stuck

**Solutions**:
1. Check if online
2. Verify service worker is active
3. Manually trigger sync
4. Check browser console for errors

### Queue Growing

**Symptom**: Many pending operations

**Solutions**:
1. Ensure stable internet
2. Check API endpoints are accessible
3. Review operation errors in DevTools
4. Clear queue if corrupted

### IndexedDB Errors

**Symptom**: Can't queue operations

**Solutions**:
1. Check storage quota (Settings → Storage)
2. Clear browser data if corrupted
3. Disable private browsing mode
4. Check IndexedDB in DevTools

## Future Enhancements

- [ ] Conflict resolution UI
- [ ] Selective sync (choose what to sync)
- [ ] Compression for large payloads
- [ ] Delta sync (only changed fields)
- [ ] Offline-first architecture (local-first DB)
- [ ] Background fetch for large downloads

## Resources

- [Background Sync API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)
- [IndexedDB API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Periodic Background Sync - web.dev](https://web.dev/periodic-background-sync/)

---

**Status**: Phase 2 Complete ✅  
**Version**: v2025.10.20  
**Last Updated**: October 20, 2025
