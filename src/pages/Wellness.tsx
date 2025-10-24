import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { 
  Music, 
  Wind, 
  Moon, 
  Heart, 
  Brain, 
  ClipboardList,
  Sparkles,
  Activity
} from "lucide-react";
import { MoodChart } from "@/components/MoodChart";
import logoImage from "@/assets/logo.png";
import koiFishImage from "@/assets/koi-fish.jpg";
import bettaFishImage from "@/assets/betta-fish.jpg";
import mantaRayImage from "@/assets/manta-ray.jpg";

export default function Wellness() {
  const navigate = useNavigate();
  const [moodData] = useState([
    { day: "Mon", value: 6 },
    { day: "Tue", value: 8 },
    { day: "Wed", value: 7 },
    { day: "Thu", value: 9 },
    { day: "Fri", value: 10 },
    { day: "Sat", value: 9 },
    { day: "Sun", value: 8 },
  ]);

  const wellnessFeatures = [
    {
      icon: Music,
      title: "Meditations",
      description: "Guided meditations for peace and clarity",
      path: "/meditations",
      color: "bg-blue-500",
      image: koiFishImage
    },
    {
      icon: Wind,
      title: "Breathing",
      description: "Calm your mind with breathing exercises",
      path: "/breathe",
      color: "bg-green-500",
      image: mantaRayImage
    },
    {
      icon: Moon,
      title: "Sleep",
      description: "Improve your sleep quality and habits",
      path: "/sleep",
      color: "bg-purple-500",
      image: bettaFishImage
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Track and understand your emotions",
      path: "/moods",
      color: "bg-pink-500",
      image: bettaFishImage
    },
    {
      icon: Brain,
      title: "CBT Tools",
      description: "Cognitive behavioral therapy techniques",
      path: "/cbt",
      color: "bg-orange-500",
      image: koiFishImage
    },
    {
      icon: ClipboardList,
      title: "Assessments",
      description: "Mental health and wellness assessments",
      path: "/assessments",
      color: "bg-indigo-500",
      image: mantaRayImage
    },
    {
      icon: Sparkles,
      title: "Affirmations",
      description: "Daily positive affirmations",
      path: "/affirmations",
      color: "bg-yellow-500",
      image: koiFishImage
    },
    {
      icon: Activity,
      title: "AI Chat",
      description: "Talk to Peace, your AI companion",
      path: "/chat",
      color: "bg-teal-500",
      image: mantaRayImage
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Wellness" showBack backTo="/dashboard" />
      
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={koiFishImage}
          alt="Peaceful koi fish swimming"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="flex items-center gap-3 mb-4">
            <img src={logoImage} alt="Peace Logo" className="h-12 w-12 drop-shadow-lg" />
            <h1 className="text-3xl font-bold text-foreground drop-shadow-lg">
              Your Wellness Journey
            </h1>
          </div>
          <p className="text-foreground/90 drop-shadow-md max-w-md">
            Tools and practices for mental wellbeing and inner peace
          </p>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Mood Overview */}
        <Card className="mb-6">
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

        {/* Wellness Tools Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Wellness Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wellnessFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  onClick={() => navigate(feature.path)}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    <div className={`absolute top-4 left-4 ${feature.color} rounded-full p-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 space-y-3">
          <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
          <Button
            size="lg"
            className="w-full justify-start"
            onClick={() => navigate("/moods")}
          >
            <Heart className="h-5 w-5 mr-3" />
            Log Today's Mood
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/breathe")}
          >
            <Wind className="h-5 w-5 mr-3" />
            Start Breathing Exercise
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/meditations")}
          >
            <Music className="h-5 w-5 mr-3" />
            Begin Meditation
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}