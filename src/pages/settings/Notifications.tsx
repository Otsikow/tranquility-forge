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
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getPushTopics,
  updatePushTopics,
} from "@/lib/pushNotifications";
import { Bell, Clock, Flame, Heart } from "lucide-react";

export default function Notifications() {
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
  const { toast } = useToast();
  const [pushSupported, setPushSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    // Load settings and push state on mount
    setSettings(getNotificationSettings());
    setPushSupported(isPushSupported());
    setPermission(getNotificationPermission());

    // Check topics/subscription silently
    (async () => {
      try {
        const t = await getPushTopics();
        setTopics(t);
        // If topics exist, we consider subscribed
        setIsSubscribed(t.length > 0);
      } catch {
        // ignore
      }
    })();
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

  const handleEnablePush = async () => {
    try {
      const perm = await requestNotificationPermission();
      setPermission(perm);
      if (perm !== "granted") {
        toast({ title: "Permission denied", description: "Enable notifications in your browser settings.", variant: "destructive" });
        return;
      }
      const sub = await subscribeToPush();
      if (sub) {
        setIsSubscribed(true);
        toast({ title: "Push enabled", description: "You will receive push notifications when supported." });
      }
    } catch (e) {
      toast({ title: "Push setup failed", description: "Please try again later.", variant: "destructive" });
    }
  };

  const handleDisablePush = async () => {
    try {
      await unsubscribeFromPush();
      setIsSubscribed(false);
      setTopics([]);
      toast({ title: "Push disabled", description: "You will no longer receive push notifications." });
    } catch (e) {
      toast({ title: "Failed to disable", description: "Please try again.", variant: "destructive" });
    }
  };

  const toggleTopic = async (topic: string) => {
    const newTopics = topics.includes(topic)
      ? topics.filter((t) => t !== topic)
      : [...topics, topic];
    setTopics(newTopics);
    try {
      await updatePushTopics(newTopics);
      toast({ title: "Preferences saved", description: "Your push topics were updated." });
    } catch {
      // revert on error
      setTopics(topics);
      toast({ title: "Save failed", description: "Could not update topics.", variant: "destructive" });
    }
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

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive notifications even when the app is closed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!pushSupported && (
              <p className="text-sm text-muted-foreground">
                Push not supported in this environment. Install as a PWA and try Chrome/Edge.
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Browser Permission</Label>
                <p className="text-sm text-muted-foreground capitalize">{permission}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEnablePush} disabled={!pushSupported || permission === "granted"}>
                  Enable
                </Button>
                <Button variant="outline" onClick={handleDisablePush} disabled={!pushSupported || !isSubscribed}>
                  Disable
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Label>Topics</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: "daily", label: "Daily Check-ins" },
                  { key: "meditation", label: "Meditation Reminders" },
                  { key: "streaks", label: "Streak Milestones" },
                  { key: "announcements", label: "Announcements" },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => toggleTopic(t.key)}
                    className={`text-left px-3 py-2 border rounded-md ${topics.includes(t.key) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                    disabled={!isSubscribed}
                  >
                    <span className="text-sm font-medium">{t.label}</span>
                    <span className="block text-xs text-muted-foreground">{topics.includes(t.key) ? 'Enabled' : 'Disabled'}</span>
                  </button>
                ))}
              </div>
              {!isSubscribed && (
                <p className="text-xs text-muted-foreground">Subscribe first to manage topics.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>In-app notifications are always available. Push requires permission and PWA install.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
