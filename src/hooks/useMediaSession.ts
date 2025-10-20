/**
 * Hook for managing media session API (lock screen controls)
 */

import { useEffect } from 'react';

interface MediaMetadata {
  title: string;
  artist?: string;
  album?: string;
  artwork?: { src: string; sizes: string; type: string }[];
}

export function useMediaSession(
  metadata: MediaMetadata | null,
  isPlaying: boolean,
  onPlay: () => void,
  onPause: () => void,
  onSeekBackward?: () => void,
  onSeekForward?: () => void
) {
  useEffect(() => {
    if (!('mediaSession' in navigator) || !metadata) return;

    // Set metadata
    navigator.mediaSession.metadata = new MediaMetadata({
      title: metadata.title,
      artist: metadata.artist || 'Peace App',
      album: metadata.album || 'Guided Meditations',
      artwork: metadata.artwork || [
        { src: '/placeholder.svg', sizes: '512x512', type: 'image/svg+xml' },
      ],
    });

    // Set action handlers
    navigator.mediaSession.setActionHandler('play', onPlay);
    navigator.mediaSession.setActionHandler('pause', onPause);

    if (onSeekBackward) {
      navigator.mediaSession.setActionHandler('seekbackward', onSeekBackward);
    }

    if (onSeekForward) {
      navigator.mediaSession.setActionHandler('seekforward', onSeekForward);
    }

    // Update playback state
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

    return () => {
      // Clean up
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
    };
  }, [metadata, isPlaying, onPlay, onPause, onSeekBackward, onSeekForward]);
}
