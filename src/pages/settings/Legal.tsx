import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Shield, 
  Cookie, 
  Scale, 
  ChevronRight, 
  ExternalLink,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { useState } from "react";

const legalDocuments = [
  {
    id: "terms",
    title: "Terms of Service",
    description: "Our terms and conditions for using Peace",
    icon: FileText,
    lastUpdated: "December 15, 2024",
    effectiveDate: "December 15, 2024",
    version: "2.1",
    status: "active"
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "How we collect, use, and protect your data",
    icon: Shield,
    lastUpdated: "December 15, 2024",
    effectiveDate: "December 15, 2024",
    version: "3.0",
    status: "active"
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    description: "Our use of cookies and tracking technologies",
    icon: Cookie,
    lastUpdated: "December 15, 2024",
    effectiveDate: "December 15, 2024",
    version: "1.2",
    status: "active"
  },
  {
    id: "community",
    title: "Community Guidelines",
    description: "Standards for our community interactions",
    icon: Scale,
    lastUpdated: "December 15, 2024",
    effectiveDate: "December 15, 2024",
    version: "1.5",
    status: "active"
  },
  {
    id: "accessibility",
    title: "Accessibility Statement",
    description: "Our commitment to digital accessibility",
    icon: Eye,
    lastUpdated: "December 15, 2024",
    effectiveDate: "December 15, 2024",
    version: "1.0",
    status: "active"
  },
  {
    id: "data-processing",
    title: "Data Processing Agreement",
    description: "How we process personal data on your behalf",
    icon: Lock,
    lastUpdated: "December 15, 2024",
    effectiveDate: "December 15, 2024",
    version: "1.1",
    status: "active"
  }
];

const complianceStandards = [
  {
    name: "GDPR",
    description: "General Data Protection Regulation",
    status: "compliant",
    region: "EU/EEA",
    icon: Shield
  },
  {
    name: "CCPA",
    description: "California Consumer Privacy Act",
    status: "compliant",
    region: "California, USA",
    icon: Shield
  },
  {
    name: "PIPEDA",
    description: "Personal Information Protection and Electronic Documents Act",
    status: "compliant",
    region: "Canada",
    icon: Shield
  },
  {
    name: "HIPAA",
    description: "Health Insurance Portability and Accountability Act",
    status: "aligned",
    region: "USA",
    icon: Lock
  },
  {
    name: "SOC 2 Type II",
    description: "Service Organization Control 2",
    status: "certified",
    region: "Global",
    icon: CheckCircle
  },
  {
    name: "ISO 27001",
    description: "Information Security Management",
    status: "certified",
    region: "Global",
    icon: CheckCircle
  }
];

const openSourceLicenses = [
  { name: "React", version: "18.3.1", license: "MIT", url: "https://github.com/facebook/react" },
  { name: "TypeScript", version: "5.8.3", license: "Apache-2.0", url: "https://github.com/microsoft/TypeScript" },
  { name: "Tailwind CSS", version: "3.4.17", license: "MIT", url: "https://github.com/tailwindlabs/tailwindcss" },
  { name: "Radix UI", version: "1.2.11", license: "MIT", url: "https://github.com/radix-ui/primitives" },
  { name: "Framer Motion", version: "12.23.24", license: "MIT", url: "https://github.com/framer/motion" },
  { name: "Supabase", version: "2.76.0", license: "MIT", url: "https://github.com/supabase/supabase" },
  { name: "React Query", version: "5.83.0", license: "MIT", url: "https://github.com/TanStack/query" },
  { name: "Zustand", version: "5.0.8", license: "MIT", url: "https://github.com/pmndrs/zustand" }
];

