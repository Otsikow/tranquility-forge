import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Sparkles } from "lucide-react";
import boraBoraImage from "@/assets/bora-bora.jpg";

const affirmations = [
  {
    id: 1,
    text: "I am worthy of love, peace, and happiness",
    category: "Self-Love",
    likes: 124,
  },
  {
    id: 2,
    text: "Every breath I take fills me with calm and clarity",
    category: "Mindfulness",
    likes: 98,
  },
  {
    id: 3,
    text: "I release what no longer serves me and embrace what does",
    category: "Letting Go",
    likes: 156,
  },
  {
    id: 4,
    text: "My thoughts are positive, my heart is open",
    category: "Positivity",
    likes: 87,
  },
  {
    id: 5,
    text: "I am exactly where I need to be in this moment",
    category: "Presence",
    likes: 203,
  },
];

export default function Affirmations() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Affirmations" showBack backTo="/dashboard" />

      {/* Hero Section */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <img
          src={boraBoraImage}
          alt="Tranquil tropical paradise with crystal-clear waters"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary drop-shadow-lg" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-lg">
              Daily Affirmations
            </h2>
          </div>
          <p className="text-foreground/90 drop-shadow-md">
            Positive words to uplift your spirit
          </p>
        </div>
      </div>

      {/* Today's Featured Affirmation */}
      <div className="px-6 pt-6 pb-4 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Affirmation of the Day
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-semibold text-foreground mb-6 leading-relaxed">
              "I am capable of amazing things and deserve all the good that comes my way"
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Affirmations List */}
      <div className="px-6 py-6 space-y-4 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Browse Affirmations
        </h3>
        
        {affirmations.map((affirmation, index) => (
          <Card 
            key={affirmation.id} 
            className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs font-medium text-primary mb-2 block">
                    {affirmation.category}
                  </span>
                  <p className="text-lg font-medium text-foreground leading-relaxed mb-3">
                    "{affirmation.text}"
                  </p>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{affirmation.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
