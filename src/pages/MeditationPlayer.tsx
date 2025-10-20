import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Loader2, Lock, Clock, PlayCircle } from "lucide-react";
import { useMeditations } from "@/hooks/useMeditations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Meditation } from "@/types/db";

export default function MeditationPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { meditations } = useMeditations();
  const { toast } = useToast();
  
  const [meditation, setMeditation] = useState<Meditation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Load meditation
  useEffect(() => {
    const med = meditations.find(m => m.id === id);
    if (med) {
      setMeditation(med);
      setLoading(false);
    } else if (!loading && meditations.length > 0) {
      toast({
        title: "Meditation not found",
        variant: "destructive",
      });
      navigate("/meditations");
    }
  }, [id, meditations, navigate, toast, loading]);

  // Start session
  const startSession = async () => {
    if (!meditation) return;

    // Check if premium and locked
    if (!meditation.is_free) {
      toast({
        title: "Premium Content",
        description: "This meditation requires a premium subscription",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to track your progress",
          variant: "destructive",
        });
        return;
      }

      // Create session
      const { data, error } = await supabase
        .from('sessions_played')
        .insert({
          user_id: user.id,
          meditation_id: meditation.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSessionId(data.id);
        setShowPlayer(true);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start meditation session",
        variant: "destructive",
      });
    }
  };

  // Complete session
  const completeSession = async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('sessions_played')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Session completed",
        description: "Well done! Your progress has been saved.",
      });
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!meditation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title={meditation.title} showBack backTo="/meditations" />

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
        {/* Cover Image */}
        <Card className="overflow-hidden">
          <div className="relative h-64 bg-muted">
            {meditation.cover_url ? (
              <img
                src={meditation.cover_url}
                alt={meditation.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <div className="text-8xl text-primary/30">🧘</div>
              </div>
            )}

            {/* Premium Overlay */}
            {!meditation.is_free && !showPlayer && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Lock className="w-16 h-16 text-primary mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Premium Content
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Unlock this meditation with a premium subscription
                    </p>
                    <Button variant="outline" onClick={() => navigate("/profile")}>
                      View Plans
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-2xl">{meditation.title}</CardTitle>
              <div className="flex gap-2">
                {!meditation.is_free && (
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="w-3 h-3" />
                    Premium
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(meditation.duration_seconds)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {meditation.description}
            </p>
          </CardContent>
        </Card>

        {/* Audio Player or Start Button */}
        {showPlayer && meditation.audio_url ? (
          <Card>
            <CardContent className="pt-6">
              <AudioPlayer
                audioUrl={meditation.audio_url}
                title={meditation.title}
                onPlay={() => {
                  console.log('Started playing:', meditation.title);
                }}
                onComplete={completeSession}
              />
            </CardContent>
          </Card>
        ) : (
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={startSession}
            disabled={!meditation.is_free && !showPlayer}
          >
            <PlayCircle className="w-5 h-5" />
            {meditation.is_free ? 'Start Meditation' : 'Locked'}
          </Button>
        )}

        {/* Demo Audio Note */}
        {showPlayer && !meditation.audio_url && (
          <Card className="bg-muted">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Demo meditation - Audio file not yet uploaded
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
