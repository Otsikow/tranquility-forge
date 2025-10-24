import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ClipboardCheck, TrendingUp, AlertCircle } from "lucide-react";
import { Assessment, UserAssessment } from "@/types/db";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function Assessments() {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [userAssessments, setUserAssessments] = useState<UserAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [takingAssessment, setTakingAssessment] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load assessment templates
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .select("*")
        .order("name");

      if (assessmentError) throw assessmentError;

      // Load user's assessment history
      const { data: userAssessmentData, error: userAssessmentError } = await supabase
        .from("user_assessments")
        .select("*, assessment:assessments(*)")
        .eq("user_id", user.id)
        .order("taken_at", { ascending: false });

      if (userAssessmentError) throw userAssessmentError;

      setAssessments(assessmentData || []);
      setUserAssessments(userAssessmentData || []);
    } catch (error) {
      console.error("Error loading assessments:", error);
      toast({
        title: "Error loading assessments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestion(0);
    setResponses([]);
    setTakingAssessment(true);
  };

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);

    const questions = selectedAssessment?.questions as any[];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateScore = () => {
    if (!selectedAssessment) return 0;
    
    const questions = selectedAssessment.questions as any[];
    return responses.reduce((sum, response, index) => {
      const question = questions[index];
      // Handle reverse scoring if specified
      if (question.reverse) {
        const maxScale = Math.max(...question.scale);
        return sum + (maxScale - response);
      }
      return sum + response;
    }, 0);
  };

  const getInterpretation = (score: number) => {
    if (!selectedAssessment) return "";
    
    const scoring = selectedAssessment.scoring as any;
    const range = scoring.ranges.find(
      (r: any) => score >= r.min && score <= r.max
    );
    return range;
  };

  const submitAssessment = async () => {
    if (!selectedAssessment) return;

    const questions = selectedAssessment.questions as any[];
    if (responses.length !== questions.length) {
      toast({
        title: "Please answer all questions",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const score = calculateScore();
      const interpretation = getInterpretation(score);

      const { error } = await supabase
        .from("user_assessments")
        .insert({
          user_id: user.id,
          assessment_id: selectedAssessment.id,
          responses: { answers: responses },
          score,
          interpretation: interpretation.recommendation,
        });

      if (error) throw error;

      toast({
        title: "Assessment completed",
        description: "View your results in the History tab",
      });

      setTakingAssessment(false);
      setSelectedAssessment(null);
      loadData();
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error saving assessment",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "minimal":
      case "low":
        return "bg-green-500";
      case "mild":
        return "bg-yellow-500";
      case "moderate":
        return "bg-orange-500";
      case "moderately severe":
      case "severe":
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getChartData = (type: string) => {
    return userAssessments
      .filter((ua) => ua.assessment?.type === type)
      .reverse()
      .slice(0, 10)
      .map((ua) => ({
        date: format(new Date(ua.taken_at), "MMM d"),
        score: ua.score,
      }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Self-Assessments" />

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-2">
                <p className="font-medium">Important Information</p>
                <p className="text-muted-foreground">
                  These assessments are screening tools to help you understand your mental health. 
                  They are not diagnostic tools and should not replace professional medical advice. 
                  If you're concerned about your mental health, please consult a healthcare professional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Tests</TabsTrigger>
            <TabsTrigger value="history">My History</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4 mt-6">
            {assessments.map((assessment) => {
              const lastTaken = userAssessments.find(
                (ua) => ua.assessment_id === assessment.id
              );

              return (
                <Card
                  key={assessment.id}
                  className="hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {assessment.name}
                          <Badge variant="secondary">{assessment.type}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {assessment.description}
                        </CardDescription>
                      </div>
                      <ClipboardCheck className="w-6 h-6 text-primary flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {lastTaken && (
                          <p>
                            Last taken: {format(new Date(lastTaken.taken_at), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      <Button onClick={() => startAssessment(assessment)}>
                        {lastTaken ? "Take Again" : "Start Assessment"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            {["PHQ-9", "GAD-7", "PSS-10"].map((type) => {
              const chartData = getChartData(type);
              const latestAssessment = userAssessments.find(
                (ua) => ua.assessment?.type === type
              );

              if (!latestAssessment) return null;

              const interpretation = JSON.parse(latestAssessment.interpretation || "{}");
              const scoring = latestAssessment.assessment?.scoring as any;
              const range = scoring?.ranges?.find(
                (r: any) => latestAssessment.score >= r.min && latestAssessment.score <= r.max
              );

              return (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {type}
                      <Badge className={getSeverityColor(range?.severity)}>
                        {range?.severity || "Unknown"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Latest Score</span>
                        <span className="text-2xl font-bold">{latestAssessment.score}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {range?.recommendation}
                      </p>
                    </div>

                    {chartData.length > 1 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-semibold">Progress Over Time</h4>
                        </div>
                        <ResponsiveContainer width="100%" height={150}>
                          <LineChart data={chartData}>
                            <XAxis
                              dataKey="date"
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={12}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              fontSize={12}
                            />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={{ fill: "hsl(var(--primary))" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {userAssessments.length === 0 && (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">
                    No assessment history yet. Take your first assessment to track your progress.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Assessment Dialog */}
      <Dialog open={takingAssessment} onOpenChange={setTakingAssessment}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAssessment?.name}</DialogTitle>
            <DialogDescription>
              {selectedAssessment?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedAssessment && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Question {currentQuestion + 1} of{" "}
                  {(selectedAssessment.questions as any[]).length}
                </span>
                <span>
                  {Math.round(
                    ((currentQuestion + 1) / (selectedAssessment.questions as any[]).length) *
                      100
                  )}
                  %
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {
                    (selectedAssessment.questions as any[])[currentQuestion]
                      .text
                  }
                </h3>

                <RadioGroup
                  value={responses[currentQuestion]?.toString()}
                  onValueChange={(v) => handleResponse(parseInt(v))}
                >
                  <div className="space-y-3">
                    {(selectedAssessment.questions as any[])[
                      currentQuestion
                    ].scale.map((value: number, index: number) => {
                      const scoring = selectedAssessment.scoring as any;
                      const label = scoring.scale_labels[index];

                      return (
                        <div key={value} className="relative">
                          <RadioGroupItem
                            value={value.toString()}
                            id={`option-${value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`option-${value}`}
                            className="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                          >
                            <span className="font-medium">{label}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={() =>
                    setCurrentQuestion(Math.max(0, currentQuestion - 1))
                  }
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                {currentQuestion ===
                (selectedAssessment.questions as any[]).length - 1 ? (
                  <Button
                    onClick={submitAssessment}
                    disabled={responses.length !== (selectedAssessment.questions as any[]).length}
                  >
                    Complete Assessment
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={responses[currentQuestion] === undefined}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
