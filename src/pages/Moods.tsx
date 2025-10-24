import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { EnhancedMoodTracker } from "@/components/EnhancedMoodTracker";
import { AchievementSystem } from "@/components/AchievementSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Trophy, BarChart3 } from "lucide-react";

export default function Moods() {
  const [activeTab, setActiveTab] = useState("tracker");

  const handleMoodSubmit = (moodData: any) => {
    // Handle mood submission
    console.log('Mood submitted:', moodData);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Mood & Wellness" showBack={false} />

      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracker" className="gap-2">
              <Heart className="h-4 w-4" />
              Tracker
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="mt-6">
            <EnhancedMoodTracker onMoodSubmit={handleMoodSubmit} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Detailed mood insights and patterns coming soon...
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <AchievementSystem showAll={true} />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
