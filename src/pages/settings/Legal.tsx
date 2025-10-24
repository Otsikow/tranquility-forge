import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, FileText, Shield, Cookie, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const legalDocuments = [
  {
    title: "Terms of Service",
    description: "Read our terms and conditions",
    icon: FileText,
    lastUpdated: "October 20, 2024",
    path: "/settings/legal/terms",
  },
  {
    title: "Privacy Policy",
    description: "Learn how we protect your data",
    icon: Shield,
    lastUpdated: "October 20, 2024",
    path: "/settings/legal/privacy",
  },
  {
    title: "Cookie Policy",
    description: "Understand how we use cookies",
    icon: Cookie,
    lastUpdated: "October 20, 2024",
    path: "/settings/legal/cookies",
  },
  {
    title: "Community Guidelines",
    description: "Our community standards and expectations",
    icon: Scale,
    lastUpdated: "October 20, 2024",
    path: "/settings/legal/guidelines",
  },
];

export default function Legal() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Legal" showBack backTo="/settings" />

      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-foreground">Legal Information</h2>
          <p className="text-muted-foreground">
            Important documents and policies
          </p>
        </div>

        {/* Legal Documents */}
        <div className="space-y-3">
          {legalDocuments.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <Link to={doc.path} key={doc.path}>
                <Card 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 rounded-full p-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {doc.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {doc.lastUpdated}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Licenses */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Open Source Licenses
            </h3>
            <p className="text-sm text-muted-foreground">
              Peace is built with open source software. View the licenses and 
              attributions for the libraries and tools we use.
            </p>
            <button className="flex items-center gap-2 text-primary hover:underline">
              View Licenses
              <ChevronRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Compliance & Certifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">GDPR Compliant</h4>
                  <p className="text-sm text-muted-foreground">
                    We comply with the General Data Protection Regulation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">HIPAA Aligned</h4>
                  <p className="text-sm text-muted-foreground">
                    Our practices align with health data protection standards
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">ISO 27001</h4>
                  <p className="text-sm text-muted-foreground">
                    Information security management certified
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="bg-muted rounded-lg p-6 text-center space-y-2">
          <h3 className="font-semibold text-foreground">Questions About Legal?</h3>
          <p className="text-sm text-muted-foreground">
            Contact our legal team at legal@peace.app
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>Peace App © 2024. All rights reserved.</p>
          <p className="mt-2">Registered in Delaware, USA</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
