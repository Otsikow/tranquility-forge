import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Brain, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { CBTExercise, UserCBTProgress } from "@/types/db";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const CATEGORY_INFO: Record<string, { icon: string; color: string; description: string }> = {
  thought_record: {
    icon: "📝",
    color: "bg-blue-500",
    description: "Identify and challenge negative thoughts",
  },
  behavioral_activation: {
    icon: "🎯",
    color: "bg-green-500",
    description: "Plan activities that bring joy and accomplishment",
  },
  cognitive_restructuring: {
    icon: "🧠",
    color: "bg-purple-500",
    description: "Transform unhelpful thinking patterns",
  },
  exposure: {
    icon: "💪",
    color: "bg-orange-500",
    description: "Gradually face your fears",
  },
};

export default function CBTTools() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercises, setExercises] = useState<CBTExercise[]>([]);
  const [userProgress, setUserProgress] = useState<UserCBTProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load CBT exercises
      const { data: exerciseData, error: exerciseError } = await supabase
        .from("cbt_exercises")
        .select("*")
        .order("difficulty_level", { ascending: true });

      if (exerciseError) throw exerciseError;

      // Load user's progress
      const { data: progressData, error: progressError } = await supabase
        .from("user_cbt_progress")
        .select("*, exercise:cbt_exercises(*)")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

      if (progressError) throw progressError;

      setExercises(exerciseData || []);
      setUserProgress(progressData || []);
    } catch (error) {
      console.error("Error loading CBT tools:", error);
      toast({
        title: "Error loading CBT tools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startExercise = async (exercise: CBTExercise) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create a new progress entry
      const { data, error } = await supabase
        .from("user_cbt_progress")
        .insert({
          user_id: user.id,
          exercise_id: exercise.id,
          responses: {},
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to exercise page (to be created)
      navigate(`/cbt/${data.id}`);
    } catch (error) {
      console.error("Error starting exercise:", error);
      toast({
        title: "Error starting exercise",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressStats = () => {
    const completed = userProgress.filter((p) => p.completed).length;
    const inProgress = userProgress.filter((p) => !p.completed).length;
    return { completed, inProgress, total: completed + inProgress };
  };

  const stats = getProgressStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="CBT Tools" />

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Header Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>Cognitive Behavioral Therapy</CardTitle>
                <CardDescription className="mt-2">
                  Evidence-based exercises to help you identify and change negative thought patterns.
                  Work through these exercises at your own pace.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="exercises" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exercises">All Exercises</TabsTrigger>
            <TabsTrigger value="my-work">My Work</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-6 mt-6">
            {Object.entries(
              exercises.reduce((acc, exercise) => {
                if (!acc[exercise.category]) {
                  acc[exercise.category] = [];
                }
                acc[exercise.category].push(exercise);
                return acc;
              }, {} as Record<string, CBTExercise[]>)
            ).map(([category, categoryExercises]) => {
              const info = CATEGORY_INFO[category] || {
                icon: "📋",
                color: "bg-gray-500",
                description: category,
              };

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <h3 className="font-semibold capitalize">
                        {category.replace(/_/g, " ")}
                      </h3>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {categoryExercises.map((exercise) => {
                      const userHasStarted = userProgress.some(
                        (p) => p.exercise_id === exercise.id
                      );

                      return (
                        <Card
                          key={exercise.id}
                          className="hover:shadow-lg transition-all duration-200"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {exercise.title}
                                  {userHasStarted && (
                                    <Badge variant="secondary" className="text-xs">
                                      Started
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {exercise.description}
                                </CardDescription>
                              </div>
                              <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                {exercise.duration_minutes && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{exercise.duration_minutes} min</span>
                                  </div>
                                )}
                                <Badge
                                  className={getDifficultyColor(exercise.difficulty_level)}
                                >
                                  {exercise.difficulty_level}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => startExercise(exercise)}
                              >
                                {userHasStarted ? "Continue" : "Start"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="my-work" className="space-y-4 mt-6">
            {userProgress.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">
                    No exercises started yet. Begin your first exercise to track your progress.
                  </p>
                </CardContent>
              </Card>
            ) : (
              userProgress.map((progress) => (
                <Card
                  key={progress.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/cbt/${progress.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {progress.exercise?.title}
                          {progress.completed && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {progress.completed
                            ? `Completed ${format(
                                new Date(progress.completed_at!),
                                "MMM d, yyyy"
                              )}`
                            : `Started ${format(
                                new Date(progress.started_at),
                                "MMM d, yyyy"
                              )}`}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={progress.completed ? "default" : "secondary"}
                      >
                        {progress.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
