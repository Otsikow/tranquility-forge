import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, BookOpen, MessageCircle, Wind, Sparkles, Music, Users, Brain, Moon, ClipboardList } from "lucide-react";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoImage from "@/assets/logo.png";
import eagleImage from "@/assets/bald-eagle.jpg";
import bettaFishImage from "@/assets/betta-fish.jpg";
import dragonflyImage from "@/assets/dragonfly.jpg";
import hummingbirdImage from "@/assets/hummingbird.png";
import koiFishImage from "@/assets/koi-fish.jpg";
import mantaRayImage from "@/assets/manta-ray.jpg";
const features = [{
  icon: Leaf,
  title: "Guided Meditations",
  description: "Find your inner calm with our curated meditation library",
  image: koiFishImage
}, {
  icon: Heart,
  title: "Mood Tracking",
  description: "Understand your emotional patterns and celebrate your progress",
  image: bettaFishImage
}, {
  icon: BookOpen,
  title: "Personal Journal",
  description: "Reflect, grow, and track your mindfulness journey",
  image: hummingbirdImage
}, {
  icon: MessageCircle,
  title: "AI Companion",
  description: "Chat with Peace, your empathetic AI wellbeing assistant",
  image: dragonflyImage
}, {
  icon: Wind,
  title: "Breathing Exercises",
  description: "Calm your mind with guided breathing techniques",
  image: mantaRayImage
}, {
  icon: Sparkles,
  title: "Daily Affirmations",
  description: "Start each day with positive, uplifting messages",
  image: eagleImage
}];

const quickLinks = [
  { icon: Heart, label: "Wellness", to: "/wellness" },
  { icon: BookOpen, label: "Journal", to: "/journal" },
  { icon: Music, label: "Meditations", to: "/meditations" },
  { icon: MessageCircle, label: "Chat", to: "/chat" },
  { icon: Users, label: "Community", to: "/community" },
  { icon: Brain, label: "CBT Tools", to: "/cbt" },
  { icon: Moon, label: "Sleep", to: "/sleep" },
  { icon: ClipboardList, label: "Assessments", to: "/assessments" },
  { icon: Wind, label: "Breathe", to: "/breathe" },
  { icon: Sparkles, label: "Affirmations", to: "/affirmations" },
];
export default function Index() {
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img src={eagleImage} alt="Bald eagle soaring over majestic mountains" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        
        {/* Theme toggle in top right */}
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <img src={logoImage} alt="Peace Logo" className="h-48 w-48 mb-4 drop-shadow-xl animate-fade-up" />
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-up" style={{
          animationDelay: '0.1s'
        }}>
            Welcome to Peace
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl animate-fade-up" style={{
          animationDelay: '0.2s'
        }}>
            Your personal sanctuary for mental wellbeing, mindfulness, and inner calm
          </p>
          <div className="flex gap-4 animate-fade-up" style={{
          animationDelay: '0.4s'
        }}>
            <Link to="/welcome">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Journey to Wellbeing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover tools and practices designed to help you find balance, reduce stress, and cultivate inner peace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in group" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm rounded-full p-3">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>;
        })}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Quick Links
          </h3>
          <p className="text-muted-foreground mt-2">
            Jump straight into key experiences
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {quickLinks.map(({ icon: Icon, label, to }) => (
            <Link key={to} to={to} className="group">
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                <CardContent className="pt-4 pb-4 flex flex-col items-center justify-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium text-foreground text-center">
                    {label}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src={mantaRayImage} alt="Manta ray gliding peacefully underwater" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Begin Your Journey Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users finding peace, balance, and clarity through mindful practices
          </p>
          <Link to="/welcome">
            <Button size="lg" className="text-lg px-12">
              Start Free
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>;
}