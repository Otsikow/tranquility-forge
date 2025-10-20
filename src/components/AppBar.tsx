import { ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface AppBarProps {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export const AppBar = ({ title, showBack = true, showSettings = false, onSettingsClick }: AppBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 w-full bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-card-foreground">{title}</h1>
      </div>
      
      {showSettings && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="h-9 w-9"
        >
          <Settings className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
