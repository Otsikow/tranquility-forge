import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Activity, 
  Eye, 
  Puzzle, 
  Wind,
  Clock,
  Star,
  Lock,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CBTCategory, CBTExercise, CBTProgress } from "@/types/db";
import { BottomNav } from "@/components/BottomNav";

const categoryIcons = {
  'brain': Brain,
  'activity': Activity,
  'eye': Eye,
  'puzzle': Puzzle,
  'wind': Wind,
};

export default function CBTTools() {
  const [categories, setCategories] = useState<CBTCategory[]>([]);
  const [exercises, setExercises] = useState<CBTExercise[]>([]);
  const [progress, setProgress] = useState<CBTProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCBTData();
  }, []);

  const loadCBTData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const { data: categoriesData } = await supabase
        .from('cbt_categories')
        .select('*')
        .order('sort_order');
      
      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Load exercises
      const { data: exercisesData } = await supabase
        .from('cbt_exercises')
        .select(`
          *,
          category:cbt_categories(name, color, icon)
        `)
        .order('created_at', { ascending: false });

      if (exercisesData) {
        setExercises(exercisesData as any);
      }

      // Load user progress
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: progressData } = await supabase
          .from('cbt_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressData) {
          setProgress(progressData);
        }
      }
    } catch (error) {
      console.error('Error loading CBT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'text-green-600 bg-green-100';
    if (level <= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDifficultyText = (level: number) => {
    if (level <= 2) return 'Beginner';
    if (level <= 3) return 'Intermediate';
    return 'Advanced';
  };

  const isExerciseCompleted = (exerciseId: string) => {
    return progress.some(p => p.exercise_id === exerciseId && p.completed_at);
  };

  const getCompletedCount = (categoryId: string) => {
    const categoryExercises = exercises.filter(e => e.category_id === categoryId);
    return categoryExercises.filter(e => isExerciseCompleted(e.id)).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">CBT Tools</h1>
            <p className="text-muted-foreground">Evidence-based exercises for mental wellness</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="all">All Exercises</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || Brain;
                const completedCount = getCompletedCount(category.id);
                const totalCount = exercises.filter(e => e.category_id === category.id).length;
                
                return (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          <IconComponent className="h-6 w-6" style={{ color: category.color }} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {completedCount}/{totalCount} completed
                            </Badge>
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ 
                                  width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button asChild>
                          <Link to={`/cbt/category/${category.id}`}>
                            Explore
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* All Exercises Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {exercises.map((exercise) => {
                const IconComponent = categoryIcons[exercise.category?.icon as keyof typeof categoryIcons] || Brain;
                const isCompleted = isExerciseCompleted(exercise.id);
                
                return (
                  <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: exercise.category?.color + '20' }}
                        >
                          <IconComponent className="h-5 w-5" style={{ color: exercise.category?.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground line-clamp-1">
                              {exercise.title}
                            </h3>
                            {isCompleted && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {exercise.is_premium && (
                              <Lock className="h-4 w-4 text-amber-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {exercise.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge 
                              variant="secondary" 
                              style={{ backgroundColor: exercise.category?.color + '20', color: exercise.category?.color }}
                            >
                              {exercise.category?.name}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={getDifficultyColor(exercise.difficulty_level || 1)}
                            >
                              {getDifficultyText(exercise.difficulty_level || 1)}
                            </Badge>
                            {exercise.estimated_duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{exercise.estimated_duration}min</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>{exercise.exercise_type}</span>
                            </div>
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/cbt/exercise/${exercise.id}`}>
                            {isCompleted ? 'Review' : 'Start'}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}