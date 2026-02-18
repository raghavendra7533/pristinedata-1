import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, Zap, Crown, ChevronDown, Info } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  currentBillingPeriod?: "monthly" | "annual";
  onPlanUpgrade: (planName: string, credits: number, billingPeriod: "monthly" | "annual") => void;
  onCreditsPurchase: (credits: number) => void;
}

const PLANS = [
  {
    name: "Starter",
    price: 499,
    credits: 8000,
    icon: Zap,
    features: [
      "8,000 monthly credits",
      "Priority support",
      "Email & mobile enrichment",
      "AI insights",
      "Competitive entry point",
      "1 user seat included",
      "Add-on seats $99/mo"
    ],
    color: "from-cyan-500 to-cyan-600"
  },
  {
    name: "Growth",
    price: 999,
    credits: 17600,
    icon: Crown,
    popular: true,
    features: [
      "17,600 monthly credits",
      "Priority support",
      "Advanced integrations",
      "Advanced analytics",
      "Scales with usage, high ROI",
      "3 user seats included",
      "Add-on seats $89/mo",
      "Custom workflows"
    ],
    color: "from-violet-500 to-violet-600"
  },
  {
    name: "Enterprise",
    price: 1500,
    credits: 25000,
    icon: Crown,
    isCustom: true,
    features: [
      "25,000+ monthly credits",
      "24/7 dedicated support",
      "All integrations",
      "Custom analytics",
      "Custom user seats",
      "Add-on seats $79-$99/mo",
      "Volume discount pricing",
      "API access",
      "White-label options"
    ],
    color: "from-amber-500 to-amber-600"
  }
];

const CREDIT_PACKS = [
  { 
    credits: 1000, 
    price: 80, 
    pricePerCredit: 0.080,
    tooltip: "1,000 credits → 500 contacts enriched + 500 emails personalized"
  },
  { 
    credits: 2500, 
    price: 190, 
    pricePerCredit: 0.076,
    tooltip: "2,500 credits → 1,250 contacts enriched + 1,250 emails personalized"
  },
  { 
    credits: 5000, 
    price: 360, 
    pricePerCredit: 0.072,
    popular: true,
    tooltip: "5,000 credits → 2,500 contacts enriched + 2,500 emails personalized"
  },
  { 
    credits: 10000, 
    price: 680, 
    pricePerCredit: 0.068,
    bestValue: true,
    tooltip: "10,000 credits → 5,000 contacts enriched + 5,000 emails personalized"
  }
];

const BONUS_PACKS = [
  { packValue: 1000, creditsDelivered: 14700, baseCredits: 13333, bonus: "+10%", effectivePrice: 0.068 },
  { packValue: 2000, creditsDelivered: 29400, baseCredits: 25565, bonus: "+15%", effectivePrice: 0.068 },
  { packValue: 5000, creditsDelivered: 73333, baseCredits: 61111, bonus: "+20%", effectivePrice: 0.068 }
];

