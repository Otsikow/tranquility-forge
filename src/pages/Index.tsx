import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, BookOpen, MessageCircle, Wind, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import banffImage from "@/assets/banff-lake.jpg";
import boraBoraImage from "@/assets/bora-bora.jpg";
import cappadociaImage from "@/assets/cappadocia.jpg";
import icelandImage from "@/assets/iceland-lights.jpg";
import maldivesImage from "@/assets/maldives.jpg";
import victoriaFallsImage from "@/assets/victoria-falls.jpg";

const features = [
  {
    icon: Leaf,
    title: "Guided Meditations",
    description: "Find your inner calm with our curated meditation library",
    image: icelandImage,
  },
  {
    icon: Heart,
    title: "Mood Tracking",
    description: "Understand your emotional patterns and celebrate your progress",
    image: maldivesImage,
  },
  {
    icon: BookOpen,
    title: "Personal Journal",
    description: "Reflect, grow, and track your mindfulness journey",
    image: cappadociaImage,
  },
  {
    icon: MessageCircle,
    title: "AI Companion",
    description: "Chat with Peace, your empathetic AI wellbeing assistant",
    image: boraBoraImage,
  },
  {
    icon: Wind,
    title: "Breathing Exercises",
    description: "Calm your mind with guided breathing techniques",
    image: victoriaFallsImage,
  },
  {
    icon: Sparkles,
    title: "Daily Affirmations",
    description: "Start each day with positive, uplifting messages",
    image: banffImage,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src={banffImage}
          alt="Peaceful mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-up">
            Welcome to Peace
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Your personal sanctuary for mental wellbeing, mindfulness, and inner calm
          </p>
          <div className="flex gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
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
            return (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
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
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={maldivesImage}
            alt="Serene beach"
            className="w-full h-full object-cover opacity-30"
          />
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
    </div>
  );
}
