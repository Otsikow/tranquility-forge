import { useState, useEffect } from "react";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getQueueSize, clearAllQueued } from "@/lib/backgroundSync";

export const SyncStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check queue size periodically
    checkQueueSize();
    const interval = setInterval(checkQueueSize, 10000); // Every 10 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const checkQueueSize = async () => {
    const size = await getQueueSize();
    setQueueSize(size);
  };

  const handleClearQueue = async () => {
    setIsChecking(true);
    try {
      await clearAllQueued();
      await checkQueueSize();
    } finally {
      setIsChecking(false);
    }
  };

  if (isOnline && queueSize === 0) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <Cloud className="h-3 w-3" />
        <span className="text-xs">Online</span>
      </Badge>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge 
          variant={isOnline ? "secondary" : "destructive"} 
          className="gap-1.5 cursor-pointer"
        >
          {isOnline ? (
            <>
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span className="text-xs">Syncing ({queueSize})</span>
            </>
          ) : (
            <>
              <CloudOff className="h-3 w-3" />
              <span className="text-xs">Offline</span>
            </>
          )}
        </Badge>
      </PopoverTrigger>
      
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-1">Sync Status</h4>
            <p className="text-xs text-muted-foreground">
              {isOnline 
                ? `${queueSize} operation${queueSize === 1 ? '' : 's'} pending sync`
                : 'You\'re offline. Changes will sync when reconnected.'
              }
            </p>
          </div>

          {queueSize > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={checkQueueSize}
                disabled={isChecking}
                className="flex-1"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
                Check
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearQueue}
                disabled={isChecking}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
