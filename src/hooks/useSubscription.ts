import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier, getSubscriptionManager } from "@/lib/subscriptionManager";

export function useSubscription() {
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setTier("free");
          setIsLoading(false);
          return;
        }

        // Fetch user's subscription from database
        const { data, error } = await supabase
          .from("user_subscriptions")
          .select(`
            *,
            tier:subscription_tiers(name)
          `)
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (error || !data) {
          setTier("free");
        } else {
          setTier((data.tier as any)?.name || "free");
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setTier("free");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  const subscriptionManager = getSubscriptionManager(tier);

  return {
    tier,
    isLoading,
    features: subscriptionManager.getFeatures(),
    hasAccess: subscriptionManager.hasAccess.bind(subscriptionManager),
    canAccessContent: subscriptionManager.canAccessContent.bind(subscriptionManager),
    getUpgradeMessage: subscriptionManager.getUpgradeMessage.bind(subscriptionManager),
    shouldShowUpgradePrompt: subscriptionManager.shouldShowUpgradePrompt.bind(subscriptionManager),
  };
}
