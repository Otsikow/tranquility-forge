import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Terms of Service" showBack backTo="/settings/legal" />

      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 20, 2024</p>
        </div>

        <Card>
          <CardContent className="prose dark:prose-invert max-w-none pt-6">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using Peace, you agree to be bound by these Terms of
              Service. If you do not agree, do not use the app.
            </p>

            <h2>Use of the Service</h2>
            <p>
              Peace is an AI wellbeing companion intended for informational and
              educational purposes only. It is not a substitute for professional
              advice, diagnosis, or treatment.
            </p>

            <h2>User Responsibilities</h2>
            <ul>
              <li>Provide accurate information and use the app responsibly.</li>
              <li>Do not misuse the service or attempt to disrupt its operation.</li>
              <li>Respect the rights and privacy of others.</li>
            </ul>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Contact us at <a href="mailto:legal@peace.app">legal@peace.app</a>.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
