import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: "free" | "basic" | "pro" | "elite";
  onPlanUpdate: (plan: "basic" | "pro" | "elite", billing: "monthly" | "yearly") => void;
}

type PlanType = "basic" | "pro" | "elite";

const plans = [
  {
    id: "basic" as const,
    name: "Basic",
    icon: Zap,
    monthlyPrice: 299,
    yearlyPrice: 2870,
    features: [
      "AI form correction for 1 sport",
      "3 feedback sessions / week",
      "Access to verified coach directory",
      "Basic progress tracking",
      "Limited leaderboard"
    ]
  },
  {
    id: "pro" as const,
    name: "Pro",
    icon: Sparkles,
    monthlyPrice: 999,
    yearlyPrice: 9590,
    popular: true,
    features: [
      "Unlimited AI analysis + real-time feedback",
      "2 verified coach sessions / month",
      "Personal progress dashboard & insights",
      "Multi-sport access (up to 2 sports)",
      "Goal-based training recommendations"
    ]
  },
  {
    id: "elite" as const,
    name: "Elite",
    icon: Crown,
    monthlyPrice: 2499,
    yearlyPrice: 23990,
    features: [
      "Advanced AI metrics (speed, posture, alignment)",
      "4+ sessions with verified or celebrity coaches",
      "Personalized masterclasses & drills",
      "Cross-sport performance reports",
      "Early access to new features and events"
    ]
  }
];

