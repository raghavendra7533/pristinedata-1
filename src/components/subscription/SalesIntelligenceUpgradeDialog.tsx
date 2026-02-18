import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Users } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SalesIntelligenceUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  currentUsers: number;
  currentBillingPeriod?: "monthly" | "annual";
  onPlanChange: (plan: string, users: number, billingPeriod: "monthly" | "annual") => void;
}

const PLANS = [
  {
    name: "Basic",
    price: 99,
    features: [
      "Up to 50 Playbooks/month",
      "Self-serve access",
      "Email support",
      "Basic analytics"
    ]
  },
  {
    name: "Pro",
    price: 149,
    popular: true,
    features: [
      "Unlimited Playbooks (fair use)",
      "CRM integration (Salesforce, HubSpot)",
      "Auto-log & sync",
      "Usage dashboard",
      "Priority support",
      "Advanced analytics"
    ]
  }
];

export function SalesIntelligenceUpgradeDialog({ 
  open, 
  onOpenChange, 
  currentPlan,
  currentUsers,
  currentBillingPeriod = "monthly",
  onPlanChange 
}: SalesIntelligenceUpgradeDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [userCount, setUserCount] = useState(currentUsers);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(currentBillingPeriod);

  const calculatePrice = (plan: string, users: number) => {
    const basePlan = PLANS.find(p => p.name === plan);
    if (!basePlan) return 0;
    
    let pricePerUser = basePlan.price;
    
    // Apply volume discount for 10+ users
    if (users >= 10) {
      pricePerUser = plan === "Pro" ? 129 : 89;
    }
    
    const monthlyTotal = pricePerUser * users;
    
    // Apply 15% annual discount
    if (billingPeriod === "annual") {
      return Math.round(monthlyTotal * 0.85);
    }
    
    return monthlyTotal;
  };

  const getAnnualSavings = (plan: string, users: number) => {
    const basePlan = PLANS.find(p => p.name === plan);
    if (!basePlan) return 0;
    
    let pricePerUser = basePlan.price;
    if (users >= 10) {
      pricePerUser = plan === "Pro" ? 129 : 89;
    }
    
    const monthlyTotal = pricePerUser * users;
    return Math.round(monthlyTotal * 0.15 * 12); // 15% off for 12 months
  };

  const handleUpgrade = () => {
    onPlanChange(selectedPlan, userCount, billingPeriod);
    const period = billingPeriod === "annual" ? "annually" : "monthly";
    toast.success(`Successfully ${currentPlan === selectedPlan ? 'updated user count' : `upgraded to ${selectedPlan} plan`} (${period})!`);
    onOpenChange(false);
  };

  const currentPrice = calculatePrice(currentPlan, currentUsers);
  const newPrice = calculatePrice(selectedPlan, userCount);
  const priceChange = newPrice - currentPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sales Intelligence Plans</DialogTitle>
          <DialogDescription>
            Choose the right plan for your team and scale as you grow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Billing Period Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={billingPeriod === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={billingPeriod === "annual" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingPeriod("annual")}
              >
                Annual
                <Badge className="ml-2 bg-green-500 text-white hover:bg-green-600">
                  Save 15%
                </Badge>
              </Button>
            </div>
          </div>

          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLANS.map((plan) => {
              const isCurrentPlan = plan.name === currentPlan;
              const isSelected = plan.name === selectedPlan;
              const basePrice = plan.price;
              const volumePrice = userCount >= 10 ? (plan.name === "Pro" ? 129 : 89) : basePrice;
              const displayPrice = billingPeriod === "annual" ? Math.round(volumePrice * 0.85) : volumePrice;
              const savings = getAnnualSavings(plan.name, userCount);
              
              return (
                <Card 
                  key={plan.name}
                  className={`relative cursor-pointer transition-all ${
                    isSelected ? 'border-primary shadow-lg ring-2 ring-primary' : ''
                  } ${isCurrentPlan && !isSelected ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="secondary">Current Plan</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">${displayPrice}</span>
                        <span className="text-muted-foreground">/user/month</span>
                      </div>
                      {billingPeriod === "annual" && (
                        <div className="text-sm">
                          <span className="text-muted-foreground line-through">${volumePrice}</span>
                          <span className="text-green-600 font-semibold ml-2">
                            Save ${Math.round(volumePrice * 0.15)}/user/month
                          </span>
                        </div>
                      )}
                      {userCount >= 10 && (
                        <CardDescription className="text-primary font-semibold text-xs">
                          Volume discount applied for 10+ seats
                        </CardDescription>
                      )}
                    </div>
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
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* User Count Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Number of Licensed Users
              </CardTitle>
              <CardDescription>
                Add or remove user licenses. Volume discount applies for 10+ users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="userCount">Number of Users</Label>
                  <Input
                    id="userCount"
                    type="number"
                    min="1"
                    max="1000"
                    value={userCount}
                    onChange={(e) => setUserCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setUserCount(Math.max(1, userCount - 1))}
                  >
                    -
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setUserCount(userCount + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current monthly cost:</span>
                  <span className="font-medium">${currentPrice.toLocaleString()}/month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New monthly cost:</span>
                  <span className="font-semibold text-lg">${newPrice.toLocaleString()}/month</span>
                </div>
                {priceChange !== 0 && (
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Monthly change:</span>
                    <span className={`font-semibold ${priceChange > 0 ? 'text-destructive' : 'text-green-600'}`}>
                      {priceChange > 0 ? '+' : ''}{priceChange > 0 ? '$' : '-$'}{Math.abs(priceChange).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpgrade}
              disabled={selectedPlan === currentPlan && userCount === currentUsers}
            >
              {currentPlan === selectedPlan && userCount !== currentUsers 
                ? 'Update Licenses'
                : selectedPlan !== currentPlan 
                ? `Upgrade to ${selectedPlan}`
                : 'No Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}