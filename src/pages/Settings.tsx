import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, User, Bell, HelpCircle, Info, FileText, Shield, CreditCard, Crown, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import banffImage from "@/assets/banff-lake.jpg";

const settingsSections = [
  {
    title: "Profile & Security",
    description: "Manage your account and privacy settings",
    icon: User,
    path: "/settings/profile-security",
    color: "text-primary",
  },
  {
    title: "Subscription",
    description: "Manage your subscription and billing",
    icon: CreditCard,
    path: "/subscription",
    color: "text-primary",
  },
  {
    title: "Notifications",
    description: "Customize your notification preferences",
    icon: Bell,
    path: "/settings/notifications",
    color: "text-primary",
  },
  {
    title: "Health & Support",
    description: "Mental health resources and crisis support",
    icon: Heart,
    path: "/health-support",
    color: "text-primary",
  },
  {
    title: "Help & Support",
    description: "Get help and contact support",
    icon: HelpCircle,
    path: "/settings/help",
    color: "text-primary",
  },
  {
    title: "About",
    description: "Learn more about Peace",
    icon: Info,
    path: "/settings/about",
    color: "text-primary",
  },
  {
    title: "Legal",
    description: "Terms, privacy policy, and more",
    icon: FileText,
    path: "/settings/legal",
    color: "text-primary",
  },
];

export default function Settings() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Settings" showBack backTo="/dashboard" />

      {/* Hero Section */}
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img
          src={banffImage}
          alt="Peaceful mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary drop-shadow-lg" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-lg">
              Settings & Preferences
            </h2>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-6 py-6 space-y-3 max-w-4xl mx-auto">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Link key={section.path} to={section.path}>
              <Card 
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-3">
                      <Icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-0.5">
                        {section.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
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

      <BottomNav />
    </div>
  );
}
