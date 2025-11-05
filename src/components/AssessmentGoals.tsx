import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Target,
  Plus,
  CheckCircle,
  Circle,
  Trash2,
  TrendingDown,
  Calendar,
  AlertCircle,
} from "lucide-react";
import type { AssessmentType, AssessmentSeverity } from "@/lib/assessmentService";

interface AssessmentGoal {
  id: string;
  assessmentType: AssessmentType;
  currentScore: number;
  targetScore: number;
  currentSeverity: AssessmentSeverity;
  targetSeverity: AssessmentSeverity;
  targetDate: string;
  createdAt: string;
  milestones: { score: number; achieved: boolean; date?: string }[];
}

const assessmentNames = {
  phq9: "Depression (PHQ-9)",
  gad7: "Anxiety (GAD-7)",
  pss10: "Stress (PSS-10)",
  sleep_hygiene: "Sleep Hygiene",
};

const severityLevels: AssessmentSeverity[] = [
  "severe",
  "moderately_severe",
  "moderate",
  "mild",
  "minimal",
];

const severityLabels = {
  minimal: "Minimal",
  mild: "Mild",
  moderate: "Moderate",
  moderately_severe: "Moderately Severe",
  severe: "Severe",
};

interface AssessmentGoalsProps {
  currentResults: Record<AssessmentType, { score: number; severity: AssessmentSeverity }>;
}

