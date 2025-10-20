import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const PWAUpdatePrompt = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShowReload(true);
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShowReload(true);
              
              toast.info("Update available", {
                description: "A new version of Peace is ready to install.",
                duration: 10000,
                action: {
                  label: "Update",
                  onClick: () => handleUpdate(),
                },
              });
            }
          });
        }
      });
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowReload(false);
    }
  };

  // This component doesn't render anything visible
  // It uses toast notifications instead
  return null;
};
