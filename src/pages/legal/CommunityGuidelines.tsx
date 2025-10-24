import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";

const LAST_UPDATED = "October 24, 2025";

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Community Guidelines" showBack backTo="/settings/legal" />

      <div className="px-6 py-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Our Principles</h2>
          <p>
            Peace is a supportive space for mental wellbeing. We ask all users to follow
            these guidelines to keep our community safe, respectful, and kind.
          </p>

          <h3>Be Respectful</h3>
          <ul>
            <li>Engage with empathy. No harassment, bullying, or hate speech.</li>
            <li>Do not share content that is violent, sexually explicit, or illegal.</li>
            <li>Respect others’ privacy. Do not share personal or confidential information.</li>
          </ul>

          <h3>Supportive and Safe</h3>
          <ul>
            <li>Avoid giving medical or legal advice. Encourage seeking professional help when needed.</li>
            <li>Do not encourage self-harm or dangerous activities.</li>
            <li>Report concerns using in-app reporting or by contacting support.</li>
          </ul>

          <h3>Authenticity and Integrity</h3>
          <ul>
            <li>Do not impersonate others or misrepresent affiliations.</li>
            <li>No spam, scams, or deceptive practices.</li>
            <li>Use the Service as intended; do not exploit bugs or misuse features.</li>
          </ul>

          <h3>Enforcement</h3>
          <p>
            We may remove content or suspend accounts that violate these guidelines or our
            Terms. We may also work with law enforcement when required by law or to prevent
            harm. Appeals can be made by contacting <a href="mailto:support@peace.app">support@peace.app</a>.
          </p>

          <h3>Notices</h3>
          <p>
            These guidelines complement our Terms of Service and Privacy Policy. We may update
            them from time to time. Continued use of the Service constitutes acceptance.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