export default function AssessmentGoals({ currentResults }: AssessmentGoalsProps) {
  const { toast } = useToast();
  const [goals, setGoals] = useState<AssessmentGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<{
    assessmentType: AssessmentType | null;
    targetScore: number;
    targetDate: string;
  }>({
    assessmentType: null,
    targetScore: 0,
    targetDate: "",
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem("assessment_goals");
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error("Error loading goals:", error);
      }
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem("assessment_goals", JSON.stringify(goals));
  }, [goals]);

  // Update goal progress when current results change
  useEffect(() => {
    const updatedGoals = goals.map((goal) => {
      const current = currentResults[goal.assessmentType];
      if (!current) return goal;

      // Update milestones
      const updatedMilestones = goal.milestones.map((milestone) => ({
        ...milestone,
        achieved: current.score <= milestone.score,
        date: current.score <= milestone.score && !milestone.achieved ? new Date().toISOString() : milestone.date,
      }));

      return {
        ...goal,
        currentScore: current.score,
        currentSeverity: current.severity,
        milestones: updatedMilestones,
      };
    });

    setGoals(updatedGoals);
  }, [currentResults]);

  const createMilestones = (currentScore: number, targetScore: number) => {
    const milestones: { score: number; achieved: boolean }[] = [];
    const diff = currentScore - targetScore;
    const steps = Math.min(4, Math.max(2, Math.floor(diff / 5)));

    for (let i = 1; i <= steps; i++) {
      const score = Math.round(currentScore - (diff * i) / (steps + 1));
      milestones.push({ score, achieved: false });
    }

    milestones.push({ score: targetScore, achieved: false });
    return milestones;
  };

  const handleAddGoal = () => {
    if (!newGoal.assessmentType || !newGoal.targetDate) {
      toast({
        title: "Missing Information",
        description: "Please select an assessment type and target date.",
        variant: "destructive",
      });
      return;
    }

    const current = currentResults[newGoal.assessmentType];
    if (!current) {
      toast({
        title: "No Current Data",
        description: "Complete this assessment first to set a goal.",
        variant: "destructive",
      });
      return;
    }

    if (newGoal.targetScore >= current.score) {
      toast({
        title: "Invalid Goal",
        description: "Target score must be lower than your current score.",
        variant: "destructive",
      });
      return;
    }

    const goal: AssessmentGoal = {
      id: Date.now().toString(),
      assessmentType: newGoal.assessmentType,
      currentScore: current.score,
      targetScore: newGoal.targetScore,
      currentSeverity: current.severity,
      targetSeverity: "minimal", // Will be calculated based on score
      targetDate: newGoal.targetDate,
      createdAt: new Date().toISOString(),
      milestones: createMilestones(current.score, newGoal.targetScore),
    };

    setGoals([...goals, goal]);
    setShowAddGoal(false);
    setNewGoal({ assessmentType: null, targetScore: 0, targetDate: "" });
    
    toast({
      title: "Goal Created",
      description: "Your wellness goal has been set successfully!",
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
    toast({
      title: "Goal Deleted",
      description: "Your wellness goal has been removed.",
    });
  };

  const calculateProgress = (goal: AssessmentGoal) => {
    const totalReduction = goal.currentScore - goal.targetScore;
    const currentReduction = goal.currentScore - currentResults[goal.assessmentType]?.score || goal.currentScore;
    return Math.min(100, Math.max(0, (currentReduction / totalReduction) * 100));
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const days = Math.ceil(
      (new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const availableAssessments = Object.keys(currentResults).filter(
    (type) =>
      currentResults[type as AssessmentType] &&
      !goals.some((g) => g.assessmentType === type)
  ) as AssessmentType[];

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Set Wellness Goals</h3>
              <p className="text-sm text-blue-800">
                Track your progress towards better mental health by setting specific, measurable
                goals based on your assessment scores.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {goals.length === 0 && !showAddGoal && (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Goals Set</h3>
            <p className="text-muted-foreground mb-4">
              Create your first wellness goal to start tracking your progress.
            </p>
            <Button onClick={() => setShowAddGoal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {goals.map((goal) => {
        const current = currentResults[goal.assessmentType];
        const progress = calculateProgress(goal);
        const daysRemaining = getDaysUntilTarget(goal.targetDate);
        const isOverdue = daysRemaining < 0;
        const isAchieved = current && current.score <= goal.targetScore;

        return (
          <Card key={goal.id} className={isAchieved ? "border-green-500 border-2" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isAchieved ? "bg-green-100" : "bg-primary/10"
                    }`}
                  >
                    {isAchieved ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Target className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {assessmentNames[goal.assessmentType]}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Target: Score of {goal.targetScore} by{" "}
                      {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAchieved ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Goal Achieved! 🎉</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Congratulations! You've reached your target score. Keep up the great work!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{current?.score || goal.currentScore}</div>
                      <div className="text-xs text-muted-foreground">Current</div>
                    </div>
                    <div>
                      <TrendingDown className="h-6 w-6 mx-auto text-primary" />
                      <div className="text-xs text-muted-foreground">Improving</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {goal.targetScore}
                      </div>
                      <div className="text-xs text-muted-foreground">Target</div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                      isOverdue ? "bg-red-50 text-red-700" : "bg-muted"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>
                      {isOverdue
                        ? `Overdue by ${Math.abs(daysRemaining)} days`
                        : `${daysRemaining} days remaining`}
                    </span>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Milestones</h4>
                    <div className="space-y-2">
                      {goal.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded bg-muted/50"
                        >
                          {milestone.achieved ? (
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              milestone.achieved ? "text-green-700 font-medium" : "text-muted-foreground"
                            }`}
                          >
                            Reach score of {milestone.score}
                          </span>
                          {milestone.achieved && milestone.date && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {new Date(milestone.date).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}

      {showAddGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Wellness Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Assessment Type</Label>
              <Select
                value={newGoal.assessmentType || ""}
                onValueChange={(value) =>
                  setNewGoal({ ...newGoal, assessmentType: value as AssessmentType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssessments.map((type) => (
                    <SelectItem key={type} value={type}>
                      {assessmentNames[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newGoal.assessmentType && (
              <>
                <div className="space-y-2">
                  <Label>Target Score</Label>
                  <Input
                    type="number"
                    placeholder="Enter target score"
                    value={newGoal.targetScore || ""}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, targetScore: parseInt(e.target.value) || 0 })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Current score: {currentResults[newGoal.assessmentType]?.score || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={newGoal.targetDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddGoal(false);
                  setNewGoal({ assessmentType: null, targetScore: 0, targetDate: "" });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleAddGoal} className="flex-1">
                Create Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {goals.length > 0 && !showAddGoal && availableAssessments.length > 0 && (
        <Button onClick={() => setShowAddGoal(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Goal
        </Button>
      )}
    </div>
  );
}
