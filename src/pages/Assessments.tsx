import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssessmentAnalytics from "@/components/AssessmentAnalytics";
import AssessmentScheduler from "@/components/AssessmentScheduler";
import AssessmentComparison from "@/components/AssessmentComparison";
import AssessmentProviderShare from "@/components/AssessmentProviderShare";
import CrisisInterventionFlow from "@/components/CrisisInterventionFlow";
import AssessmentGoals from "@/components/AssessmentGoals";
import { generateAssessmentPDF } from "@/lib/pdfExport";
import {
  Brain,
  Heart,
  Target,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  BookOpen,
  Download,
  TrendingUp,
  Calendar,
  FileText,
  Share2,
} from "lucide-react";
import SelfAssessment from "@/components/SelfAssessment";
import AssessmentDetailedResults from "@/components/AssessmentDetailedResults";
import type { AssessmentResult } from "@/components/SelfAssessment";
import {
  getAvailableAssessments,
  getAssessmentHistoryWithInsights,
  exportAssessmentResults,
  type AssessmentType,
  type AssessmentResultWithInsights,
} from "@/lib/assessmentService";

// Icons and colors
const assessmentIcons = {
  phq9: Heart,
  gad7: Brain,
  pss10: Target,
  sleep_hygiene: Clock,
};

const assessmentColors = {
  phq9: "text-blue-500",
  gad7: "text-purple-500",
  pss10: "text-orange-500",
  sleep_hygiene: "text-indigo-500",
};

const assessmentBgColors = {
  phq9: "bg-blue-100",
  gad7: "bg-purple-100",
  pss10: "bg-orange-100",
  sleep_hygiene: "bg-indigo-100",
};

const categories = [
  { key: "all", label: "All Assessments", icon: BarChart3 },
  { key: "Mental Health", label: "Mental Health", icon: Heart },
  { key: "Stress", label: "Stress", icon: Target },
  { key: "Sleep", label: "Sleep", icon: Clock },
];

