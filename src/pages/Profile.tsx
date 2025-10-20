import { useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-card pb-20">
      <AppBar title="Profile" showBack={false} />
      
      <div className="px-6 py-6 space-y-6">
        <Card className="bg-muted border-border">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Alex</h2>
              <p className="text-muted-foreground">alex@example.com</p>
            </div>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-2" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
