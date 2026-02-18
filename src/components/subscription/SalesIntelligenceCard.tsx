import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ArrowUpCircle } from "lucide-react";

interface SalesIntelligenceCardProps {
  plan: string;
  pricePerUser: number;
  usersLicensed: number;
  playbooksThisMonth: number;
  playbookLimit: number | null;
  onUpgradeClick: () => void;
}

export function SalesIntelligenceCard({ 
  plan, 
  pricePerUser, 
  usersLicensed, 
  playbooksThisMonth, 
  playbookLimit,
  onUpgradeClick
}: SalesIntelligenceCardProps) {
  const totalCost = pricePerUser * usersLicensed;
  const isUnlimited = playbookLimit === null;
  const percentage = playbookLimit ? Math.min((playbooksThisMonth / playbookLimit) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Sales Intelligence</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {plan} Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-3xl font-bold">{playbooksThisMonth}</span>
            <span className="text-sm text-muted-foreground">
              {isUnlimited ? 'playbooks this month' : `of ${playbookLimit} playbooks`}
            </span>
          </div>
          {!isUnlimited && playbookLimit && (
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Licensed Users:</span>
            <span className="font-medium">{usersLicensed} users</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price per User:</span>
            <span className="font-medium">${pricePerUser}/month</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <span className="text-muted-foreground">Total Cost:</span>
            <span className="font-semibold text-primary">${totalCost}/month</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-3">
            {plan === "Pro" 
              ? "Unlimited playbooks with CRM integration, auto-log & sync, and usage dashboard" 
              : "Up to 50 playbooks per month with self-serve access"}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onUpgradeClick}
          >
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            {plan === "Basic" ? "Upgrade to Pro" : "Manage Plan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}