import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";

const LAST_UPDATED = "October 24, 2025";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Cookie Policy" showBack backTo="/settings/legal" />

      <div className="px-6 py-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device to help websites and apps
            remember information about your visit. We also use similar technologies such as
            local storage and service workers for offline functionality.
          </p>

          <h3>How We Use Cookies</h3>
          <ul>
            <li><strong>Strictly Necessary:</strong> Enable core functionality such as authentication and security.</li>
            <li><strong>Preferences:</strong> Remember settings like theme and language.</li>
            <li><strong>Performance/Analytics:</strong> Help us understand usage to improve the Service.</li>
            <li><strong>Notifications/PWA:</strong> Support push notifications and offline caching via the service worker.</li>
          </ul>

          <h3>Managing Cookies</h3>
          <p>
            Most browsers and devices allow you to control cookies through their settings.
            You can remove or block cookies, but the Service may not function properly
            without certain cookies.
          </p>

          <h3>Third-Party Cookies</h3>
          <p>
            Some third parties may set cookies in connection with our Service (e.g., for
            analytics or push services). These cookies are subject to the third parties’
            policies.
          </p>

          <h3>Changes</h3>
          <p>
            We may update this Cookie Policy to reflect changes in our practices or legal
            requirements. We will post updates within the Service.
          </p>

          <h3>Contact</h3>
          <p>
            Questions about this Cookie Policy? Contact us at <a href="mailto:privacy@peace.app">privacy@peace.app</a>.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
