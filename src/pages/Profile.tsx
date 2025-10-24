import { useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LogOut, 
  User, 
  Settings, 
  ChevronRight,
  Bell,
  CreditCard,
  Shield,
  HelpCircle,
  Info,
  FileText,
  Users,
  ClipboardList,
  Award,
} from "lucide-react";
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
      <AppBar title="Profile" showBack={false} />
      
      <div className="px-6 py-8 space-y-6 max-w-2xl mx-auto">
        {/* User Profile Card */}
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

        {/* Account Section */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Account
          </h3>
          <div className="space-y-2">
            <Link to="/settings">
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2.5">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">Settings</h4>
                      <p className="text-xs text-muted-foreground">Manage preferences</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/settings/profile-security">
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2.5">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">Privacy & Security</h4>
                      <p className="text-xs text-muted-foreground">Manage your security</p>
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
                    <div className="bg-primary/10 rounded-full p-2.5">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">Notifications</h4>
                      <p className="text-xs text-muted-foreground">Configure alerts</p>
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
                    <div className="bg-primary/10 rounded-full p-2.5">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">Subscription</h4>
                      <p className="text-xs text-muted-foreground">Manage premium</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* More Features Section */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            More Features
          </h3>
          <div className="space-y-2">
            <Link to="/community">
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2.5">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">Community</h4>
                      <p className="text-xs text-muted-foreground">Connect with others</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/assessments">
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2.5">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">Assessments</h4>
                      <p className="text-xs text-muted-foreground">Track your progress</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Support
          </h3>
          <div className="space-y-2">
            <Link to="/settings/help">
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2.5">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">Help Center</h4>
                      <p className="text-xs text-muted-foreground">Get support</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/settings/about">
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2.5">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">About</h4>
                      <p className="text-xs text-muted-foreground">App information</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/settings/legal">
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2.5">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">Legal</h4>
                      <p className="text-xs text-muted-foreground">Terms & privacy</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-2" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
