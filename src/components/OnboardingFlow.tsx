import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Shield,
  Users,
  BookOpen,
  Brain
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import OnboardingSurvey from "./OnboardingSurvey";
import SelfAssessment from "./SelfAssessment";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  component: React.ComponentType<any>;
  required: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Peace',
    description: 'Let\'s personalize your mental wellness journey',
    icon: Heart,
    component: WelcomeStep,
    required: true
  },
  {
    id: 'survey',
    title: 'Tell Us About Yourself',
    description: 'Help us understand your goals and preferences',
    icon: Target,
    component: OnboardingSurvey,
    required: true
  },
  {
    id: 'assessment',
    title: 'Mental Health Check-in',
    description: 'Take a quick assessment to understand your current state',
    icon: Brain,
    component: AssessmentStep,
    required: false
  },
  {
    id: 'features',
    title: 'Explore Features',
    description: 'Discover what Peace has to offer',
    icon: Sparkles,
    component: FeaturesStep,
    required: true
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Your personalized experience is ready',
    icon: CheckCircle,
    component: CompleteStep,
    required: true
  }
];

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 rounded-full bg-primary/10">
          <Heart className="h-12 w-12 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Welcome to Peace</h2>
        <p className="text-muted-foreground text-lg">
          Your personal mental wellness companion
        </p>
      </div>
      <div className="space-y-4 text-left max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Journal & Reflect</h3>
            <p className="text-sm text-muted-foreground">Track your thoughts and emotions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100">
            <Brain className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">Guided Meditations</h3>
            <p className="text-sm text-muted-foreground">Find calm with expert-guided sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold">AI Support</h3>
            <p className="text-sm text-muted-foreground">Get personalized guidance anytime</p>
          </div>
        </div>
      </div>
      <Button onClick={onNext} size="lg" className="w-full">
        Get Started
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

function AssessmentStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const [showAssessment, setShowAssessment] = useState(false);

  if (showAssessment) {
    return (
      <SelfAssessment
        assessmentType="phq9"
        onComplete={() => {
          setShowAssessment(false);
          onNext();
        }}
        onClose={() => {
          setShowAssessment(false);
          onSkip();
        }}
      />
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 rounded-full bg-purple-100">
          <Brain className="h-12 w-12 text-purple-600" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Mental Health Check-in</h2>
        <p className="text-muted-foreground">
          Take a quick, confidential assessment to help us personalize your experience
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 text-left max-w-md mx-auto">
        <h3 className="font-semibold mb-2">What to expect:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 9 simple questions about your mood</li>
          <li>• Takes about 5 minutes</li>
          <li>• Completely confidential</li>
          <li>• Helps us recommend the right content</li>
        </ul>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onSkip} className="flex-1">
          Skip for now
        </Button>
        <Button onClick={() => setShowAssessment(true)} className="flex-1">
          Start Assessment
        </Button>
      </div>
    </div>
  );
}

function FeaturesStep({ onNext }: { onNext: () => void }) {
  const features = [
    {
      icon: BookOpen,
      title: "Smart Journaling",
      description: "AI-powered prompts and mood tracking",
      color: "text-blue-500"
    },
    {
      icon: Heart,
      title: "Personalized Meditations",
      description: "Content tailored to your goals",
      color: "text-green-500"
    },
    {
      icon: Target,
      title: "Progress Tracking",
      description: "Achievements and streaks to stay motivated",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Crisis Support",
      description: "24/7 resources when you need them most",
      color: "text-red-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Discover Peace Features</h2>
        <p className="text-muted-foreground">
          Everything you need for your mental wellness journey
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Icon className={`h-6 w-6 ${feature.color} mt-1`} />
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Button onClick={onNext} size="lg" className="w-full">
        Continue
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

function CompleteStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">You're All Set!</h2>
        <p className="text-muted-foreground text-lg">
          Your personalized Peace experience is ready
        </p>
      </div>
      <div className="bg-primary/10 rounded-lg p-4 max-w-md mx-auto">
        <h3 className="font-semibold mb-2">What's next?</h3>
        <ul className="text-sm text-muted-foreground space-y-1 text-left">
          <li>• Start with a quick meditation</li>
          <li>• Log your first mood entry</li>
          <li>• Explore personalized recommendations</li>
          <li>• Set up your daily reminders</li>
        </ul>
      </div>
      <Button onClick={onComplete} size="lg" className="w-full">
        Enter Peace
        <Sparkles className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const { completeOnboarding } = useUserProfile();

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      completeOnboarding({}).then(() => {
        onComplete();
      }).catch((error) => {
        console.error('Error completing onboarding:', error);
        onComplete(); // Continue anyway
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSurveyComplete = (data: any) => {
    completeOnboarding(data).then(() => {
      handleNext();
    }).catch((error) => {
      console.error('Error completing survey:', error);
      handleNext(); // Continue anyway
    });
  };

  const renderStep = () => {
    const StepComponent = currentStepData.component;
    
    if (currentStepData.id === 'survey') {
      return (
        <StepComponent
          onComplete={handleSurveyComplete}
          onSkip={handleSkip}
        />
      );
    }
    
    if (currentStepData.id === 'assessment') {
      return (
        <StepComponent
          onNext={handleNext}
          onSkip={handleSkip}
        />
      );
    }
    
    if (currentStepData.id === 'complete') {
      return (
        <StepComponent
          onComplete={onComplete}
        />
      );
    }
    
    return (
      <StepComponent
        onNext={handleNext}
        onSkip={handleSkip}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Peace</h1>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{currentStepData.title}</h2>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          
          {/* Navigation */}
          {currentStepData.id !== 'survey' && currentStepData.id !== 'assessment' && currentStepData.id !== 'complete' && (
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleSkip}
                className="gap-2"
              >
                Skip
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}