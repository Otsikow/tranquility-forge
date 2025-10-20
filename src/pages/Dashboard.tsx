import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { MoodChart } from "@/components/MoodChart";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Leaf, BookOpen, Wind, MessageCircle, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/logo.png";
import hummingbirdImage from "@/assets/hummingbird.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Alex");
  const [moodData] = useState([
    { day: "Mon", value: 6 },
    { day: "Tue", value: 8 },
    { day: "Wed", value: 7 },
    { day: "Thu", value: 9 },
    { day: "Fri", value: 10 },
    { day: "Sat", value: 9 },
    { day: "Sun", value: 8 },
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth/login");
      } else {
        setUserName(user.user_metadata?.name || "Friend");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section with Image */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img
          src={hummingbirdImage}
          alt="Vibrant hummingbird feeding from flower"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-background/30">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Peace Logo" className="h-10 w-10 drop-shadow-lg" />
            <h1 className="text-lg font-semibold text-foreground drop-shadow-md">
              Good morning, {userName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="text-foreground hover:text-foreground backdrop-blur-sm"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-lg mb-2">
            How are you feeling today?
          </h2>
          <p className="text-foreground/90 drop-shadow-md">
            Take a moment to reflect on your wellbeing
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 animate-fade-up max-w-4xl mx-auto">
        {/* Mood Chart */}
        <Card className="bg-muted border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground">Your Weekly Mood</CardTitle>
              <div className="text-sm text-primary font-semibold">Up</div>
            </div>
            <p className="text-sm text-muted-foreground">Last 7 days +5%</p>
          </CardHeader>
          <CardContent>
            <MoodChart data={moodData} />
          </CardContent>
        </Card>

        {/* Today's Affirmation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Today's Affirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground text-lg font-medium">
              I am capable of amazing things.
            </p>
          </CardContent>
        </Card>

        {/* Recent Journal */}
        <Card className="bg-muted border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground">Recent Thoughts</CardTitle>
              <Button
                variant="link"
                className="text-primary p-0 h-auto"
                onClick={() => navigate("/journal")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-card-foreground text-sm">
                  Today I felt a sense of calm during my morning walk. The sun was...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full justify-start"
            onClick={() => navigate("/journal/new")}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            New Journal Entry
          </Button>
          <Button
            size="lg"
            variant="dark"
            className="w-full justify-start"
            onClick={() => navigate("/breathe")}
          >
            <Wind className="h-5 w-5 mr-2" />
            Start Meditation
          </Button>
          <Button
            size="lg"
            variant="dark"
            className="w-full justify-start"
            onClick={() => navigate("/chat")}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Talk to Peace
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