export function UpgradeDialog({ open, onOpenChange, currentPlan, currentBillingPeriod = "monthly", onPlanUpgrade, onCreditsPurchase }: UpgradeDialogProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(currentBillingPeriod);
  const [bonusPacksOpen, setBonusPacksOpen] = useState(false);

  const getPrice = (basePrice: number) => {
    if (billingPeriod === "annual") {
      return Math.round(basePrice * 0.85); // 15% discount
    }
    return basePrice;
  };

  const getAnnualSavings = (basePrice: number) => {
    return Math.round(basePrice * 0.15 * 12); // 15% off for 12 months
  };

  const handlePlanUpgrade = (planName: string, credits: number, basePrice: number) => {
    onPlanUpgrade(planName, credits, billingPeriod);
    const finalPrice = getPrice(basePrice);
    const period = billingPeriod === "annual" ? "annually" : "monthly";
    toast.success(`Successfully upgraded to ${planName} (${period})!`);
    onOpenChange(false);
  };

  const handleCreditsPurchase = (credits: number, price: number) => {
    onCreditsPurchase(credits);
    toast.success(`Successfully purchased ${credits.toLocaleString()} credits!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose a plan that fits your needs or purchase additional credits
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="credits">One-Time Credits</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6 mt-6">
            {/* Billing Period Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
                <Button
                  variant={billingPeriod === "monthly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingPeriod("monthly")}
                  className="relative"
                >
                  Monthly
                </Button>
                <Button
                  variant={billingPeriod === "annual" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingPeriod("annual")}
                  className="relative"
                >
                  Annual
                  <Badge className="ml-2 bg-green-500 text-white hover:bg-green-600">
                    Save 15%
                  </Badge>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                const isCurrentPlan = plan.name === currentPlan;
                const displayPrice = getPrice(plan.price);
                const savings = getAnnualSavings(plan.price);
                
                return (
                  <Card 
                    key={plan.name}
                    className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'opacity-60' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`h-8 w-8 bg-gradient-to-br ${plan.color} bg-clip-text text-transparent`} />
                        {isCurrentPlan && (
                          <Badge variant="secondary">Current Plan</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          {plan.isCustom ? (
                            <span className="text-2xl font-bold">Custom</span>
                          ) : (
                            <>
                              <span className="text-3xl font-bold">${displayPrice}</span>
                              <span className="text-muted-foreground">/{billingPeriod === "annual" ? "month" : "month"}</span>
                            </>
                          )}
                        </div>
                        {billingPeriod === "annual" && !plan.isCustom && (
                          <div className="text-sm">
                            <span className="text-muted-foreground line-through">${plan.price}</span>
                            <span className="text-green-600 font-semibold ml-2">
                              Save ${savings}/year
                            </span>
                          </div>
                        )}
                      </div>
                      <CardDescription className="font-semibold text-foreground">
                        {plan.isCustom ? '25,000+' : plan.credits.toLocaleString()} monthly credits
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "default" : "outline"}
                        disabled={isCurrentPlan}
                        onClick={() => plan.isCustom ? window.location.href = 'mailto:sales@company.com' : handlePlanUpgrade(plan.name, plan.credits, plan.price)}
                      >
                        {isCurrentPlan ? "Current Plan" : plan.isCustom ? "Contact Sales" : "Upgrade"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="credits" className="space-y-6 mt-6">
            <TooltipProvider>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Purchase Additional Credits</h3>
                <p className="text-muted-foreground">
                  One-time packs to boost your monthly allowance. Credits never expire.
                </p>
              </div>

              {/* Credit Pack Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {CREDIT_PACKS.map((pack) => (
                  <Tooltip key={pack.credits}>
                    <TooltipTrigger asChild>
                      <Card 
                        className={`relative transition-all duration-300 hover:shadow-xl cursor-pointer ${
                          pack.popular ? 'border-primary shadow-lg ring-2 ring-primary/20' : ''
                        } ${pack.bestValue ? 'border-primary shadow-lg' : ''}`}
                      >
                        {pack.bestValue && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 cursor-help">
                                  Best Value
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Lowest cost per credit - best for high-volume campaigns</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                        {pack.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 cursor-help">
                                  Popular
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Most chosen by teams running mid-sized campaigns</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                        <CardContent className="pt-6 pb-6 text-center space-y-4">
                          <div>
                            <div className="text-4xl font-bold mb-1">
                              {pack.credits.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">credits</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold mb-1">${pack.price}</div>
                            <div className="text-sm font-medium text-muted-foreground">
                              ${pack.pricePerCredit.toFixed(3)}/credit
                            </div>
                          </div>
                          <Button 
                            className="w-full"
                            variant={pack.popular || pack.bestValue ? "default" : "outline"}
                            onClick={() => handleCreditsPurchase(pack.credits, pack.price)}
                          >
                            Purchase
                          </Button>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{pack.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              {/* Informational Message */}
              <div className="max-w-4xl mx-auto">
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      <Info className="inline-block h-4 w-4 mr-1 mb-0.5" />
                      Credits will be used only after your monthly allowance. You'll always use your plan credits first.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Collapsible Bonus Section */}
              <div className="max-w-4xl mx-auto">
                <Collapsible open={bonusPacksOpen} onOpenChange={setBonusPacksOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="font-semibold">Credit Multiplier Packs (Big Buyer Bonus)</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${bonusPacksOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Volume Bonus Tiers</CardTitle>
                        <CardDescription>
                          Bonus credits automatically added at checkout. Great for teams running high-volume campaigns.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-semibold">Pack Value</th>
                                <th className="text-left py-3 px-4 font-semibold">Credits Delivered</th>
                                <th className="text-left py-3 px-4 font-semibold">Bonus</th>
                                <th className="text-left py-3 px-4 font-semibold">Effective $/Credit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {BONUS_PACKS.map((bonus, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                  <td className="py-3 px-4 font-semibold">${bonus.packValue.toLocaleString()}</td>
                                  <td className="py-3 px-4">
                                    {bonus.creditsDelivered.toLocaleString()}
                                    <span className="text-muted-foreground text-xs ml-1">
                                      ({bonus.baseCredits.toLocaleString()} {bonus.bonus})
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                      {bonus.bonus}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 font-medium">${bonus.effectivePrice.toFixed(3)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <Button className="w-full" onClick={() => window.location.href = 'mailto:sales@company.com'}>
                            Contact Sales for Volume Pricing
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TooltipProvider>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}