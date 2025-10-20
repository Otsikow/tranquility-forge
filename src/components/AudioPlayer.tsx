import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaSession } from "@/hooks/useMediaSession";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  onPlay?: () => void;
  onPause?: () => void;
  onComplete?: () => void;
  className?: string;
}

export function AudioPlayer({
  audioUrl,
  title,
  onPlay,
  onPause,
  onComplete,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  // Seek backward
  const seekBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  // Seek forward
  const seekForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      duration,
      audioRef.current.currentTime + 10
    );
  };

  // Handle seek
  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Set up media session
  useMediaSession(
    { title },
    isPlaying,
    togglePlayPause,
    togglePlayPause,
    seekBackward,
    seekForward
  );

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  return (
    <div className={cn("space-y-4", className)}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={seekBackward}
          className="h-10 w-10"
        >
          <SkipBack className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          onClick={togglePlayPause}
          className="h-14 w-14 rounded-full"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={seekForward}
          className="h-10 w-10"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="flex-1"
        />
      </div>
    </div>
  );
}
