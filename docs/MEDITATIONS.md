# Peace App - Meditations Feature

## Overview
The Meditations feature provides a comprehensive library of guided meditation sessions with an HTML5 audio player, session tracking, and premium content management.

## Features

### 1. Meditations Library (`/meditations`)
- **Grid/List View**: Responsive grid layout showing meditation cards
- **Card Information**:
  - Cover image with lazy loading
  - Title and description preview
  - Duration badge (e.g., "10 min")
  - Premium/Free indicator
- **Performance**: 
  - Lazy-loaded images
  - Optimized card animations
  - Preload metadata for audio files

### 2. Meditation Player (`/meditations/:id`)
- **Detail View**:
  - Full cover image
  - Complete description
  - Duration display
  - Premium lock state for paid content
- **Audio Player**:
  - HTML5 audio with custom controls
  - Play/Pause button
  - Progress slider with time display
  - Skip backward/forward (10 seconds)
  - Volume control
  - **Media Session API**: Lock screen controls with metadata
- **Session Tracking**:
  - Creates `sessions_played` record on start
  - Updates `completed_at` when meditation finishes
  - Tracks user progress over time

### 3. Premium Content
- **Free vs Paid**:
  - Free meditations: Full access
  - Premium meditations: Lock overlay with upgrade prompt
- **Visual Indicators**:
  - Lock icon badge on cards
  - Semi-transparent overlay on locked content
  - Call-to-action to view premium plans

## Technical Implementation

### Hooks

#### `useMeditations`
```typescript
// Fetches all meditations from database
const { meditations, loading } = useMeditations();
```

#### `useMediaSession`
```typescript
// Integrates with device media controls (lock screen)
useMediaSession(
  { title: "Meditation Title" },
  isPlaying,
  onPlay,
  onPause,
  onSeekBackward,
  onSeekForward
);
```

### Components

#### `AudioPlayer`
Fully-featured audio player with:
- Play/pause controls
- Seek bar with current time display
- Skip forward/backward buttons
- Volume control slider
- Auto-updates media session metadata

### Database Integration

#### Session Tracking
```typescript
// On meditation start
await supabase.from('sessions_played').insert({
  user_id: user.id,
  meditation_id: meditation.id,
  // started_at auto-set by DB
});

// On meditation complete
await supabase.from('sessions_played')
  .update({ completed_at: new Date().toISOString() })
  .eq('id', sessionId);
```

## Performance Optimizations

### Image Loading
- Cover images use `loading="lazy"` attribute
- Fallback to emoji/gradient for missing images
- Responsive image sizing

### Audio Loading
- Audio uses `preload="metadata"` for fast metadata display
- Full audio only loads when player is activated
- Background playback support via Media Session API

### UI Optimizations
- Staggered card animations (0.1s delay per card)
- Skeleton loading states
- Smooth transitions and hover effects

## User Flow

1. **Browse**: User views meditation library
2. **Select**: Clicks on a meditation card
3. **Check Access**: 
   - Free meditation → Show player immediately
   - Premium meditation → Show lock overlay
4. **Start Session**: Click "Start Meditation"
   - Creates database record
   - Shows audio player
5. **Play**: Use player controls
   - Media controls appear on lock screen
   - Progress tracked in real-time
6. **Complete**: Meditation finishes
   - Updates `completed_at` in database
   - Shows completion toast

## Premium Content Strategy

### Current Implementation
- Visual lock indicators
- Disabled play button for premium content
- Upgrade prompt with link to profile/plans

### Future Enhancements (Not Implemented)
- Stripe integration for subscriptions
- Trial periods
- Preview clips for premium content
- Purchase individual meditations

## Media Session API Support

### Capabilities
- **Lock Screen Controls**: Play/pause/skip from lock screen
- **Now Playing Info**: Shows title, artwork, duration
- **Notification Controls**: Media controls in notification tray
- **Browser Support**: Chrome, Safari, Edge, Firefox

### Metadata
```typescript
navigator.mediaSession.metadata = new MediaMetadata({
  title: "Morning Clarity",
  artist: "Peace App",
  album: "Guided Meditations",
  artwork: [
    { src: coverUrl, sizes: "512x512", type: "image/jpeg" }
  ]
});
```

## Demo Content

6 meditations seeded in database:
1. **Morning Clarity** (10 min) - Free
2. **Stress Release** (8 min) - Free
3. **Deep Sleep Journey** (20 min) - Free
4. **Mindful Breathing** (5 min) - Free
5. **Gratitude Practice** (7 min) - Free
6. **Inner Peace** (15 min) - Premium

## Future Enhancements

### Planned Features
- [ ] Audio file uploads via Supabase Storage
- [ ] Playlists/Collections
- [ ] Favorites/Bookmarks
- [ ] Download for offline playback
- [ ] Playback speed control
- [ ] Sleep timer
- [ ] Stats dashboard (total time meditated, streak tracking)
- [ ] Social sharing of completed sessions
- [ ] Meditation recommendations based on mood
- [ ] Background music mixer

### Analytics Ideas
- Most popular meditations
- Average completion rate
- Peak usage times
- User retention by meditation type
