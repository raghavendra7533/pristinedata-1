import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Calculator, ArrowRight, TrendingUp, Building2, Users, Info, 
  Send, ChevronDown, Settings2, Brain, Phone, Sparkles, Mail,
  Share2, Eye, EyeOff, Linkedin, MessageSquare, Copy, Check
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Unified pricing: $0.01 per credit
const CREDIT_PRICE = 0.01;

// Credit multipliers
const DEFAULT_MULTIPLIERS = {
  account: 2,    // 2 credits per account
  contact: 6,    // 6 credits per contact
  mobile: 12,    // 12 credits per mobile number
  messaging: 1,  // 1 credit per message
  linkedin: 5,   // premium channel
  sms: 3,        // SMS rate
};

// Sending engine pricing
const SENDING_ENGINE_RATE = 3.5; // $3.50 per 1000 contacts

// Email infrastructure pricing
const MAILBOX_UNIT_SIZE = 100; // mailboxes per unit
const MAILBOX_UNIT_PRICE = 50; // $50 per 100 mailboxes

const PLANS = [
  { name: "Starter", credits: 8000, price: 80, color: "cyan" },
  { name: "Growth", credits: 17600, price: 176, popular: true, color: "violet" },
  { name: "Enterprise", credits: 25000, price: 250, isCustom: true, color: "amber" }
];

