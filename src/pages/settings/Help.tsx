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
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
    answer: "Navigate to the Moods page from the bottom navigation bar and select your current mood. You can add notes and see trends over time.",
  },
  {
    question: "Can I use the app offline?",
    answer: "Yes! Peace works offline. Your journal entries, meditation sessions, and mood tracking will sync automatically when you're back online.",
  },
  {
    question: "How do I start a meditation session?",
    answer: "Go to the Meditations page, browse available guided meditations, and tap on one to start. You can download meditations for offline use.",
  },
  {
    question: "Can I export my journal entries?",
    answer: "Yes, go to Settings > Profile & Security > Data Export to download all your journal entries and personal data.",
  },
  {
    question: "How do I change my password?",
    answer: "Go to Settings > Profile & Security > Change Password. Enter your current password and choose a new one.",
  },
  {
    question: "Is my data private and secure?",
    answer: "Yes, all data is encrypted end-to-end and stored securely. We never share your personal information with third parties. Read our Privacy Policy in Settings > Legal for more details.",
  },
  {
    question: "How do I enable push notifications?",
    answer: "Go to Settings > Notifications to customize your notification preferences, including reminders for meditation, journaling, and mood tracking.",
  },
  {
    question: "Can I access the AI chat for support?",
    answer: "Yes! Tap the Chat icon in the bottom navigation to chat with our AI wellness assistant. It's available 24/7 for guidance and support.",
  },
];

export default function Help() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResourceClick = (title: string) => {
    switch (title) {
      case "Frequently Asked Questions":
        // Smooth scroll to FAQ section
        setTimeout(() => {
          document.getElementById('faq-section')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
        break;
      case "Video Tutorials":
        window.open("https://www.youtube.com/@PeaceWellnessApp", "_blank", "noopener,noreferrer");
        break;
      case "Contact Support":
        window.location.href = "mailto:support@peace.app?subject=Support Request";
        break;
      case "Live Chat":
        // Navigate to the chat page for live support
        navigate("/chat");
        toast({
          title: "Chat Support",
          description: "Ask our AI assistant any questions you have!",
        });
        break;
      default:
        break;
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Help & Support" showBack backTo="/settings" />

      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Crisis Resources Banner */}
        <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
              🆘 Crisis Resources
            </h3>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
              If you're experiencing a mental health crisis or emergency, please reach out for immediate help:
            </p>
            <div className="space-y-2">
              <a 
                href="tel:988"
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg hover:shadow-md transition-all"
              >
                <div>
                  <h4 className="font-semibold text-foreground">988 Suicide & Crisis Lifeline</h4>
                  <p className="text-sm text-muted-foreground">Call or text 988 - Available 24/7</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
              <a 
                href="sms:741741"
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg hover:shadow-md transition-all"
              >
                <div>
                  <h4 className="font-semibold text-foreground">Crisis Text Line</h4>
                  <p className="text-sm text-muted-foreground">Text HOME to 741741</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
              <a 
                href="tel:911"
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg hover:shadow-md transition-all"
              >
                <div>
                  <h4 className="font-semibold text-foreground">Emergency Services</h4>
                  <p className="text-sm text-muted-foreground">Call 911 for immediate emergency</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </CardContent>
        </Card>

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
                onClick={() => handleResourceClick(resource.title)}
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
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleResourceClick(resource.title);
                    }}>
                      {resource.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick FAQs */}
        <Card id="faq-section">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Answers
            </h3>
            {faqItems.map((faq, index) => (
              <div key={index} className="space-y-2">
                <button 
                  className="w-full text-left group"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {faq.question}
                    </h4>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-primary flex-shrink-0 transition-transform" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  {expandedFaq === index && (
                    <p className="text-sm text-muted-foreground mt-2 animate-in fade-in-50 duration-200">
                      {faq.answer}
                    </p>
                  )}
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
            
            <button
              onClick={() => navigate("/community")}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Join Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with other users in our forum
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <a 
              href="https://medium.com/@peace-wellness" 
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

            <a 
              href="https://www.youtube.com/@PeaceWellnessApp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-medium text-foreground">Video Guides</h4>
                  <p className="text-sm text-muted-foreground">
                    Watch tutorials on our YouTube channel
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
          <Button 
            variant="outline" 
            className="gap-2 mt-4"
            onClick={() => window.location.href = "mailto:support@peace.app?subject=Support Request&body=Hello Peace Support Team,%0D%0A%0D%0AI need help with:%0D%0A%0D%0A"}
          >
            <Mail className="w-4 h-4" />
            support@peace.app
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
