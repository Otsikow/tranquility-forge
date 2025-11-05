import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart3,
  Download,
  Target,
  Heart,
  Brain,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  getAssessmentHistoryWithInsights,
  type AssessmentType,
  type AssessmentResultWithInsights,
} from "@/lib/assessmentService";

interface AssessmentAnalyticsProps {
  assessmentType: AssessmentType;
}

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

export default function AssessmentAnalytics({ assessmentType }: AssessmentAnalyticsProps) {
  const [history, setHistory] = useState<AssessmentResultWithInsights[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const Icon = assessmentIcons[assessmentType];
  const color = assessmentColors[assessmentType];

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getAssessmentHistoryWithInsights(assessmentType, 30);
        setHistory(data);
      } catch (error) {
        console.error("Error loading assessment history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [assessmentType]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading analytics...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground">
            Complete multiple assessments to see analytics and trends.
          </p>
        </CardContent>
      </Card>
    );
  }

  const latestResult = history[0];
  const averageScore = Math.round(
    history.reduce((sum, r) => sum + r.score, 0) / history.length
  );
  const lowestScore = Math.min(...history.map((r) => r.score));
  const highestScore = Math.max(...history.map((r) => r.score));

  // Calculate trend over last 30 days
  const recentResults = history.slice(0, 5);
  const olderResults = history.slice(5, 10);
  const recentAvg = recentResults.length
    ? recentResults.reduce((sum, r) => sum + r.score, 0) / recentResults.length
    : 0;
  const olderAvg = olderResults.length
    ? olderResults.reduce((sum, r) => sum + r.score, 0) / olderResults.length
    : recentAvg;
  const overallTrend =
    recentAvg < olderAvg ? "improving" : recentAvg > olderAvg ? "declining" : "stable";

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

  const getTrendIcon = (trend: string) => {
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

  // Create a simple text-based chart
  const maxScore = Math.max(...history.map((r) => r.score));
  const chartHeight = 150;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{latestResult.score}</div>
              <div className="text-sm text-muted-foreground mb-2">Current Score</div>
              <Badge className={getSeverityColor(latestResult.severity)}>
                {latestResult.severity.replace("_", " ")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{averageScore}</div>
              <div className="text-sm text-muted-foreground mb-2">Average Score</div>
              <div className="text-xs text-muted-foreground">
                Based on {history.length} assessments
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getTrendIcon(overallTrend)}
                <span className="text-2xl font-bold">
                  {overallTrend === "improving" && "↓"}
                  {overallTrend === "declining" && "↑"}
                  {overallTrend === "stable" && "→"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">Overall Trend</div>
              <div className="text-xs text-muted-foreground capitalize">{overallTrend}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{history.length}</div>
              <div className="text-sm text-muted-foreground mb-2">Total Assessments</div>
              <div className="text-xs text-muted-foreground">
                Range: {lowestScore} - {highestScore}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Score History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {history.slice(0, 15).map((result, index) => {
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
                  <div className="relative h-8 bg-muted rounded overflow-hidden">
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
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-xs font-medium text-white mix-blend-difference">
                        {result.severity.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Severity Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["minimal", "mild", "moderate", "moderately_severe", "severe"].map((severity) => {
              const count = history.filter((r) => r.severity === severity).length;
              const percentage = history.length > 0 ? (count / history.length) * 100 : 0;

              return (
                <div key={severity} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize">{severity.replace("_", " ")}</span>
                    <span className="text-muted-foreground">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="relative h-6 bg-muted rounded overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 ${
                        severity === "minimal"
                          ? "bg-green-500"
                          : severity === "mild"
                          ? "bg-yellow-500"
                          : severity === "moderate"
                          ? "bg-orange-500"
                          : severity === "moderately_severe"
                          ? "bg-red-500"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overallTrend === "improving" && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Positive Progress</p>
                  <p className="text-sm text-green-800">
                    Your scores show improvement over time. Keep up your current practices and
                    self-care routines.
                  </p>
                </div>
              </div>
            )}

            {overallTrend === "declining" && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Attention Needed</p>
                  <p className="text-sm text-orange-800">
                    Your recent scores show an increase. Consider reaching out for additional
                    support or adjusting your self-care strategies.
                  </p>
                </div>
              </div>
            )}

            {history.length >= 3 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Consistent Tracking</p>
                  <p className="text-sm text-blue-800">
                    You've completed {history.length} assessments. Regular tracking helps identify
                    patterns and measure progress effectively.
                  </p>
                </div>
              </div>
            )}

            {latestResult.severity === "severe" || latestResult.severity === "moderately_severe" && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Professional Support Recommended</p>
                  <p className="text-sm text-red-800">
                    Your latest score suggests significant symptoms. Please consider consulting
                    with a mental health professional.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
