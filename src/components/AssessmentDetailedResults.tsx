import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Download,
  Share2,
  Heart,
  Brain,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { 
  getAssessmentHistoryWithInsights,
  exportAssessmentResults,
  type AssessmentType,
  type AssessmentResultWithInsights
} from "@/lib/assessmentService";

interface AssessmentDetailedResultsProps {
  assessmentType: AssessmentType;
  onClose: () => void;
}

const assessmentIcons = {
  phq9: Heart,
  gad7: Brain,
  pss10: Target,
  sleep_hygiene: Clock
};

const assessmentColors = {
  phq9: 'text-blue-500',
  gad7: 'text-purple-500',
  pss10: 'text-orange-500',
  sleep_hygiene: 'text-indigo-500'
};

const assessmentBgColors = {
  phq9: 'bg-blue-100',
  gad7: 'bg-purple-100',
  pss10: 'bg-orange-100',
  sleep_hygiene: 'bg-indigo-100'
};

export default function AssessmentDetailedResults({ 
  assessmentType, 
  onClose 
}: AssessmentDetailedResultsProps) {
  const [history, setHistory] = useState<AssessmentResultWithInsights[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const Icon = assessmentIcons[assessmentType];
  const color = assessmentColors[assessmentType];
  const bgColor = assessmentBgColors[assessmentType];

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getAssessmentHistoryWithInsights(assessmentType, 20);
        setHistory(data);
      } catch (error) {
        console.error('Error loading assessment history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [assessmentType]);

  const latestResult = history[0];
  const previousResult = history[1];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minimal': return 'text-green-600';
      case 'mild': return 'text-yellow-600';
      case 'moderate': return 'text-orange-600';
      case 'moderately_severe': return 'text-red-600';
      case 'severe': return 'text-red-700';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'minimal': return 'bg-green-100 text-green-800';
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'moderately_severe': return 'bg-red-100 text-red-800';
      case 'severe': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleExport = () => {
    const csvContent = exportAssessmentResults(history);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assessmentType}-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading detailed results...</p>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Results Available</h3>
          <p className="text-muted-foreground mb-4">
            Complete an assessment to see detailed results here.
          </p>
          <Button onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${bgColor}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <CardTitle className="text-xl">{assessmentType.toUpperCase()} Detailed Results</CardTitle>
              <p className="text-sm text-muted-foreground">
                {history.length} assessment{history.length !== 1 ? 's' : ''} completed
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {latestResult && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{latestResult.score}</div>
                      <div className="text-sm text-muted-foreground mb-2">Current Score</div>
                      <Badge className={getSeverityBadgeColor(latestResult.severity)}>
                        {latestResult.severity.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {previousResult && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">{previousResult.score}</div>
                        <div className="text-sm text-muted-foreground mb-2">Previous Score</div>
                        <div className="flex items-center justify-center gap-1">
                          {getTrendIcon(latestResult.score_trend || 'stable')}
                          <span className="text-sm text-muted-foreground">
                            {latestResult.score_trend === 'improving' && 'Improving'}
                            {latestResult.score_trend === 'declining' && 'Declining'}
                            {latestResult.score_trend === 'stable' && 'Stable'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{history.length}</div>
                      <div className="text-sm text-muted-foreground mb-2">Total Assessments</div>
                      <div className="text-xs text-muted-foreground">
                        {latestResult.days_since_last && `Last taken ${latestResult.days_since_last} days ago`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {latestResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Latest Assessment Interpretation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{latestResult.interpretation}</p>
                  
                  {latestResult.recommendations && latestResult.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {latestResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.slice(0, 10).map((result, index) => {
                    const isLatest = index === 0;
                    const trend = result.score_trend;
                    
                    return (
                      <div key={result.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">
                            {new Date(result.completed_at).toLocaleDateString()}
                          </div>
                          {isLatest && (
                            <Badge variant="secondary" className="text-xs">Latest</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-semibold">{result.score}</div>
                            <div className="text-xs text-muted-foreground">
                              {result.severity.replace('_', ' ')}
                            </div>
                          </div>
                          {trend && (
                            <div className="flex items-center gap-1">
                              {getTrendIcon(trend)}
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

          <TabsContent value="recommendations" className="space-y-6">
            {latestResult && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {latestResult.recommendations && latestResult.recommendations.length > 0 ? (
                      <ul className="space-y-3">
                        {latestResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">{rec}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Based on your {latestResult.severity.replace('_', ' ')} score level
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No specific recommendations available.</p>
                    )}
                  </CardContent>
                </Card>

                {latestResult.resources && latestResult.resources.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Suggested Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {latestResult.resources.map((resource, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              {history.map((result, index) => (
                <Card key={result.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${bgColor}`}>
                          <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {new Date(result.completed_at).toLocaleDateString()}
                            {index === 0 && <span className="ml-2 text-xs text-muted-foreground">(Latest)</span>}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(result.completed_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{result.score}</div>
                        <Badge className={getSeverityBadgeColor(result.severity)}>
                          {result.severity.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    {result.previous_score !== undefined && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>Previous: {result.previous_score} points</span>
                        {result.score_trend && (
                          <div className="flex items-center gap-1">
                            {getTrendIcon(result.score_trend)}
                            <span>
                              {result.score_trend === 'improving' && 'Improving'}
                              {result.score_trend === 'declining' && 'Declining'}
                              {result.score_trend === 'stable' && 'Stable'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">{result.interpretation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}