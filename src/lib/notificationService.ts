import { supabase } from '@/integrations/supabase/client';

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private registration: ServiceWorkerRegistration | null = null;

  async initialize() {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    // Check current permission
    this.permission = Notification.permission;

    // Register service worker if not already registered
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    return this.permission === 'granted';
  }

  async requestPermission(): Promise<boolean> {
    if (this.permission === 'granted') return true;
    if (this.permission === 'denied') return false;

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async subscribeToPushNotifications(): Promise<boolean> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      });

      // Save subscription to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('push_subscriptions')
          .upsert({
            user_id: user.id,
            endpoint: subscription.endpoint,
            p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
            auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
          });
      }

      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }

  async showNotification(data: NotificationData): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const options: NotificationOptions = {
      body: data.body,
      icon: data.icon || '/logo.png',
      badge: data.badge || '/logo.png',
      tag: data.tag,
      data: data.data,
      actions: data.actions,
      requireInteraction: false,
      silent: false
    };

    if (this.registration) {
      // Use service worker for better control
      this.registration.showNotification(data.title, options);
    } else {
      // Fallback to basic notification
      new Notification(data.title, options);
    }
  }

  async scheduleNotification(data: NotificationData, delay: number): Promise<void> {
    setTimeout(() => {
      this.showNotification(data);
    }, delay);
  }

  async scheduleRepeatingNotification(
    data: NotificationData, 
    interval: number
  ): Promise<number> {
    return setInterval(() => {
      this.showNotification(data);
    }, interval);
  }

  async cancelScheduledNotification(intervalId: number): Promise<void> {
    clearInterval(intervalId);
  }

  // Smart notification scheduling based on user behavior
  async scheduleSmartNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get user's timezone and preferences
    const { data: profile } = await supabase
      .from('users_profile')
      .select('timezone')
      .eq('id', user.id)
      .single();

    const timezone = profile?.timezone || 'UTC';

    // Schedule daily check-in
    this.scheduleDailyCheckIn(timezone);
    
    // Schedule meditation reminders
    this.scheduleMeditationReminders(timezone);
    
    // Schedule journal reminders
    this.scheduleJournalReminders(timezone);
    
    // Schedule mood tracking reminders
    this.scheduleMoodTrackingReminders(timezone);
  }

  private async scheduleDailyCheckIn(timezone: string) {
    const checkInTime = this.getTimeInTimezone('09:00', timezone);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const scheduledTime = new Date(today.getTime() + checkInTime.getTime());
    
    if (scheduledTime > now) {
      const delay = scheduledTime.getTime() - now.getTime();
      this.scheduleNotification({
        title: 'Daily Check-in',
        body: 'How are you feeling today? Take a moment to reflect on your wellbeing.',
        tag: 'daily_checkin',
        data: { type: 'daily_checkin', action: 'open_dashboard' }
      }, delay);
    }
  }

  private async scheduleMeditationReminders(timezone: string) {
    const meditationTime = this.getTimeInTimezone('20:00', timezone);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const scheduledTime = new Date(today.getTime() + meditationTime.getTime());
    
    if (scheduledTime > now) {
      const delay = scheduledTime.getTime() - now.getTime();
      this.scheduleNotification({
        title: 'Meditation Time',
        body: 'Take a few minutes to center yourself with meditation.',
        tag: 'meditation_reminder',
        data: { type: 'meditation', action: 'open_meditations' }
      }, delay);
    }
  }

  private async scheduleJournalReminders(timezone: string) {
    const journalTime = this.getTimeInTimezone('21:00', timezone);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const scheduledTime = new Date(today.getTime() + journalTime.getTime());
    
    if (scheduledTime > now) {
      const delay = scheduledTime.getTime() - now.getTime();
      this.scheduleNotification({
        title: 'Journal Entry',
        body: 'Capture your thoughts and feelings in your journal.',
        tag: 'journal_reminder',
        data: { type: 'journal', action: 'open_journal' }
      }, delay);
    }
  }

  private async scheduleMoodTrackingReminders(timezone: string) {
    const moodTime = this.getTimeInTimezone('18:00', timezone);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const scheduledTime = new Date(today.getTime() + moodTime.getTime());
    
    if (scheduledTime > now) {
      const delay = scheduledTime.getTime() - now.getTime();
      this.scheduleNotification({
        title: 'Mood Check',
        body: 'Track your mood to better understand your patterns.',
        tag: 'mood_tracking',
        data: { type: 'mood', action: 'open_moods' }
      }, delay);
    }
  }

  private getTimeInTimezone(timeString: string, timezone: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const targetTime = new Date(utc);
    targetTime.setHours(hours, minutes, 0, 0);
    return targetTime;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Engagement notifications
  async sendEngagementNotification(type: 'achievement' | 'streak' | 'milestone', data: any) {
    let notification: NotificationData;

    switch (type) {
      case 'achievement':
        notification = {
          title: 'Achievement Unlocked! 🎉',
          body: `You've completed ${data.count} ${data.activity} sessions!`,
          tag: 'achievement',
          data: { type: 'achievement', ...data }
        };
        break;
      case 'streak':
        notification = {
          title: 'Streak Alert! 🔥',
          body: `You're on a ${data.days}-day streak! Keep it up!`,
          tag: 'streak',
          data: { type: 'streak', ...data }
        };
        break;
      case 'milestone':
        notification = {
          title: 'Milestone Reached! 🌟',
          body: `Congratulations on reaching ${data.milestone}!`,
          tag: 'milestone',
          data: { type: 'milestone', ...data }
        };
        break;
    }

    await this.showNotification(notification);
  }

  // Crisis support notifications
  async sendCrisisSupportNotification() {
    await this.showNotification({
      title: 'You\'re Not Alone 💙',
      body: 'If you\'re struggling, please reach out. Help is available 24/7.',
      tag: 'crisis_support',
      data: { type: 'crisis_support' },
      actions: [
        { action: 'call_helpline', title: 'Call Helpline' },
        { action: 'open_chat', title: 'Talk to Peace' }
      ]
    });
  }
}

export const notificationService = new NotificationService();