import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";

const LAST_UPDATED = "October 24, 2025";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Privacy Policy" showBack backTo="/settings/legal" />

      <div className="px-6 py-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            This Privacy Policy explains how Peace ("we", "us", "our") collects, uses,
            discloses, and protects your information when you use our application and related
            services (the "Service").
          </p>

          <h3>Information We Collect</h3>
          <ul>
            <li><strong>Account Information:</strong> Email, display name, and authentication identifiers.</li>
            <li><strong>Content You Provide:</strong> Journal entries, messages, assessments, preferences.</li>
            <li><strong>Usage Data:</strong> App interactions, feature usage, device and app version, crash logs.</li>
            <li><strong>Device and Technical Data:</strong> Device type, OS, language, time zone, network info.</li>
            <li><strong>Cookies and Similar Technologies:</strong> Service cookies for session, preferences, and analytics.</li>
          </ul>

          <h3>How We Use Information</h3>
          <ul>
            <li>Provide, maintain, and improve the Service and its features.</li>
            <li>Personalize content and experiences (e.g., recommendations, reminders).</li>
            <li>Enable offline sync and background processing where you opt in.</li>
            <li>Detect, prevent, and address technical issues, abuse, or security incidents.</li>
            <li>Comply with legal obligations and enforce our Terms.</li>
            <li>Communicate with you about updates, security, and support.</li>
          </ul>

          <h3>Legal Bases for Processing (EEA/UK)</h3>
          <ul>
            <li>Performance of a contract (to provide the Service).</li>
            <li>Legitimate interests (e.g., security, improvement) balanced against your rights.</li>
            <li>Consent (e.g., certain analytics or marketing, where applicable).</li>
            <li>Legal obligations.</li>
          </ul>

          <h3>Retention</h3>
          <p>
            We retain personal data only as long as necessary for the purposes described in this
            Policy, including providing the Service, complying with legal obligations, resolving
            disputes, and enforcing agreements. You may request deletion as described below.
          </p>

          <h3>Sharing and Disclosure</h3>
          <ul>
            <li><strong>Service Providers:</strong> Vendors who process data on our behalf (e.g., hosting, analytics, notifications) under confidentiality obligations.</li>
            <li><strong>AI Features:</strong> To provide AI functionality, limited data may be processed by AI providers subject to data processing terms.</li>
            <li><strong>Legal and Safety:</strong> Where required by law or to protect rights, safety, and security.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale.</li>
          </ul>

          <h3>International Transfers</h3>
          <p>
            Your data may be processed in countries with laws different from yours. Where required,
            we implement appropriate safeguards such as standard contractual clauses.
          </p>

          <h3>Security</h3>
          <p>
            We employ technical and organizational measures to protect your data, including encryption
            in transit and at rest where applicable, access controls, and monitoring. No system is
            100% secure; please use strong passwords and protect your account.
          </p>

          <h3>Your Rights</h3>
          <p>
            Depending on your location, you may have rights to access, correct, delete, or restrict
            processing of your personal data, and to data portability and objection. To exercise your
            rights, contact us at <a href="mailto:privacy@peace.app">privacy@peace.app</a>.
          </p>

          <h3>Children’s Privacy</h3>
          <p>
            The Service is not directed to children under 13, and we do not knowingly collect personal
            data from them. If you believe a child has provided personal data, contact us to delete it.
          </p>

          <h3>Your Choices</h3>
          <ul>
            <li><strong>Account:</strong> You can update certain information in the app settings.</li>
            <li><strong>Marketing:</strong> You can opt out of non-essential communications.</li>
            <li><strong>Cookies:</strong> You can control cookies via your device/browser settings.</li>
            <li><strong>Data Deletion:</strong> Request deletion at <a href="mailto:privacy@peace.app">privacy@peace.app</a>.</li>
          </ul>

          <h3>Changes to This Policy</h3>
          <p>
            We may update this Policy from time to time. We will notify you of material changes
            through the Service or by other reasonable means. Continued use constitutes acceptance.
          </p>

          <h3>Contact</h3>
          <p>
            For questions or concerns about this Policy, contact us at <a href="mailto:privacy@peace.app">privacy@peace.app</a>.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
