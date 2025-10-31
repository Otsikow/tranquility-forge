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
  TrendingUp
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { 
  assessmentDefinitions, 
  calculateSeverity, 
  generateInterpretation,
  saveAssessmentProgress,
  getAssessmentProgress,
  completeAssessment,
  type AssessmentType,
  type AssessmentSeverity
} from "@/lib/assessmentService";

export interface AssessmentResult {
  score: number;
  level: AssessmentSeverity;
  interpretation: string;
  recommendations: string[];
  resources: string[];
}

const assessmentIcons = {
  phq9: Heart,
  gad7: Brain,
  pss10: Target,
  sleep_hygiene: Moon
};

const assessmentColors = {
  phq9: "text-blue-500",
  gad7: "text-purple-500", 
  pss10: "text-orange-500",
  sleep_hygiene: "text-indigo-500"
};

interface SelfAssessmentProps {
  assessmentType: AssessmentType;
  onComplete?: (result: AssessmentResult) => void;
  onClose?: () => void;
}

export default function SelfAssessment({ assessmentType, onComplete, onClose }: SelfAssessmentProps) {
  const { logActivity } = useUserProfile();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const assessment = assessmentDefinitions[assessmentType];
  const Icon = assessmentIcons[assessmentType];
  const color = assessmentColors[assessmentType];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  // Load existing progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await getAssessmentProgress(assessmentType);
        if (progress) {
          setCurrentQuestion(progress.current_question);
          setAnswers(progress.answers);
        }
      } catch (error) {
        console.error('Error loading assessment progress:', error);
      }
    };

    loadProgress();
  }, [assessmentType]);

  const handleAnswer = async (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Save progress
    try {
      await saveAssessmentProgress(assessmentType, currentQuestion, newAnswers);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
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

  const calculateResult = async () => {
    setIsLoading(true);
    try {
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
      
      // Check for crisis indicators (suicidal ideation in PHQ-9)
      if (assessmentType === 'phq9' && answers.suicidal >= 1) {
        // Show crisis warning before completing assessment
        const confirmed = window.confirm(
          'Your responses indicate you may be having thoughts of self-harm. ' +
          'If you are in immediate danger, please call 988 (Suicide Prevention Lifeline) or 911. ' +
          'Do you want to continue with the assessment?'
        );
        
        if (!confirmed) {
          setIsLoading(false);
          return;
        }
      }
      
      // Complete assessment in database
      const dbResult = await completeAssessment(assessmentType, totalScore, answers);

      // Log activity for analytics/achievements
      try {
        await logActivity('assessment_completed', undefined, undefined, {
          assessment_type: assessmentType,
          score: totalScore,
          severity: dbResult.severity,
        });
      } catch (e) {
        // Non-blocking
        console.warn('Activity log failed', e);
      }
      
      const assessmentResult: AssessmentResult = {
        score: totalScore,
        level: dbResult.severity,
        interpretation: dbResult.interpretation || '',
        recommendations: dbResult.recommendations || [],
        resources: dbResult.resources || []
      };

      setResult(assessmentResult);
      setIsCompleted(true);

      onComplete?.(assessmentResult);
    } catch (error) {
      console.error('Error completing assessment:', error);
      // Fallback to local calculation
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
      const level = calculateSeverity(assessmentType, totalScore);
      const { interpretation, recommendations, resources } = generateInterpretation(assessmentType, totalScore, level);
      
      const assessmentResult: AssessmentResult = {
        score: totalScore,
        level,
        interpretation,
        recommendations,
        resources
      };

      setResult(assessmentResult);
      try {
        await logActivity('assessment_completed_local', undefined, undefined, {
          assessment_type: assessmentType,
          score: totalScore,
          severity: level,
        });
      } catch {}
      setIsCompleted(true);

      onComplete?.(assessmentResult);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setResult(null);
  };

  const getLevelColor = (level: AssessmentSeverity) => {
    switch (level) {
      case 'minimal': return 'text-green-500';
      case 'mild': return 'text-yellow-500';
      case 'moderate': return 'text-orange-500';
      case 'moderately_severe': return 'text-red-500';
      case 'severe': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getLevelBadgeColor = (level: AssessmentSeverity) => {
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
            <Icon className={`h-8 w-8 ${color}`} />
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
              out of {assessment.max_score} total points
            </div>
            <Badge className={`${getLevelBadgeColor(result.level)} text-sm px-3 py-1`}>
              {result.level.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Crisis Warning for severe results */}
          {result.level === 'severe' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">Important Notice</h4>
                  <p className="text-sm text-red-800 mb-3">
                    Your responses suggest severe symptoms. Please consider reaching out for immediate professional help.
                  </p>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong className="text-red-900">Crisis Support:</strong>
                      <a href="tel:988" className="text-red-800 ml-2 font-semibold hover:underline">988</a>
                    </div>
                    <div>
                      <strong className="text-red-900">Emergency Services:</strong>
                      <a href="tel:911" className="text-red-800 ml-2 font-semibold hover:underline">911</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={resetAssessment} className="flex-1">
              Retake Assessment
            </Button>
            <Button onClick={onClose} className="flex-1">
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
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
          <h2 className="text-lg sm:text-xl font-bold">{assessment.name}</h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">{assessment.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Question */}
        <div className="space-y-3 sm:space-y-4">
          <h3 
            id={`question-${currentQ.id}`}
            className="text-base sm:text-lg font-semibold leading-tight"
          >
            {currentQ.text}
          </h3>
          
          <RadioGroup
            value={answers[currentQ.id]?.toString()}
            onValueChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
            className="space-y-2 sm:space-y-3"
            role="radiogroup"
            aria-labelledby={`question-${currentQ.id}`}
          >
            {currentQ.options.map((option) => (
              <div key={option.value} className="flex items-start space-x-2 sm:space-x-3">
                <RadioGroupItem 
                  value={option.value.toString()} 
                  id={`${currentQ.id}-${option.value}`}
                  className="mt-1 flex-shrink-0"
                  aria-describedby={option.description ? `${currentQ.id}-${option.value}-desc` : undefined}
                />
                <Label 
                  htmlFor={`${currentQ.id}-${option.value}`}
                  className="flex-1 cursor-pointer p-2 sm:p-3 rounded-lg border border-border hover:bg-muted/50 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-colors min-h-[60px] flex items-center"
                >
                  <div>
                    <div className="font-medium text-sm sm:text-base">{option.label}</div>
                    {option.description && (
                      <div 
                        id={`${currentQ.id}-${option.value}-desc`}
                        className="text-xs sm:text-sm text-muted-foreground mt-1"
                      >
                        {option.description}
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="gap-2 order-2 sm:order-1"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered || isLoading}
            className="gap-2 order-1 sm:order-2"
            size="sm"
          >
            {isLoading ? 'Processing...' : currentQuestion === assessment.questions.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}