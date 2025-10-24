import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Heart,
  Zap,
  Star,
  Calendar,
  Award,
  Flame,
  Users,
  Brain,
  Moon,
  ClipboardList,
  Wind,
  Sparkles
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useMeditations } from "@/hooks/useMeditations";
import { format } from "date-fns";

interface PersonalizedDashboardProps {
  userName: string;
}

export default function PersonalizedDashboard({ userName }: PersonalizedDashboardProps) {
  const navigate = useNavigate();
  const { profile, achievements, logActivity } = useUserProfile();
  const { meditations } = useMeditations();
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Mock data for demonstration - in real app, this would come from the recommendation engine
  const mockRecommendations = [
    {
      id: '1',
      title: 'Morning Energy Boost',
      type: 'meditation',
      duration: 10,
      reason: 'Based on your stress relief goal',
      score: 0.9
    },
    {
      id: '2', 
      title: 'Sleep Stories: Ocean Waves',
      type: 'sleep',
      duration: 20,
      reason: 'Perfect for your sleep improvement goal',
      score: 0.85
    },
    {
      id: '3',
      title: 'Anxiety Relief Breathing',
      type: 'meditation',
      duration: 5,
      reason: 'Quick practice for anxiety management',
      score: 0.8
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (!profile) return "Welcome to your mental wellness journey!";
    
    const goals = profile.mental_health_goals;
    if (goals.includes('stress_relief')) {
      return "Take a moment to breathe and find your calm today.";
    }
    if (goals.includes('sleep_improvement')) {
      return "A good night's sleep starts with a peaceful day.";
    }
    if (goals.includes('anxiety_management')) {
      return "You're stronger than your anxiety. Take it one step at a time.";
    }
    return "Every small step towards wellness matters.";
  };

  const getStreakMessage = () => {
    if (!profile) return null;
    
    const streak = profile.current_streak_days;
    if (streak === 0) return "Start your wellness streak today!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return `${streak} days strong! You're building a great habit.`;
    if (streak < 30) return `Amazing! ${streak} days in a row!`;
    return `Incredible! ${streak} days of consistent practice!`;
  };

  const getAchievementBadges = () => {
    return achievements.slice(0, 3).map(achievement => ({
      key: achievement.achievement_key,
      name: achievement.achievement_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type: achievement.achievement_type
    }));
  };

  const getGoalProgress = () => {
    if (!profile) return [];
    
    return profile.mental_health_goals.map(goal => {
      const goalData = {
        stress_relief: { label: 'Stress Relief', icon: Heart, color: 'text-red-500', progress: 75 },
        anxiety_management: { label: 'Anxiety Management', icon: Zap, color: 'text-purple-500', progress: 60 },
        sleep_improvement: { label: 'Better Sleep', icon: Clock, color: 'text-blue-500', progress: 80 },
        mood_enhancement: { label: 'Mood Enhancement', icon: Star, color: 'text-yellow-500', progress: 70 },
        focus_concentration: { label: 'Focus & Concentration', icon: Target, color: 'text-green-500', progress: 65 },
        emotional_regulation: { label: 'Emotional Regulation', icon: Heart, color: 'text-pink-500', progress: 55 },
        self_compassion: { label: 'Self-Compassion', icon: Heart, color: 'text-pink-500', progress: 70 },
        mindfulness_practice: { label: 'Mindfulness Practice', icon: Heart, color: 'text-emerald-500', progress: 85 }
      };
      
      return { goal, ...goalData[goal] };
    });
  };

  useEffect(() => {
    setRecommendations(mockRecommendations);
  }, []);

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">Loading your personalized dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {getGreeting()}, {userName}! 👋
              </h2>
              <p className="text-muted-foreground mt-1">
                {getMotivationalMessage()}
              </p>
            </div>
            {profile.current_streak_days > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary font-bold text-lg">
                  <Flame className="h-5 w-5" />
                  {profile.current_streak_days}
                </div>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            )}
          </div>
          
          {getStreakMessage() && (
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-sm text-primary font-medium">
                {getStreakMessage()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {profile.total_meditation_minutes}
              </div>
              <p className="text-xs text-muted-foreground">Minutes Meditated</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {profile.total_journal_entries}
              </div>
              <p className="text-xs text-muted-foreground">Journal Entries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {profile.current_streak_days}
              </div>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {achievements.length}
              </div>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      {profile.mental_health_goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Your Wellness Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getGoalProgress().map(({ goal, label, icon: Icon, color, progress }) => (
                <div key={goal} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${color}`} />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getAchievementBadges().map(({ key, name, type }) => (
                <Badge key={key} variant="secondary" className="gap-1">
                  <Award className="h-3 w-3" />
                  {name}
                </Badge>
              ))}
              {achievements.length > 3 && (
                <Badge variant="outline">
                  +{achievements.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Recommended for You
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on your goals and preferences
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/meditations/${rec.id}`)}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {rec.duration}min
                      </Badge>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Match</div>
                        <div className="text-sm font-medium">{Math.round(rec.score * 100)}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          size="lg"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/journal/new")}
        >
          <BookOpen className="h-6 w-6" />
          <span>New Journal Entry</span>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/meditations")}
        >
          <Heart className="h-6 w-6" />
          <span>Start Meditation</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => navigate("/moods")}
        >
          <TrendingUp className="h-6 w-6" />
          <span>Log Mood</span>
        </Button>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Button variant="ghost" className="h-20 flex-col gap-2" onClick={() => navigate("/community")}>
            <Users className="h-5 w-5" />
            <span className="text-xs">Community</span>
          </Button>
          <Button variant="ghost" className="h-20 flex-col gap-2" onClick={() => navigate("/cbt")}>
            <Brain className="h-5 w-5" />
            <span className="text-xs">CBT Tools</span>
          </Button>
          <Button variant="ghost" className="h-20 flex-col gap-2" onClick={() => navigate("/sleep")}>
            <Moon className="h-5 w-5" />
            <span className="text-xs">Sleep</span>
          </Button>
          <Button variant="ghost" className="h-20 flex-col gap-2" onClick={() => navigate("/assessments")}>
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs">Assessments</span>
          </Button>
          <Button variant="ghost" className="h-20 flex-col gap-2" onClick={() => navigate("/breathe")}>
            <Wind className="h-5 w-5" />
            <span className="text-xs">Breathing</span>
          </Button>
          <Button variant="ghost" className="h-20 flex-col gap-2" onClick={() => navigate("/affirmations")}>
            <Sparkles className="h-5 w-5" />
            <span className="text-xs">Affirmations</span>
          </Button>
        </div>
      </div>
    </div>
  );
}