import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { toast } from "sonner";
import {
  isPushSupported,
  getNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  updatePushTopics,
  getPushTopics,
} from "@/lib/pushNotifications";

interface NotificationTopic {
  id: string;
  label: string;
  description: string;
}

const TOPICS: NotificationTopic[] = [
  {
    id: 'daily_checkin',
    label: 'Daily Check-in',
    description: 'Gentle reminder to check in with yourself',
  },
  {
    id: 'affirmation',
    label: 'Affirmation of the Day',
    description: 'Receive your daily affirmation',
  },
  {
    id: 'breathing',
    label: 'Breathing Reminder',
    description: 'Take a moment to breathe',
  },
  {
    id: 'weekly_reflection',
    label: 'Weekly Reflection',
    description: 'Review your week and set intentions',
  },
];

export const NotificationSettings = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const supported = isPushSupported();
    setIsSupported(supported);

    if (supported) {
      const permission = getNotificationPermission();
      setIsSubscribed(permission === 'granted');

      if (permission === 'granted') {
        const topics = await getPushTopics();
        setSelectedTopics(topics);
      }
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const subscription = await subscribeToPush();
      
      if (subscription) {
        setIsSubscribed(true);
        // Set default topics
        const defaultTopics = TOPICS.map(t => t.id);
        await updatePushTopics(defaultTopics);
        setSelectedTopics(defaultTopics);
        
        toast.success("Notifications enabled", {
          description: "You'll receive updates from Peace",
        });
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      toast.error("Failed to enable notifications", {
        description: "Please try again or check your browser settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await unsubscribeFromPush();
      setIsSubscribed(false);
      setSelectedTopics([]);
      
      toast.success("Notifications disabled", {
        description: "You won't receive any more updates",
      });
    } catch (error) {
      console.error('Unsubscribe error:', error);
      toast.error("Failed to disable notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicToggle = async (topicId: string) => {
    const newTopics = selectedTopics.includes(topicId)
      ? selectedTopics.filter(t => t !== topicId)
      : [...selectedTopics, topicId];

    setSelectedTopics(newTopics);

    try {
      await updatePushTopics(newTopics);
      toast.success("Preferences updated");
    } catch (error) {
      console.error('Update topics error:', error);
      toast.error("Failed to update preferences");
      // Revert on error
      setSelectedTopics(selectedTopics);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive gentle reminders and updates
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Enable Notifications</Label>
            <p className="text-sm text-muted-foreground">
              {isSubscribed ? 'Notifications are active' : 'Turn on to receive updates'}
            </p>
          </div>
          <Button
            variant={isSubscribed ? "outline" : "default"}
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? "..." : isSubscribed ? "Disable" : "Enable"}
          </Button>
        </div>

        {isSubscribed && (
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base">Notification Topics</Label>
            
            {TOPICS.map((topic) => (
              <div key={topic.id} className="flex items-start justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={topic.id} className="cursor-pointer">
                    {topic.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
                <Switch
                  id={topic.id}
                  checked={selectedTopics.includes(topic.id)}
                  onCheckedChange={() => handleTopicToggle(topic.id)}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
