import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationBannerProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "success" | "warning" | "info";
  duration?: number; // Auto-dismiss after ms (0 = no auto-dismiss)
}

export function NotificationBanner({
  title,
  message,
  action,
  variant = "default",
  duration = 5000,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!visible) return null;

  const variantStyles = {
    default: "bg-primary/10 border-primary/20",
    success: "bg-green-500/10 border-green-500/20",
    warning: "bg-yellow-500/10 border-yellow-500/20",
    info: "bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-50 border rounded-lg p-4 shadow-lg animate-fade-down ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
          {action && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                action.onClick();
                setVisible(false);
              }}
              className="mt-2 p-0 h-auto"
            >
              {action.label}
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setVisible(false)}
          className="h-6 w-6 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
