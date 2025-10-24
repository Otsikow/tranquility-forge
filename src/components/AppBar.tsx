import { ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface AppBarProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export const AppBar = ({ title, showBack = true, backTo, showSettings = false, onSettingsClick }: AppBarProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            aria-label="Go back"
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-9 w-9 text-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      
      {showSettings && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="h-9 w-9 text-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
