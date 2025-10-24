import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Moon, 
  Headphones, 
  BarChart3, 
  Play,
  Clock,
  Star,
  Lock,
  TrendingUp,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SleepStory, Soundscape, SleepTracking } from "@/types/db";
import { BottomNav } from "@/components/BottomNav";

export default function Sleep() {
  const [stories, setStories] = useState<SleepStory[]>([]);
  const [soundscapes, setSoundscapes] = useState<Soundscape[]>([]);
  const [sleepData, setSleepData] = useState<SleepTracking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSleepData();
  }, []);

  const loadSleepData = async () => {
    try {
      setLoading(true);
      
      // Load sleep stories
      const { data: storiesData } = await supabase
        .from('sleep_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (storiesData) {
        setStories(storiesData);
      }

      // Load soundscapes
      const { data: soundscapesData } = await supabase
        .from('soundscapes')
        .select('*')
        .order('created_at', { ascending: false });

      if (soundscapesData) {
        setSoundscapes(soundscapesData);
      }

      // Load sleep tracking data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: sleepData } = await supabase
          .from('sleep_tracking')
          .select('*')
          .eq('user_id', user.id)
          .order('sleep_date', { ascending: false })
          .limit(30);

        if (sleepData) {
          setSleepData(sleepData);
        }
      }
    } catch (error) {
      console.error('Error loading sleep data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const getSleepQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-600 bg-green-100';
    if (quality >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSleepQualityText = (quality: number) => {
    if (quality >= 8) return 'Excellent';
    if (quality >= 6) return 'Good';
    if (quality >= 4) return 'Fair';
    return 'Poor';
  };

  const calculateWeeklyAverage = () => {
    const lastWeek = sleepData.slice(0, 7);
    const validData = lastWeek.filter(d => d.sleep_quality !== null);
    if (validData.length === 0) return 0;
    return validData.reduce((sum, d) => sum + (d.sleep_quality || 0), 0) / validData.length;
  };

  const weeklyAverage = calculateWeeklyAverage();

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
            <h1 className="text-2xl font-bold text-foreground">Sleep & Relaxation</h1>
            <p className="text-muted-foreground">Stories, sounds, and tracking for better sleep</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Sleep Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sleep Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Weekly Average</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {weeklyAverage.toFixed(1)}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={getSleepQualityColor(weeklyAverage)}
                  >
                    {getSleepQualityText(weeklyAverage)}
                  </Badge>
                </div>
              </div>
              <Progress value={(weeklyAverage / 10) * 100} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Poor (1-3)</span>
                <span>Fair (4-6)</span>
                <span>Good (7-8)</span>
                <span>Excellent (9-10)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="stories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stories">Sleep Stories</TabsTrigger>
            <TabsTrigger value="sounds">Soundscapes</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          {/* Sleep Stories Tab */}
          <TabsContent value="stories" className="space-y-4">
            <div className="space-y-4">
              {stories.map((story) => (
                <Card key={story.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Moon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {story.title}
                          </h3>
                          {story.is_premium && (
                            <Lock className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {story.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(story.duration_seconds)}</span>
                          </div>
                          {story.narrator && (
                            <div className="flex items-center gap-1">
                              <Headphones className="h-3 w-3" />
                              <span>{story.narrator}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link to={`/sleep/story/${story.id}`}>
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Soundscapes Tab */}
          <TabsContent value="sounds" className="space-y-4">
            <div className="space-y-4">
              {soundscapes.map((soundscape) => (
                <Card key={soundscape.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Headphones className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {soundscape.name}
                          </h3>
                          {soundscape.is_premium && (
                            <Lock className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {soundscape.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">
                            {soundscape.category}
                          </Badge>
                          {soundscape.is_loopable && (
                            <Badge variant="secondary">
                              Loopable
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link to={`/sleep/soundscape/${soundscape.id}`}>
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sleep Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Sleep Data</h3>
                <Button asChild size="sm">
                  <Link to="/sleep/track">
                    <Calendar className="h-4 w-4 mr-1" />
                    Add Entry
                  </Link>
                </Button>
              </div>
              
              {sleepData.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Moon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No sleep data yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start tracking your sleep to see insights and patterns
                    </p>
                    <Button asChild>
                      <Link to="/sleep/track">Start Tracking</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {sleepData.slice(0, 7).map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Moon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {new Date(entry.sleep_date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {entry.sleep_duration ? `${Math.floor(entry.sleep_duration / 60)}h ${entry.sleep_duration % 60}m` : 'No duration recorded'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {entry.sleep_quality && (
                              <Badge 
                                variant="outline" 
                                className={getSleepQualityColor(entry.sleep_quality)}
                              >
                                {entry.sleep_quality}/10
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}