export default function PricingCalculator() {
  const navigate = useNavigate();
  
  // Collapsible state
  const [audienceOpen, setAudienceOpen] = useState(true);
  const [sendingOpen, setSendingOpen] = useState(true);
  
  // Show math toggle
  const [showMath, setShowMath] = useState(false);
  
  // Assumptions drawer
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [multipliers, setMultipliers] = useState(DEFAULT_MULTIPLIERS);
  const [customPricing, setCustomPricing] = useState(false);
  const [creditPrice, setCreditPrice] = useState(CREDIT_PRICE);
  
  // Copy state
  const [copied, setCopied] = useState(false);
  
  // Audience & Enrichment inputs
  const [timeframeMonths, setTimeframeMonths] = useState(3);
  const [refreshCadence, setRefreshCadence] = useState<"none" | "quarterly" | "biannual" | "annual">("none");
  const [smoothBilling, setSmoothBilling] = useState(true);
  const [accounts, setAccounts] = useState(6000);
  const [contacts, setContacts] = useState(12000);
  const [mobilePct, setMobilePct] = useState(5);
  const [msgsPerContact, setMsgsPerContact] = useState(5);
  
  // Sending Engine toggle
  const [sendingEngineEnabled, setSendingEngineEnabled] = useState(true);
  
  // Campaign Services toggle
  const [campaignServicesEnabled, setCampaignServicesEnabled] = useState(false);
  const CAMPAIGN_SERVICES_FEE = 500; // $500/month flat fee
  
  // Email infrastructure inputs
  const [sendingDays, setSendingDays] = useState(20);

  // Calculations
  const calculations = useMemo(() => {
    const mobileEnriched = Math.round(contacts * (mobilePct / 100));
    const messagesTotal = contacts * msgsPerContact;
    
    // Credit calculations
    const accountCredits = accounts * multipliers.account;
    const contactCredits = contacts * multipliers.contact;
    const mobileCredits = mobileEnriched * multipliers.mobile;
    const messagingCredits = messagesTotal * multipliers.messaging;
    
    // Data track base total
    const dataTrackBase = accountCredits + contactCredits + mobileCredits + messagingCredits;
    
    // Refresh cadence multiplier (audience only)
    const refreshes = {
      none: 1,
      annual: 1,
      biannual: Math.ceil(timeframeMonths / 6),
      quarterly: Math.ceil(timeframeMonths / 3)
    }[refreshCadence];
    
    const audienceCredits = (accountCredits + contactCredits) * refreshes;
    const dataTrackTotal = audienceCredits + mobileCredits + messagingCredits;
    
    // Monthly credits calculation
    let monthlyDataCredits: number;
    if (smoothBilling) {
      monthlyDataCredits = Math.ceil(dataTrackTotal / Math.max(1, timeframeMonths));
    } else {
      monthlyDataCredits = dataTrackTotal;
    }
    
    // Sending engine cost - $3.50 per 1000 contacts
    const sendingEngineCost = sendingEngineEnabled ? Math.ceil(contacts / 1000) * SENDING_ENGINE_RATE : 0;
    
    // Email infrastructure - mailboxes based on email volume
    // Emails per month = total messages / timeframe months
    const emailsPerMonth = Math.ceil(messagesTotal / Math.max(1, timeframeMonths));
    const dailySends = emailsPerMonth / Math.max(1, sendingDays);
    const mailboxesNeeded = Math.ceil(dailySends / 5);
    const domainsNeeded = Math.ceil(mailboxesNeeded / 50);
    const mailboxUnits = Math.ceil(mailboxesNeeded / MAILBOX_UNIT_SIZE);
    const mailboxCost = sendingEngineEnabled ? mailboxUnits * MAILBOX_UNIT_PRICE : 0;
    
    const sendingTrackTotal = sendingEngineCost + mailboxCost;
    
    // Campaign Services cost
    const campaignServicesCost = campaignServicesEnabled ? CAMPAIGN_SERVICES_FEE : 0;
    
    // Total monthly
    const totalMonthlyCredits = monthlyDataCredits;
    
    // Cost calculations
    const monthlyDataCost = monthlyDataCredits * creditPrice;
    const monthlySendingCost = sendingTrackTotal;
    const totalMonthlyCost = monthlyDataCost + monthlySendingCost + campaignServicesCost;
    
    // Plan recommendation
    let recommendedPlan = PLANS[PLANS.length - 1];
    let overage = 0;
    
    for (const plan of PLANS) {
      if (plan.credits >= totalMonthlyCredits) {
        recommendedPlan = plan;
        break;
      }
      // Check if within 20% overage threshold
      if (totalMonthlyCredits <= plan.credits * 1.2) {
        recommendedPlan = plan;
        overage = totalMonthlyCredits - plan.credits;
        break;
      }
    }
    
    if (totalMonthlyCredits > PLANS[PLANS.length - 1].credits) {
      overage = totalMonthlyCredits - PLANS[PLANS.length - 1].credits;
    }
    
    const overageCost = overage > 0 ? overage * creditPrice : 0;
    
    return {
      mobileEnriched,
      messagesTotal,
      accountCredits,
      contactCredits,
      mobileCredits,
      messagingCredits,
      dataTrackBase,
      dataTrackTotal,
      monthlyDataCredits,
      audienceCredits,
      refreshes,
      sendingEngineCost,
      emailsPerMonth,
      dailySends,
      mailboxesNeeded,
      domainsNeeded,
      mailboxUnits,
      mailboxCost,
      sendingTrackTotal,
      campaignServicesCost,
      totalMonthlyCredits,
      monthlyDataCost,
      monthlySendingCost,
      totalMonthlyCost,
      recommendedPlan,
      overage,
      overageCost,
    };
  }, [accounts, contacts, mobilePct, msgsPerContact, timeframeMonths, refreshCadence, smoothBilling, sendingEngineEnabled, campaignServicesEnabled, sendingDays, multipliers, creditPrice, CAMPAIGN_SERVICES_FEE]);

  const handleShare = async () => {
    const quoteText = `Pristine Data Estimate:
Data Track: ${calculations.monthlyDataCredits.toLocaleString()} credits ($${calculations.monthlyDataCost.toFixed(2)}/mo)
Sending Engine: $${calculations.sendingEngineCost.toFixed(2)}/mo
Total: $${calculations.totalMonthlyCost.toFixed(2)}/mo
Recommended: ${calculations.recommendedPlan.name} Plan`;
    
    await navigator.clipboard.writeText(quoteText);
    setCopied(true);
    toast({ title: "Quote copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const resetMultipliers = () => {
    setMultipliers(DEFAULT_MULTIPLIERS);
    setCreditPrice(CREDIT_PRICE);
    setCustomPricing(false);
  };

  const CreditChip = ({ value, label }: { value: number; label: string }) => (
    <Badge variant="outline" className="text-xs font-normal mt-1">
      {value.toLocaleString()} {label}
    </Badge>
  );

  const MathLine = ({ formula, result }: { formula: string; result: string }) => (
    showMath ? (
      <div className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded mt-1">
        {formula} = {result}
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <section className="relative bg-gradient-hero px-6 py-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-white" />
            <h1 className="text-3xl font-bold text-white">Pricing Calculator</h1>
          </div>
          <p className="text-white/90 text-lg">
            Estimate your credits and monthly cost for data enrichment and outbound sending
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <TooltipProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Inputs */}
            <div className="lg:col-span-2 space-y-4">
              {/* Audience & Enrichment Card */}
              <Collapsible open={audienceOpen} onOpenChange={setAudienceOpen}>
                <Card className="shadow-card rounded-2xl overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Audience & Enrichment</CardTitle>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${audienceOpen ? 'rotate-180' : ''}`} />
                      </div>
                      <CardDescription>Define your total audience and refresh strategy</CardDescription>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      {/* Timeframe & Billing */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            Timeframe (months)
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                              <TooltipContent><p>Plan your audience over this period (1-12 months)</p></TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            type="number"
                            min={1}
                            max={12}
                            value={timeframeMonths}
                            onChange={(e) => setTimeframeMonths(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            Refresh Cadence
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                              <TooltipContent><p>Re-enrich your audience on a schedule</p></TooltipContent>
                            </Tooltip>
                          </Label>
                          <Select value={refreshCadence} onValueChange={(v: any) => setRefreshCadence(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="biannual">Bi-annual</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="sm:col-span-2 flex items-center justify-between p-3 bg-card rounded-md">
                          <div className="flex items-center gap-2">
                            <Label className="cursor-pointer">Smooth billing</Label>
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                              <TooltipContent><p>Spread credits evenly across months</p></TooltipContent>
                            </Tooltip>
                          </div>
                          <Switch checked={smoothBilling} onCheckedChange={setSmoothBilling} />
                        </div>
                      </div>
                      
                      {/* Audience Inputs */}
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            Total Unique Accounts
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            value={accounts}
                            onChange={(e) => setAccounts(Math.max(0, parseInt(e.target.value) || 0))}
                            className="text-lg"
                          />
                          <CreditChip value={calculations.accountCredits} label="credits" />
                          <MathLine formula={`${accounts.toLocaleString()} × ${multipliers.account}`} result={`${calculations.accountCredits.toLocaleString()} credits`} />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Total Unique Contacts
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            value={contacts}
                            onChange={(e) => setContacts(Math.max(0, parseInt(e.target.value) || 0))}
                            className="text-lg"
                          />
                          <CreditChip value={calculations.contactCredits} label="credits" />
                          <MathLine formula={`${contacts.toLocaleString()} × ${multipliers.contact}`} result={`${calculations.contactCredits.toLocaleString()} credits`} />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            Mobile Enrichment %
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={mobilePct}
                              onChange={(e) => setMobilePct(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                            />
                            <span className="text-sm font-medium">%</span>
                          </div>
                          <CreditChip value={calculations.mobileCredits} label={`credits (${calculations.mobileEnriched.toLocaleString()} contacts)`} />
                          <MathLine formula={`${calculations.mobileEnriched.toLocaleString()} × ${multipliers.mobile}`} result={`${calculations.mobileCredits.toLocaleString()} credits`} />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Personalized Messages per Contact
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            value={msgsPerContact}
                            onChange={(e) => setMsgsPerContact(Math.max(0, parseInt(e.target.value) || 0))}
                          />
                          <CreditChip value={calculations.messagingCredits} label={`credits (${calculations.messagesTotal.toLocaleString()} messages)`} />
                          <MathLine formula={`${calculations.messagesTotal.toLocaleString()} × ${multipliers.messaging}`} result={`${calculations.messagingCredits.toLocaleString()} credits`} />
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Sending Engine Card */}
              <Collapsible open={sendingOpen} onOpenChange={setSendingOpen}>
                <Card className="shadow-card rounded-2xl overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Send className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">Sending Engine</CardTitle>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${sendingOpen ? 'rotate-180' : ''}`} />
                      </div>
                      <CardDescription>Email infrastructure for your outbound campaigns</CardDescription>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="space-y-5 pt-0">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <div>
                            <Label className="cursor-pointer">Enable Sending Engine</Label>
                            <p className="text-xs text-muted-foreground mt-0.5">$3.50 per 1,000 contacts + infrastructure</p>
                          </div>
                        </div>
                        <Switch checked={sendingEngineEnabled} onCheckedChange={setSendingEngineEnabled} />
                      </div>
                      
                      {sendingEngineEnabled && (
                        <>
                          {/* Email Volume Display */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Emails per Month
                                <Tooltip>
                                  <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                                  <TooltipContent><p>Calculated from total messages / timeframe</p></TooltipContent>
                                </Tooltip>
                              </Label>
                              <Input
                                type="number"
                                value={calculations.emailsPerMonth}
                                readOnly
                                className="text-lg bg-muted/50"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Sending Days per Month
                                <Tooltip>
                                  <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                                  <TooltipContent><p>We pace ~5 emails per mailbox per day</p></TooltipContent>
                                </Tooltip>
                              </Label>
                              <Input
                                type="number"
                                min={1}
                                max={31}
                                value={sendingDays}
                                onChange={(e) => setSendingDays(Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                              />
                            </div>
                          </div>
                          
                          {/* Infrastructure Summary */}
                          {calculations.emailsPerMonth > 0 && (
                            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Daily sends</span>
                                <span className="font-medium">{Math.round(calculations.dailySends).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Suggested mailboxes</span>
                                <span className="font-medium">{calculations.mailboxesNeeded.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Suggested domains</span>
                                <span className="font-medium">{calculations.domainsNeeded.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Cost Summary */}
                          <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Sending Engine ({contacts.toLocaleString()} contacts)</span>
                              <span className="font-medium">${calculations.sendingEngineCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Infrastructure ({calculations.mailboxUnits} units × $50)</span>
                              <span className="font-medium">${calculations.mailboxCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                              <span>Total sending cost</span>
                              <span>${calculations.sendingTrackTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Campaign Services Card */}
              <Card className="shadow-card rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Campaign Services</h3>
                        <p className="text-sm text-muted-foreground">Managed campaign support</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">$500</p>
                        <p className="text-xs text-muted-foreground">/month</p>
                      </div>
                      <Switch checked={campaignServicesEnabled} onCheckedChange={setCampaignServicesEnabled} />
                    </div>
                  </div>
                  {campaignServicesEnabled && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="p-3 bg-primary/5 rounded-lg text-sm text-muted-foreground">
                        Includes dedicated campaign management, optimization, and reporting support.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Assumptions Button */}
              <Sheet open={assumptionsOpen} onOpenChange={setAssumptionsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Settings2 className="h-4 w-4" />
                    Assumptions
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Assumptions</SheetTitle>
                    <SheetDescription>Credit pricing and unit multipliers</SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-sm font-medium">One pool of credits</p>
                      <p className="text-xs text-muted-foreground">
                        Single price per credit is ${creditPrice.toFixed(2)}. Unit multipliers preserve your previous per-unit costs.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Allow custom pricing</Label>
                        <Switch checked={customPricing} onCheckedChange={setCustomPricing} />
                      </div>
                      
                      {customPricing && (
                        <div className="space-y-2">
                          <Label>Price per credit ($)</Label>
                          <Input
                            type="number"
                            step={0.001}
                            min={0.001}
                            value={creditPrice}
                            onChange={(e) => setCreditPrice(Math.max(0.001, parseFloat(e.target.value) || 0.01))}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Credits per unit</p>
                      {Object.entries(multipliers).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{key}</span>
                          <span className="text-sm font-mono">{value} credits</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Refresh applies to</p>
                      <Badge variant="secondary">Audience only (accounts + contacts)</Badge>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={resetMultipliers}>
                      Reset to defaults
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Right Column - Live Estimate */}
            <div className="space-y-4">
              <Card className="sticky top-6 shadow-card rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Your Estimate
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMath(!showMath)}
                      className="gap-1 text-xs"
                    >
                      {showMath ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {showMath ? 'Hide' : 'Show'} math
                    </Button>
                  </div>
                  
                  {/* Helper chip */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5 w-fit cursor-help">
                        <Info className="h-3 w-3" />
                        <span>Data: {creditPrice * 100}¢/credit · Accounts {multipliers.account} • Contacts {multipliers.contact} • Mobile {multipliers.mobile} | Sending: $3.50/1K contacts</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>All features draw from the same ${creditPrice}/credit balance. Sending engine is $3.50 per 1,000 contacts.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                
                <CardContent className="space-y-5">
                  {/* Data Track */}
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">Data Track</h4>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account credits</span>
                        <span className="font-medium">{calculations.accountCredits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact credits</span>
                        <span className="font-medium">{calculations.contactCredits.toLocaleString()}</span>
                      </div>
                      {calculations.mobileCredits > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mobile credits</span>
                          <span className="font-medium">{calculations.mobileCredits.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Messaging credits</span>
                        <span className="font-medium">{calculations.messagingCredits.toLocaleString()}</span>
                      </div>
                      
                      {calculations.refreshes > 1 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Info className="h-3 w-3" />
                          <span>Audience ×{calculations.refreshes} ({refreshCadence} refresh)</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total credits</span>
                        <span>{calculations.dataTrackTotal.toLocaleString()}</span>
                      </div>
                      
                      {smoothBilling && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monthly credits</span>
                          <span className="font-medium">{calculations.monthlyDataCredits.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-baseline p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm font-medium">Data subtotal</span>
                      <span className="text-xl font-bold text-primary">
                        ${calculations.monthlyDataCost.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </span>
                    </div>
                  </div>

                  {/* Sending Engine */}
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">Sending Engine</h4>
                    </div>
                    
                    {calculations.sendingTrackTotal > 0 ? (
                      <>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Engine cost ({contacts.toLocaleString()} contacts)</span>
                            <span className="font-medium">${calculations.sendingEngineCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Infrastructure ({calculations.mailboxUnits} units)</span>
                            <span className="font-medium">${calculations.mailboxCost.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-baseline p-3 bg-primary/5 rounded-lg">
                          <span className="text-sm font-medium">Sending subtotal</span>
                          <span className="text-xl font-bold text-primary">
                            ${calculations.sendingTrackTotal.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Enable sending engine above to add infrastructure cost</p>
                      </div>
                    )}
                  </div>

                  {/* Campaign Services */}
                  {calculations.campaignServicesCost > 0 && (
                    <div className="space-y-3 pb-4 border-b">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-sm">Campaign Services</h4>
                      </div>
                      
                      <div className="flex justify-between items-baseline p-3 bg-primary/5 rounded-lg">
                        <span className="text-sm font-medium">Services subtotal</span>
                        <span className="text-xl font-bold text-primary">
                          ${calculations.campaignServicesCost.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Recommended Plan */}
                  <div className="space-y-3 pb-4 border-b">
                    <h4 className="font-semibold text-sm">Recommended Plan</h4>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{calculations.recommendedPlan.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {calculations.recommendedPlan.isCustom ? '25K+' : calculations.recommendedPlan.credits.toLocaleString()} credits/mo
                          </p>
                        </div>
                        <p className="font-bold">
                          {calculations.recommendedPlan.isCustom ? 'Custom' : `$${calculations.recommendedPlan.price}`}
                          {!calculations.recommendedPlan.isCustom && <span className="text-xs text-muted-foreground">/mo</span>}
                        </p>
                      </div>
                      
                      {calculations.overage > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Overage: {calculations.overage.toLocaleString()} credits (+${calculations.overageCost.toFixed(2)})
                        </Badge>
                      )}
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      Annual saves 15%
                    </Badge>
                  </div>

                  {/* Total */}
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg" aria-live="polite">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold">Total Monthly Cost</span>
                        <span className="text-3xl font-bold text-primary">
                          ${calculations.totalMonthlyCost.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {calculations.totalMonthlyCredits.toLocaleString()} credits/month
                      </p>
                    </div>

                    <Button className="w-full" size="lg" onClick={() => navigate('/subscription-hub')}>
                      View Plans & Upgrade
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
                      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                      {copied ? 'Copied!' : 'Share Quote'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Plans Summary */}
              <Card className="shadow-card rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Available Plans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {PLANS.map((plan) => (
                    <div 
                      key={plan.name}
                      className={`p-3 rounded-lg border transition-colors ${
                        plan.name === calculations.recommendedPlan.name 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">{plan.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {plan.isCustom ? '25K+' : plan.credits.toLocaleString()} credits
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">
                            {plan.isCustom ? 'Custom' : `$${plan.price}`}
                            {!plan.isCustom && <span className="text-xs text-muted-foreground">/mo</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${plan.isCustom ? '0.01' : (plan.price / plan.credits).toFixed(4)}/credit
                          </p>
                        </div>
                      </div>
                      {plan.name === calculations.recommendedPlan.name && (
                        <Badge variant="secondary" className="mt-2 text-xs">Recommended</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TooltipProvider>
      </div>

      {/* Mobile sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Monthly</p>
            <p className="text-2xl font-bold text-primary">${calculations.totalMonthlyCost.toFixed(2)}</p>
          </div>
          <Button size="lg" onClick={() => navigate('/subscription-hub')}>
            Upgrade
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
