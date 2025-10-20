/**
 * Performance monitoring and optimization utilities
 */

// Report Web Vitals (optional integration)
export const reportWebVitals = (metric: any) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Performance]', metric);
  }

  // In production, send to analytics
  // e.g., sendToAnalytics(metric);
};

// Measure component render time
export const measureRender = (componentName: string) => {
  const start = performance.now();

  return () => {
    const duration = performance.now() - start;
    if (duration > 16) {
      // Warn if render takes longer than one frame (16ms)
      console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
    }
  };
};

// Debounce function for expensive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll/resize handlers
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get network information (if available)
export const getNetworkInfo = () => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  if (!connection) {
    return null;
  }

  return {
    effectiveType: connection.effectiveType, // 'slow-2g', '2g', '3g', or '4g'
    downlink: connection.downlink, // Mbps
    rtt: connection.rtt, // ms
    saveData: connection.saveData, // boolean
  };
};

// Adaptive loading based on network
export const shouldLoadHeavyAssets = (): boolean => {
  const networkInfo = getNetworkInfo();

  if (!networkInfo) {
    return true; // Default to loading if we can't determine network
  }

  // Don't load heavy assets on slow connections or data saver mode
  if (networkInfo.saveData || networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') {
    return false;
  }

  return true;
};

// Measure page load performance
export const measurePageLoad = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;

  return {
    pageLoadTime,
    connectTime,
    renderTime,
  };
};

// Get Core Web Vitals (requires web-vitals library in production)
export const getCoreWebVitals = () => {
  // This is a placeholder for actual web-vitals integration
  // In production, use: import { getCLS, getFID, getLCP } from 'web-vitals';
  
  return {
    message: 'Install web-vitals library for real metrics',
    docs: 'https://github.com/GoogleChrome/web-vitals',
  };
};

// Cache management helper
export const clearOldCaches = async (currentVersion: string) => {
  if (!('caches' in window)) return;

  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => !name.includes(currentVersion));

  await Promise.all(
    oldCaches.map(name => {
      console.log('[Performance] Deleting old cache:', name);
      return caches.delete(name);
    })
  );
};
