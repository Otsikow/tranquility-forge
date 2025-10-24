import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Moon, Play, Clock, Lock, Volume2 } from "lucide-react";
import { SleepTrack } from "@/types/db";
import { useNavigate } from "react-router-dom";

const SLEEP_TYPES = [
  { value: "all", label: "All Tracks" },
  { value: "story", label: "Sleep Stories", icon: "📖" },
  { value: "soundscape", label: "Soundscapes", icon: "🌊" },
  { value: "white_noise", label: "White Noise", icon: "⚪" },
  { value: "meditation", label: "Sleep Meditations", icon: "🧘" },
];

export default function Sleep() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<SleepTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const { data, error } = await supabase
        .from("sleep_tracks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTracks(data || []);
    } catch (error) {
      console.error("Error loading sleep tracks:", error);
      toast({
        title: "Error loading sleep tracks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const filteredTracks = selectedType === "all"
    ? tracks
    : tracks.filter((track) => track.type === selectedType);

  const getTypeInfo = (type: string) => {
    return SLEEP_TYPES.find((t) => t.value === type) || SLEEP_TYPES[0];
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
      <AppBar title="Sleep Resources" />

      <div className="px-6 py-6 space-y-6 max-w-6xl mx-auto">
        {/* Hero Card */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Moon className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">Peaceful Sleep</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Drift off to sleep with calming stories, soothing soundscapes, and guided meditations. 
                  Set a timer and let the content play even when your screen is off.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {SLEEP_TYPES.map((type) => (
            <Badge
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedType(type.value)}
            >
              {type.icon && `${type.icon} `}{type.label}
            </Badge>
          ))}
        </div>

        {/* Sleep Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">
                  No sleep tracks available yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTracks.map((track, index) => {
              const typeInfo = getTypeInfo(track.type);
              
              return (
                <Card
                  key={track.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    if (track.is_free || true) {
                      // Navigate to player (to be created)
                      navigate(`/sleep/${track.id}`);
                    } else {
                      toast({
                        title: "Premium Content",
                        description: "Upgrade to access this track",
                      });
                    }
                  }}
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {track.cover_url ? (
                      <img
                        src={track.cover_url}
                        alt={track.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/10">
                        <div className="text-6xl">{typeInfo.icon || "🌙"}</div>
                      </div>
                    )}
                    
                    {/* Premium Badge */}
                    {!track.is_free && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-background/80 backdrop-blur-sm gap-1">
                          <Lock className="w-3 h-3" />
                          Premium
                        </Badge>
                      </div>
                    )}

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(track.duration_seconds)}
                      </Badge>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-background/80 backdrop-blur-sm">
                        {typeInfo.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="pt-4 pb-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                      {track.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {track.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Sleep Tips Card */}
        <Card className="bg-muted/50 mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Sleep Better Tonight</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Set a consistent sleep schedule, even on weekends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Create a relaxing bedtime routine 30-60 minutes before sleep</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Keep your bedroom cool (60-67°F) and dark</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Avoid screens, caffeine, and heavy meals before bed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>If you can't sleep after 20 minutes, get up and do a calming activity</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
