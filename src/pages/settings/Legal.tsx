import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Shield, Cookie, Scale, AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Legal() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Legal" showBack backTo="/settings" />

      <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Legal Information</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your privacy and trust are important to us. Please read through our legal documents 
            to understand how we protect your data and provide our services.
          </p>
          <p className="text-sm text-muted-foreground">
            Last Updated: October 24, 2025
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Peace is a mental wellness app and should not be used as a substitute for professional 
            mental health care. If you're experiencing a crisis, please contact emergency services 
            or a mental health crisis line immediately.
          </AlertDescription>
        </Alert>

        {/* Legal Documents Tabs */}
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Terms of Service</span>
              <span className="sm:hidden">Terms</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy Policy</span>
              <span className="sm:hidden">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="cookies" className="flex items-center gap-2">
              <Cookie className="w-4 h-4" />
              <span className="hidden sm:inline">Cookie Policy</span>
              <span className="sm:hidden">Cookies</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
              <span className="sm:hidden">Rules</span>
            </TabsTrigger>
          </TabsList>

          {/* Terms of Service */}
          <TabsContent value="terms">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Terms of Service</h2>
                    <p className="text-muted-foreground mb-4">
                      Effective Date: October 24, 2025
                    </p>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Acceptance of Terms</h3>
                    <p className="text-foreground/90 mb-4">
                      Welcome to Peace ("we," "our," or "us"). By accessing or using our mobile application, 
                      website, or services (collectively, the "Service"), you agree to be bound by these Terms 
                      of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      These Terms constitute a legally binding agreement between you and Peace. We reserve the 
                      right to update these Terms at any time, and your continued use of the Service after such 
                      changes constitutes your acceptance of the new Terms.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Description of Service</h3>
                    <p className="text-foreground/90 mb-4">
                      Peace is a mental wellness application that provides:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>AI-powered conversational support for mental wellbeing</li>
                      <li>Guided meditation and mindfulness exercises</li>
                      <li>Mood tracking and journaling features</li>
                      <li>Breathing exercises and relaxation techniques</li>
                      <li>CBT (Cognitive Behavioral Therapy) tools and worksheets</li>
                      <li>Sleep support and tracking</li>
                      <li>Community forums for peer support</li>
                      <li>Mental health assessments and progress tracking</li>
                    </ul>
                    <p className="text-foreground/90 mb-4 font-semibold">
                      IMPORTANT: Peace is not a substitute for professional mental health care. Our Service 
                      is designed to support your mental wellness but should not replace therapy, counseling, 
                      or medical treatment. Always consult with qualified healthcare professionals for serious 
                      mental health concerns.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3. Eligibility</h3>
                    <p className="text-foreground/90 mb-4">
                      You must be at least 13 years old to use our Service. If you are between 13 and 18 years 
                      old, you must have permission from a parent or legal guardian. By using the Service, you 
                      represent and warrant that you meet these age requirements.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">4. User Accounts</h3>
                    <p className="text-foreground/90 mb-4">
                      To access certain features, you must create an account. You agree to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and promptly update your account information</li>
                      <li>Maintain the security of your password</li>
                      <li>Accept responsibility for all activities under your account</li>
                      <li>Notify us immediately of any unauthorized use</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Subscription and Payment</h3>
                    <p className="text-foreground/90 mb-4">
                      <strong>Free Tier:</strong> Basic features are available for free with limited functionality.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      <strong>Premium Subscription:</strong> Additional features require a paid subscription. 
                      Subscriptions automatically renew unless canceled before the renewal date. You can cancel 
                      at any time through your account settings.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      <strong>Refund Policy:</strong> We offer a 7-day money-back guarantee for new subscribers. 
                      After this period, subscription fees are non-refundable except where required by law.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      <strong>Price Changes:</strong> We reserve the right to change subscription prices with 
                      30 days' notice to existing subscribers.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">6. User Content</h3>
                    <p className="text-foreground/90 mb-4">
                      You retain all rights to content you create or submit through the Service, including 
                      journal entries, forum posts, and other user-generated content ("User Content"). By 
                      submitting User Content, you grant us a limited license to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Store and process your content to provide the Service</li>
                      <li>Display forum posts to other users (where applicable)</li>
                      <li>Create anonymized, aggregated analytics to improve our Service</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      We will never sell your personal journal entries or private content to third parties.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">7. Prohibited Conduct</h3>
                    <p className="text-foreground/90 mb-4">
                      You agree not to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Use the Service for any illegal purpose</li>
                      <li>Harass, threaten, or harm other users</li>
                      <li>Post spam, malware, or malicious content</li>
                      <li>Impersonate others or provide false information</li>
                      <li>Attempt to gain unauthorized access to our systems</li>
                      <li>Scrape or data mine the Service</li>
                      <li>Use the Service to provide professional therapy or medical advice</li>
                      <li>Share content that violates intellectual property rights</li>
                      <li>Interfere with other users' enjoyment of the Service</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">8. Intellectual Property</h3>
                    <p className="text-foreground/90 mb-4">
                      The Service, including its design, text, graphics, software, and other content 
                      (excluding User Content), is owned by Peace and protected by copyright, trademark, 
                      and other intellectual property laws. You may not copy, modify, distribute, or create 
                      derivative works without our written permission.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">9. Third-Party Services</h3>
                    <p className="text-foreground/90 mb-4">
                      Our Service may integrate with third-party services (such as AI providers, analytics 
                      tools, and payment processors). We are not responsible for these third-party services, 
                      and your use of them is subject to their respective terms and policies.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">10. Privacy and Data Protection</h3>
                    <p className="text-foreground/90 mb-4">
                      Your privacy is important to us. Please review our Privacy Policy to understand how we 
                      collect, use, and protect your personal information. We are committed to maintaining the 
                      confidentiality and security of your mental health data.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">11. Medical Disclaimer</h3>
                    <p className="text-foreground/90 mb-4 font-semibold">
                      THE SERVICE IS NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY DISEASE OR MEDICAL 
                      CONDITION. THE CONTENT PROVIDED IS FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      <strong>Crisis Support:</strong> If you are experiencing a mental health crisis, having 
                      thoughts of self-harm, or need immediate assistance, please:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Call 911 or your local emergency services</li>
                      <li>Contact the National Suicide Prevention Lifeline: 988</li>
                      <li>Go to your nearest emergency room</li>
                      <li>Contact a mental health professional immediately</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">12. Termination</h3>
                    <p className="text-foreground/90 mb-4">
                      We reserve the right to suspend or terminate your account at our discretion if you 
                      violate these Terms or engage in harmful behavior. You may terminate your account at 
                      any time through your account settings.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      Upon termination, your right to use the Service ceases immediately. We may retain 
                      certain data as required by law or for legitimate business purposes.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">13. Disclaimers and Limitations of Liability</h3>
                    <p className="text-foreground/90 mb-4">
                      THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT 
                      PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, 
                      FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE 
                      DAMAGES ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE 
                      AMOUNT YOU PAID US IN THE PAST 12 MONTHS.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">14. Indemnification</h3>
                    <p className="text-foreground/90 mb-4">
                      You agree to indemnify and hold harmless Peace, its officers, directors, employees, and 
                      agents from any claims, damages, losses, liabilities, and expenses (including legal fees) 
                      arising from your use of the Service or violation of these Terms.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">15. Dispute Resolution</h3>
                    <p className="text-foreground/90 mb-4">
                      <strong>Governing Law:</strong> These Terms are governed by the laws of the State of 
                      Delaware, USA, without regard to conflict of law principles.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      <strong>Arbitration:</strong> Any disputes shall be resolved through binding arbitration 
                      in accordance with the American Arbitration Association rules, except where prohibited 
                      by law. You waive the right to participate in class actions.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">16. Changes to Terms</h3>
                    <p className="text-foreground/90 mb-4">
                      We may modify these Terms at any time. We will notify you of material changes via email 
                      or through the Service. Your continued use after such changes constitutes acceptance of 
                      the modified Terms.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">17. Contact Information</h3>
                    <p className="text-foreground/90 mb-4">
                      For questions about these Terms, please contact us:
                    </p>
                    <ul className="list-none mb-4 space-y-2 text-foreground/90">
                      <li><strong>Email:</strong> legal@peace.app</li>
                      <li><strong>Address:</strong> Peace Inc., 123 Wellness Way, Wilmington, DE 19801, USA</li>
                    </ul>

                    <p className="text-muted-foreground text-sm mt-8 pt-4 border-t border-border">
                      By using Peace, you acknowledge that you have read, understood, and agree to be bound 
                      by these Terms of Service.
                    </p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Policy */}
          <TabsContent value="privacy">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Privacy Policy</h2>
                    <p className="text-muted-foreground mb-4">
                      Effective Date: October 24, 2025
                    </p>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Introduction</h3>
                    <p className="text-foreground/90 mb-4">
                      At Peace, we take your privacy seriously. This Privacy Policy explains how we collect, 
                      use, disclose, and protect your personal information when you use our Service. We are 
                      committed to maintaining the confidentiality and security of your mental health data.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      We comply with applicable data protection laws, including the General Data Protection 
                      Regulation (GDPR), California Consumer Privacy Act (CCPA), and Health Insurance Portability 
                      and Accountability Act (HIPAA) where applicable.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Information We Collect</h3>
                    
                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.1 Information You Provide</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Account Information:</strong> Name, email address, username, password</li>
                      <li><strong>Profile Information:</strong> Age, gender, location (optional), profile picture</li>
                      <li><strong>Health Information:</strong> Mood logs, journal entries, assessment responses, 
                      sleep data, meditation preferences</li>
                      <li><strong>User Content:</strong> Messages in AI chat, forum posts, comments, affirmations</li>
                      <li><strong>Payment Information:</strong> Processed securely through third-party payment 
                      processors (we do not store full credit card numbers)</li>
                      <li><strong>Communications:</strong> Support requests, feedback, survey responses</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.2 Automatically Collected Information</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Device Information:</strong> Device type, operating system, browser type, 
                      unique device identifiers</li>
                      <li><strong>Usage Data:</strong> Features used, time spent in app, interaction patterns, 
                      session duration</li>
                      <li><strong>Log Data:</strong> IP address, access times, pages viewed, clicks, errors</li>
                      <li><strong>Location Data:</strong> Approximate location based on IP address (we do not 
                      collect precise GPS location)</li>
                      <li><strong>Cookies and Tracking:</strong> See our Cookie Policy for details</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.3 Information from Third Parties</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Social media profiles (if you choose to connect them)</li>
                      <li>Analytics and advertising partners</li>
                      <li>Payment processors</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3. How We Use Your Information</h3>
                    <p className="text-foreground/90 mb-4">
                      We use your information to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Provide the Service:</strong> Process your requests, enable features, 
                      personalize your experience</li>
                      <li><strong>AI Features:</strong> Generate AI responses, provide mental health insights, 
                      suggest relevant content</li>
                      <li><strong>Improve Our Service:</strong> Analyze usage patterns, develop new features, 
                      fix bugs</li>
                      <li><strong>Communication:</strong> Send notifications, updates, newsletters, support 
                      messages</li>
                      <li><strong>Safety and Security:</strong> Prevent fraud, enforce our Terms, protect 
                      users from harm</li>
                      <li><strong>Legal Compliance:</strong> Comply with legal obligations, respond to legal 
                      requests</li>
                      <li><strong>Research:</strong> Conduct anonymized research to advance mental health 
                      understanding (with your consent)</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">4. AI and Data Processing</h3>
                    <p className="text-foreground/90 mb-4">
                      Our AI-powered chat feature processes your messages to provide supportive responses. 
                      We use third-party AI services (such as OpenAI) to power these features. Your chat 
                      data may be processed by these services subject to their privacy policies.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      We implement technical measures to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Anonymize data sent to AI providers where possible</li>
                      <li>Limit data retention by AI providers</li>
                      <li>Prevent use of your data to train AI models (where supported)</li>
                      <li>Encrypt sensitive information in transit and at rest</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Information Sharing and Disclosure</h3>
                    <p className="text-foreground/90 mb-4">
                      <strong>We do not sell your personal information.</strong> We may share your information with:
                    </p>
                    
                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">5.1 Service Providers</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Cloud hosting providers (encrypted storage)</li>
                      <li>AI and machine learning services</li>
                      <li>Analytics providers</li>
                      <li>Payment processors</li>
                      <li>Customer support tools</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">5.2 Community Features</h4>
                    <p className="text-foreground/90 mb-4">
                      Content you post in public forums or communities is visible to other users. Your 
                      username and profile picture may be displayed with your posts.
                    </p>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">5.3 Legal Requirements</h4>
                    <p className="text-foreground/90 mb-4">
                      We may disclose information if required by law or if we believe in good faith that 
                      disclosure is necessary to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Comply with legal obligations or court orders</li>
                      <li>Protect our rights and property</li>
                      <li>Prevent harm or illegal activity</li>
                      <li>Respond to emergencies involving risk of death or serious injury</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">5.4 Business Transfers</h4>
                    <p className="text-foreground/90 mb-4">
                      In the event of a merger, acquisition, or sale of assets, your information may be 
                      transferred to the acquiring entity.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">6. Data Security</h3>
                    <p className="text-foreground/90 mb-4">
                      We implement robust security measures to protect your information:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Encryption:</strong> Data encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
                      <li><strong>Access Controls:</strong> Strict employee access policies, multi-factor authentication</li>
                      <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
                      <li><strong>Compliance:</strong> ISO 27001 certified information security management</li>
                      <li><strong>Monitoring:</strong> 24/7 security monitoring and incident response</li>
                      <li><strong>Backup:</strong> Regular encrypted backups with disaster recovery plans</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      However, no method of transmission over the internet is 100% secure. While we strive 
                      to protect your information, we cannot guarantee absolute security.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">7. Data Retention</h3>
                    <p className="text-foreground/90 mb-4">
                      We retain your information for as long as necessary to provide the Service and comply 
                      with legal obligations:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Account Data:</strong> Retained while your account is active plus 30 days 
                      after deletion (for recovery)</li>
                      <li><strong>Journal Entries:</strong> Retained while your account is active (you can 
                      delete individual entries anytime)</li>
                      <li><strong>Chat History:</strong> Retained for 90 days (or until you delete it)</li>
                      <li><strong>Usage Data:</strong> Aggregated data retained indefinitely for analytics</li>
                      <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal or 
                      regulatory compliance</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">8. Your Privacy Rights</h3>
                    <p className="text-foreground/90 mb-4">
                      Depending on your location, you may have the following rights:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Access:</strong> Request a copy of your personal information</li>
                      <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                      <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                      <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                      <li><strong>Restriction:</strong> Limit how we process your information</li>
                      <li><strong>Objection:</strong> Object to certain processing activities</li>
                      <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                      <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      To exercise these rights, contact us at privacy@peace.app or use the settings in your 
                      account. We will respond within 30 days.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">9. Children's Privacy</h3>
                    <p className="text-foreground/90 mb-4">
                      Our Service is not directed to children under 13. We do not knowingly collect personal 
                      information from children under 13. If we discover that we have collected information 
                      from a child under 13, we will delete it immediately.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      Users aged 13-18 should have parental consent before using the Service.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">10. International Data Transfers</h3>
                    <p className="text-foreground/90 mb-4">
                      Your information may be transferred to and processed in countries other than your own. 
                      We use standard contractual clauses and other legal mechanisms to ensure adequate 
                      protection of your data in compliance with GDPR and other data protection laws.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">11. California Privacy Rights (CCPA)</h3>
                    <p className="text-foreground/90 mb-4">
                      California residents have additional rights under the CCPA:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Know what personal information we collect and how it's used</li>
                      <li>Request deletion of personal information</li>
                      <li>Opt-out of the sale of personal information (we do not sell your information)</li>
                      <li>Non-discrimination for exercising privacy rights</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">12. European Privacy Rights (GDPR)</h3>
                    <p className="text-foreground/90 mb-4">
                      If you are in the European Economic Area (EEA), you have additional rights under GDPR, 
                      including the right to lodge a complaint with a supervisory authority.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">13. Changes to This Policy</h3>
                    <p className="text-foreground/90 mb-4">
                      We may update this Privacy Policy from time to time. We will notify you of material 
                      changes by email or through a prominent notice in the Service. We encourage you to 
                      review this policy periodically.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">14. Contact Us</h3>
                    <p className="text-foreground/90 mb-4">
                      For privacy-related questions or to exercise your rights:
                    </p>
                    <ul className="list-none mb-4 space-y-2 text-foreground/90">
                      <li><strong>Email:</strong> privacy@peace.app</li>
                      <li><strong>Data Protection Officer:</strong> dpo@peace.app</li>
                      <li><strong>Address:</strong> Peace Inc., 123 Wellness Way, Wilmington, DE 19801, USA</li>
                    </ul>

                    <p className="text-muted-foreground text-sm mt-8 pt-4 border-t border-border">
                      Your privacy matters to us. We are committed to protecting your personal information 
                      and mental health data with the highest standards of security and confidentiality.
                    </p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cookie Policy */}
          <TabsContent value="cookies">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Cookie Policy</h2>
                    <p className="text-muted-foreground mb-4">
                      Effective Date: October 24, 2025
                    </p>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">1. What Are Cookies?</h3>
                    <p className="text-foreground/90 mb-4">
                      Cookies are small text files stored on your device when you visit our Service. They 
                      help us recognize your device and remember certain information about your preferences 
                      or actions.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      Similar technologies include web beacons, pixels, local storage, and mobile identifiers. 
                      This policy covers all such technologies, collectively referred to as "cookies."
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Types of Cookies We Use</h3>
                    
                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.1 Essential Cookies</h4>
                    <p className="text-foreground/90 mb-4">
                      These cookies are necessary for the Service to function properly. They enable core 
                      functionality such as:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Authentication and account access</li>
                      <li>Security and fraud prevention</li>
                      <li>Load balancing and performance</li>
                      <li>Remembering your preferences (theme, language)</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      <strong>These cookies cannot be disabled</strong> as they are essential for the Service 
                      to work.
                    </p>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.2 Analytics Cookies</h4>
                    <p className="text-foreground/90 mb-4">
                      We use analytics cookies to understand how users interact with our Service:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Pages visited and features used</li>
                      <li>Time spent on pages</li>
                      <li>Navigation paths through the app</li>
                      <li>Error rates and technical issues</li>
                      <li>Device and browser information</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      We use tools like Google Analytics (with IP anonymization enabled) to collect this data. 
                      You can opt-out of these cookies through your account settings.
                    </p>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.3 Functional Cookies</h4>
                    <p className="text-foreground/90 mb-4">
                      These cookies enhance functionality and personalization:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Remembering your preferences (notifications, display settings)</li>
                      <li>Customizing content based on your interests</li>
                      <li>Providing social media features</li>
                      <li>Enabling chat and support features</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.4 Marketing Cookies</h4>
                    <p className="text-foreground/90 mb-4">
                      With your consent, we may use marketing cookies to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Show you relevant advertisements</li>
                      <li>Measure ad campaign effectiveness</li>
                      <li>Remember whether you've seen certain messages</li>
                      <li>Provide personalized content recommendations</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      You can opt-out of marketing cookies through your account settings or browser settings.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3. Third-Party Cookies</h3>
                    <p className="text-foreground/90 mb-4">
                      We work with trusted third-party service providers who may set cookies on our behalf:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Google Analytics:</strong> Usage analytics and reporting</li>
                      <li><strong>Stripe:</strong> Payment processing</li>
                      <li><strong>Sentry:</strong> Error tracking and monitoring</li>
                      <li><strong>Supabase:</strong> Backend infrastructure and authentication</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      These third parties have their own privacy policies and may use cookies independently. 
                      We recommend reviewing their policies for more information.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">4. Session vs. Persistent Cookies</h3>
                    <p className="text-foreground/90 mb-4">
                      <strong>Session Cookies:</strong> Temporary cookies deleted when you close your browser. 
                      Used for authentication and security.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      <strong>Persistent Cookies:</strong> Remain on your device for a set period or until 
                      you delete them. Used to remember preferences and improve user experience.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Local Storage and IndexedDB</h3>
                    <p className="text-foreground/90 mb-4">
                      We use browser local storage and IndexedDB to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Enable offline functionality for journal entries and meditation content</li>
                      <li>Cache data for faster loading</li>
                      <li>Store user preferences locally</li>
                      <li>Sync data across devices</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      This data is stored securely on your device and can be cleared through your browser 
                      settings or app settings.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">6. Mobile App Identifiers</h3>
                    <p className="text-foreground/90 mb-4">
                      Our mobile app may use device identifiers for:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Push notifications</li>
                      <li>Analytics and crash reporting</li>
                      <li>Fraud prevention</li>
                      <li>Personalization</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      You can manage these identifiers through your device settings (iOS: Settings → Privacy → 
                      Tracking; Android: Settings → Google → Ads).
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">7. Managing Cookies</h3>
                    
                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">7.1 Through Peace Settings</h4>
                    <p className="text-foreground/90 mb-4">
                      You can manage cookie preferences in your account settings under "Privacy & Data."
                    </p>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">7.2 Through Your Browser</h4>
                    <p className="text-foreground/90 mb-4">
                      Most browsers allow you to control cookies through their settings:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                      <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                      <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                      <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">7.3 Browser "Do Not Track"</h4>
                    <p className="text-foreground/90 mb-4">
                      We respect browser "Do Not Track" signals for marketing cookies. However, essential 
                      cookies will still be used to provide the Service.
                    </p>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">7.4 Opt-Out Links</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                      <li><strong>Network Advertising Initiative:</strong> <a href="https://optout.networkadvertising.org/" className="text-primary hover:underline">NAI Opt-Out</a></li>
                      <li><strong>Digital Advertising Alliance:</strong> <a href="https://optout.aboutads.info/" className="text-primary hover:underline">DAA Opt-Out</a></li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">8. Impact of Disabling Cookies</h3>
                    <p className="text-foreground/90 mb-4">
                      Disabling certain cookies may affect your experience:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>You may need to log in more frequently</li>
                      <li>Some features may not work properly</li>
                      <li>Personalization will be limited</li>
                      <li>Offline functionality may not be available</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      Essential cookies cannot be disabled as they are required for the Service to function.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">9. Updates to This Policy</h3>
                    <p className="text-foreground/90 mb-4">
                      We may update this Cookie Policy to reflect changes in technology, legal requirements, 
                      or our practices. We will notify you of material changes through the Service or by email.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">10. Contact Us</h3>
                    <p className="text-foreground/90 mb-4">
                      Questions about our use of cookies? Contact us at:
                    </p>
                    <ul className="list-none mb-4 space-y-2 text-foreground/90">
                      <li><strong>Email:</strong> privacy@peace.app</li>
                      <li><strong>Address:</strong> Peace Inc., 123 Wellness Way, Wilmington, DE 19801, USA</li>
                    </ul>

                    <p className="text-muted-foreground text-sm mt-8 pt-4 border-t border-border">
                      By continuing to use Peace, you consent to our use of cookies as described in this policy.
                    </p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Guidelines */}
          <TabsContent value="community">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Community Guidelines</h2>
                    <p className="text-muted-foreground mb-4">
                      Effective Date: October 24, 2025
                    </p>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Our Community Mission</h3>
                    <p className="text-foreground/90 mb-4">
                      Peace is a safe, supportive community where people can share their mental health journey, 
                      connect with others, and find support. These Community Guidelines help ensure that our 
                      community remains welcoming, respectful, and helpful for everyone.
                    </p>
                    <p className="text-foreground/90 mb-4">
                      By participating in our community forums, chat features, or any interactive features, 
                      you agree to follow these guidelines.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Core Principles</h3>
                    
                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.1 Be Kind and Respectful</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Treat others with empathy and compassion</li>
                      <li>Respect different perspectives and experiences</li>
                      <li>Use welcoming and inclusive language</li>
                      <li>Assume good intentions in others</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.2 Keep It Safe</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Protect your privacy and that of others</li>
                      <li>Don't share personal contact information publicly</li>
                      <li>Report concerning behavior to moderators</li>
                      <li>Seek professional help for crises (we are not a crisis service)</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2.3 Be Authentic</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Share from your genuine experience</li>
                      <li>Don't impersonate others or misrepresent yourself</li>
                      <li>Be honest but maintain appropriate boundaries</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3. Prohibited Content and Behavior</h3>
                    
                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">3.1 Harmful Content</h4>
                    <p className="text-foreground/90 mb-4">
                      The following content is strictly prohibited:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Self-harm content:</strong> Detailed descriptions, methods, or encouragement 
                      of self-harm or suicide</li>
                      <li><strong>Violence:</strong> Graphic violence, threats, or encouragement of violence</li>
                      <li><strong>Harassment:</strong> Bullying, stalking, intimidation, or targeted harassment</li>
                      <li><strong>Hate speech:</strong> Content attacking people based on race, ethnicity, 
                      religion, gender, sexual orientation, disability, or other protected characteristics</li>
                      <li><strong>Sexual content:</strong> Explicit sexual content, solicitation, or harassment</li>
                      <li><strong>Dangerous activities:</strong> Promotion of eating disorders, substance abuse, 
                      or other harmful behaviors</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">3.2 Spam and Manipulation</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Spam, advertisements, or promotional content</li>
                      <li>Misleading information or scams</li>
                      <li>Manipulation of voting or engagement features</li>
                      <li>Automated posting or bot activity</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">3.3 Misinformation</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>False or misleading health information</li>
                      <li>Discouraging evidence-based treatment</li>
                      <li>Promoting unproven "cures" or treatments</li>
                      <li>Anti-vaccination propaganda</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">3.4 Privacy Violations</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Sharing others' personal information (doxxing)</li>
                      <li>Posting private conversations without consent</li>
                      <li>Impersonating others</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">4. Sharing About Mental Health</h3>
                    
                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">4.1 Encouraged Sharing</h4>
                    <p className="text-foreground/90 mb-4">
                      We encourage you to share:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Your feelings and experiences</li>
                      <li>Coping strategies that work for you</li>
                      <li>Questions and requests for support</li>
                      <li>Recovery stories and hope</li>
                      <li>Resources that helped you</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">4.2 Content Warnings</h4>
                    <p className="text-foreground/90 mb-4">
                      When sharing potentially triggering content, please:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Use content warnings (CW) or trigger warnings (TW)</li>
                      <li>Be general rather than specific about methods or details</li>
                      <li>Focus on feelings and recovery rather than explicit descriptions</li>
                      <li>Consider using spoiler tags to hide sensitive content</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">4.3 Peer Support, Not Therapy</h4>
                    <p className="text-foreground/90 mb-4">
                      Remember:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>This is a peer support community, not professional therapy</li>
                      <li>Don't provide medical advice or diagnose others</li>
                      <li>Encourage professional help when appropriate</li>
                      <li>Share what worked for you, not what others "should" do</li>
                      <li>Respect that everyone's journey is different</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Crisis Situations</h3>
                    <p className="text-foreground/90 mb-4 font-semibold">
                      Peace is not a crisis service. If you or someone you know is in immediate danger:
                    </p>
                    <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4">
                      <p className="text-foreground font-semibold mb-2">Emergency Resources:</p>
                      <ul className="list-none space-y-2 text-foreground/90">
                        <li><strong>Emergency Services:</strong> 911 (USA)</li>
                        <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                        <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                        <li><strong>International Association for Suicide Prevention:</strong> Find your country's resources at iasp.info</li>
                      </ul>
                    </div>
                    <p className="text-foreground/90 mb-4">
                      If you see content indicating someone is in immediate danger, please report it to our 
                      moderators immediately. We may contact emergency services if we believe someone is at 
                      imminent risk.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">6. Respectful Disagreement</h3>
                    <p className="text-foreground/90 mb-4">
                      Healthy discussion is welcome, but:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Disagree with ideas, not people</li>
                      <li>Use "I" statements to share your perspective</li>
                      <li>Stay open to learning from others</li>
                      <li>Know when to disengage from unproductive conversations</li>
                      <li>Don't derail others' posts with off-topic debates</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">7. Moderation</h3>
                    
                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">7.1 Reporting Content</h4>
                    <p className="text-foreground/90 mb-4">
                      If you see content that violates these guidelines:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Use the "Report" button on the post or message</li>
                      <li>Provide details about the violation</li>
                      <li>Don't engage with or amplify harmful content</li>
                      <li>Trust our moderation team to review reports fairly</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">7.2 Enforcement Actions</h4>
                    <p className="text-foreground/90 mb-4">
                      Violations may result in:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li><strong>Warning:</strong> First-time minor violations</li>
                      <li><strong>Content removal:</strong> Posts or comments that violate guidelines</li>
                      <li><strong>Temporary suspension:</strong> Repeated or moderate violations</li>
                      <li><strong>Permanent ban:</strong> Severe violations, illegal activity, or repeated offenses</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      We consider context and intent when making moderation decisions. You can appeal 
                      moderation actions by contacting support@peace.app.
                    </p>

                    <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">7.3 False Reports</h4>
                    <p className="text-foreground/90 mb-4">
                      Repeatedly making false or malicious reports may result in restrictions on your account.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">8. Age-Appropriate Content</h3>
                    <p className="text-foreground/90 mb-4">
                      Our community includes users of various ages (13+). Please keep content appropriate 
                      and remember that younger users may be present. Avoid:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Explicit language or adult content</li>
                      <li>Detailed discussions of substance use</li>
                      <li>Graphic descriptions of violence or trauma</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">9. Intellectual Property</h3>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Only post content you have the right to share</li>
                      <li>Respect copyright, trademarks, and other IP rights</li>
                      <li>Provide attribution when sharing others' work</li>
                      <li>Use royalty-free images or cite sources</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">10. Off-Platform Behavior</h3>
                    <p className="text-foreground/90 mb-4">
                      We may take action for serious off-platform behavior (such as harassment of Peace 
                      users elsewhere) that affects the safety of our community.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">11. Updates to Guidelines</h3>
                    <p className="text-foreground/90 mb-4">
                      We may update these guidelines as our community evolves. Major changes will be 
                      communicated through the Service. Continued participation indicates acceptance of 
                      updated guidelines.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">12. Conclusion</h3>
                    <p className="text-foreground/90 mb-4">
                      These guidelines exist to protect and support our community. When in doubt, ask yourself:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground/90">
                      <li>Is this kind and respectful?</li>
                      <li>Would I want someone to share this with me?</li>
                      <li>Does this contribute positively to our community?</li>
                      <li>Am I keeping myself and others safe?</li>
                    </ul>
                    <p className="text-foreground/90 mb-4">
                      Thank you for being part of the Peace community and helping us create a supportive 
                      space for mental wellness.
                    </p>

                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">13. Contact</h3>
                    <p className="text-foreground/90 mb-4">
                      Questions about these guidelines?
                    </p>
                    <ul className="list-none mb-4 space-y-2 text-foreground/90">
                      <li><strong>Email:</strong> community@peace.app</li>
                      <li><strong>Support:</strong> support@peace.app</li>
                    </ul>

                    <p className="text-muted-foreground text-sm mt-8 pt-4 border-t border-border">
                      Together, we can create a compassionate community where everyone feels safe, 
                      supported, and understood.
                    </p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Compliance & Certifications
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">GDPR Compliant</h4>
                    <p className="text-sm text-muted-foreground">
                      Full compliance with European data protection regulations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">HIPAA Aligned</h4>
                    <p className="text-sm text-muted-foreground">
                      Health data protection standards and best practices
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">ISO 27001 Certified</h4>
                    <p className="text-sm text-muted-foreground">
                      Information security management system certified
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">SOC 2 Type II</h4>
                    <p className="text-sm text-muted-foreground">
                      Independently verified security and availability controls
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Legal Contact Information
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">General Legal Inquiries</h4>
                  <p className="text-sm text-muted-foreground">legal@peace.app</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Privacy Questions</h4>
                  <p className="text-sm text-muted-foreground">privacy@peace.app</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Data Protection Officer</h4>
                  <p className="text-sm text-muted-foreground">dpo@peace.app</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Mailing Address</h4>
                  <p className="text-sm text-muted-foreground">
                    Peace Inc.<br />
                    123 Wellness Way<br />
                    Wilmington, DE 19801<br />
                    United States
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Peace App © 2025. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Registered in Delaware, USA | Company Registration Number: 12345678
          </p>
          <p className="text-xs text-muted-foreground">
            We are committed to protecting your privacy and providing a safe, secure platform 
            for your mental wellness journey.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
