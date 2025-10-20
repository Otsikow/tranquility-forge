import { toast } from "@/hooks/use-toast";

export interface NotificationSettings {
  dailyCheckIn: boolean;
  streakAlerts: boolean;
  meditationReminders: boolean;
  checkInTime: string; // HH:MM format
  meditationTime: string; // HH:MM format
}

const DEFAULT_SETTINGS: NotificationSettings = {
  dailyCheckIn: true,
  streakAlerts: true,
  meditationReminders: true,
  checkInTime: "09:00",
  meditationTime: "20:00",
};

const STORAGE_KEY = "notification-settings";

// Get notification settings from localStorage
export const getNotificationSettings = (): NotificationSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Failed to load notification settings:", e);
  }
  return DEFAULT_SETTINGS;
};

// Save notification settings to localStorage
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Reschedule notifications with new settings
    scheduleNotifications(settings);
  } catch (e) {
    console.error("Failed to save notification settings:", e);
  }
};

export interface NotifyOptions {
  title: string;
  description?: string;
  type?: "default" | "destructive";
}

// Main notification utility - extensible for push notifications
export const notify = (options: NotifyOptions) => {
  const { title, description, type = "default" } = options;

  // In-app notification using toast
  toast({
    title,
    description,
    variant: type === "destructive" ? "destructive" : undefined,
  });

  // TODO: Add push notification support here
  // if (pushNotificationsEnabled && 'Notification' in window) {
  //   new Notification(title, { body: description });
  // }
};

// Notification scheduler - currently local, can be expanded with cron
interface ScheduledNotification {
  id: string;
  type: keyof Pick<NotificationSettings, "dailyCheckIn" | "meditationReminders">;
  time: string;
  timeoutId?: number;
}

let scheduledNotifications: ScheduledNotification[] = [];

// Calculate milliseconds until next occurrence of time
const msUntilTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  // If target time has passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
};

// Schedule a notification
const scheduleNotification = (
  type: keyof Pick<NotificationSettings, "dailyCheckIn" | "meditationReminders">,
  time: string,
  enabled: boolean
): void => {
  // Remove existing scheduled notification of this type
  const existing = scheduledNotifications.find((n) => n.type === type);
  if (existing?.timeoutId) {
    clearTimeout(existing.timeoutId);
  }

  if (!enabled) {
    scheduledNotifications = scheduledNotifications.filter((n) => n.type !== type);
    return;
  }

  const ms = msUntilTime(time);
  
  const timeoutId = window.setTimeout(() => {
    // Trigger the notification
    if (type === "dailyCheckIn") {
      notify({
        title: "Daily Check-In",
        description: "Take a moment to reflect on your day and log your mood.",
      });
    } else if (type === "meditationReminders") {
      notify({
        title: "Time to Meditate",
        description: "Take a peaceful break with a guided meditation session.",
      });
    }

    // Reschedule for next day
    scheduleNotification(type, time, enabled);
  }, ms);

  const notification: ScheduledNotification = {
    id: `${type}-${Date.now()}`,
    type,
    time,
    timeoutId,
  };

  scheduledNotifications = scheduledNotifications.filter((n) => n.type !== type);
  scheduledNotifications.push(notification);
};

// Schedule all notifications based on settings
export const scheduleNotifications = (settings: NotificationSettings): void => {
  scheduleNotification("dailyCheckIn", settings.checkInTime, settings.dailyCheckIn);
  scheduleNotification("meditationReminders", settings.meditationTime, settings.meditationReminders);
};

// Initialize scheduler on app load
export const initializeNotificationScheduler = (): void => {
  const settings = getNotificationSettings();
  scheduleNotifications(settings);
};

// Trigger a streak alert (called from app logic)
export const notifyStreakAlert = (streak: number, milestone?: boolean): void => {
  const settings = getNotificationSettings();
  if (!settings.streakAlerts) return;

  if (milestone) {
    notify({
      title: `🔥 ${streak}-Day Milestone!`,
      description: `Amazing! You've maintained your practice for ${streak} days straight.`,
    });
  } else {
    notify({
      title: `${streak}-Day Streak!`,
      description: "Keep up the great work!",
    });
  }
};
