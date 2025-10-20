import { Cloud, CloudOff, Loader2, AlertCircle } from "lucide-react";
import type { SyncState } from "@/hooks/useJournalEntries";
import { cn } from "@/lib/utils";

interface SyncIndicatorProps {
  state: SyncState;
  className?: string;
}

export function SyncIndicator({ state, className }: SyncIndicatorProps) {
  const indicators: Record<SyncState, {
    icon: typeof Cloud;
    text: string;
    color: string;
    animate?: boolean;
  }> = {
    synced: {
      icon: Cloud,
      text: 'Synced',
      color: 'text-muted-foreground',
    },
    syncing: {
      icon: Loader2,
      text: 'Syncing...',
      color: 'text-primary',
      animate: true,
    },
    offline: {
      icon: CloudOff,
      text: 'Offline',
      color: 'text-muted-foreground',
    },
    error: {
      icon: AlertCircle,
      text: 'Sync error',
      color: 'text-destructive',
    },
  };

  const { icon: Icon, text, color, animate } = indicators[state];

  return (
    <div className={cn('flex items-center gap-1.5 text-xs', color, className)}>
      <Icon className={cn('w-3.5 h-3.5', animate && 'animate-spin')} />
      <span>{text}</span>
    </div>
  );
}
