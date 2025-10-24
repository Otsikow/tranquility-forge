import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Community() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect unauthenticated users to login
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/auth/login");
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Community" showBack backTo="/dashboard" />

      <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Forums & Peer Support</h2>
        </div>

        {/* Forums */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Forums</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/community/forums/welcome")}> 
              <MessageSquare className="w-4 h-4 mr-2" /> Welcome & Introductions
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/community/forums/anxiety")}> 
              <MessageSquare className="w-4 h-4 mr-2" /> Managing Anxiety
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/community/forums/depression")}> 
              <MessageSquare className="w-4 h-4 mr-2" /> Depression Support
            </Button>
          </CardContent>
        </Card>

        {/* Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Peer Support Groups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="secondary">
              <Users className="w-4 h-4 mr-2" /> Mindful Mornings (Public)
            </Button>
            <Button className="w-full justify-start" variant="secondary">
              <Users className="w-4 h-4 mr-2" /> Sleep Better (Private)
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <PlusCircle className="w-4 h-4 mr-2" /> Create a Group
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
