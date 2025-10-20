import { useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Plus, Search } from "lucide-react";
import cappadociaImage from "@/assets/cappadocia.jpg";

const entries = [
  { id: "1", title: "A Day of Reflection", date: "October 26, 2023", excerpt: "Today was a mix of emotions, but I found a moment of peace...", tags: ["#Gratitude", "#Mindfulness"] },
  { id: "2", title: "Feeling Overwhelmed", date: "October 25, 2023", excerpt: "Work has been really stressful lately. I need to find better coping mechanisms.", tags: ["#Stress", "#Work"] },
];

export default function Journal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="My Journal" showBack={false} />

      {/* Hero Section */}
      <div className="relative h-44 md:h-56 overflow-hidden">
        <img
          src={cappadociaImage}
          alt="Peaceful Cappadocia landscape with hot air balloons at sunrise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-lg mb-1">
            Your Reflection Space
          </h2>
          <p className="text-foreground/90 drop-shadow-md">
            Document your journey, one thought at a time
          </p>
        </div>
      </div>
      
      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex gap-3">
          <Button size="lg" className="flex-1" onClick={() => navigate("/journal/new")}>
            <Plus className="h-5 w-5 mr-2" />
            New Entry
          </Button>
          <Button size="lg" variant="outline">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="bg-muted border-border cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => navigate(`/journal/${entry.id}`)}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-card-foreground">{entry.title}</h3>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{entry.excerpt}</p>
                <div className="flex gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-card text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
