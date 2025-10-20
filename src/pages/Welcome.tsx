import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, BookOpen, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-lake.jpg";

const onboardingSteps = [
  {
    icon: Leaf,
    title: "Guided Meditations",
    description: "Find calm and reduce stress with our library of guided sessions.",
  },
  {
    icon: Heart,
    title: "Mood Tracking",
    description: "Understand your emotional patterns with daily mood insights.",
  },
  {
    icon: BookOpen,
    title: "Personal Journal",
    description: "Reflect on your thoughts and track your mindfulness journey.",
  },
  {
    icon: MessageCircle,
    title: "AI Support",
    description: "Chat with Peace, your empathetic AI companion.",
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/auth/register");
    }
  };

  const currentItem = onboardingSteps[currentStep];
  const Icon = currentItem.icon;

  return (
    <div className="min-h-screen bg-card flex flex-col">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={heroImage}
          alt="Peaceful mountain lake"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8 pb-24 flex flex-col items-center text-center animate-fade-up">
        <h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-3">
          Welcome to Peace
        </h1>
        <p className="text-muted-foreground mb-12 max-w-md">
          Your personal guide to a calmer mind. Let's begin your journey to a more mindful and peaceful you.
        </p>

        {/* Onboarding Card */}
        <div className="w-full max-w-sm mb-8 animate-scale-in">
          <div className="bg-muted rounded-3xl p-8 mb-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-card rounded-full flex items-center justify-center">
              <Icon className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground mb-3">
              {currentItem.title}
            </h2>
            <p className="text-muted-foreground">
              {currentItem.description}
            </p>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full max-w-sm space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={handleNext}
          >
            {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-card-foreground"
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}
