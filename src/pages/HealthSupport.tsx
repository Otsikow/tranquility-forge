import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  Phone, 
  MessageCircle, 
  BookOpen, 
  Users, 
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Stethoscope,
  Brain,
  Zap,
  Globe,
  Mail,
  Calendar,
  Video,
  FileText,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const crisisResources = [
  {
    title: "National Suicide Prevention Lifeline",
    description: "24/7 crisis support and suicide prevention",
    phone: "988",
    icon: Phone,
    urgent: true,
    available: "24/7"
  },
  {
    title: "Crisis Text Line",
    description: "Text-based crisis support",
    phone: "Text HOME to 741741",
    icon: MessageCircle,
    urgent: true,
    available: "24/7"
  },
  {
    title: "Emergency Services",
    description: "For immediate life-threatening situations",
    phone: "911",
    icon: AlertTriangle,
    urgent: true,
    available: "24/7"
  }
];

const healthResources = [
  {
    title: "Mental Health Assessments",
    description: "Take validated screening tools for depression, anxiety, and stress",
    icon: Brain,
    path: "/assessments",
    color: "bg-blue-500"
  },
  {
    title: "AI Chat Support",
    description: "Talk to our AI mental health companion",
    icon: MessageCircle,
    path: "/chat",
    color: "bg-green-500"
  },
  {
    title: "Meditation & Breathing",
    description: "Guided meditations and breathing exercises",
    icon: Zap,
    path: "/breathe",
    color: "bg-purple-500"
  },
  {
    title: "Mood Tracking",
    description: "Track your daily mood and emotional patterns",
    icon: Heart,
    path: "/moods",
    color: "bg-pink-500"
  },
  {
    title: "Journaling",
    description: "Reflect and process your thoughts",
    icon: BookOpen,
    path: "/journal",
    color: "bg-orange-500"
  },
  {
    title: "Community Support",
    description: "Connect with others on similar journeys",
    icon: Users,
    path: "/community",
    color: "bg-teal-500"
  }
];

const professionalSupport = [
  {
    title: "Find a Therapist",
    description: "Connect with licensed mental health professionals",
    icon: Stethoscope,
    action: "Search Directory",
    external: true
  },
  {
    title: "Online Therapy Platforms",
    description: "Access therapy from the comfort of your home",
    icon: Video,
    action: "View Options",
    external: true
  },
  {
    title: "Support Groups",
    description: "Join local or online support groups",
    icon: Users,
    action: "Find Groups",
    external: true
  },
  {
    title: "Mental Health Apps",
    description: "Recommended apps for mental wellness",
    icon: Globe,
    action: "Browse Apps",
    external: true
  }
];

const selfHelpResources = [
  {
    title: "CBT Tools",
    description: "Cognitive Behavioral Therapy techniques and exercises",
    icon: Brain,
    path: "/cbt"
  },
  {
    title: "Sleep Support",
    description: "Improve your sleep hygiene and quality",
    icon: Clock,
    path: "/sleep"
  },
  {
    title: "Wellness Hub",
    description: "Comprehensive wellness resources and tools",
    icon: Heart,
    path: "/wellness"
  },
  {
    title: "Help Center",
    description: "FAQs, tutorials, and technical support",
    icon: HelpCircle,
    path: "/settings/help"
  }
];

const emergencyContacts = [
  {
    name: "National Suicide Prevention Lifeline",
    number: "988",
    description: "24/7 crisis support",
    urgent: true
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "24/7 text support",
    urgent: true
  },
  {
    name: "SAMHSA National Helpline",
    number: "1-800-662-4357",
    description: "Substance abuse and mental health services",
    urgent: false
  },
  {
    name: "National Domestic Violence Hotline",
    number: "1-800-799-7233",
    description: "24/7 support for domestic violence",
    urgent: false
  }
];

export default function HealthSupport() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Health & Support" showBack backTo="/dashboard" />

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Crisis Support - Always at the top */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Crisis Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-red-600 dark:text-red-300">
              If you're experiencing a mental health crisis or having thoughts of self-harm, 
              please reach out for immediate help.
            </p>
            <div className="grid gap-3">
              {crisisResources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2">
                      <Icon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {resource.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-red-600 dark:text-red-400">
                        {resource.phone}
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {resource.available}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Health Resources */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Your Health Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Link key={index} to={resource.path}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`${resource.color} rounded-full p-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
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

        {/* Self-Help Resources */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Self-Help Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selfHelpResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Link key={index} to={resource.path}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 rounded-full p-3">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
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

        {/* Professional Support */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Professional Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionalSupport.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 rounded-full p-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        {resource.action}
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Save these important numbers for immediate support when you need it most.
            </p>
            {emergencyContacts.map((contact, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  contact.urgent 
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                    : 'bg-muted border-border'
                }`}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">
                    {contact.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {contact.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-primary">
                    {contact.number}
                  </div>
                  {contact.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Legal & Privacy */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Legal & Privacy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link to="/settings/legal">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Privacy Policy & Terms
                </Button>
              </Link>
              <Link to="/settings/help">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="bg-muted rounded-lg p-6 text-center space-y-4">
          <h3 className="font-semibold text-foreground flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />
            Need More Help?
          </h3>
          <p className="text-sm text-muted-foreground">
            Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              support@peace.app
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4 space-y-1">
          <p>Remember: You are not alone. Help is always available.</p>
          <p>Peace App © 2024. Built with care for your wellbeing.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}