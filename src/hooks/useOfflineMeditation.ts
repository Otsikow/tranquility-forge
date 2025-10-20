import { useState, useEffect } from 'react';
import {
  downloadMeditationOffline,
  getOfflineMeditation,
  isMeditationDownloaded,
  deleteMeditationOffline,
} from '@/lib/offlineStorage';
import { toast } from 'sonner';

export const useOfflineMeditation = (meditationId: string, audioUrl: string, title: string) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [offlineAudioUrl, setOfflineAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    checkDownloadStatus();
  }, [meditationId]);

  const checkDownloadStatus = async () => {
    const downloaded = await isMeditationDownloaded(meditationId);
    setIsDownloaded(downloaded);

    if (downloaded) {
      const blob = await getOfflineMeditation(meditationId);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setOfflineAudioUrl(url);
      }
    }
  };

  const download = async () => {
    setIsDownloading(true);
    try {
      await downloadMeditationOffline(meditationId, title, audioUrl);
      await checkDownloadStatus();
      toast.success("Downloaded for offline playback", {
        description: title,
      });
    } catch (error: any) {
      console.error('Download failed:', error);
      toast.error("Download failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const remove = async () => {
    try {
      await deleteMeditationOffline(meditationId);
      setIsDownloaded(false);
      setOfflineAudioUrl(null);
      toast.success("Removed from offline storage");
    } catch (error) {
      console.error('Remove failed:', error);
      toast.error("Failed to remove");
    }
  };

  const getAudioUrl = (): string => {
    return offlineAudioUrl || audioUrl;
  };

  return {
    isDownloaded,
    isDownloading,
    download,
    remove,
    getAudioUrl,
  };
};
