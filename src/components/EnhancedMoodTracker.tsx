import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smile, 
  Meh, 
  Frown, 
  Plus, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Target,
  Heart,
  Brain,
  Zap,
  Moon,
  Star,
  Activity
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface MoodEntry {
  id: string;
  mood: number;
  note: string;
  tags: string[];
  created_at: string;
  energy_level?: number;
  stress_level?: number;
  sleep_quality?: number;
}

const moodOptions = [
  { value: 1, label: 'Very Low', icon: Frown, color: 'text-red-500', bgColor: 'bg-red-100' },
  { value: 2, label: 'Low', icon: Frown, color: 'text-red-400', bgColor: 'bg-red-50' },
  { value: 3, label: 'Somewhat Low', icon: Meh, color: 'text-orange-500', bgColor: 'bg-orange-100' },
  { value: 4, label: 'Below Average', icon: Meh, color: 'text-orange-400', bgColor: 'bg-orange-50' },
  { value: 5, label: 'Neutral', icon: Meh, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  { value: 6, label: 'Above Average', icon: Smile, color: 'text-yellow-400', bgColor: 'bg-yellow-50' },
  { value: 7, label: 'Good', icon: Smile, color: 'text-green-400', bgColor: 'bg-green-100' },
  { value: 8, label: 'Very Good', icon: Smile, color: 'text-green-500', bgColor: 'bg-green-100' },
  { value: 9, label: 'Great', icon: Smile, color: 'text-emerald-500', bgColor: 'bg-emerald-100' },
  { value: 10, label: 'Excellent', icon: Smile, color: 'text-emerald-600', bgColor: 'bg-emerald-100' }
];

const moodTags = [
  'Work', 'Relationships', 'Health', 'Exercise', 'Sleep', 'Weather', 
  'Social', 'Family', 'Hobbies', 'Travel', 'Food', 'Music', 'Nature'
];

interface EnhancedMoodTrackerProps {
  onMoodSubmit?: (mood: Omit<MoodEntry, 'id' | 'created_at'>) => void;
}

export default function EnhancedMoodTracker({ onMoodSubmit }: EnhancedMoodTrackerProps) {
  const { profile, logActivity } = useUserProfile();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [sleepQuality, setSleepQuality] = useState<number>(5);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);

  // Mock data for demonstration
  const mockMoodData = [
    { day: 'Mon', mood: 7, energy: 6, stress: 4, sleep: 8 },
    { day: 'Tue', mood: 8, energy: 7, stress: 3, sleep: 7 },
    { day: 'Wed', mood: 6, energy: 5, stress: 6, sleep: 6 },
    { day: 'Thu', mood: 9, energy: 8, stress: 2, sleep: 9 },
    { day: 'Fri', mood: 8, energy: 7, stress: 3, sleep: 8 },
    { day: 'Sat', mood: 9, energy: 9, stress: 1, sleep: 8 },
    { day: 'Sun', mood: 7, energy: 6, stress: 4, sleep: 7 }
  ];

  const weeklyMoodData = [
    { week: 'Week 1', avgMood: 6.5, entries: 5 },
    { week: 'Week 2', avgMood: 7.2, entries: 6 },
    { week: 'Week 3', avgMood: 6.8, entries: 4 },
    { week: 'Week 4', avgMood: 7.8, entries: 7 }
  ];

  const moodDistribution = [
    { name: 'Low (1-4)', value: 15, color: '#ef4444' },
    { name: 'Neutral (5-6)', value: 25, color: '#f59e0b' },
    { name: 'Good (7-8)', value: 45, color: '#10b981' },
    { name: 'Excellent (9-10)', value: 15, color: '#059669' }
  ];

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;

    const moodEntry: Omit<MoodEntry, 'id' | 'created_at'> = {
      mood: selectedMood,
      note,
      tags: selectedTags,
      energy_level: energyLevel,
      stress_level: stressLevel,
      sleep_quality: sleepQuality
    };

    // Log activity
    await logActivity('mood_check', undefined, undefined, {
      mood: selectedMood,
      energy_level: energyLevel,
      stress_level: stressLevel,
      sleep_quality: sleepQuality,
      tags: selectedTags
    });

    // Add to recent moods
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      ...moodEntry,
      created_at: new Date().toISOString()
    };
    setRecentMoods(prev => [newEntry, ...prev.slice(0, 4)]);

    // Reset form
    setSelectedMood(null);
    setNote("");
    setSelectedTags([]);
    setEnergyLevel(5);
    setStressLevel(5);
    setSleepQuality(5);
    setShowAdvanced(false);

    onMoodSubmit?.(moodEntry);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getMoodInsights = () => {
    if (recentMoods.length < 3) return null;

    const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
    const trend = recentMoods[0].mood > recentMoods[recentMoods.length - 1].mood ? 'up' : 'down';
    
    return { avgMood, trend };
  };

  const insights = getMoodInsights();

  return (
    <div className="space-y-6">
      {/* Quick Mood Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            How are you feeling right now?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mood Scale */}
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedMood === option.value;
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`h-16 flex-col gap-1 ${
                    isSelected ? option.bgColor : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedMood(option.value)}
                >
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : option.color}`} />
                  <span className="text-xs">{option.value}</span>
                </Button>
              );
            })}
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Add a note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's contributing to how you feel?"
              className="w-full p-3 border border-border rounded-md bg-background resize-none"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {moodTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">Energy Level: {energyLevel}/10</label>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">High</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stress Level: {stressLevel}/10</label>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-red-500" />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">High</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sleep Quality: {sleepQuality}/10</label>
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-blue-500" />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">Excellent</span>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handleMoodSubmit} 
            disabled={!selectedMood}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Mood
          </Button>
        </CardContent>
      </Card>

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMoods.map((entry) => {
                const moodOption = moodOptions.find(m => m.value === entry.mood);
                const Icon = moodOption?.icon || Meh;
                return (
                  <div key={entry.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className={`p-2 rounded-full ${moodOption?.bgColor || 'bg-gray-100'}`}>
                      <Icon className={`h-4 w-4 ${moodOption?.color || 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{moodOption?.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>
                      )}
                      {entry.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {entry.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Mood Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold">This Week's Mood</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mockMoodData}>
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis domain={[1, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Weekly Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyMoodData}>
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Bar dataKey="avgMood" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Mood Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={moodDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {moodDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {moodDistribution.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {insights && (
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Recent Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Your average mood over the last {recentMoods.length} entries is {insights.avgMood.toFixed(1)}/10.
                      {insights.trend === 'up' ? ' Your mood is trending upward! 📈' : ' Your mood has been declining recently. 📉'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}