import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Brain, 
  Heart, 
  Target, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  BookOpen
} from "lucide-react";
import SelfAssessment from "@/components/SelfAssessment";
import type { AssessmentResult } from "@/components/SelfAssessment";

const availableAssessments = [
  {
    id: 'phq9',
    name: 'PHQ-9 Depression Screening',
    description: 'A validated 9-question screening tool for depression',
    duration: '5-10 minutes',
    icon: Heart,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    category: 'Mental Health',
    lastTaken: null,
    recommended: true
  },
  {
    id: 'gad7',
    name: 'GAD-7 Anxiety Screening',
    description: 'A validated 7-question screening tool for anxiety',
    duration: '3-5 minutes',
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    category: 'Mental Health',
    lastTaken: null,
    recommended: true
  },
  {
    id: 'pss10',
    name: 'PSS-10 Stress Scale',
    description: 'A 10-question scale to measure perceived stress',
    duration: '5 minutes',
    icon: Target,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    category: 'Stress',
    lastTaken: null,
    recommended: false
  },
  {
    id: 'sleep_hygiene',
    name: 'Sleep Hygiene Assessment',
    description: 'Evaluate your sleep habits and quality',
    duration: '3-5 minutes',
    icon: Clock,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
    category: 'Sleep',
    lastTaken: null,
    recommended: false
  }
];

const categories = [
  { key: 'all', label: 'All Assessments', icon: BarChart3 },
  { key: 'Mental Health', label: 'Mental Health', icon: Heart },
  { key: 'Stress', label: 'Stress', icon: Target },
  { key: 'Sleep', label: 'Sleep', icon: Clock }
];

export default function Assessments() {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [assessmentResults, setAssessmentResults] = useState<Record<string, AssessmentResult>>({});

  const filteredAssessments = selectedCategory === 'all' 
    ? availableAssessments 
    : availableAssessments.filter(a => a.category === selectedCategory);

  const handleAssessmentComplete = (assessmentId: string, result: AssessmentResult) => {
    setAssessmentResults(prev => ({ ...prev, [assessmentId]: result }));
    setSelectedAssessment(null);
  };

  const getAssessmentStatus = (assessmentId: string) => {
    const result = assessmentResults[assessmentId];
    if (!result) return null;
    
    const getStatusColor = (level: string) => {
      switch (level) {
        case 'minimal': return 'text-green-600';
        case 'mild': return 'text-yellow-600';
        case 'moderate': return 'text-orange-600';
        case 'moderately_severe': return 'text-red-600';
        case 'severe': return 'text-red-700';
        default: return 'text-gray-600';
      }
    };

    return {
      level: result.level,
      score: result.score,
      color: getStatusColor(result.level)
    };
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Mental Health Assessments" showBack={false} />

      <div className="px-6 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Self-Assessment Tools</h1>
          <p className="text-muted-foreground">
            Take validated mental health screenings to better understand your wellbeing
          </p>
        </div>

        {/* Important Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Important Notice</h3>
                <p className="text-sm text-blue-800">
                  These assessments are screening tools only and do not replace professional diagnosis. 
                  If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssessments.map((assessment) => {
            const Icon = assessment.icon;
            const status = getAssessmentStatus(assessment.id);
            
            return (
              <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${assessment.bgColor}`}>
                        <Icon className={`h-6 w-6 ${assessment.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{assessment.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{assessment.category}</p>
                      </div>
                    </div>
                    {assessment.recommended && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Recommended
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{assessment.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {assessment.duration}
                    </div>
                    {status && (
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        <span className={status.color}>
                          {status.level.replace('_', ' ')} ({status.score} points)
                        </span>
                      </div>
                    )}
                  </div>

                  {status ? (
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedAssessment(assessment.id)}
                      >
                        Retake Assessment
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          // Show detailed results
                          console.log('Show results for', assessment.id);
                        }}
                      >
                        View Detailed Results
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => setSelectedAssessment(assessment.id)}
                    >
                      Start Assessment
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Crisis Resources */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Crisis Support</h3>
                <p className="text-sm text-red-800 mb-3">
                  If you're having thoughts of self-harm or suicide, please reach out for immediate help:
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong className="text-red-900">National Suicide Prevention Lifeline:</strong>
                    <span className="text-red-800 ml-2">988</span>
                  </div>
                  <div className="text-sm">
                    <strong className="text-red-900">Crisis Text Line:</strong>
                    <span className="text-red-800 ml-2">Text HOME to 741741</span>
                  </div>
                  <div className="text-sm">
                    <strong className="text-red-900">Emergency Services:</strong>
                    <span className="text-red-800 ml-2">911</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Dialog */}
      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAssessment && availableAssessments.find(a => a.id === selectedAssessment)?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <SelfAssessment
              assessmentType={selectedAssessment as 'phq9' | 'gad7'}
              onComplete={(result) => handleAssessmentComplete(selectedAssessment, result)}
              onClose={() => setSelectedAssessment(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}