import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, User, Bell, HelpCircle, Info, FileText, Shield, Brain, AlertCircle, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import banffImage from "@/assets/banff-lake.jpg";

const featureSections = [
  {
    title: "Mental Health Tools",
    description: "Access assessments and CBT exercises",
    icon: Brain,
    path: "/assessments",
    color: "text-purple-500",
  },
  {
    title: "Crisis Resources",
    description: "Emergency support when you need it",
    icon: AlertCircle,
    path: "/crisis",
    color: "text-red-500",
  },
  {
    title: "Learning Center",
    description: "Educational articles and resources",
    icon: BookOpen,
    path: "/learn",
    color: "text-blue-500",
  },
  {
    title: "Community",
    description: "Connect with others on their journey",
    icon: Users,
    path: "/community",
    color: "text-green-500",
  },
];

const settingsSections = [
  {
    title: "Profile & Security",
    description: "Manage your account and privacy settings",
    icon: User,
    path: "/settings/profile-security",
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

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Features Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1">Features</h3>
          {featureSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Link key={section.path} to={section.path}>
                <Card 
                  className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted rounded-full p-3">
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

        {/* Settings Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1">Settings</h3>
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
      </div>

      <BottomNav />
    </div>
  );
}
