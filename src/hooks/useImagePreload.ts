import { useEffect, useState } from 'react';

/**
 * Preload critical images for better LCP
 * @param imageUrls Array of image URLs to preload
 */
export const useImagePreload = (imageUrls: string[]) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let loaded = 0;

    const preloadImage = (url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          setLoadedCount(loaded);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    Promise.all(imageUrls.map(preloadImage))
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Image preload failed:', error);
        setIsLoading(false);
      });
  }, [imageUrls]);

  return {
    isLoading,
    loadedCount,
    total: imageUrls.length,
    progress: imageUrls.length > 0 ? (loadedCount / imageUrls.length) * 100 : 100,
  };
};

/**
 * Preload a single critical image
 * @param imageUrl Image URL to preload
 */
export const preloadImage = (imageUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = imageUrl;
  });
};
