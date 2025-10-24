import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Heart, 
  Moon, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Target,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAssessments } from "@/hooks/useAssessments";
import { useToast } from "@/hooks/use-toast";

interface AssessmentQuestion {
  id: string;
  text: string;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
}

export interface AssessmentResult {
  score: number;
  level: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  interpretation: string;
  recommendations: string[];
  resources: string[];
}

const PHQ9Questions: AssessmentQuestion[] = [
  {
    id: "interest",
    text: "Little interest or pleasure in doing things",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "mood",
    text: "Feeling down, depressed, or hopeless",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "sleep",
    text: "Trouble falling or staying asleep, or sleeping too much",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "energy",
    text: "Feeling tired or having little energy",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "appetite",
    text: "Poor appetite or overeating",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "self_esteem",
    text: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "concentration",
    text: "Trouble concentrating on things, such as reading the newspaper or watching television",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "movement",
    text: "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "suicidal",
    text: "Thoughts that you would be better off dead, or of hurting yourself",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  }
];

const GAD7Questions: AssessmentQuestion[] = [
  {
    id: "nervous",
    text: "Feeling nervous, anxious, or on edge",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "worry",
    text: "Not being able to stop or control worrying",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "worry_excessive",
    text: "Worrying too much about different things",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "trouble_relaxing",
    text: "Trouble relaxing",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "restless",
    text: "Being so restless that it's hard to sit still",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "irritable",
    text: "Becoming easily annoyed or irritable",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  {
    id: "afraid",
    text: "Feeling afraid as if something awful might happen",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  }
];

const PSS10Questions: AssessmentQuestion[] = [
  {
    id: "upset",
    text: "In the last month, how often have you been upset because of something that happened unexpectedly?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "unable_control",
    text: "In the last month, how often have you felt that you were unable to control the important things in your life?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "nervous_stressed",
    text: "In the last month, how often have you felt nervous and stressed?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "confident",
    text: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    options: [
      { value: 4, label: "Never" },
      { value: 3, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Fairly often" },
      { value: 0, label: "Very often" }
    ]
  },
  {
    id: "going_your_way",
    text: "In the last month, how often have you felt that things were going your way?",
    options: [
      { value: 4, label: "Never" },
      { value: 3, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Fairly often" },
      { value: 0, label: "Very often" }
    ]
  },
  {
    id: "could_not_cope",
    text: "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "control_irritations",
    text: "In the last month, how often have you been able to control irritations in your life?",
    options: [
      { value: 4, label: "Never" },
      { value: 3, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Fairly often" },
      { value: 0, label: "Very often" }
    ]
  },
  {
    id: "on_top",
    text: "In the last month, how often have you felt that you were on top of things?",
    options: [
      { value: 4, label: "Never" },
      { value: 3, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Fairly often" },
      { value: 0, label: "Very often" }
    ]
  },
  {
    id: "angered",
    text: "In the last month, how often have you been angered because of things that happened that were outside of your control?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: "difficulties_piling",
    text: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  }
];

const SleepHygieneQuestions: AssessmentQuestion[] = [
  {
    id: "consistent_schedule",
    text: "I go to bed and wake up at approximately the same time each day",
    options: [
      { value: 4, label: "Always (7 days/week)" },
      { value: 3, label: "Usually (5-6 days/week)" },
      { value: 2, label: "Sometimes (3-4 days/week)" },
      { value: 1, label: "Rarely (1-2 days/week)" },
      { value: 0, label: "Never" }
    ]
  },
  {
    id: "sleep_duration",
    text: "I get 7-9 hours of sleep per night",
    options: [
      { value: 4, label: "Always (7 days/week)" },
      { value: 3, label: "Usually (5-6 days/week)" },
      { value: 2, label: "Sometimes (3-4 days/week)" },
      { value: 1, label: "Rarely (1-2 days/week)" },
      { value: 0, label: "Never" }
    ]
  },
  {
    id: "caffeine_timing",
    text: "I avoid caffeine within 6 hours of bedtime",
    options: [
      { value: 4, label: "Always" },
      { value: 3, label: "Usually" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Rarely" },
      { value: 0, label: "Never" }
    ]
  },
  {
    id: "screen_time",
    text: "I avoid screens (phone, TV, computer) for at least 30 minutes before bed",
    options: [
      { value: 4, label: "Always" },
      { value: 3, label: "Usually" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Rarely" },
      { value: 0, label: "Never" }
    ]
  },
  {
    id: "bedroom_environment",
    text: "My bedroom is dark, quiet, and cool",
    options: [
      { value: 4, label: "Always" },
      { value: 3, label: "Usually" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Rarely" },
      { value: 0, label: "Never" }
    ]
  },
  {
    id: "bed_for_sleep",
    text: "I use my bed only for sleep (not work, watching TV, etc.)",
    options: [
      { value: 4, label: "Always" },
      { value: 3, label: "Usually" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Rarely" },
      { value: 0, label: "Never" }
    ]
  },
  {
    id: "exercise_timing",
    text: "I avoid vigorous exercise within 3 hours of bedtime",
    options: [
      { value: 4, label: "Always" },
      { value: 3, label: "Usually" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Rarely" },
      { value: 0, label: "Never" }
    ]
  },
  {
    id: "relaxation_routine",
    text: "I have a relaxing bedtime routine",
    options: [
      { value: 4, label: "Always" },
      { value: 3, label: "Usually" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Rarely" },
      { value: 0, label: "Never" }
    ]
  },
  {
    id: "alcohol_avoidance",
    text: "I avoid alcohol close to bedtime",
    options: [
      { value: 4, label: "Always" },
      { value: 3, label: "Usually" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Rarely" },
      { value: 0, label: "Never" }
    ]
  },
  {
    id: "daytime_naps",
    text: "I avoid long daytime naps (more than 30 minutes)",
    options: [
      { value: 4, label: "Always" },
      { value: 3, label: "Usually" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Rarely" },
      { value: 0, label: "Never" }
    ]
  }
];

const assessments = {
  phq9: {
    name: "PHQ-9 Depression Screening",
    description: "A 9-question screening tool for depression",
    icon: Heart,
    color: "text-blue-500",
    questions: PHQ9Questions,
    maxScore: 27
  },
  gad7: {
    name: "GAD-7 Anxiety Screening", 
    description: "A 7-question screening tool for anxiety",
    icon: Brain,
    color: "text-purple-500",
    questions: GAD7Questions,
    maxScore: 21
  },
  pss10: {
    name: "PSS-10 Stress Scale",
    description: "A 10-question scale to measure perceived stress",
    icon: Target,
    color: "text-orange-500",
    questions: PSS10Questions,
    maxScore: 40
  },
  sleep_hygiene: {
    name: "Sleep Hygiene Assessment",
    description: "Evaluate your sleep habits and quality",
    icon: Moon,
    color: "text-indigo-500",
    questions: SleepHygieneQuestions,
    maxScore: 40
  }
};

interface SelfAssessmentProps {
  assessmentType: keyof typeof assessments;
  onComplete?: (result: AssessmentResult) => void;
  onClose?: () => void;
}

export default function SelfAssessment({ assessmentType, onComplete, onClose }: SelfAssessmentProps) {
  const { logActivity } = useUserProfile();
  const { saveAssessmentResult, loading } = useAssessments();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const assessment = assessments[assessmentType];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    
    let level: AssessmentResult['level'];
    let interpretation: string;
    let recommendations: string[];
    let resources: string[];

    if (assessmentType === 'phq9') {
      if (totalScore <= 4) {
        level = 'minimal';
        interpretation = "Your responses suggest minimal depression symptoms.";
        recommendations = [
          "Continue your current self-care practices",
          "Consider regular mood tracking",
          "Maintain healthy lifestyle habits"
        ];
        resources = ["Mood tracking", "Meditation", "Exercise"];
      } else if (totalScore <= 9) {
        level = 'mild';
        interpretation = "Your responses suggest mild depression symptoms.";
        recommendations = [
          "Consider talking to a healthcare provider",
          "Try mood tracking and meditation",
          "Focus on sleep and exercise"
        ];
        resources = ["Mood tracking", "Meditation", "Sleep resources", "Professional support"];
      } else if (totalScore <= 14) {
        level = 'moderate';
        interpretation = "Your responses suggest moderate depression symptoms.";
        recommendations = [
          "Consider professional mental health support",
          "Try structured self-care routines",
          "Consider therapy or counseling"
        ];
        resources = ["Professional support", "Therapy resources", "Crisis support"];
      } else if (totalScore <= 19) {
        level = 'moderately_severe';
        interpretation = "Your responses suggest moderately severe depression symptoms.";
        recommendations = [
          "Seek professional mental health support",
          "Consider medication evaluation",
          "Build a strong support network"
        ];
        resources = ["Professional support", "Crisis support", "Emergency resources"];
      } else {
        level = 'severe';
        interpretation = "Your responses suggest severe depression symptoms.";
        recommendations = [
          "Seek immediate professional help",
          "Consider crisis support services",
          "Build emergency support plan"
        ];
        resources = ["Crisis support", "Emergency resources", "Professional support"];
      }
    } else if (assessmentType === 'gad7') {
      if (totalScore <= 4) {
        level = 'minimal';
        interpretation = "Your responses suggest minimal anxiety symptoms.";
        recommendations = [
          "Continue stress management practices",
          "Consider regular anxiety tracking",
          "Maintain relaxation routines"
        ];
        resources = ["Breathing exercises", "Meditation", "Stress management"];
      } else if (totalScore <= 9) {
        level = 'mild';
        interpretation = "Your responses suggest mild anxiety symptoms.";
        recommendations = [
          "Try anxiety management techniques",
          "Consider professional guidance",
          "Practice regular relaxation"
        ];
        resources = ["Breathing exercises", "Meditation", "Anxiety management"];
      } else if (totalScore <= 14) {
        level = 'moderate';
        interpretation = "Your responses suggest moderate anxiety symptoms.";
        recommendations = [
          "Consider professional mental health support",
          "Try structured anxiety management",
          "Consider therapy or counseling"
        ];
        resources = ["Professional support", "Therapy resources", "Anxiety management"];
      } else {
        level = 'severe';
        interpretation = "Your responses suggest severe anxiety symptoms.";
        recommendations = [
          "Seek professional mental health support",
          "Consider medication evaluation",
          "Build anxiety management toolkit"
        ];
        resources = ["Professional support", "Crisis support", "Anxiety management"];
      }
    } else if (assessmentType === 'pss10') {
      if (totalScore <= 13) {
        level = 'minimal';
        interpretation = "You are experiencing low perceived stress.";
        recommendations = [
          "Continue your current stress management practices",
          "Maintain work-life balance",
          "Practice preventive self-care"
        ];
        resources = ["Stress management", "Meditation", "Exercise"];
      } else if (totalScore <= 26) {
        level = 'moderate';
        interpretation = "You are experiencing moderate perceived stress.";
        recommendations = [
          "Identify and manage stress triggers",
          "Practice relaxation techniques daily",
          "Consider stress management workshops",
          "Ensure adequate sleep and exercise"
        ];
        resources = ["Breathing exercises", "Meditation", "Time management", "Professional support"];
      } else {
        level = 'severe';
        interpretation = "You are experiencing high perceived stress.";
        recommendations = [
          "Seek professional support for stress management",
          "Review and adjust daily commitments",
          "Practice intensive self-care",
          "Consider therapy or counseling"
        ];
        resources = ["Professional support", "Stress management", "Therapy resources"];
      }
    } else { // sleep_hygiene
      if (totalScore >= 32) {
        level = 'minimal';
        interpretation = "You have excellent sleep hygiene practices.";
        recommendations = [
          "Continue your healthy sleep habits",
          "Share your sleep routine with others",
          "Monitor for any changes in sleep quality"
        ];
        resources = ["Sleep tracking", "Sleep meditation"];
      } else if (totalScore >= 24) {
        level = 'mild';
        interpretation = "Your sleep hygiene is good but has room for improvement.";
        recommendations = [
          "Review areas where you scored lower",
          "Implement one new sleep habit at a time",
          "Track your sleep quality improvements"
        ];
        resources = ["Sleep hygiene guide", "Sleep tracking", "Relaxation techniques"];
      } else if (totalScore >= 16) {
        level = 'moderate';
        interpretation = "Your sleep hygiene needs significant improvement.";
        recommendations = [
          "Create a consistent bedtime routine",
          "Optimize your bedroom environment",
          "Address screen time and caffeine habits",
          "Consider sleep education resources"
        ];
        resources = ["Sleep hygiene guide", "Professional support", "Sleep meditation"];
      } else {
        level = 'severe';
        interpretation = "Your sleep hygiene needs major attention.";
        recommendations = [
          "Consult a healthcare provider about sleep issues",
          "Start with one sleep habit change at a time",
          "Consider a sleep study if problems persist",
          "Address lifestyle factors affecting sleep"
        ];
        resources = ["Professional support", "Sleep specialist", "Sleep hygiene guide"];
      }
    }

    const assessmentResult: AssessmentResult = {
      score: totalScore,
      level,
      interpretation,
      recommendations,
      resources
    };

    setResult(assessmentResult);
    setIsCompleted(true);

    // Save to database
    saveResultToDatabase(assessmentResult);
  };

  const saveResultToDatabase = async (assessmentResult: AssessmentResult) => {
    setIsSaving(true);
    try {
      const savedResult = await saveAssessmentResult(
        assessmentType,
        assessmentResult.score,
        assessment.maxScore,
        assessmentResult.level,
        assessmentResult.interpretation,
        assessmentResult.recommendations,
        assessmentResult.resources,
        answers
      );

      if (savedResult) {
        // Log activity
        logActivity('assessment', savedResult.id, undefined, {
          assessment_type: assessmentType,
          score: assessmentResult.score,
          level: assessmentResult.level
        });

        toast({
          title: "Assessment Complete",
          description: "Your results have been saved successfully.",
        });

        onComplete?.(assessmentResult);
      } else {
        toast({
          title: "Warning",
          description: "Assessment completed but results could not be saved.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment results.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setResult(null);
  };

  const getLevelColor = (level: AssessmentResult['level']) => {
    switch (level) {
      case 'minimal': return 'text-green-500';
      case 'mild': return 'text-yellow-500';
      case 'moderate': return 'text-orange-500';
      case 'moderately_severe': return 'text-red-500';
      case 'severe': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getLevelBadgeColor = (level: AssessmentResult['level']) => {
    switch (level) {
      case 'minimal': return 'bg-green-100 text-green-800';
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'moderately_severe': return 'bg-red-100 text-red-800';
      case 'severe': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isCompleted && result) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <assessment.icon className={`h-8 w-8 ${assessment.color}`} />
            <h2 className="text-2xl font-bold">Assessment Complete</h2>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{assessment.name}</h3>
            <p className="text-muted-foreground">Your results and recommendations</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{result.score}</div>
            <div className="text-sm text-muted-foreground mb-4">
              out of {assessment.maxScore} total points
            </div>
            <Badge className={`${getLevelBadgeColor(result.level)} text-sm px-3 py-1`}>
              {result.level.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Interpretation */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Interpretation</h4>
            <p className="text-sm text-muted-foreground">{result.interpretation}</p>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3">Suggested Resources</h4>
            <div className="flex flex-wrap gap-2">
              {result.resources.map((resource, index) => (
                <Badge key={index} variant="secondary">
                  {resource}
                </Badge>
              ))}
            </div>
          </div>

          {/* Saving Indicator */}
          {isSaving && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving results...
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={resetAssessment} className="flex-1" disabled={isSaving}>
              Retake Assessment
            </Button>
            <Button onClick={onClose} className="flex-1" disabled={isSaving}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = assessment.questions[currentQuestion];
  const isAnswered = answers[currentQ.id] !== undefined;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          <assessment.icon className={`h-6 w-6 ${assessment.color}`} />
          <h2 className="text-xl font-bold">{assessment.name}</h2>
        </div>
        <p className="text-muted-foreground">{assessment.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {currentQ.text}
          </h3>
          
          <RadioGroup
            value={answers[currentQ.id]?.toString()}
            onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
            className="space-y-3"
          >
            {currentQ.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${currentQ.id}-${option.value}`} />
                <Label 
                  htmlFor={`${currentQ.id}-${option.value}`}
                  className="flex-1 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="gap-2"
          >
            {currentQuestion === assessment.questions.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}