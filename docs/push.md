# Push Notifications Documentation

## Overview

Peace supports Web Push Notifications to keep users engaged with gentle reminders and updates. The system uses the Web Push API with VAPID authentication for secure, reliable notifications.

## Architecture

### Components

1. **Push Subscription Manager** (`src/lib/pushNotifications.ts`)
   - Handles subscription lifecycle
   - Manages permission requests
   - Stores subscriptions in database

2. **Service Worker** (`public/sw.js`)
   - Receives push events
   - Displays notifications
   - Handles notification clicks

3. **Notification Settings UI** (`src/components/NotificationSettings.tsx`)
   - User preferences interface
   - Topic subscription management
   - Enable/disable controls

4. **Database Table** (`push_subscriptions`)
   - Stores user subscriptions
   - Tracks notification topics
   - RLS-protected per user

## Notification Topics

Users can subscribe to these topics:

| Topic | Description | Frequency |
|-------|-------------|-----------|
| `daily_checkin` | Gentle reminder to check in | Once per day |
| `affirmation` | Daily affirmation delivery | Morning |
| `breathing` | Breathing exercise reminder | Customizable |
| `weekly_reflection` | Week review prompt | Sunday evening |

## Implementation

### Frontend Subscription Flow

```typescript
import { subscribeToPush } from "@/lib/pushNotifications";

// Request permission and subscribe
const subscription = await subscribeToPush();
```

### Checking Permission Status

```typescript
import { getNotificationPermission } from "@/lib/pushNotifications";

const permission = getNotificationPermission();
// 'default', 'granted', or 'denied'
```

### Managing Topics

```typescript
import { updatePushTopics, getPushTopics } from "@/lib/pushNotifications";

// Get current topics
const topics = await getPushTopics();

// Update topics
await updatePushTopics(['daily_checkin', 'affirmation']);
```

### Unsubscribing

```typescript
import { unsubscribeFromPush } from "@/lib/pushNotifications";

await unsubscribeFromPush();
```

## Service Worker Events

### Push Event

Triggered when notification is received:

```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [200, 100, 200],
      data: { url: data.url },
    })
  );
});
```

### Notification Click Event

Handles user interaction:

```javascript
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Open or focus appropriate window
  const urlToOpen = event.notification.data?.url || '/';
  clients.openWindow(urlToOpen);
});
```

## Database Schema

### push_subscriptions Table

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,  -- Public key
  auth TEXT NOT NULL,    -- Auth secret
  topics TEXT[],         -- Subscribed topics
  created_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ
);
```

### RLS Policies

- Users can only view/modify their own subscriptions
- Service role has full access for sending notifications

## VAPID Keys

VAPID (Voluntary Application Server Identification) keys authenticate push messages.

### Current Setup

- Public key embedded in client code (temporary)
- Private key required for backend (to be configured)

### Production Setup

1. Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

2. Store keys securely:
   - Public key → Environment variable (client-side)
   - Private key → Supabase secrets (server-side)

3. Update client code:
```typescript
const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
```

## Best Practices

### User Experience

1. **Ask Contextually**: Request permission after user shows interest
   - After first journal entry
   - When viewing affirmations
   - Never on first load

2. **Explain Benefits**: Show why notifications are valuable
   - "Get your daily affirmation"
   - "Never miss your breathing practice"

3. **Respect Quiet Hours**: Consider user timezone
   - No notifications 10 PM - 7 AM
   - Stored in `users_profile.timezone`

4. **Frequency Limits**: Don't overwhelm users
   - Max 3 notifications per day
   - Allow customization per topic

### Technical

1. **Permission Denied**: Handle gracefully
   - Don't show prompt again
   - Offer alternative (email, in-app)

2. **Subscription Expiry**: Re-subscribe if needed
   - Check on app startup
   - Handle expired subscriptions

3. **Offline Notifications**: Queue when offline
   - Store in service worker
   - Send when online

## Testing

### Local Testing

1. **Request Permission**:
```javascript
// Chrome DevTools → Application → Notifications
await Notification.requestPermission();
```

2. **Test Push Event**:
```javascript
// Chrome DevTools → Application → Service Workers → Push
// Send test notification with payload
```

3. **Simulate Offline**:
```javascript
// Chrome DevTools → Network → Offline
// Verify notifications still work
```

### Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 80+ | ✅ Full | Best support |
| Firefox 90+ | ✅ Full | Requires HTTPS |
| Safari 16+ | ⚠️ Limited | iOS/macOS only, no actions |
| Edge 80+ | ✅ Full | Chromium-based |

## Troubleshooting

### Permission Denied

**Symptom**: User can't enable notifications

**Solutions**:
1. Check browser settings (site permissions)
2. Clear site data and retry
3. Verify HTTPS (required for push)

### Notifications Not Received

**Symptom**: Subscribed but no notifications

**Solutions**:
1. Verify service worker is active
2. Check subscription in database
3. Ensure backend is sending correctly
4. Test with browser DevTools

### Subscription Failed

**Symptom**: Error during subscribe()

**Solutions**:
1. Verify VAPID public key is correct
2. Check network connectivity
3. Ensure user is authenticated
4. Review browser console errors

## Privacy & Security

1. **User Control**: Full control over topics and opt-out
2. **Data Storage**: Only endpoint + keys stored (no content)
3. **RLS Protection**: Users can't access others' subscriptions
4. **HTTPS Required**: Ensures secure communication
5. **No Tracking**: Subscriptions don't track user behavior

## Future Enhancements

- [ ] Rich notifications with images
- [ ] Notification actions (Quick reply, Snooze)
- [ ] Scheduled notifications (user-defined times)
- [ ] Smart frequency (ML-based optimal timing)
- [ ] Multi-device sync (manage across devices)
- [ ] A/B testing notification content

## Resources

- [Web Push API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Notifications API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [VAPID Specification](https://datatracker.ietf.org/doc/html/rfc8292)
- [web-push Library](https://github.com/web-push-libs/web-push)

---

**Status**: Phase 2 Complete ✅  
**Version**: v2025.10.20  
**Last Updated**: October 20, 2025
