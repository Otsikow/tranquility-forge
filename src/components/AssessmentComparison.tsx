import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Brain,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  getAssessmentHistoryWithInsights,
  type AssessmentType,
  type AssessmentResultWithInsights,
} from "@/lib/assessmentService";
import { generateComparisonPDF } from "@/lib/pdfExport";

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

const assessmentNames = {
  phq9: "Depression (PHQ-9)",
  gad7: "Anxiety (GAD-7)",
  pss10: "Stress (PSS-10)",
  sleep_hygiene: "Sleep Hygiene",
};

export default function AssessmentComparison() {
  const [allResults, setAllResults] = useState<
    Record<AssessmentType, AssessmentResultWithInsights[]>
  >({
    phq9: [],
    gad7: [],
    pss10: [],
    sleep_hygiene: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadAllAssessments = async () => {
      try {
        setIsLoading(true);
        const types: AssessmentType[] = ["phq9", "gad7", "pss10", "sleep_hygiene"];
        const results = await Promise.all(
          types.map(async (type) => {
            const history = await getAssessmentHistoryWithInsights(type, 10);
            return { type, history };
          })
        );

        const newResults: Record<AssessmentType, AssessmentResultWithInsights[]> = {
          phq9: [],
          gad7: [],
          pss10: [],
          sleep_hygiene: [],
        };

        results.forEach(({ type, history }) => {
          newResults[type] = history;
        });

        setAllResults(newResults);
      } catch (error) {
        console.error("Error loading assessments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllAssessments();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minimal":
        return "bg-green-100 text-green-800";
      case "mild":
        return "bg-yellow-100 text-yellow-800";
      case "moderate":
        return "bg-orange-100 text-orange-800";
      case "moderately_severe":
        return "bg-red-100 text-red-800";
      case "severe":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "declining":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleExportComparison = () => {
    generateComparisonPDF(allResults);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading assessment data...</p>
      </div>
    );
  }

  const hasAnyData = Object.values(allResults).some((results) => results.length > 0);

  if (!hasAnyData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Assessment Data</h3>
          <p className="text-muted-foreground">
            Complete multiple assessments to compare your mental health metrics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Assessment Comparison</h2>
          <p className="text-muted-foreground">
            View and compare your mental health metrics across different assessments
          </p>
        </div>
        {hasAnyData && (
          <Button variant="outline" onClick={handleExportComparison}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(allResults) as AssessmentType[]).map((type) => {
              const results = allResults[type];
              const latest = results[0];
              const Icon = assessmentIcons[type];
              const color = assessmentColors[type];
              const bgColor = assessmentBgColors[type];

              return (
                <Card key={type}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${bgColor}`}>
                          <Icon className={`h-6 w-6 ${color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{assessmentNames[type]}</h3>
                          <p className="text-sm text-muted-foreground">
                            {results.length} assessment{results.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {latest ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Latest Score</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{latest.score}</span>
                            {latest.score_trend && getTrendIcon(latest.score_trend)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Severity</span>
                          <Badge className={getSeverityColor(latest.severity)}>
                            {latest.severity.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Last Taken</span>
                          <span className="text-sm">
                            {new Date(latest.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                        {results.length > 1 && (
                          <div className="pt-2 border-t">
                            <div className="text-sm text-muted-foreground mb-1">Progress</div>
                            <div className="flex items-center gap-2">
                              {latest.score_trend === "improving" && (
                                <span className="text-sm text-green-600 font-medium">
                                  ↓ Scores decreasing (Improving)
                                </span>
                              )}
                              {latest.score_trend === "declining" && (
                                <span className="text-sm text-red-600 font-medium">
                                  ↑ Scores increasing (Declining)
                                </span>
                              )}
                              {latest.score_trend === "stable" && (
                                <span className="text-sm text-gray-600 font-medium">
                                  → Scores stable
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No assessments completed yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          {(Object.keys(allResults) as AssessmentType[]).map((type) => {
            const results = allResults[type];
            if (results.length === 0) return null;

            const Icon = assessmentIcons[type];
            const color = assessmentColors[type];
            const bgColor = assessmentBgColors[type];
            const maxScore = Math.max(...results.map((r) => r.score));

            return (
              <Card key={type}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <CardTitle>{assessmentNames[type]} Trend</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.slice(0, 10).map((result, index) => {
                      const barWidth = maxScore > 0 ? (result.score / maxScore) * 100 : 0;
                      const isLatest = index === 0;

                      return (
                        <div key={result.id} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                {new Date(result.completed_at).toLocaleDateString()}
                              </span>
                              {isLatest && (
                                <Badge variant="secondary" className="text-xs">
                                  Latest
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{result.score}</span>
                              {result.score_trend && getTrendIcon(result.score_trend)}
                            </div>
                          </div>
                          <div className="relative h-6 bg-muted rounded overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 ${
                                result.severity === "minimal"
                                  ? "bg-green-500"
                                  : result.severity === "mild"
                                  ? "bg-yellow-500"
                                  : result.severity === "moderate"
                                  ? "bg-orange-500"
                                  : result.severity === "moderately_severe"
                                  ? "bg-red-500"
                                  : "bg-red-600"
                              } transition-all`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Correlations Tab */}
        <TabsContent value="correlations" className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Understanding Correlations</h3>
                  <p className="text-sm text-blue-800">
                    Mental health symptoms often overlap. For example, poor sleep can affect mood
                    and stress levels. Use this data to identify patterns in your well-being.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Correlations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(allResults).map(([type, results]) => {
                  if (results.length === 0) return null;
                  const latest = results[0];

                  return (
                    <div key={type} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${assessmentBgColors[type as AssessmentType]}`}>
                          {(() => {
                            const Icon = assessmentIcons[type as AssessmentType];
                            return <Icon className={`h-5 w-5 ${assessmentColors[type as AssessmentType]}`} />;
                          })()}
                        </div>
                        <div>
                          <h4 className="font-semibold">{assessmentNames[type as AssessmentType]}</h4>
                          <p className="text-sm text-muted-foreground">
                            Current: {latest.severity.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{latest.score}</div>
                        {latest.score_trend && (
                          <div className="flex items-center gap-1 justify-end">
                            {getTrendIcon(latest.score_trend)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {latest.score_trend}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
