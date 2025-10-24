import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, Lock, BookOpen, TrendingUp, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CBTTools() {
  const navigate = useNavigate();

  const exercises = [
    {
      id: "1",
      title: "Thought Record",
      description: "Identify and challenge negative thought patterns",
      category: "thought_record",
      duration: 15,
      isPremium: false,
      icon: Brain,
      color: "text-blue-500"
    },
    {
      id: "2",
      title: "Behavioral Activation",
      description: "Plan activities to improve mood and energy",
      category: "behavioral_activation",
      duration: 10,
      isPremium: false,
      icon: Activity,
      color: "text-green-500"
    },
    {
      id: "3",
      title: "Progressive Muscle Relaxation",
      description: "Reduce physical tension and anxiety",
      category: "relaxation",
      duration: 20,
      isPremium: true,
      icon: Activity,
      color: "text-purple-500"
    },
    {
      id: "4",
      title: "Problem Solving",
      description: "Break down problems and find solutions",
      category: "problem_solving",
      duration: 15,
      isPremium: false,
      icon: TrendingUp,
      color: "text-orange-500"
    },
    {
      id: "5",
      title: "Exposure Hierarchy",
      description: "Gradually face fears in a structured way",
      category: "exposure",
      duration: 20,
      isPremium: true,
      icon: TrendingUp,
      color: "text-red-500"
    },
    {
      id: "6",
      title: "Mindful Observation",
      description: "Practice present-moment awareness",
      category: "mindfulness",
      duration: 10,
      isPremium: false,
      icon: Brain,
      color: "text-teal-500"
    }
  ];

  const recentSessions = [
    {
      id: "1",
      exerciseTitle: "Thought Record",
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      moodBefore: 4,
      moodAfter: 7
    },
    {
      id: "2",
      exerciseTitle: "Behavioral Activation",
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      moodBefore: 5,
      moodAfter: 8
    }
  ];

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, { label: string; variant: any }> = {
      thought_record: { label: "Cognitive", variant: "default" },
      behavioral_activation: { label: "Behavioral", variant: "secondary" },
      relaxation: { label: "Relaxation", variant: "outline" },
      problem_solving: { label: "Problem Solving", variant: "default" },
      exposure: { label: "Exposure", variant: "secondary" },
      mindfulness: { label: "Mindfulness", variant: "outline" }
    };
    return badges[category] || { label: category, variant: "default" };
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="CBT Tools" />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">CBT Tools</h1>
          <p className="text-muted-foreground">
            Evidence-based exercises to improve your mental wellbeing
          </p>
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              What is CBT?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              Cognitive Behavioral Therapy (CBT) is a proven approach that helps you 
              identify and change unhelpful thinking patterns and behaviors.
            </p>
            <p className="text-muted-foreground">
              These interactive exercises guide you through CBT techniques you can 
              practice on your own, anytime.
            </p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="exercises" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="history">My History</TabsTrigger>
          </TabsList>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {exercises.map((exercise) => {
                const Icon = exercise.icon;
                const categoryBadge = getCategoryBadge(exercise.category);
                
                return (
                  <Card 
                    key={exercise.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate(`/cbt-tools/exercise/${exercise.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg bg-accent ${exercise.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg">{exercise.title}</CardTitle>
                              {exercise.isPremium && (
                                <Lock className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                            <CardDescription>{exercise.description}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Badge variant={categoryBadge.variant}>
                          {categoryBadge.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{exercise.duration} min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-6">
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{session.exerciseTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            {session.completedAt.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Mood Impact</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{session.moodBefore}</span>
                            <span className="text-green-500">→</span>
                            <span className="text-sm font-semibold text-green-500">{session.moodAfter}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No exercises completed yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start your first CBT exercise to track your progress
                  </p>
                  <Button onClick={() => navigate(`/cbt-tools/exercise/1`)}>
                    Start First Exercise
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Thought Records Quick Access */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Quick Access: Thought Records</CardTitle>
            <CardDescription>
              Track and challenge your thoughts anytime
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate("/cbt-tools/thought-records")}
            >
              <Brain className="h-4 w-4 mr-2" />
              View My Thought Records
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
