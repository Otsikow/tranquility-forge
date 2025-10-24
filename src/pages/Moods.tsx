import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import EnhancedMoodTracker from "@/components/EnhancedMoodTracker";
import AchievementSystem from "@/components/AchievementSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Trophy, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodChart } from "@/components/MoodChart";

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
              {(() => {
                const weeklyData = [
                  { day: 'Mon', value: 7 },
                  { day: 'Tue', value: 8 },
                  { day: 'Wed', value: 6 },
                  { day: 'Thu', value: 9 },
                  { day: 'Fri', value: 8 },
                  { day: 'Sat', value: 9 },
                  { day: 'Sun', value: 7 },
                ];

                const averageMood = (weeklyData.reduce((sum, d) => sum + d.value, 0) / weeklyData.length).toFixed(1);
                const bestDay = weeklyData.reduce((a, b) => (b.value > a.value ? b : a));
                const challengingDay = weeklyData.reduce((a, b) => (b.value < a.value ? b : a));

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          Weekly Mood Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <MoodChart data={weeklyData} />
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm text-muted-foreground">Average</div>
                            <div className="text-xl font-semibold">{averageMood}/10</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Best Day</div>
                            <div className="text-xl font-semibold">{bestDay.day}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Challenging</div>
                            <div className="text-xl font-semibold">{challengingDay.day}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Your mood shows healthy variability with strong weekends. Keep building routines that support Thursday and Saturday highs.
                        </p>
                        <ul className="text-sm list-disc pl-5 space-y-2 text-muted-foreground">
                          <li>Consider a mid-week reset on Wednesdays.</li>
                          <li>Anchor a gratitude practice on days with lower energy.</li>
                          <li>Track sleep and exercise correlations in notes for clearer patterns.</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
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
