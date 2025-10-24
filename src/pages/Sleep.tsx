import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Moon, Music, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Sleep() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/auth/login");
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Sleep" showBack backTo="/dashboard" />

      <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Moon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Stories & Soundscapes</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sleep Stories</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" className="justify-start">
              <PlayCircle className="w-4 h-4 mr-2" /> Starry Night Voyage (15m)
            </Button>
            <Button variant="outline" className="justify-start">
              <PlayCircle className="w-4 h-4 mr-2" /> Woodland Cabin (20m)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Soundscapes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="secondary" className="justify-start">
              <Music className="w-4 h-4 mr-2" /> Ocean Waves
            </Button>
            <Button variant="secondary" className="justify-start">
              <Music className="w-4 h-4 mr-2" /> Rain on Leaves
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
