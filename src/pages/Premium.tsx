import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Premium() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Premium" showBack backTo="/dashboard" />

      <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Upgrade your experience</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plans</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Free</h3>
                <Badge variant="secondary">Current</Badge>
              </div>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Core features</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Limited content</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Premium</h3>
                <Badge>Best value</Badge>
              </div>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> All meditations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Sleep stories & soundscapes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> CBT premium worksheets</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Advanced AI chat</li>
              </ul>
              <Button className="w-full mt-4" onClick={() => navigate("/auth/login")}>Upgrade</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
