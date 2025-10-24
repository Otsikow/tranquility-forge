import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Cookie Policy" showBack backTo="/settings/legal" />

      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-2xl font-bold text-foreground">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 20, 2024</p>
        </div>

        <Card>
          <CardContent className="prose dark:prose-invert max-w-none pt-6">
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files that help us provide a better
              experience by remembering your preferences.
            </p>

            <h2>How We Use Cookies</h2>
            <ul>
              <li>Authentication and session management</li>
              <li>Analytics and performance</li>
              <li>Preference storage (e.g., theme)</li>
            </ul>

            <h2>Managing Cookies</h2>
            <p>
              You can control cookies in your browser settings. Disabling some
              cookies may impact functionality.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
