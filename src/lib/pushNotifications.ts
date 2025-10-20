import { supabase } from "@/integrations/supabase/client";

// Check if push notifications are supported
export const isPushSupported = (): boolean => {
  return 'PushManager' in window && 'serviceWorker' in navigator && 'Notification' in window;
};

// Check current notification permission
export const getNotificationPermission = (): NotificationPermission => {
  return Notification.permission;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported');
  }

  const permission = await Notification.requestPermission();
  return permission;
};

// Subscribe to push notifications
export const subscribeToPush = async (): Promise<PushSubscription | null> => {
  try {
    if (!isPushSupported()) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('[Push] Permission denied');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Create new subscription
      // Note: VAPID public key would come from environment
      // For now, we'll use a placeholder
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrHL4jNt-6lFNzLEZp2UpDDxJqTJjqnSCBKMgDVPTcVVhqD_0tM'
        ) as BufferSource,
      });
    }

    // Save subscription to database
    const { endpoint, keys } = subscription.toJSON();
    
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.user.id,
        endpoint: endpoint!,
        p256dh: keys!.p256dh,
        auth: keys!.auth,
      }, {
        onConflict: 'endpoint',
      });

    if (error) {
      console.error('[Push] Failed to save subscription:', error);
      throw error;
    }

    console.log('[Push] Subscription saved');
    return subscription;
  } catch (error) {
    console.error('[Push] Subscription failed:', error);
    throw error;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async (): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      
      // Remove from database
      const { endpoint } = subscription.toJSON();
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', endpoint);
      
      console.log('[Push] Unsubscribed successfully');
    }
  } catch (error) {
    console.error('[Push] Unsubscribe failed:', error);
    throw error;
  }
};

// Update subscription topics
export const updatePushTopics = async (topics: string[]): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      throw new Error('No active subscription');
    }

    const { endpoint } = subscription.toJSON();
    
    const { error } = await supabase
      .from('push_subscriptions')
      .update({ topics })
      .eq('endpoint', endpoint);

    if (error) throw error;
    
    console.log('[Push] Topics updated:', topics);
  } catch (error) {
    console.error('[Push] Failed to update topics:', error);
    throw error;
  }
};

// Get current subscription topics
export const getPushTopics = async (): Promise<string[]> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      return [];
    }

    const { endpoint } = subscription.toJSON();
    
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('topics')
      .eq('endpoint', endpoint)
      .single();

    if (error) throw error;
    
    return data?.topics || [];
  } catch (error) {
    console.error('[Push] Failed to get topics:', error);
    return [];
  }
};

// Helper: Convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
