import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";

export default function Guidelines() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Community Guidelines" showBack backTo="/settings/legal" />

      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-2xl font-bold text-foreground">Community Guidelines</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 20, 2024</p>
        </div>

        <Card>
          <CardContent className="prose dark:prose-invert max-w-none pt-6">
            <h2>Be Kind and Respectful</h2>
            <p>
              Supportive, constructive, and compassionate communication helps
              everyone feel safe and welcome.
            </p>

            <h2>Protect Privacy</h2>
            <p>
              Do not share personal or sensitive information without consent.
            </p>

            <h2>No Harmful Content</h2>
            <p>
              Content that encourages self-harm, hate, or violence is not
              permitted.
            </p>

            <h2>Report Issues</h2>
            <p>
              If you see something concerning, contact us at
              <a href="mailto:support@peace.app"> support@peace.app</a>.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