export function SubscriptionModal({ open, onOpenChange, currentPlan, onPlanUpdate }: SubscriptionModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

  const handlePlanSelect = (plan: PlanType) => {
    if (currentPlan === plan) return;
    setSelectedPlan(plan);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!selectedPlan) return;
    
    onPlanUpdate(selectedPlan, billingCycle);
    
    toast({
      title: "Plan activated",
      description: "You can manage your subscription anytime in Settings.",
    });
    
    setShowConfirm(false);
    setSelectedPlan(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    setShowConfirm(false);
    setSelectedPlan(null);
  };

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getOriginalYearlyPrice = (plan: typeof plans[0]) => {
    return plan.monthlyPrice * 12;
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
          border: '2px solid rgba(255, 107, 0, 0.3)'
        }}
      >
        {!showConfirm ? (
          <>
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-heading" style={{ color: '#F2F2F2' }}>
                Choose Your Training Plan
              </SheetTitle>
              <SheetDescription style={{ color: '#BFBFBF' }}>
                AI Motion Analysis included on all plans • 7-Day Free Trial
              </SheetDescription>
            </SheetHeader>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
              <div 
                className="inline-flex rounded-full p-1"
                style={{ backgroundColor: '#181818', border: '1px solid rgba(255, 107, 0, 0.3)' }}
              >
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className="px-6 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    backgroundColor: billingCycle === "monthly" ? '#FF6B00' : 'transparent',
                    color: billingCycle === "monthly" ? '#FFFFFF' : '#BFBFBF',
                    boxShadow: billingCycle === "monthly" ? '0 0 20px rgba(255, 107, 0, 0.5)' : 'none'
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className="px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: billingCycle === "yearly" ? '#FF6B00' : 'transparent',
                    color: billingCycle === "yearly" ? '#FFFFFF' : '#BFBFBF',
                    boxShadow: billingCycle === "yearly" ? '0 0 20px rgba(255, 107, 0, 0.5)' : 'none'
                  }}
                >
                  Yearly
                  <span className="text-xs" style={{ color: '#FFB800' }}>Save 20%</span>
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isCurrentPlan = currentPlan === plan.id;
                const price = getPrice(plan);
                const originalYearlyPrice = getOriginalYearlyPrice(plan);
                
                return (
                  <Card
                    key={plan.id}
                    className="relative overflow-hidden transition-all hover:scale-105"
                    style={{
                      backgroundColor: '#181818',
                      border: '2px solid rgba(255, 107, 0, 0.3)',
                      boxShadow: '0 0 20px rgba(255, 107, 0, 0.2)'
                    }}
                  >
                    {plan.popular && (
                      <div 
                        className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg"
                        style={{ backgroundColor: '#FF6B00', color: '#FFFFFF' }}
                      >
                        Most Popular
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: 'rgba(255, 107, 0, 0.2)' }}
                        >
                          <Icon className="h-6 w-6" style={{ color: '#FF6B00' }} />
                        </div>
                        <h3 className="text-xl font-heading" style={{ color: '#F2F2F2' }}>
                          {plan.name}
                        </h3>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold" style={{ color: '#FF6B00' }}>
                            ₹{price}
                          </span>
                          <span style={{ color: '#BFBFBF' }}>
                            / {billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        {billingCycle === "yearly" && (
                          <div className="mt-1">
                            <span 
                              className="text-sm line-through"
                              style={{ color: '#666666' }}
                            >
                              ₹{originalYearlyPrice}
                            </span>
                          </div>
                        )}
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#FF6B00' }} />
                            <span className="text-sm" style={{ color: '#BFBFBF' }}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {isCurrentPlan ? (
                        <div 
                          className="w-full py-2 text-center rounded-lg font-medium"
                          style={{
                            backgroundColor: 'transparent',
                            border: '2px solid #FF6B00',
                            color: '#F2F2F2'
                          }}
                        >
                          Current Plan
                        </div>
                      ) : (
                        <Button
                          onClick={() => handlePlanSelect(plan.id)}
                          className="w-full font-semibold transition-all hover:scale-105"
                          style={{
                            backgroundColor: plan.id === "pro" ? '#FF6B00' : 'transparent',
                            color: plan.id === "pro" ? '#FFFFFF' : '#FF6B00',
                            border: plan.id === "pro" ? 'none' : '2px solid #FF6B00',
                            boxShadow: '0 0 20px rgba(255, 107, 0, 0.3)'
                          }}
                        >
                          {plan.id === "basic" && "Choose Basic"}
                          {plan.id === "pro" && "Upgrade to Pro"}
                          {plan.id === "elite" && "Go Elite"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-6"
              style={{ color: '#FF6B00' }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-heading" style={{ color: '#F2F2F2' }}>
                Confirm Your Plan
              </SheetTitle>
            </SheetHeader>

            {selectedPlanData && (
              <Card
                className="mb-6"
                style={{
                  backgroundColor: '#181818',
                  border: '2px solid rgba(255, 107, 0, 0.3)'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <selectedPlanData.icon className="h-8 w-8" style={{ color: '#FF6B00' }} />
                    <div>
                      <h3 className="text-2xl font-heading" style={{ color: '#F2F2F2' }}>
                        {selectedPlanData.name}
                      </h3>
                      <p style={{ color: '#BFBFBF' }}>
                        {billingCycle === "monthly" ? "Monthly" : "Yearly"} Billing
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)' }}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span style={{ color: '#BFBFBF' }}>
                        {billingCycle === "monthly" ? "Monthly" : "Annual"} Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        {billingCycle === "yearly" && (
                          <span 
                            className="text-sm line-through"
                            style={{ color: '#666666' }}
                          >
                            ₹{getOriginalYearlyPrice(selectedPlanData)}
                          </span>
                        )}
                        <span className="text-3xl font-bold" style={{ color: '#FF6B00' }}>
                          ₹{getPrice(selectedPlanData)}
                        </span>
                      </div>
                    </div>
                    {billingCycle === "yearly" && (
                      <p className="text-sm text-right" style={{ color: '#FFB800' }}>
                        You save ₹{getOriginalYearlyPrice(selectedPlanData) - getPrice(selectedPlanData)} per year
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3" style={{ color: '#F2F2F2' }}>
                      What's included:
                    </h4>
                    <ul className="space-y-2">
                      {selectedPlanData.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#FF6B00' }} />
                          <span style={{ color: '#BFBFBF' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div 
                    className="p-3 rounded-lg mb-6 text-sm"
                    style={{ 
                      backgroundColor: 'rgba(255, 184, 0, 0.1)',
                      border: '1px solid rgba(255, 184, 0, 0.3)'
                    }}
                  >
                    <span style={{ color: '#FFB800' }}>
                      ✨ 7-Day Free Trial • Cancel anytime
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                      style={{
                        borderColor: 'rgba(255, 107, 0, 0.5)',
                        color: '#FF6B00'
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="flex-1 font-semibold"
                      style={{
                        backgroundColor: '#FF6B00',
                        color: '#FFFFFF',
                        boxShadow: '0 0 20px rgba(255, 107, 0, 0.5)'
                      }}
                    >
                      Confirm & Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
