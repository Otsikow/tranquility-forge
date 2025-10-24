import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Heart, 
  Target, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Moon,
  TrendingDown,
  TrendingUp,
  Minus,
  Loader2,
  History,
  Calendar
} from "lucide-react";
import SelfAssessment from "@/components/SelfAssessment";
import type { AssessmentResult as ComponentAssessmentResult } from "@/components/SelfAssessment";
import { useAssessments } from "@/hooks/useAssessments";
import type { AssessmentType, AssessmentHistory, AssessmentResult as DBAssessmentResult } from "@/types/db";
import { format } from "date-fns";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const availableAssessments = [
  {
    id: 'phq9' as AssessmentType,
    name: 'PHQ-9 Depression Screening',
    description: 'A validated 9-question screening tool for depression',
    duration: '5-10 minutes',
    icon: Heart,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    category: 'Mental Health',
    maxScore: 27,
    recommended: true
  },
  {
    id: 'gad7' as AssessmentType,
    name: 'GAD-7 Anxiety Screening',
    description: 'A validated 7-question screening tool for anxiety',
    duration: '3-5 minutes',
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    category: 'Mental Health',
    maxScore: 21,
    recommended: true
  },
  {
    id: 'pss10' as AssessmentType,
    name: 'PSS-10 Stress Scale',
    description: 'A 10-question scale to measure perceived stress',
    duration: '5 minutes',
    icon: Target,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    category: 'Stress',
    maxScore: 40,
    recommended: false
  },
  {
    id: 'sleep_hygiene' as AssessmentType,
    name: 'Sleep Hygiene Assessment',
    description: 'Evaluate your sleep habits and quality',
    duration: '3-5 minutes',
    icon: Moon,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
    category: 'Sleep',
    maxScore: 40,
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
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [latestResults, setLatestResults] = useState<Record<AssessmentType, AssessmentHistory | null>>({
    phq9: null,
    gad7: null,
    pss10: null,
    sleep_hygiene: null
  });
  const [detailedResult, setDetailedResult] = useState<DBAssessmentResult | null>(null);
  const [historyData, setHistoryData] = useState<AssessmentHistory[]>([]);
  const [selectedHistoryAssessment, setSelectedHistoryAssessment] = useState<AssessmentType | null>(null);

  const { 
    getLatestAssessments, 
    getAssessmentById, 
    getAssessmentHistory, 
    loading 
  } = useAssessments();

  useEffect(() => {
    loadLatestResults();
  }, []);

  const loadLatestResults = async () => {
    const results = await getLatestAssessments();
    setLatestResults(results);
  };

  const loadHistory = async (assessmentType: AssessmentType) => {
    const history = await getAssessmentHistory(assessmentType, 20);
    setHistoryData(history);
    setSelectedHistoryAssessment(assessmentType);
  };

  const filteredAssessments = selectedCategory === 'all' 
    ? availableAssessments 
    : availableAssessments.filter(a => a.category === selectedCategory);

  const handleAssessmentComplete = () => {
    loadLatestResults();
    setSelectedAssessment(null);
  };

  const handleViewDetails = async (assessmentId: AssessmentType) => {
    const latest = latestResults[assessmentId];
    if (latest) {
      const detailed = await getAssessmentById(latest.id);
      setDetailedResult(detailed);
    }
  };

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

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'bg-green-100 text-green-800';
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'moderately_severe': return 'bg-red-100 text-red-800';
      case 'severe': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (history: AssessmentHistory[]) => {
    if (history.length < 2) return <Minus className="h-4 w-4" />;
    
    const latest = history[0].score;
    const previous = history[1].score;
    
    if (latest < previous) return <TrendingDown className="h-4 w-4 text-green-600" />;
    if (latest > previous) return <TrendingUp className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
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

        {/* Tabs for Assessments and History */}
        <Tabs defaultValue="assessments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="space-y-6">
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssessments.map((assessment) => {
                  const Icon = assessment.icon;
                  const latest = latestResults[assessment.id];
                  
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
                          {latest && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span className="text-xs">
                                {format(new Date(latest.completed_at), 'MMM d')}
                              </span>
                            </div>
                          )}
                        </div>

                        {latest && (
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <div className="text-sm font-medium text-muted-foreground">Last Score</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`font-semibold ${getStatusColor(latest.severity_level)}`}>
                                  {latest.score}/{assessment.maxScore}
                                </span>
                                <Badge className={`${getLevelBadgeColor(latest.severity_level)} text-xs`}>
                                  {latest.severity_level.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        {latest ? (
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setSelectedAssessment(assessment.id)}
                            >
                              Retake Assessment
                            </Button>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewDetails(assessment.id)}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => loadHistory(assessment.id)}
                              >
                                <History className="h-4 w-4 mr-1" />
                                History
                              </Button>
                            </div>
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
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {selectedHistoryAssessment ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {availableAssessments.find(a => a.id === selectedHistoryAssessment)?.name} History
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedHistoryAssessment(null)}
                  >
                    View All
                  </Button>
                </div>

                {historyData.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Score Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={[...historyData].reverse()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="completed_at" 
                            tickFormatter={(date) => format(new Date(date), 'MMM d')}
                            fontSize={12}
                          />
                          <YAxis fontSize={12} />
                          <Tooltip 
                            labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                            formatter={(value: number) => [`Score: ${value}`, '']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  {historyData.map((result, index) => (
                    <Card key={result.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {result.score}/{result.max_score}
                              </span>
                              <Badge className={`${getLevelBadgeColor(result.severity_level)} text-xs`}>
                                {result.severity_level.replace('_', ' ')}
                              </Badge>
                              {index < historyData.length - 1 && getTrendIcon([result, historyData[index + 1]])}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {format(new Date(result.completed_at), 'MMMM d, yyyy • h:mm a')}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={async () => {
                              const detailed = await getAssessmentById(result.id);
                              setDetailedResult(detailed);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No History Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select an assessment from the Assessments tab to view its history
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
              assessmentType={selectedAssessment}
              onComplete={handleAssessmentComplete}
              onClose={() => setSelectedAssessment(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detailed Results Dialog */}
      <Dialog open={!!detailedResult} onOpenChange={() => setDetailedResult(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assessment Results</DialogTitle>
          </DialogHeader>
          {detailedResult && (
            <div className="space-y-6">
              {/* Score */}
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {detailedResult.score}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  out of {detailedResult.max_score} total points
                </div>
                <Badge className={`${getLevelBadgeColor(detailedResult.severity_level)} text-sm px-3 py-1`}>
                  {detailedResult.severity_level.replace('_', ' ').toUpperCase()}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(detailedResult.completed_at), 'MMMM d, yyyy • h:mm a')}
                </p>
              </div>

              {/* Interpretation */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Interpretation</h4>
                <p className="text-sm text-muted-foreground">{detailedResult.interpretation}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {detailedResult.recommendations.map((rec, index) => (
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
                  {detailedResult.resources.map((resource, index) => (
                    <Badge key={index} variant="secondary">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={() => setDetailedResult(null)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
