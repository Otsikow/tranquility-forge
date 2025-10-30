import { useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, User, Settings, ChevronRight, MessageCircle, Bell, HelpCircle, Shield, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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
      <AppBar title="Profile" showBack backTo="/dashboard" />
      
      <div className="px-6 py-8 space-y-8 max-w-2xl mx-auto">
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

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Account & Settings</h3>
          
          <Link to="/settings">
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">
                      Settings
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your preferences and account
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/chat">
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/10 rounded-full p-3">
                    <MessageCircle className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">
                      AI Chat
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Talk to Peace, your AI companion
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/settings/notifications">
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500/10 rounded-full p-3">
                    <Bell className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">
                      Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your notification preferences
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/subscription">
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/10 rounded-full p-3">
                    <CreditCard className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">
                      Subscription
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your subscription and billing
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/settings/help">
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/10 rounded-full p-3">
                    <HelpCircle className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">
                      Help & Support
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get help and contact support
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-2" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
