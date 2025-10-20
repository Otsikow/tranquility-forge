import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  getNotificationSettings,
  saveNotificationSettings,
  NotificationSettings,
  notify,
} from "@/lib/notifications";
import { Bell, Clock, Flame, Heart } from "lucide-react";

export default function Notifications() {
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
  const { toast } = useToast();

  useEffect(() => {
    // Load settings on mount
    setSettings(getNotificationSettings());
  }, []);

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
    
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleTimeChange = (key: "checkInTime" | "meditationTime", value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
  };

  const testNotification = () => {
    notify({
      title: "Test Notification",
      description: "This is how notifications will appear in the app.",
    });
  };

  return (
    <div className="min-h-screen bg-card pb-20">
      <AppBar title="Notifications" showBack backTo="/settings" />
      
      <div className="p-6 space-y-6">
        {/* Test Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Test Notifications
            </CardTitle>
            <CardDescription>
              Preview how in-app notifications will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testNotification} className="w-full">
              Send Test Notification
            </Button>
          </CardContent>
        </Card>

        {/* Daily Check-In */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Daily Check-In Reminder
            </CardTitle>
            <CardDescription>
              Get reminded to log your mood and reflections each day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-check-in">Enable Daily Reminders</Label>
              <Switch
                id="daily-check-in"
                checked={settings.dailyCheckIn}
                onCheckedChange={() => handleToggle("dailyCheckIn")}
              />
            </div>
            
            {settings.dailyCheckIn && (
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="check-in-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Reminder Time
                </Label>
                <Input
                  id="check-in-time"
                  type="time"
                  value={settings.checkInTime}
                  onChange={(e) => handleTimeChange("checkInTime", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You'll be reminded at this time each day
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meditation Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Meditation Reminders
            </CardTitle>
            <CardDescription>
              Stay consistent with your meditation practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="meditation-reminder">Enable Meditation Reminders</Label>
              <Switch
                id="meditation-reminder"
                checked={settings.meditationReminders}
                onCheckedChange={() => handleToggle("meditationReminders")}
              />
            </div>
            
            {settings.meditationReminders && (
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="meditation-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Reminder Time
                </Label>
                <Input
                  id="meditation-time"
                  type="time"
                  value={settings.meditationTime}
                  onChange={(e) => handleTimeChange("meditationTime", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A gentle reminder to meditate
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              Streak Alerts
            </CardTitle>
            <CardDescription>
              Celebrate your consistency with milestone notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="streak-alerts">Enable Streak Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you hit streak milestones
                </p>
              </div>
              <Switch
                id="streak-alerts"
                checked={settings.streakAlerts}
                onCheckedChange={() => handleToggle("streakAlerts")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Future Push Notifications */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Push Notifications</CardTitle>
            <CardDescription>
              Coming soon: Receive notifications even when the app is closed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled className="w-full">
              Enable Push Notifications (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>All notifications are currently in-app only.</p>
          <p>Push notification support will be added in a future update.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
