import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, LayoutList, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function CBT() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/auth/login");
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="CBT Tools" showBack backTo="/dashboard" />

      <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Interactive Exercises</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Worksheets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/cbt/worksheet/thought-record")}> 
              <LayoutList className="w-4 h-4 mr-2" /> Thought Record
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/cbt/worksheet/behavioral-activation")}> 
              <LayoutList className="w-4 h-4 mr-2" /> Behavioral Activation
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/cbt/worksheet/exposure-hierarchy")}> 
              <LayoutList className="w-4 h-4 mr-2" /> Exposure Hierarchy
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="secondary">
              <FileText className="w-4 h-4 mr-2" /> Recent Thought Record
            </Button>
            <Button className="w-full justify-start" variant="secondary">
              <FileText className="w-4 h-4 mr-2" /> Activity Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
