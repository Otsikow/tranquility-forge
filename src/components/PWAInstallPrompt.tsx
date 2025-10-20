import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Listen for beforeinstallprompt (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check for iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    if (isIOS && !isInStandaloneMode && !dismissed) {
      // Show iOS guide after a short delay
      setTimeout(() => setShowIOSGuide(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt && !showIOSGuide) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="p-4 shadow-lg border-primary/20 bg-card">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground mb-1">
              {showIOSGuide ? 'Install Peace on iOS' : 'Install Peace'}
            </h3>
            
            {showIOSGuide ? (
              <div className="text-xs text-muted-foreground space-y-2">
                <p>Tap the Share button <span className="inline-block">📤</span> in Safari, then select "Add to Home Screen".</p>
                <p className="text-[11px] opacity-75">This will give you quick access and a better experience.</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mb-3">
                Install Peace for faster access and offline features. Works like a native app!
              </p>
            )}

            <div className="flex gap-2 mt-3">
              {!showIOSGuide && (
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="h-8 text-xs"
                >
                  Install
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="h-8 text-xs"
              >
                {showIOSGuide ? 'Got it' : 'Not now'}
              </Button>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={handleDismiss}
            className="h-6 w-6 flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
