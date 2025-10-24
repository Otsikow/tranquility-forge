import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserSubscription, PremiumFeature, SubscriptionTier } from "@/types/db";
import { BottomNav } from "@/components/BottomNav";

const subscriptionPlans = [
  {
    tier: 'free' as SubscriptionTier,
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Basic features to get started',
    features: [
      'Basic journal entries',
      'Limited meditations',
      'Mood tracking',
      'Basic AI chat',
      'Community access'
    ],
    color: 'bg-gray-100',
    textColor: 'text-gray-600',
    icon: Star
  },
  {
    tier: 'premium' as SubscriptionTier,
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    description: 'Everything you need for mental wellness',
    features: [
      'Unlimited journal entries',
      'All meditations & sleep stories',
      'Advanced mood analytics',
      'CBT tools & exercises',
      'Community forums',
      'Priority support',
      'Offline access'
    ],
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
    icon: Crown,
    popular: true
  },
  {
    tier: 'pro' as SubscriptionTier,
    name: 'Pro',
    price: '$19.99',
    period: 'month',
    description: 'Complete mental health toolkit',
    features: [
      'Everything in Premium',
      'Personal coach access',
      'Custom meditation creation',
      'Advanced sleep tracking',
      'Family sharing',
      '24/7 priority support',
      'Early access to features'
    ],
    color: 'bg-purple-100',
    textColor: 'text-purple-600',
    icon: Crown
  }
];

export default function Subscription() {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load current subscription
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (subscriptionData) {
        setCurrentSubscription(subscriptionData as UserSubscription);
      }

      // Load premium features
      const { data: featuresData } = await supabase
        .from('premium_features')
        .select('*')
        .order('tier_required', { ascending: true });

      if (featuresData) {
        setPremiumFeatures(featuresData as PremiumFeature[]);
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    // In a real app, this would integrate with Stripe
    console.log(`Upgrading to ${tier} plan`);
    // For now, just show a message
    alert(`Upgrade to ${tier} plan - This would integrate with Stripe in production`);
  };

  const getCurrentPlan = () => {
    if (!currentSubscription) return subscriptionPlans[0];
    return subscriptionPlans.find(plan => plan.tier === currentSubscription.tier) || subscriptionPlans[0];
  };

  const getFeaturesForTier = (tier: SubscriptionTier) => {
    return premiumFeatures.filter(feature => {
      const tierOrder = { free: 0, premium: 1, pro: 2 };
      return tierOrder[tier] >= tierOrder[feature.tier_required];
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

  const currentPlan = getCurrentPlan();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Subscription</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentPlan.color}`}>
                <currentPlan.icon className={`h-4 w-4 ${currentPlan.textColor}`} />
              </div>
              Current Plan: {currentPlan.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{currentPlan.price}</p>
                  <p className="text-sm text-muted-foreground">per {currentPlan.period}</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Available Plans</h2>
          <div className="grid gap-4">
            {subscriptionPlans.map((plan) => {
              const isCurrentPlan = plan.tier === currentPlan.tier;
              const IconComponent = plan.icon;
              
              return (
                <Card key={plan.tier} className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
                  {plan.popular && !isCurrentPlan && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.color}`}>
                        <IconComponent className={`h-5 w-5 ${plan.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{plan.price}</p>
                        <p className="text-sm text-muted-foreground">per {plan.period}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4">
                        {isCurrentPlan ? (
                          <Button disabled className="w-full">
                            Current Plan
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleUpgrade(plan.tier)}
                            className="w-full"
                            variant={plan.popular ? "default" : "outline"}
                          >
                            {plan.tier === 'free' ? 'Downgrade' : 'Upgrade'} to {plan.name}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Premium Features */}
        <Card>
          <CardHeader>
            <CardTitle>Premium Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {premiumFeatures.map((feature) => {
                const hasAccess = getFeaturesForTier(currentPlan.tier).some(f => f.id === feature.id);
                
                return (
                  <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasAccess ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {hasAccess ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Crown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{feature.name}</p>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <Badge variant={hasAccess ? "default" : "outline"}>
                      {hasAccess ? 'Included' : feature.tier_required}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}