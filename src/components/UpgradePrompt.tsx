import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradePromptProps {
  feature: string;
  description?: string;
  requiredTier?: "premium" | "pro";
  className?: string;
}

export function UpgradePrompt({ 
  feature, 
  description, 
  requiredTier = "premium",
  className = "" 
}: UpgradePromptProps) {
  const navigate = useNavigate();

  return (
    <Card className={`bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {requiredTier === "pro" ? (
            <Sparkles className="h-5 w-5 text-amber-500" />
          ) : (
            <Crown className="h-5 w-5 text-amber-500" />
          )}
          <CardTitle className="text-lg">
            {requiredTier === "pro" ? "Pro Feature" : "Premium Feature"}
          </CardTitle>
        </div>
        <CardDescription>
          {description || `Upgrade to ${requiredTier === "pro" ? "Pro" : "Premium"} to unlock ${feature}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          onClick={() => navigate("/subscription")}
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
}

interface InlineUpgradePromptProps {
  feature: string;
  requiredTier?: "premium" | "pro";
}

export function InlineUpgradePrompt({ feature, requiredTier = "premium" }: InlineUpgradePromptProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
      <div className="flex items-center gap-2">
        <Crown className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">
          {requiredTier === "pro" ? "Pro" : "Premium"} feature: {feature}
        </span>
      </div>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => navigate("/subscription")}
      >
        Upgrade
      </Button>
    </div>
  );
}
