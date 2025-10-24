import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Crown, Zap, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();
  const currentTier = "free"; // This would come from user context

  const tiers = [
    {
      id: "free",
      name: "Free",
      displayName: "Free",
      icon: Sparkles,
      color: "text-gray-500",
      priceMonthly: 0,
      priceYearly: 0,
      description: "Perfect for getting started",
      features: [
        "Basic meditations",
        "Journal entries",
        "Mood tracking",
        "AI chat (limited)",
        "Breathing exercises",
        "Community access (read-only)"
      ],
      cta: "Current Plan"
    },
    {
      id: "premium",
      name: "Premium",
      displayName: "Premium",
      icon: Crown,
      color: "text-amber-500",
      priceMonthly: 9.99,
      priceYearly: 99.99,
      description: "Unlock advanced features",
      popular: true,
      features: [
        "All Free features",
        "Unlimited AI chat",
        "Premium meditations",
        "CBT tools & worksheets",
        "Sleep stories",
        "Community posting",
        "Support groups",
        "Priority support",
        "Ad-free experience"
      ],
      cta: "Upgrade to Premium"
    },
    {
      id: "pro",
      name: "Pro",
      displayName: "Pro",
      icon: Zap,
      color: "text-purple-500",
      priceMonthly: 19.99,
      priceYearly: 199.99,
      description: "Complete wellness toolkit",
      features: [
        "All Premium features",
        "Advanced analytics",
        "Personalized insights",
        "Unlimited sleep content",
        "Private support groups",
        "Export data",
        "Custom reminders",
        "1-on-1 coaching (monthly)",
        "Early access to features"
      ],
      cta: "Upgrade to Pro"
    }
  ];

  const handleSubscribe = (tierId: string) => {
    if (tierId === currentTier) return;
    
    toast({
      title: "Redirecting to checkout...",
      description: "You'll be redirected to complete your subscription.",
    });
    
    // In production, this would redirect to Stripe/payment processor
    console.log(`Subscribing to ${tierId} - ${billingCycle}`);
  };

  const getPrice = (tier: typeof tiers[0]) => {
    const price = billingCycle === "monthly" ? tier.priceMonthly : tier.priceYearly;
    if (price === 0) return "Free";
    
    if (billingCycle === "yearly") {
      const monthlyEquivalent = (price / 12).toFixed(2);
      return (
        <div>
          <span className="text-3xl font-bold">${monthlyEquivalent}</span>
          <span className="text-muted-foreground">/month</span>
          <p className="text-xs text-muted-foreground mt-1">
            ${price}/year (save {Math.round(((tier.priceMonthly * 12 - price) / (tier.priceMonthly * 12)) * 100)}%)
          </p>
        </div>
      );
    }
    
    return (
      <div>
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-muted-foreground">/month</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Subscription" />

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg">
            Invest in your mental wellbeing today
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={billingCycle === "monthly" ? "font-semibold" : "text-muted-foreground"}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === "yearly"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
            />
            <span className={billingCycle === "yearly" ? "font-semibold" : "text-muted-foreground"}>
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <Badge variant="secondary" className="ml-2">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isCurrentPlan = tier.id === currentTier;
            const isPopular = tier.popular;

            return (
              <Card 
                key={tier.id}
                className={`relative ${isPopular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'bg-accent/50' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 ${tier.color}`} />
                    <CardTitle className="text-2xl">{tier.displayName}</CardTitle>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="pt-2">
                    {getPrice(tier)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                    disabled={isCurrentPlan}
                    onClick={() => handleSubscribe(tier.id)}
                  >
                    {isCurrentPlan ? "Current Plan" : tier.cta}
                  </Button>

                  <div className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! You can cancel your subscription at any time from your account settings. 
                You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, debit cards, and digital wallets through our 
                secure payment processor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Is there a free trial?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! Premium and Pro plans include a 7-day free trial. You won't be charged 
                until the trial ends.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Can I switch plans?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take 
                effect at the start of your next billing cycle.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <div className="text-center space-y-4 py-8">
          <p className="text-sm text-muted-foreground">
            Trusted by over 100,000 users worldwide
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-muted-foreground text-sm">🔒 Secure Payment</div>
            <div className="text-muted-foreground text-sm">✓ Money-back Guarantee</div>
            <div className="text-muted-foreground text-sm">⭐ 4.8/5 Rating</div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
