import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  BellOff, 
  Clock, 
  Heart, 
  BookOpen, 
  Wind,
  MessageCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { notificationService } from "@/lib/notificationService";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { AppBar } from "@/components/AppBar";

interface NotificationSettings {
  enabled: boolean;
  dailyCheckIn: boolean;
  meditationReminders: boolean;
  journalReminders: boolean;
  moodTracking: boolean;
  communityUpdates: boolean;
  achievementAlerts: boolean;
  reminderTime: string;
  timezone: string;
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailyCheckIn: true,
    meditationReminders: true,
    journalReminders: true,
    moodTracking: true,
    communityUpdates: false,
    achievementAlerts: true,
    reminderTime: '20:00',
    timezone: 'UTC'
  });
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
    checkPermission();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user profile for timezone
      const { data: profile } = await supabase
        .from('users_profile')
        .select('timezone')
        .eq('id', user.id)
        .single();

      if (profile) {
        setSettings(prev => ({
          ...prev,
          timezone: profile.timezone || 'UTC'
        }));
      }

      // Load notification preferences from localStorage
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings(prev => ({
          ...prev,
          ...JSON.parse(savedSettings)
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setPermission('granted');
        setSettings(prev => ({ ...prev, enabled: true }));
        await notificationService.subscribeToPushNotifications();
        await saveSettings();
      } else {
        setPermission('denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Save to localStorage
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
      
      // Update user profile timezone
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users_profile')
          .update({ timezone: settings.timezone })
          .eq('id', user.id);
      }

      // Schedule notifications if enabled
      if (settings.enabled && permission === 'granted') {
        await notificationService.scheduleSmartNotifications();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const testNotification = async () => {
    if (permission !== 'granted') return;
    
    await notificationService.showNotification({
      title: 'Test Notification',
      body: 'This is a test notification from Peace!',
      tag: 'test'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Notification Settings" />

      <div className="px-6 py-6 space-y-6">
        {/* Permission Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Permission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {permission === 'granted' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : permission === 'denied' ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <BellOff className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {permission === 'granted' ? 'Notifications Enabled' : 
                     permission === 'denied' ? 'Notifications Blocked' : 
                     'Permission Required'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {permission === 'granted' ? 'You\'ll receive notifications as configured below' :
                     permission === 'denied' ? 'Please enable notifications in your browser settings' :
                     'Click the button below to enable notifications'}
                  </p>
                </div>
              </div>
              {permission !== 'granted' && (
                <Button onClick={requestPermission}>
                  Enable Notifications
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enabled">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Turn all notifications on or off
                </p>
              </div>
              <Switch
                id="enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
                disabled={permission !== 'granted'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderTime">Reminder Time</Label>
              <Select
                value={settings.reminderTime}
                onValueChange={(value) => handleSettingChange('reminderTime', value)}
                disabled={!settings.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleSettingChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: 'dailyCheckIn',
                label: 'Daily Check-in',
                description: 'Morning wellness check-in reminders',
                icon: Heart
              },
              {
                key: 'meditationReminders',
                label: 'Meditation Reminders',
                description: 'Reminders to practice meditation',
                icon: Wind
              },
              {
                key: 'journalReminders',
                label: 'Journal Reminders',
                description: 'Reminders to write in your journal',
                icon: BookOpen
              },
              {
                key: 'moodTracking',
                label: 'Mood Tracking',
                description: 'Reminders to track your mood',
                icon: Heart
              },
              {
                key: 'communityUpdates',
                label: 'Community Updates',
                description: 'Updates from community forums',
                icon: MessageCircle
              },
              {
                key: 'achievementAlerts',
                label: 'Achievement Alerts',
                description: 'Celebrate your milestones and streaks',
                icon: CheckCircle
              }
            ].map(({ key, label, description, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor={key}>{label}</Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch
                  id={key}
                  checked={settings[key as keyof NotificationSettings] as boolean}
                  onCheckedChange={(checked) => handleSettingChange(key as keyof NotificationSettings, checked)}
                  disabled={!settings.enabled}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Test Notification */}
        <Card>
          <CardHeader>
            <CardTitle>Test Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Send a test notification to make sure everything is working correctly.
              </p>
              <Button
                onClick={testNotification}
                disabled={permission !== 'granted'}
                variant="outline"
              >
                Send Test Notification
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}