import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageCircle, TrendingUp, Heart } from "lucide-react";

export default function Notifications() {
  const [dailyReminders, setDailyReminders] = useState(true);
  const [moodTracking, setMoodTracking] = useState(true);
  const [journalReminders, setJournalReminders] = useState(false);
  const [affirmations, setAffirmations] = useState(true);
  const [weeklyInsights, setWeeklyInsights] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Notifications" showBack />

      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive notifications on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="daily-reminders" className="text-base font-medium">
                  Daily Meditation Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded to take time for mindfulness
                </p>
              </div>
              <Switch
                id="daily-reminders"
                checked={dailyReminders}
                onCheckedChange={setDailyReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="mood-tracking" className="text-base font-medium">
                  Mood Check-in
                </Label>
                <p className="text-sm text-muted-foreground">
                  Daily prompts to track your mood
                </p>
              </div>
              <Switch
                id="mood-tracking"
                checked={moodTracking}
                onCheckedChange={setMoodTracking}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="journal-reminders" className="text-base font-medium">
                  Journal Prompts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Gentle reminders to reflect and journal
                </p>
              </div>
              <Switch
                id="journal-reminders"
                checked={journalReminders}
                onCheckedChange={setJournalReminders}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="affirmations" className="text-base font-medium">
                  Daily Affirmations
                </Label>
                <p className="text-sm text-muted-foreground">
                  Start your day with positive messages
                </p>
              </div>
              <Switch
                id="affirmations"
                checked={affirmations}
                onCheckedChange={setAffirmations}
              />
            </div>
          </CardContent>
        </Card>

        {/* Insights & Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Insights & Reports
            </CardTitle>
            <CardDescription>
              Receive periodic summaries of your wellbeing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="weekly-insights" className="text-base font-medium">
                  Weekly Insights
                </Label>
                <p className="text-sm text-muted-foreground">
                  Summary of your mood patterns and progress
                </p>
              </div>
              <Switch
                id="weekly-insights"
                checked={weeklyInsights}
                onCheckedChange={setWeeklyInsights}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Email Preferences
            </CardTitle>
            <CardDescription>
              Manage email communications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="email-notifications" className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates and reminders via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Master Toggle */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="push-notifications" className="text-base font-semibold">
                  Enable All Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Turn all notifications on or off at once
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