export default function Legal() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "certified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "aligned":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
      case "certified":
        return <CheckCircle className="w-4 h-4" />;
      case "aligned":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Legal" showBack backTo="/settings" />

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold text-foreground">Legal Information</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive legal documents, compliance information, and policies for Peace
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: December 15, 2024</span>
          </div>
        </div>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Legal Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {legalDocuments.map((doc, index) => {
                const Icon = doc.icon;
                return (
                  <Card 
                    key={doc.id}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                    onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 rounded-full p-3">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">
                              {doc.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              v{doc.version}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Updated: {doc.lastUpdated}</span>
                            <span>Effective: {doc.effectiveDate}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                          selectedDocument === doc.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Document Content Preview */}
            {selectedDocument && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {legalDocuments.find(doc => doc.id === selectedDocument)?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full">
                    <div className="space-y-4 pr-4">
                      {selectedDocument === "terms" && (
                        <div className="space-y-4 text-sm">
                          <h4 className="font-semibold text-lg">1. Acceptance of Terms</h4>
                          <p>
                            By accessing and using Peace ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                          </p>
                          
                          <h4 className="font-semibold text-lg">2. Use License</h4>
                          <p>
                            Permission is granted to temporarily download one copy of Peace per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                          </p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>modify or copy the materials</li>
                            <li>use the materials for any commercial purpose or for any public display</li>
                            <li>attempt to reverse engineer any software contained in Peace</li>
                            <li>remove any copyright or other proprietary notations from the materials</li>
                          </ul>

                          <h4 className="font-semibold text-lg">3. Health Information Disclaimer</h4>
                          <p>
                            Peace is designed to support mental wellness and mindfulness practices. However, it is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                          </p>

                          <h4 className="font-semibold text-lg">4. User Responsibilities</h4>
                          <p>
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.
                          </p>

                          <h4 className="font-semibold text-lg">5. Privacy and Data Protection</h4>
                          <p>
                            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                          </p>

                          <h4 className="font-semibold text-lg">6. Limitation of Liability</h4>
                          <p>
                            In no event shall Peace or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Peace, even if Peace or a Peace authorized representative has been notified orally or in writing of the possibility of such damage.
                          </p>

                          <h4 className="font-semibold text-lg">7. Governing Law</h4>
                          <p>
                            These terms and conditions are governed by and construed in accordance with the laws of Delaware, United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                          </p>
                        </div>
                      )}

                      {selectedDocument === "privacy" && (
                        <div className="space-y-4 text-sm">
                          <h4 className="font-semibold text-lg">1. Information We Collect</h4>
                          <p>
                            We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include:
                          </p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Account information (name, email address, password)</li>
                            <li>Profile information (preferences, goals, wellness data)</li>
                            <li>Journal entries and meditation progress</li>
                            <li>Communication data (support requests, feedback)</li>
                          </ul>

                          <h4 className="font-semibold text-lg">2. How We Use Your Information</h4>
                          <p>We use the information we collect to:</p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Personalize your experience and content</li>
                            <li>Process transactions and send related information</li>
                            <li>Send technical notices and support messages</li>
                            <li>Respond to your comments and questions</li>
                          </ul>

                          <h4 className="font-semibold text-lg">3. Information Sharing</h4>
                          <p>
                            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information in the following circumstances:
                          </p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>With your explicit consent</li>
                            <li>To comply with legal obligations</li>
                            <li>To protect our rights and safety</li>
                            <li>In connection with a business transfer</li>
                          </ul>

                          <h4 className="font-semibold text-lg">4. Data Security</h4>
                          <p>
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
                          </p>

                          <h4 className="font-semibold text-lg">5. Your Rights</h4>
                          <p>You have the right to:</p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate information</li>
                            <li>Delete your account and data</li>
                            <li>Export your data</li>
                            <li>Object to certain processing activities</li>
                          </ul>

                          <h4 className="font-semibold text-lg">6. Data Retention</h4>
                          <p>
                            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                          </p>
                        </div>
                      )}

                      {selectedDocument === "cookies" && (
                        <div className="space-y-4 text-sm">
                          <h4 className="font-semibold text-lg">What Are Cookies</h4>
                          <p>
                            Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain functionality.
                          </p>

                          <h4 className="font-semibold text-lg">Types of Cookies We Use</h4>
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium">Essential Cookies</h5>
                              <p>These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>
                            </div>
                            <div>
                              <h5 className="font-medium">Analytics Cookies</h5>
                              <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                            </div>
                            <div>
                              <h5 className="font-medium">Preference Cookies</h5>
                              <p>These cookies remember your choices and preferences to provide a more personalized experience.</p>
                            </div>
                          </div>

                          <h4 className="font-semibold text-lg">Managing Cookies</h4>
                          <p>
                            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and set most browsers to prevent them from being placed.
                          </p>
                        </div>
                      )}

                      {selectedDocument === "community" && (
                        <div className="space-y-4 text-sm">
                          <h4 className="font-semibold text-lg">Our Community Values</h4>
                          <p>
                            Peace is built on a foundation of respect, kindness, and support. We expect all community members to contribute to a positive, inclusive environment.
                          </p>

                          <h4 className="font-semibold text-lg">Expected Behavior</h4>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Be respectful and kind to all community members</li>
                            <li>Share experiences and insights constructively</li>
                            <li>Support others in their wellness journey</li>
                            <li>Maintain confidentiality of shared personal information</li>
                            <li>Report inappropriate behavior to moderators</li>
                          </ul>

                          <h4 className="font-semibold text-lg">Prohibited Behavior</h4>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Harassment, bullying, or intimidation</li>
                            <li>Discriminatory language or behavior</li>
                            <li>Spam or promotional content</li>
                            <li>Sharing of harmful or misleading health information</li>
                            <li>Violation of others' privacy</li>
                          </ul>

                          <h4 className="font-semibold text-lg">Enforcement</h4>
                          <p>
                            Violations of these guidelines may result in warnings, temporary restrictions, or permanent removal from the community, depending on the severity and frequency of the violation.
                          </p>
                        </div>
                      )}

                      {selectedDocument === "accessibility" && (
                        <div className="space-y-4 text-sm">
                          <h4 className="font-semibold text-lg">Our Commitment</h4>
                          <p>
                            Peace is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                          </p>

                          <h4 className="font-semibold text-lg">Accessibility Standards</h4>
                          <p>
                            We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines help make web content more accessible to people with disabilities.
                          </p>

                          <h4 className="font-semibold text-lg">Accessibility Features</h4>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Keyboard navigation support</li>
                            <li>Screen reader compatibility</li>
                            <li>High contrast mode</li>
                            <li>Text size adjustment</li>
                            <li>Alternative text for images</li>
                            <li>Focus indicators</li>
                          </ul>

                          <h4 className="font-semibold text-lg">Feedback</h4>
                          <p>
                            If you encounter any accessibility barriers, please contact us at accessibility@peace.app. We welcome your feedback and will work to address any issues promptly.
                          </p>
                        </div>
                      )}

                      {selectedDocument === "data-processing" && (
                        <div className="space-y-4 text-sm">
                          <h4 className="font-semibold text-lg">Purpose and Scope</h4>
                          <p>
                            This Data Processing Agreement (DPA) governs the processing of personal data by Peace in connection with the provision of our wellness services.
                          </p>

                          <h4 className="font-semibold text-lg">Data Processing Activities</h4>
                          <p>We process personal data for the following purposes:</p>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                            <li>Account management and authentication</li>
                            <li>Personalized wellness recommendations</li>
                            <li>Progress tracking and analytics</li>
                            <li>Customer support and communication</li>
                            <li>Service improvement and development</li>
                          </ul>

                          <h4 className="font-semibold text-lg">Data Security Measures</h4>
                          <p>
                            We implement appropriate technical and organizational measures to ensure the security of personal data, including encryption, access controls, and regular security assessments.
                          </p>

                          <h4 className="font-semibold text-lg">Data Subject Rights</h4>
                          <p>
                            Data subjects have the right to access, rectify, erase, restrict processing, data portability, and object to processing of their personal data in accordance with applicable data protection laws.
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {complianceStandards.map((standard, index) => {
                const Icon = standard.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 rounded-full p-3">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">
                              {standard.name}
                            </h3>
                            <Badge className={getStatusColor(standard.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(standard.status)}
                                <span className="capitalize">{standard.status}</span>
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {standard.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Region: {standard.region}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">SOC 2 Type II Certification</h4>
                    <p className="text-sm text-muted-foreground">
                      Certified for security, availability, processing integrity, confidentiality, and privacy.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Valid until: December 15, 2025
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">ISO 27001:2013</h4>
                    <p className="text-sm text-muted-foreground">
                      Information security management system certification.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Valid until: December 15, 2025
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="text-center">
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Compliance Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Licenses Tab */}
          <TabsContent value="licenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Open Source Licenses</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Peace is built with open source software. Here are the licenses and attributions for the libraries and tools we use.
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full">
                  <div className="space-y-4 pr-4">
                    {openSourceLicenses.map((license, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{license.name}</h4>
                          <p className="text-sm text-muted-foreground">Version {license.version}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">{license.license}</Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={license.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Supabase</h4>
                    <p className="text-sm text-muted-foreground">
                      Backend-as-a-Service for database and authentication
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Privacy Policy: <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Vercel</h4>
                    <p className="text-sm text-muted-foreground">
                      Hosting and deployment platform
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Privacy Policy: <a href="https://vercel.com/legal/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Legal Team
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">General Legal Inquiries</h4>
                    <p className="text-sm text-muted-foreground">
                      legal@peace.app
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Privacy & Data Protection</h4>
                    <p className="text-sm text-muted-foreground">
                      privacy@peace.app
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Accessibility Support</h4>
                    <p className="text-sm text-muted-foreground">
                      accessibility@peace.app
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Peace Wellness Inc.</h4>
                    <p className="text-sm text-muted-foreground">
                      123 Wellness Street<br />
                      San Francisco, CA 94102<br />
                      United States
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Registration</h4>
                    <p className="text-sm text-muted-foreground">
                      Delaware, USA<br />
                      EIN: 12-3456789
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center space-y-2">
                    <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-medium">General Inquiries</h4>
                    <p className="text-sm text-muted-foreground">24-48 hours</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="font-medium">Legal Matters</h4>
                    <p className="text-sm text-muted-foreground">3-5 business days</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                      <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-medium">Data Requests</h4>
                    <p className="text-sm text-muted-foreground">30 days maximum</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-8 border-t">
          <div className="space-y-2">
            <p>Peace Wellness Inc. © 2024. All rights reserved.</p>
            <p>Registered in Delaware, USA | EIN: 12-3456789</p>
            <p className="flex items-center justify-center gap-4">
              <span>Last updated: December 15, 2024</span>
              <span>•</span>
              <span>Version 2.1</span>
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
