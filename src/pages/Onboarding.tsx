import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const PRIMARY_GOALS = [
  { value: "stress_relief", label: "Stress Relief", emoji: "😌" },
  { value: "better_sleep", label: "Better Sleep", emoji: "😴" },
  { value: "manage_anxiety", label: "Manage Anxiety", emoji: "🧘" },
  { value: "depression_support", label: "Depression Support", emoji: "🌈" },
  { value: "focus_productivity", label: "Focus & Productivity", emoji: "🎯" },
  { value: "emotional_wellbeing", label: "Emotional Wellbeing", emoji: "💚" },
];

const SECONDARY_GOALS = [
  { value: "mindfulness", label: "Mindfulness Practice" },
  { value: "gratitude", label: "Gratitude & Positivity" },
  { value: "self_awareness", label: "Self-Awareness" },
  { value: "breathing", label: "Breathing Exercises" },
  { value: "body_scan", label: "Body Scan Relaxation" },
  { value: "guided_imagery", label: "Guided Imagery" },
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner", description: "New to meditation and mindfulness" },
  { value: "intermediate", label: "Intermediate", description: "Some experience with meditation" },
  { value: "advanced", label: "Advanced", description: "Regular meditation practice" },
];

const SESSION_LENGTHS = [
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 20, label: "20 minutes" },
  { value: 30, label: "30 minutes" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [primaryGoal, setPrimaryGoal] = useState<string>("");
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("beginner");
  const [preferredLength, setPreferredLength] = useState<number>(10);
  const [notificationTime, setNotificationTime] = useState<string>("09:00");

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleSecondaryGoalToggle = (value: string) => {
    setSecondaryGoals(prev =>
      prev.includes(value)
        ? prev.filter(g => g !== value)
        : [...prev, value]
    );
  };

  const handleComplete = async () => {
    if (!primaryGoal) {
      toast({
        title: "Please select a primary goal",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/auth/login");
        return;
      }

      const { error } = await supabase
        .from("users_profile")
        .update({
          onboarding_completed: true,
          primary_goal: primaryGoal,
          secondary_goals: secondaryGoals,
          experience_level: experienceLevel,
          preferred_session_length: preferredLength,
          notification_enabled: true,
          notification_time: notificationTime,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Create initial user statistics record
      await supabase
        .from("user_statistics")
        .insert({
          user_id: user.id,
        });

      toast({
        title: "Welcome to Peace! 🎉",
        description: "Your personalized journey begins now",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        title: "Error saving preferences",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    if (step === 1) return primaryGoal !== "";
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </p>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Welcome to Peace</CardTitle>
            <CardDescription className="text-base">
              Let's personalize your experience
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Primary Goal */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-xl font-semibold">What's your main goal?</h3>
                  <p className="text-muted-foreground">
                    Choose what matters most to you right now
                  </p>
                </div>

                <RadioGroup value={primaryGoal} onValueChange={setPrimaryGoal}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PRIMARY_GOALS.map((goal) => (
                      <div key={goal.value} className="relative">
                        <RadioGroupItem
                          value={goal.value}
                          id={goal.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={goal.value}
                          className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                        >
                          <span className="text-3xl">{goal.emoji}</span>
                          <span className="font-medium">{goal.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Secondary Goals */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-xl font-semibold">What else interests you?</h3>
                  <p className="text-muted-foreground">
                    Select any additional practices (optional)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SECONDARY_GOALS.map((goal) => (
                    <div
                      key={goal.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary ${
                        secondaryGoals.includes(goal.value)
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                      onClick={() => handleSecondaryGoalToggle(goal.value)}
                    >
                      <Checkbox
                        checked={secondaryGoals.includes(goal.value)}
                        onCheckedChange={() => handleSecondaryGoalToggle(goal.value)}
                      />
                      <Label className="cursor-pointer flex-1">{goal.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Experience Level */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-xl font-semibold">Your experience level?</h3>
                  <p className="text-muted-foreground">
                    Help us recommend the right content for you
                  </p>
                </div>

                <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
                  <div className="space-y-3">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <div key={level.value} className="relative">
                        <RadioGroupItem
                          value={level.value}
                          id={level.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={level.value}
                          className="flex flex-col gap-1 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                        >
                          <span className="font-semibold">{level.label}</span>
                          <span className="text-sm text-muted-foreground">
                            {level.description}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Preferences */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-xl font-semibold">Set your preferences</h3>
                  <p className="text-muted-foreground">
                    Customize your meditation and notification settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-length" className="text-base">
                      Preferred Session Length
                    </Label>
                    <Select
                      value={preferredLength.toString()}
                      onValueChange={(v) => setPreferredLength(parseInt(v))}
                    >
                      <SelectTrigger id="session-length">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SESSION_LENGTHS.map((length) => (
                          <SelectItem key={length.value} value={length.value.toString()}>
                            {length.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notification-time" className="text-base">
                      Daily Reminder Time
                    </Label>
                    <input
                      type="time"
                      id="notification-time"
                      value={notificationTime}
                      onChange={(e) => setNotificationTime(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send you a gentle reminder to practice mindfulness
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={loading || !canProceed()}
                >
                  {loading ? "Setting up..." : "Get Started"}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          You can change these settings anytime in your profile
        </p>
      </div>
    </div>
  );
}
