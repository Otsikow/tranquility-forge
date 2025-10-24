import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Checkbox,
} from "@/components/ui/checkbox";
import { 
  Heart, 
  Brain, 
  Moon, 
  Smile, 
  Target, 
  Zap, 
  Shield, 
  Leaf,
  Clock,
  Bell,
  Globe,
  User
} from "lucide-react";
import type { 
  MentalHealthGoal, 
  ExperienceLevel, 
  SessionLength, 
  NotificationFrequency 
} from "@/types/db";

interface OnboardingData {
  mental_health_goals: MentalHealthGoal[];
  experience_level: ExperienceLevel;
  preferred_session_length: SessionLength;
  notification_frequency: NotificationFrequency;
  timezone_offset: number;
  date_of_birth: string;
  gender: string;
  location_country: string;
  location_city: string;
}

interface OnboardingSurveyProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const mentalHealthGoals = [
  {
    key: 'stress_relief' as MentalHealthGoal,
    label: 'Stress Relief',
    description: 'Manage daily stress and find calm',
    icon: Heart,
    color: 'text-red-500'
  },
  {
    key: 'anxiety_management' as MentalHealthGoal,
    label: 'Anxiety Management',
    description: 'Cope with anxiety and worry',
    icon: Brain,
    color: 'text-purple-500'
  },
  {
    key: 'sleep_improvement' as MentalHealthGoal,
    label: 'Better Sleep',
    description: 'Improve sleep quality and rest',
    icon: Moon,
    color: 'text-blue-500'
  },
  {
    key: 'mood_enhancement' as MentalHealthGoal,
    label: 'Mood Enhancement',
    description: 'Boost overall mood and happiness',
    icon: Smile,
    color: 'text-yellow-500'
  },
  {
    key: 'focus_concentration' as MentalHealthGoal,
    label: 'Focus & Concentration',
    description: 'Improve attention and productivity',
    icon: Target,
    color: 'text-green-500'
  },
  {
    key: 'emotional_regulation' as MentalHealthGoal,
    label: 'Emotional Regulation',
    description: 'Better manage emotions and reactions',
    icon: Zap,
    color: 'text-orange-500'
  },
  {
    key: 'self_compassion' as MentalHealthGoal,
    label: 'Self-Compassion',
    description: 'Develop kindness toward yourself',
    icon: Shield,
    color: 'text-pink-500'
  },
  {
    key: 'mindfulness_practice' as MentalHealthGoal,
    label: 'Mindfulness Practice',
    description: 'Cultivate present-moment awareness',
    icon: Leaf,
    color: 'text-emerald-500'
  }
];

const experienceLevels = [
  { value: 'beginner' as ExperienceLevel, label: 'Beginner', description: 'New to meditation and mindfulness' },
  { value: 'intermediate' as ExperienceLevel, label: 'Intermediate', description: 'Some experience with meditation' },
  { value: 'advanced' as ExperienceLevel, label: 'Advanced', description: 'Regular meditation practitioner' }
];

const sessionLengths = [
  { value: 'short' as SessionLength, label: 'Short (5-10 min)', description: 'Quick daily practices' },
  { value: 'medium' as SessionLength, label: 'Medium (10-20 min)', description: 'Balanced sessions' },
  { value: 'long' as SessionLength, label: 'Long (20+ min)', description: 'Deep practice sessions' }
];

const notificationFrequencies = [
  { value: 'none' as NotificationFrequency, label: 'No reminders', description: 'I prefer to use the app on my own schedule' },
  { value: 'daily' as NotificationFrequency, label: 'Daily', description: 'Gentle daily reminders' },
  { value: 'weekly' as NotificationFrequency, label: 'Weekly', description: 'Weekly check-ins and insights' },
  { value: 'custom' as NotificationFrequency, label: 'Custom', description: 'I\'ll set my own preferences later' }
];

export default function OnboardingSurvey({ onComplete, onSkip }: OnboardingSurveyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    mental_health_goals: [],
    experience_level: 'beginner',
    preferred_session_length: 'medium',
    notification_frequency: 'daily',
    timezone_offset: new Date().getTimezoneOffset(),
    date_of_birth: '',
    gender: '',
    location_country: '',
    location_city: ''
  });

  const steps = [
    { title: 'Your Goals', description: 'What brings you to Peace?' },
    { title: 'Experience', description: 'Tell us about your meditation experience' },
    { title: 'Preferences', description: 'How do you like to practice?' },
    { title: 'Personal Info', description: 'Help us personalize your experience' },
    { title: 'Notifications', description: 'How would you like to stay engaged?' }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleGoalToggle = (goal: MentalHealthGoal) => {
    setData(prev => ({
      ...prev,
      mental_health_goals: prev.mental_health_goals.includes(goal)
        ? prev.mental_health_goals.filter(g => g !== goal)
        : [...prev.mental_health_goals, goal]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.mental_health_goals.length > 0;
      case 1: return data.experience_level !== '';
      case 2: return data.preferred_session_length !== '';
      case 3: return data.date_of_birth !== '' && data.gender !== '';
      case 4: return data.notification_frequency !== '';
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center mb-6">
              Select all that apply to help us personalize your experience
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mentalHealthGoals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = data.mental_health_goals.includes(goal.key);
                return (
                  <Card
                    key={goal.key}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleGoalToggle(goal.key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className={`h-6 w-6 ${goal.color} mt-1`} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{goal.label}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        </div>
                        <Checkbox checked={isSelected} readOnly />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center mb-6">
              This helps us recommend the right content for you
            </p>
            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <Card
                  key={level.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    data.experience_level === level.value ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, experience_level: level.value }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={data.experience_level === level.value} readOnly />
                      <div>
                        <h3 className="font-semibold">{level.label}</h3>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center mb-6">
              What session length works best for your schedule?
            </p>
            <div className="space-y-3">
              {sessionLengths.map((length) => (
                <Card
                  key={length.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    data.preferred_session_length === length.value ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, preferred_session_length: length.value }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{length.label}</h3>
                        <p className="text-sm text-muted-foreground">{length.description}</p>
                      </div>
                      <Checkbox checked={data.preferred_session_length === length.value} readOnly />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground text-center mb-6">
              This information helps us provide more relevant content and insights
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={data.date_of_birth}
                  onChange={(e) => setData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  className="w-full p-3 border border-border rounded-md bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select value={data.gender} onValueChange={(value) => setData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <input
                  type="text"
                  placeholder="e.g., United States"
                  value={data.location_country}
                  onChange={(e) => setData(prev => ({ ...prev, location_country: e.target.value }))}
                  className="w-full p-3 border border-border rounded-md bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <input
                  type="text"
                  placeholder="e.g., New York"
                  value={data.location_city}
                  onChange={(e) => setData(prev => ({ ...prev, location_city: e.target.value }))}
                  className="w-full p-3 border border-border rounded-md bg-background"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center mb-6">
              How would you like to stay engaged with your practice?
            </p>
            <div className="space-y-3">
              {notificationFrequencies.map((freq) => (
                <Card
                  key={freq.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    data.notification_frequency === freq.value ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setData(prev => ({ ...prev, notification_frequency: freq.value }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{freq.label}</h3>
                        <p className="text-sm text-muted-foreground">{freq.description}</p>
                      </div>
                      <Checkbox checked={data.notification_frequency === freq.value} readOnly />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Welcome to Peace</h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={currentStep === 0 ? onSkip : handleBack}
            >
              {currentStep === 0 ? 'Skip for now' : 'Back'}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}