import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Privacy Policy" showBack backTo="/settings/legal" />

      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 20, 2024</p>
        </div>

        <Card>
          <CardContent className="prose dark:prose-invert max-w-none pt-6">
            <h2>Overview</h2>
            <p>
              We value your privacy. This policy explains what data we collect,
              how we use it, and your choices.
            </p>

            <h2>Data We Collect</h2>
            <ul>
              <li>Account details you provide (e.g., email).</li>
              <li>Usage data to improve the service.</li>
              <li>Device data for performance and security.</li>
            </ul>

            <h2>Your Rights</h2>
            <ul>
              <li>Access, correct, or delete your data.</li>
              <li>Export your data from Settings &gt; Profile &amp; Security.</li>
              <li>Contact us for privacy requests at privacy@peace.app.</li>
            </ul>

            <h2>Contact</h2>
            <p>
              Questions about this policy? Email <a href="mailto:privacy@peace.app">privacy@peace.app</a>.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
