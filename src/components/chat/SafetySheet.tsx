import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CRISIS_RESOURCES, SAFETY_TIPS } from "@/lib/safety";
import { Heart, ExternalLink } from "lucide-react";

interface SafetySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SafetySheet({ open, onOpenChange }: SafetySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Safety & Wellbeing
          </SheetTitle>
          <SheetDescription>
            Resources and tips for your mental health journey
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Crisis Resources */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Crisis Support</h3>
            <p className="text-sm text-muted-foreground">
              If you're in crisis or having thoughts of self-harm, please reach out immediately:
            </p>
            
            <div className="space-y-2">
              {CRISIS_RESOURCES.map((resource) => (
                <a
                  key={resource.label}
                  href={resource.url}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{resource.label}</p>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Wellbeing Tips</h3>
            <div className="space-y-3">
              {SAFETY_TIPS.map((tip) => (
                <div
                  key={tip.title}
                  className="p-4 rounded-lg bg-muted/50"
                >
                  <h4 className="font-medium mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> This AI assistant is not a substitute for professional 
              mental health care, therapy, or medical advice. If you're experiencing a mental health 
              emergency, please contact emergency services or a crisis hotline immediately.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