export default function Assessments() {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [assessmentResults, setAssessmentResults] = useState<Record<string, AssessmentResult>>({});
  const [availableAssessments, setAvailableAssessments] = useState<any[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResultWithInsights[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assessments");
  const [detailedResultsAssessment, setDetailedResultsAssessment] = useState<AssessmentType | null>(null);
  const [showCrisisFlow, setShowCrisisFlow] = useState(false);
  const [crisisAssessmentData, setCrisisAssessmentData] = useState<{ type: AssessmentType; score: number; severity: string } | null>(null);
  const [showProviderShare, setShowProviderShare] = useState(false);
  const [shareAssessmentType, setShareAssessmentType] = useState<AssessmentType | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [assessments, history] = await Promise.all([
          getAvailableAssessments(),
          getAssessmentHistoryWithInsights("phq9", 5),
        ]);

        setAvailableAssessments(assessments);
        setAssessmentHistory(history);
      } catch (error) {
        console.error("Error loading assessment data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAssessments =
    selectedCategory === "all"
      ? availableAssessments
      : availableAssessments.filter((a) => a.category === selectedCategory);

  const handleAssessmentComplete = async (assessmentId: AssessmentType, result: AssessmentResult) => {
    setAssessmentResults((prev) => ({ ...prev, [assessmentId]: result }));
    setSelectedAssessment(null);

    // Check if crisis intervention is needed
    if (result.level === 'severe' || result.level === 'moderately_severe') {
      setCrisisAssessmentData({
        type: assessmentId,
        score: result.score,
        severity: result.level
      });
      setShowCrisisFlow(true);
    }

    try {
      const history = await getAssessmentHistoryWithInsights(assessmentId, 5);
      setAssessmentHistory((prev) => [...history, ...prev.filter((h) => h.assessment_type !== assessmentId)]);
    } catch (error) {
      console.error("Error refreshing assessment history:", error);
    }
  };

  const getAssessmentStatus = (assessmentId: AssessmentType) => {
    const result = assessmentResults[assessmentId];
    if (!result) return null;

    const getStatusColor = (level: string) => {
      switch (level) {
        case "minimal":
          return "text-green-600";
        case "mild":
          return "text-yellow-600";
        case "moderate":
          return "text-orange-600";
        case "moderately_severe":
          return "text-red-600";
        case "severe":
          return "text-red-700";
        default:
          return "text-gray-600";
      }
    };

    return {
      level: result.level,
      score: result.score,
      color: getStatusColor(result.level),
    };
  };

  const handleExportResults = () => {
    const results = Object.values(assessmentResults);
    if (results.length === 0) return;

    const csvContent = exportAssessmentResults(results as any);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assessment-results-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async (assessmentType: AssessmentType) => {
    try {
      const history = await getAssessmentHistoryWithInsights(assessmentType, 10);
      if (history.length === 0) {
        alert('No assessment results to export');
        return;
      }
      generateAssessmentPDF(history);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    }
  };

  const handleShareWithProvider = (assessmentType: AssessmentType) => {
    setShareAssessmentType(assessmentType);
    setShowProviderShare(true);
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="comparison">Compare</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            {/* Important Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Important Notice</h3>
                    <p className="text-sm text-blue-800">
                      These assessments are screening tools only and do not replace professional diagnosis. If you're
                      experiencing a mental health crisis, please contact emergency services or a mental health
                      professional immediately.
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
              {isLoading ? (
                <div className="col-span-2 text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading assessments...</p>
                </div>
              ) : (
                filteredAssessments.map((assessment) => {
                  const Icon = assessmentIcons[assessment.id as AssessmentType];
                  const color = assessmentColors[assessment.id as AssessmentType];
                  const bgColor = assessmentBgColors[assessment.id as AssessmentType];
                  const status = getAssessmentStatus(assessment.id as AssessmentType);

                  return (
                    <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${bgColor}`}>
                              <Icon className={`h-6 w-6 ${color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{assessment.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{assessment.category}</p>
                            </div>
                          </div>
                          {(assessment.id === "phq9" || assessment.id === "gad7") && (
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
                            {assessment.duration_minutes || "5"} minutes
                          </div>
                          {status && (
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-4 w-4" />
                              <span className={status.color}>
                                {status.level.replace("_", " ")} ({status.score} points)
                              </span>
                            </div>
                          )}
                        </div>

                        {status ? (
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setSelectedAssessment(assessment.id as AssessmentType)}
                            >
                              Retake Assessment
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
                              onClick={() => setDetailedResultsAssessment(assessment.id as AssessmentType)}
                            >
                              View Detailed Results
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full"
                            onClick={() => setSelectedAssessment(assessment.id as AssessmentType)}
                          >
                            Start Assessment
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Assessment Analytics</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {availableAssessments.map((assessment) => (
                  <div key={assessment.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{assessment.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportPDF(assessment.id as AssessmentType)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareWithProvider(assessment.id as AssessmentType)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                    <AssessmentAnalytics assessmentType={assessment.id as AssessmentType} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <AssessmentComparison />
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <AssessmentGoals 
              currentResults={Object.fromEntries(
                Object.entries(assessmentResults).map(([key, result]) => [
                  key,
                  { score: result.score, severity: result.level }
                ])
              ) as any}
            />
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <AssessmentScheduler />
          </TabsContent>

          {/* History Tab - Removed, moved to Analytics */}
          <TabsContent value="history" className="space-y-6" style={{display: 'none'}}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Assessment History</h2>
                {assessmentHistory.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleExportResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>

              {assessmentHistory.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Assessment History</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete your first assessment to see your progress here.
                    </p>
                    <Button onClick={() => setActiveTab("assessments")}>Take Assessment</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {assessmentHistory.map((result) => {
                    const Icon = assessmentIcons[result.assessment_type];
                    const color = assessmentColors[result.assessment_type];
                    const bgColor = assessmentBgColors[result.assessment_type];

                    return (
                      <Card key={result.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${bgColor}`}>
                                <Icon className={`h-5 w-5 ${color}`} />
                              </div>
                              <div>
                                <h3 className="font-semibold">{result.assessment_type.toUpperCase()}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(result.completed_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{result.score}</div>
                              <Badge
                                className={`${
                                  getAssessmentStatus(result.assessment_type)?.color || "text-gray-600"
                                }`}
                              >
                                {result.severity.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>

                          {result.previous_score !== undefined && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <TrendingUp className="h-4 w-4" />
                              <span>
                                Previous: {result.previous_score} points{" "}
                                {result.score_trend === "improving" && "(Improving)"}
                                {result.score_trend === "declining" && "(Declining)"}
                                {result.score_trend === "stable" && "(Stable)"}
                              </span>
                            </div>
                          )}

                          <p className="text-sm text-muted-foreground">{result.interpretation}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Assessment Insights</h2>

              {assessmentHistory.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Insights Available</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete multiple assessments to see trends and insights.
                    </p>
                    <Button onClick={() => setActiveTab("assessments")}>Take Assessment</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Progress Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Assessments</span>
                          <span className="font-semibold">{assessmentHistory.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Latest Score</span>
                          <span className="font-semibold">{assessmentHistory[0]?.score}</span>
                        </div>
                        {assessmentHistory[0]?.previous_score && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Previous Score</span>
                            <span className="font-semibold">{assessmentHistory[0].previous_score}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {assessmentHistory.slice(0, 3).map((result) => (
                          <div key={result.id} className="flex justify-between items-center">
                            <span className="text-sm">{result.assessment_type.toUpperCase()}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{result.score}</span>
                              <Badge variant="outline" className="text-xs">
                                {result.severity.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
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
                    <strong className="text-red-900">National Suicide Prevention Lifeline:</strong>{" "}
                    <a href="tel:988" className="text-red-900 underline font-semibold">
                      988
                    </a>
                  </div>
                  <div className="text-sm">
                    <strong className="text-red-900">Crisis Text Line:</strong>{" "}
                    <span className="text-red-900">Text HOME to 741741</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />

      {/* Assessment Dialog */}
      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assessment</DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <SelfAssessment
              assessmentType={selectedAssessment}
              onComplete={(result) => handleAssessmentComplete(selectedAssessment, result)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detailed Results Dialog */}
      <Dialog
        open={!!detailedResultsAssessment}
        onOpenChange={() => setDetailedResultsAssessment(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detailed Assessment Results</DialogTitle>
          </DialogHeader>
          {detailedResultsAssessment && assessmentResults[detailedResultsAssessment] && (
            <AssessmentDetailedResults
              assessmentType={detailedResultsAssessment}
              result={assessmentResults[detailedResultsAssessment]}
              onClose={() => setDetailedResultsAssessment(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Crisis Intervention Flow */}
      {crisisAssessmentData && (
        <CrisisInterventionFlow
          open={showCrisisFlow}
          onOpenChange={setShowCrisisFlow}
          assessmentType={crisisAssessmentData.type}
          score={crisisAssessmentData.score}
          severity={crisisAssessmentData.severity}
        />
      )}

      {/* Provider Share Dialog */}
      {shareAssessmentType && (
        <AssessmentProviderShare
          results={assessmentHistory.filter(h => h.assessment_type === shareAssessmentType)}
          assessmentType={shareAssessmentType}
          open={showProviderShare}
          onOpenChange={setShowProviderShare}
        />
      )}
    </div>
  );
}
