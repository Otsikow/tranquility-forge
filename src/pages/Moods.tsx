import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smile, Meh, Frown, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const recentMoods = [
  { id: "1", mood: "Happy", note: "Feeling great after a morning walk.", time: "8:30 AM", icon: Smile, color: "text-green-500" },
  { id: "2", mood: "Calm", note: "A relaxing evening with a book.", time: "Yesterday", icon: Smile, color: "text-blue-500" },
  { id: "3", mood: "Anxious", note: "Stressed about the upcoming presentation.", time: "2 days ago", icon: Frown, color: "text-yellow-500" },
];

const monthlyData = [
  { week: "Week 1", happy: 4, calm: 3, anxious: 2 },
  { week: "Week 2", happy: 5, calm: 4, anxious: 1 },
  { week: "Week 3", happy: 3, calm: 3, anxious: 3 },
  { week: "Week 4", happy: 6, calm: 5, anxious: 1 },
];

export default function Moods() {
  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveMood = () => {
    // Save mood logic here
    setIsOpen(false);
    setNote("");
    setSelectedMood("");
  };

  return (
    <div className="min-h-screen bg-card pb-20">
      <AppBar title="Mood Tracker" showBack={false} />

      <div className="px-6 py-6 space-y-6">
        {/* Add Mood Button */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full">
              <Plus className="h-5 w-5 mr-2" />
              Log Your Mood
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">How are you feeling?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {["Happy", "Calm", "Anxious"].map((mood) => (
                  <Button
                    key={mood}
                    variant={selectedMood === mood ? "default" : "outline"}
                    onClick={() => setSelectedMood(mood)}
                    className="flex flex-col h-20"
                  >
                    {mood === "Happy" && <Smile className="h-6 w-6 mb-1" />}
                    {mood === "Calm" && <Meh className="h-6 w-6 mb-1" />}
                    {mood === "Anxious" && <Frown className="h-6 w-6 mb-1" />}
                    <span className="text-xs">{mood}</span>
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="Add a note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-input border-border text-card-foreground"
              />
              <Button onClick={handleSaveMood} disabled={!selectedMood} className="w-full">
                Save Mood
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Recent Moods */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-card-foreground">Recent Moods</h2>
          {recentMoods.map((mood) => {
            const Icon = mood.icon;
            return (
              <Card key={mood.id} className="bg-muted border-border">
                <CardContent className="pt-6 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center flex-shrink-0">
                    <Icon className={`h-6 w-6 ${mood.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-card-foreground">{mood.mood}</h3>
                      <span className="text-xs text-muted-foreground">{mood.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{mood.note}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-card-foreground">Mood Insights</h2>
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly" className="mt-4">
              <Card className="bg-muted border-border">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Weekly data coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="monthly" className="mt-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-card-foreground mb-1">Monthly Mood Patterns</h3>
                    <p className="text-sm text-muted-foreground">October</p>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis hide />
                      <Bar dataKey="happy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="calm" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="anxious" fill="hsl(var(--alert))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
