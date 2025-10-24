import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trophy, TrendingUp, Target, Flame, Star, Award } from "lucide-react";
import { UserStatistics, UserAchievement, UserChallenge } from "@/types/db";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function Stats() {
  const { toast } = useToast();
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user statistics
      const { data: statsData, error: statsError } = await supabase
        .from("user_statistics")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (statsError && statsError.code !== "PGRST116") throw statsError;

      // Load user achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from("user_achievements")
        .select("*, achievement:achievements(*)")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      if (achievementsError) throw achievementsError;

      // Load user challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from("user_challenges")
        .select("*, challenge:challenges(*)")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: false });

      if (challengesError) throw challengesError;

      setStats(statsData);
      setAchievements(achievementsData || []);
      setChallenges(challengesData || []);
    } catch (error) {
      console.error("Error loading stats:", error);
      toast({
        title: "Error loading statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      <AppBar title="Your Progress" showBack={false} />

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Level and Points Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">
                  Level {stats?.level || 1}
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  {stats?.points || 0} points
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats?.total_sessions_completed || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats?.total_meditation_minutes || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Minutes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats?.current_meditation_streak || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{achievements.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Streaks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Your Streaks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meditation Streak</span>
                <Badge variant="secondary">
                  {stats?.current_meditation_streak || 0} days
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Best: {stats?.longest_meditation_streak || 0} days</span>
                <span>
                  {stats?.last_meditation_date
                    ? `Last: ${format(new Date(stats.last_meditation_date), "MMM d")}`
                    : "Not started"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Journal Streak</span>
                <Badge variant="secondary">
                  {stats?.current_journal_streak || 0} days
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Best: {stats?.longest_journal_streak || 0} days</span>
                <span>
                  {stats?.last_journal_date
                    ? `Last: ${format(new Date(stats.last_journal_date), "MMM d")}`
                    : "Not started"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements ({achievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No achievements yet. Keep practicing to earn your first badge!
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {achievements.map((ua) => (
                  <div
                    key={ua.id}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/70 transition-colors"
                  >
                    <div className="text-4xl">{ua.achievement?.icon || "🏆"}</div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">{ua.achievement?.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {ua.achievement?.description}
                      </p>
                      <p className="text-xs text-primary mt-1">
                        +{ua.achievement?.points_reward} points
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(ua.earned_at), "MMM d, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Challenges */}
        {challenges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Active Challenges ({challenges.filter((c) => !c.completed).length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {challenges.filter((c) => !c.completed).map((uc) => {
                const progress = (uc.current_progress / (uc.challenge?.goal_value || 1)) * 100;
                
                return (
                  <div key={uc.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{uc.challenge?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {uc.current_progress} / {uc.challenge?.goal_value}{" "}
                          {uc.challenge?.goal_unit}
                        </p>
                      </div>
                      <Badge variant={progress >= 100 ? "default" : "secondary"}>
                        {Math.round(progress)}%
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Ends: {uc.challenge?.end_date && format(new Date(uc.challenge.end_date), "MMM d, yyyy")}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
