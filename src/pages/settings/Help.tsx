import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Mail, 
  BookOpen, 
  Video, 
  ExternalLink,
  ChevronRight
} from "lucide-react";

const helpResources = [
  {
    title: "Frequently Asked Questions",
    description: "Find quick answers to common questions",
    icon: BookOpen,
    action: "View FAQs",
  },
  {
    title: "Video Tutorials",
    description: "Watch guides on how to use Peace",
    icon: Video,
    action: "Watch Videos",
  },
  {
    title: "Contact Support",
    description: "Get help from our support team",
    icon: Mail,
    action: "Send Message",
  },
  {
    title: "Live Chat",
    description: "Chat with us in real-time",
    icon: MessageCircle,
    action: "Start Chat",
  },
];

const faqItems = [
  {
    question: "How do I track my mood?",
    answer: "Navigate to the Moods page and select your current mood.",
  },
  {
    question: "Can I export my journal entries?",
    answer: "Yes, go to Settings > Profile & Security > Data Export.",
  },
  {
    question: "How do I change my password?",
    answer: "Go to Settings > Profile & Security > Change Password.",
  },
  {
    question: "Is my data private and secure?",
    answer: "Yes, all data is encrypted and stored securely.",
  },
];

export default function Help() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Help & Support" showBack />

      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Contact Options */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            How can we help you?
          </h2>
          {helpResources.map((resource, index) => {
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
                      <h3 className="font-semibold text-foreground mb-0.5">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      {resource.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick FAQs */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Answers
            </h3>
            {faqItems.map((faq, index) => (
              <div key={index} className="space-y-2">
                <button className="w-full text-left group">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {faq.question}
                    </h4>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {faq.answer}
                  </p>
                </button>
                {index < faqItems.length - 1 && (
                  <div className="h-px bg-border mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Community & Resources */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Community & Resources
            </h3>
            
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-medium text-foreground">Join Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with other users
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>

            <a 
              href="https://blog.example.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-medium text-foreground">Blog & Articles</h4>
                  <p className="text-sm text-muted-foreground">
                    Read about mindfulness and wellbeing
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="bg-muted rounded-lg p-6 text-center space-y-2">
          <h3 className="font-semibold text-foreground">Need More Help?</h3>
          <p className="text-sm text-muted-foreground">
            Our support team is available 24/7
          </p>
          <Button variant="outline" className="gap-2 mt-4">
            <Mail className="w-4 h-4" />
            support@peace.app
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
