import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Clock } from "lucide-react";
import { useMeditations } from "@/hooks/useMeditations";
import icelandImage from "@/assets/iceland-lights.jpg";

export default function Meditations() {
  const navigate = useNavigate();
  const { meditations, loading } = useMeditations();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Meditations" showBack={false} />

      {/* Hero Section */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={icelandImage}
          alt="Northern Lights meditation background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-lg mb-2">
            Guided Meditations
          </h2>
          <p className="text-foreground/90 drop-shadow-md">
            Find your inner peace with expert-guided sessions
          </p>
        </div>
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : meditations.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground">No meditations available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditations.map((meditation, index) => (
              <Card
                key={meditation.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/meditations/${meditation.id}`)}
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  {meditation.cover_url ? (
                    <img
                      src={meditation.cover_url}
                      alt={meditation.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <div className="text-6xl text-primary/30">🧘</div>
                    </div>
                  )}
                  
                  {/* Premium Badge */}
                  {!meditation.is_free && (
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
                      {formatDuration(meditation.duration_seconds)}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="pt-4 pb-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                    {meditation.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meditation.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
