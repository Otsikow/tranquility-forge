import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";

const LAST_UPDATED = "October 24, 2025";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Terms of Service" showBack backTo="/settings/legal" />

      <div className="px-6 py-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Acceptance of Terms</h2>
          <p>
            These Terms of Service ("Terms") govern your access to and use of the Peace
            application and related services (collectively, the "Service"). By using the
            Service, you agree to be bound by these Terms. If you do not agree, do not use
            the Service.
          </p>

          <h3>Eligibility</h3>
          <p>
            You must be at least 13 years old (or the minimum legal age in your
            jurisdiction) to use the Service. If you are under the age of majority,
            you represent that you have your parent or legal guardian’s permission.
          </p>

          <h3>Accounts and Security</h3>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activities that occur under your account.</li>
            <li>Notify us immediately of any unauthorized use or suspected breach of security.</li>
          </ul>

          <h3>User Content</h3>
          <p>
            You may submit content such as journal entries, messages, and other materials
            ("User Content"). You retain ownership of your User Content. You grant us a
            limited, non-exclusive, revocable license to process your User Content solely
            to provide and improve the Service, including via AI features and offline sync.
          </p>

          <h3>Acceptable Use</h3>
          <ul>
            <li>Do not use the Service in any unlawful or harmful manner.</li>
            <li>Do not harass, threaten, or abuse other users.</li>
            <li>Do not attempt to reverse engineer, disrupt, or impair the Service.</li>
            <li>Do not upload malware, spam, or infringing content.</li>
          </ul>

          <h3>Subscriptions and Billing</h3>
          <p>
            Certain features may require a paid subscription. Prices, billing intervals,
            and renewal terms will be presented at purchase. Subscriptions renew
            automatically unless canceled in accordance with the platform’s rules.
          </p>

          <h3>AI Features</h3>
          <p>
            AI-powered features may generate suggestions or responses based on your inputs.
            AI outputs can be inaccurate or incomplete. Use discretion and review outputs
            before relying on them.
          </p>

          <h3>No Medical Advice</h3>
          <p>
            The Service is for wellbeing support and educational purposes only and does not
            constitute medical, psychological, or other professional advice. The Service is
            not a substitute for professional diagnosis or treatment. In case of emergency,
            call your local emergency number.
          </p>

          <h3>Privacy</h3>
          <p>
            Your use of the Service is also governed by our Privacy Policy, which explains
            how we collect, use, and protect your information. Please review it carefully.
          </p>

          <h3>Intellectual Property</h3>
          <p>
            We and our licensors own all rights in the Service and its content, excluding
            User Content. You may not copy, modify, distribute, or create derivative works
            of the Service except as expressly permitted by these Terms.
          </p>

          <h3>Third-Party Services</h3>
          <p>
            The Service may integrate with third-party services (e.g., hosting, analytics,
            push notifications). Your use of those services may be subject to their own
            terms and policies.
          </p>

          <h3>Termination</h3>
          <p>
            We may suspend or terminate your access to the Service at any time if we
            reasonably believe you have violated these Terms or pose risk to the Service
            or other users. You may stop using the Service at any time.
          </p>

          <h3>Disclaimers</h3>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties
            of any kind, whether express or implied, including merchantability, fitness for a
            particular purpose, and non-infringement. We do not warrant that the Service will
            be uninterrupted, secure, or error-free.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss of profits or
            revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill,
            or other intangible losses, resulting from your use of the Service.
          </p>

          <h3>Indemnification</h3>
          <p>
            You agree to defend, indemnify, and hold harmless Peace and its affiliates from
            and against any claims, liabilities, damages, losses, and expenses arising out of
            or in any way connected with your use of the Service or violation of these Terms.
          </p>

          <h3>Governing Law</h3>
          <p>
            These Terms are governed by the laws of the jurisdiction where Peace is organized,
            without regard to conflict of law rules. Venue shall lie exclusively in the courts of
            that jurisdiction, except where prohibited by applicable law.
          </p>

          <h3>Changes to These Terms</h3>
          <p>
            We may update these Terms from time to time. If we make material changes, we will
            provide notice within the Service or by other reasonable means. Continued use of
            the Service after changes take effect constitutes acceptance.
          </p>

          <h3>Contact</h3>
          <p>
            Questions about these Terms? Contact us at <a href="mailto:legal@peace.app">legal@peace.app</a>.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
