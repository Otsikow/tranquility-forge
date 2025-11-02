import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, AlertCircle } from "lucide-react";

export default function AIEstimator() {
  const [projectDescription, setProjectDescription] = useState("");
  const [error, setError] = useState("");

  const handleEstimate = () => {
    if (projectDescription.length < 50) {
      setError("Please provide at least a short paragraph for AI estimation.");
    } else {
      setError("");
      // AI estimation logic goes here
    }
  };

  return (
    <Card className="bg-muted border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="text-card-foreground">AI Price Estimator</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate budget and timeline predictions powered by AI.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe your project in detail..."
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows={5}
        />
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={handleEstimate} className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Estimate
        </Button>
      </CardContent>
    </Card>
  );
}
