/**
 * Subscription and feature access management
 */

export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface SubscriptionFeatures {
  // Core features
  basicMeditations: boolean;
  premiumMeditations: boolean;
  journalEntries: boolean;
  moodTracking: boolean;
  
  // AI Chat
  aiChatLimited: boolean;
  aiChatUnlimited: boolean;
  
  // CBT Tools
  cbtToolsBasic: boolean;
  cbtToolsAdvanced: boolean;
  
  // Sleep
  sleepStoriesBasic: boolean;
  sleepStoriesUnlimited: boolean;
  sleepSoundscapes: boolean;
  sleepTracking: boolean;
  
  // Community
  communityReadOnly: boolean;
  communityPosting: boolean;
  supportGroups: boolean;
  privateSupportGroups: boolean;
  
  // Other features
  breathingExercises: boolean;
  affirmations: boolean;
  analytics: boolean;
  dataExport: boolean;
  prioritySupport: boolean;
  adFree: boolean;
  
  // Limits
  aiMessagesPerDay: number | null; // null = unlimited
  journalEntriesPerMonth: number | null;
}

const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    basicMeditations: true,
    premiumMeditations: false,
    journalEntries: true,
    moodTracking: true,
    aiChatLimited: true,
    aiChatUnlimited: false,
    cbtToolsBasic: true,
    cbtToolsAdvanced: false,
    sleepStoriesBasic: true,
    sleepStoriesUnlimited: false,
    sleepSoundscapes: false,
    sleepTracking: false,
    communityReadOnly: true,
    communityPosting: false,
    supportGroups: false,
    privateSupportGroups: false,
    breathingExercises: true,
    affirmations: true,
    analytics: false,
    dataExport: false,
    prioritySupport: false,
    adFree: false,
    aiMessagesPerDay: 10,
    journalEntriesPerMonth: null
  },
  premium: {
    basicMeditations: true,
    premiumMeditations: true,
    journalEntries: true,
    moodTracking: true,
    aiChatLimited: false,
    aiChatUnlimited: true,
    cbtToolsBasic: true,
    cbtToolsAdvanced: true,
    sleepStoriesBasic: true,
    sleepStoriesUnlimited: true,
    sleepSoundscapes: true,
    sleepTracking: true,
    communityReadOnly: true,
    communityPosting: true,
    supportGroups: true,
    privateSupportGroups: false,
    breathingExercises: true,
    affirmations: true,
    analytics: true,
    dataExport: false,
    prioritySupport: true,
    adFree: true,
    aiMessagesPerDay: null,
    journalEntriesPerMonth: null
  },
  pro: {
    basicMeditations: true,
    premiumMeditations: true,
    journalEntries: true,
    moodTracking: true,
    aiChatLimited: false,
    aiChatUnlimited: true,
    cbtToolsBasic: true,
    cbtToolsAdvanced: true,
    sleepStoriesBasic: true,
    sleepStoriesUnlimited: true,
    sleepSoundscapes: true,
    sleepTracking: true,
    communityReadOnly: true,
    communityPosting: true,
    supportGroups: true,
    privateSupportGroups: true,
    breathingExercises: true,
    affirmations: true,
    analytics: true,
    dataExport: true,
    prioritySupport: true,
    adFree: true,
    aiMessagesPerDay: null,
    journalEntriesPerMonth: null
  }
};

export class SubscriptionManager {
  private currentTier: SubscriptionTier;

  constructor(tier: SubscriptionTier = 'free') {
    this.currentTier = tier;
  }

  setTier(tier: SubscriptionTier) {
    this.currentTier = tier;
  }

  getTier(): SubscriptionTier {
    return this.currentTier;
  }

  getFeatures(): SubscriptionFeatures {
    return TIER_FEATURES[this.currentTier];
  }

  hasAccess(feature: keyof SubscriptionFeatures): boolean {
    return !!TIER_FEATURES[this.currentTier][feature];
  }

  canAccessContent(isPremium: boolean): boolean {
    if (!isPremium) return true;
    return this.currentTier === 'premium' || this.currentTier === 'pro';
  }

  getUpgradeMessage(feature: string): string {
    const tier = this.currentTier;
    
    if (tier === 'free') {
      return `Upgrade to Premium to unlock ${feature} and more!`;
    } else if (tier === 'premium') {
      return `Upgrade to Pro to access ${feature} and advanced features!`;
    }
    
    return `This feature is available in higher tiers.`;
  }

  getRemainingUsage(feature: 'aiMessages' | 'journalEntries'): {
    used: number;
    limit: number | null;
    remaining: number | null;
  } {
    // This would be fetched from actual usage data
    // For now, return mock data
    if (feature === 'aiMessages') {
      const limit = this.getFeatures().aiMessagesPerDay;
      return {
        used: 3,
        limit,
        remaining: limit ? limit - 3 : null
      };
    }
    
    return {
      used: 0,
      limit: null,
      remaining: null
    };
  }

  shouldShowUpgradePrompt(feature: keyof SubscriptionFeatures): boolean {
    return !this.hasAccess(feature) && this.currentTier !== 'pro';
  }
}

// Singleton instance
let subscriptionManager: SubscriptionManager | null = null;

export function getSubscriptionManager(tier?: SubscriptionTier): SubscriptionManager {
  if (!subscriptionManager) {
    subscriptionManager = new SubscriptionManager(tier);
  }
  return subscriptionManager;
}

export function initializeSubscription(tier: SubscriptionTier) {
  subscriptionManager = new SubscriptionManager(tier);
}
