import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Moon, 
  Play, 
  Clock, 
  Lock, 
  TrendingUp,
  CloudRain,
  Waves,
  Wind,
  Volume2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sleep() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stories");

  const sleepStories = [
    {
      id: "1",
      title: "Journey to the Peaceful Valley",
      description: "A gentle walk through a serene valley at twilight",
      narrator: "Emma Thompson",
      duration: 1800,
      category: "nature",
      isPremium: false,
      plays: 12450,
      rating: 4.8
    },
    {
      id: "2",
      title: "The Ancient Library",
      description: "Explore a mysterious library filled with forgotten tales",
      narrator: "James Morgan",
      duration: 2400,
      category: "fantasy",
      isPremium: true,
      plays: 8920,
      rating: 4.9
    },
    {
      id: "3",
      title: "Ocean Dreams",
      description: "Float peacefully on calm ocean waters under the stars",
      narrator: "Sarah Chen",
      duration: 1500,
      category: "nature",
      isPremium: false,
      plays: 15680,
      rating: 4.7
    },
    {
      id: "4",
      title: "Mountain Cabin",
      description: "Cozy evening in a remote mountain cabin",
      narrator: "David Park",
      duration: 2100,
      category: "nature",
      isPremium: true,
      plays: 7230,
      rating: 4.9
    }
  ];

  const soundscapes = [
    {
      id: "1",
      title: "Gentle Rain",
      description: "Soft rainfall on leaves",
      category: "rain",
      isPremium: false,
      icon: CloudRain,
      color: "text-blue-500"
    },
    {
      id: "2",
      title: "Ocean Waves",
      description: "Rhythmic waves on a peaceful beach",
      category: "ocean",
      isPremium: false,
      icon: Waves,
      color: "text-cyan-500"
    },
    {
      id: "3",
      title: "Forest Night",
      description: "Crickets and gentle wind through trees",
      category: "forest",
      isPremium: false,
      icon: Wind,
      color: "text-green-500"
    },
    {
      id: "4",
      title: "White Noise",
      description: "Pure white noise for deep sleep",
      category: "white_noise",
      isPremium: false,
      icon: Volume2,
      color: "text-gray-500"
    },
    {
      id: "5",
      title: "Thunder Storm",
      description: "Distant thunder with steady rain",
      category: "rain",
      isPremium: true,
      icon: CloudRain,
      color: "text-purple-500"
    },
    {
      id: "6",
      title: "Mountain Stream",
      description: "Babbling brook in the mountains",
      category: "nature",
      isPremium: true,
      icon: Waves,
      color: "text-teal-500"
    }
  ];

  const sleepStats = {
    averageQuality: 3.8,
    averageDuration: 7.2,
    streak: 5,
    lastNight: {
      quality: 4,
      duration: 7.5,
      bedtime: "10:30 PM",
      wakeTime: "6:00 AM"
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Sleep" />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Moon className="h-8 w-8" />
            Sleep Better
          </h1>
          <p className="text-muted-foreground">
            Relaxing stories and sounds for restful sleep
          </p>
        </div>

        {/* Sleep Stats */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <CardHeader>
            <CardTitle className="text-lg">Your Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{sleepStats.averageQuality}/5</p>
                <p className="text-xs text-muted-foreground">Avg Quality</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{sleepStats.averageDuration}h</p>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{sleepStats.streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate("/sleep/tracking")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Sleep Tracking
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stories">Sleep Stories</TabsTrigger>
            <TabsTrigger value="soundscapes">Soundscapes</TabsTrigger>
          </TabsList>

          {/* Sleep Stories Tab */}
          <TabsContent value="stories" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {sleepStories.map((story) => (
                <Card 
                  key={story.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/sleep/story/${story.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{story.title}</CardTitle>
                          {story.isPremium && (
                            <Lock className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <CardDescription>{story.description}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Play className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(story.duration)}</span>
                      </div>
                      <span>•</span>
                      <span>{story.narrator}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{story.rating}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {story.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Soundscapes Tab */}
          <TabsContent value="soundscapes" className="space-y-4 mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {soundscapes.map((sound) => {
                const Icon = sound.icon;
                return (
                  <Card 
                    key={sound.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate(`/sleep/soundscape/${sound.id}`)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg bg-accent ${sound.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{sound.title}</h3>
                            {sound.isPremium && (
                              <Lock className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {sound.description}
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-3 gap-2 px-0"
                          >
                            <Play className="h-3 w-3" />
                            Play
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Bedtime Reminder */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Bedtime Reminder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Set a consistent bedtime to improve your sleep quality
            </p>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate("/sleep/schedule")}
            >
              Set Sleep Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
