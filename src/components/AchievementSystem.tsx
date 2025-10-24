import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Award, 
  Flame, 
  Target, 
  BookOpen, 
  Heart, 
  Clock, 
  Star,
  Zap,
  Shield,
  Leaf,
  Calendar,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { UserAchievement } from "@/types/db";

interface AchievementDefinition {
  key: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: 'milestone' | 'streak' | 'meditation' | 'journal' | 'mood' | 'special';
  requirement: number;
  points: number;
}

const achievementDefinitions: AchievementDefinition[] = [
  // Milestone achievements
  {
    key: 'first_meditation',
    name: 'First Steps',
    description: 'Complete your first meditation session',
    icon: Heart,
    color: 'text-pink-500',
    category: 'milestone',
    requirement: 1,
    points: 10
  },
  {
    key: 'first_journal',
    name: 'Thoughtful Start',
    description: 'Write your first journal entry',
    icon: BookOpen,
    color: 'text-blue-500',
    category: 'milestone',
    requirement: 1,
    points: 10
  },
  {
    key: 'meditation_100',
    name: 'Century Club',
    description: 'Complete 100 minutes of meditation',
    icon: Clock,
    color: 'text-purple-500',
    category: 'meditation',
    requirement: 100,
    points: 50
  },
  {
    key: 'meditation_500',
    name: 'Meditation Master',
    description: 'Complete 500 minutes of meditation',
    icon: Star,
    color: 'text-yellow-500',
    category: 'meditation',
    requirement: 500,
    points: 100
  },
  {
    key: 'journal_10',
    name: 'Reflection Pro',
    description: 'Write 10 journal entries',
    icon: BookOpen,
    color: 'text-green-500',
    category: 'journal',
    requirement: 10,
    points: 30
  },
  {
    key: 'journal_50',
    name: 'Storyteller',
    description: 'Write 50 journal entries',
    icon: BookOpen,
    color: 'text-indigo-500',
    category: 'journal',
    requirement: 50,
    points: 75
  },
  
  // Streak achievements
  {
    key: 'week_streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    color: 'text-orange-500',
    category: 'streak',
    requirement: 7,
    points: 40
  },
  {
    key: 'month_streak',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: Calendar,
    color: 'text-red-500',
    category: 'streak',
    requirement: 30,
    points: 100
  },
  {
    key: 'quarter_streak',
    name: 'Quarter Champion',
    description: 'Maintain a 90-day streak',
    icon: Trophy,
    color: 'text-gold-500',
    category: 'streak',
    requirement: 90,
    points: 200
  },
  
  // Special achievements
  {
    key: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a meditation before 7 AM',
    icon: Zap,
    color: 'text-yellow-500',
    category: 'special',
    requirement: 1,
    points: 25
  },
  {
    key: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a meditation after 10 PM',
    icon: Moon,
    color: 'text-indigo-500',
    category: 'special',
    requirement: 1,
    points: 25
  },
  {
    key: 'mood_tracker',
    name: 'Mood Tracker',
    description: 'Log your mood for 7 consecutive days',
    icon: TrendingUp,
    color: 'text-pink-500',
    category: 'mood',
    requirement: 7,
    points: 35
  },
  {
    key: 'mindfulness_master',
    name: 'Mindfulness Master',
    description: 'Complete 30 different meditation sessions',
    icon: Leaf,
    color: 'text-emerald-500',
    category: 'meditation',
    requirement: 30,
    points: 80
  }
];

interface AchievementSystemProps {
  showAll?: boolean;
  limit?: number;
}

export default function AchievementSystem({ showAll = false, limit = 6 }: AchievementSystemProps) {
  const { profile, achievements, loading } = useUserProfile();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlocked, setShowUnlocked] = useState(true);

  const categories = [
    { key: 'all', label: 'All', icon: Trophy },
    { key: 'milestone', label: 'Milestones', icon: Target },
    { key: 'streak', label: 'Streaks', icon: Flame },
    { key: 'meditation', label: 'Meditation', icon: Heart },
    { key: 'journal', label: 'Journal', icon: BookOpen },
    { key: 'mood', label: 'Mood', icon: TrendingUp },
    { key: 'special', label: 'Special', icon: Star }
  ];

  const getAchievementProgress = (achievement: AchievementDefinition) => {
    if (!profile) return 0;
    
    switch (achievement.category) {
      case 'meditation':
        if (achievement.key.includes('minutes')) {
          return Math.min(profile.total_meditation_minutes, achievement.requirement);
        }
        return 0; // Would need session count data
      case 'journal':
        return Math.min(profile.total_journal_entries, achievement.requirement);
      case 'streak':
        return Math.min(profile.current_streak_days, achievement.requirement);
      default:
        return 0;
    }
  };

  const isAchievementUnlocked = (achievementKey: string) => {
    return achievements.some(a => a.achievement_key === achievementKey);
  };

  const getFilteredAchievements = () => {
    let filtered = achievementDefinitions;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    if (!showUnlocked) {
      filtered = filtered.filter(a => !isAchievementUnlocked(a.key));
    }
    
    if (!showAll && limit) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };

  const getTotalPoints = () => {
    return achievements.reduce((total, achievement) => {
      const definition = achievementDefinitions.find(a => a.key === achievement.achievement_key);
      return total + (definition?.points || 0);
    }, 0);
  };

  const getNextAchievement = () => {
    const unlockedKeys = achievements.map(a => a.achievement_key);
    const next = achievementDefinitions
      .filter(a => !unlockedKeys.includes(a.key))
      .sort((a, b) => a.requirement - b.requirement)[0];
    return next;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading achievements...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredAchievements = getFilteredAchievements();
  const totalPoints = getTotalPoints();
  const nextAchievement = getNextAchievement();

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{achievements.length}</div>
              <p className="text-xs text-muted-foreground">Achievements Unlocked</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round((achievements.length / achievementDefinitions.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Completion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Achievement */}
      {nextAchievement && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Next Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-primary/10`}>
                <nextAchievement.icon className={`h-6 w-6 ${nextAchievement.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{nextAchievement.name}</h3>
                <p className="text-sm text-muted-foreground">{nextAchievement.description}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{getAchievementProgress(nextAchievement)} / {nextAchievement.requirement}</span>
                  </div>
                  <Progress 
                    value={(getAchievementProgress(nextAchievement) / nextAchievement.requirement) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      {showAll && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon;
          const isUnlocked = isAchievementUnlocked(achievement.key);
          const progress = getAchievementProgress(achievement);
          const progressPercent = (progress / achievement.requirement) * 100;

          return (
            <Card 
              key={achievement.key} 
              className={`transition-all duration-200 hover:shadow-md ${
                isUnlocked ? 'ring-2 ring-primary/20 bg-primary/5' : 'hover:bg-muted/50'
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    isUnlocked ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isUnlocked ? achievement.color : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${
                        isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.name}
                      </h3>
                      {isUnlocked && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {achievement.points} pts
                      </Badge>
                      {!isUnlocked && (
                        <div className="text-xs text-muted-foreground">
                          {progress} / {achievement.requirement}
                        </div>
                      )}
                    </div>
                    {!isUnlocked && (
                      <Progress value={progressPercent} className="h-1 mt-2" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No achievements found for the selected filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}