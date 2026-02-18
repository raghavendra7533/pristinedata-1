import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Target, TrendingUp, Zap, Heart, Sparkles, Info, List } from "lucide-react";

interface CampaignSetupProps {
  data: {
    name: string;
    theme: string;
    stages: number;
    contactList: string;
    instructions: string;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const campaignTypes = [
  {
    id: "event-followup",
    icon: Users,
    title: "Event Outreach",
    description: "Connect before events",
    info: "Reach out to prospects before conferences, webinars, and networking events. Build awareness and drive attendance with targeted pre-event engagement."
  },
  {
    id: "sales-outreach",
    icon: Target,
    title: "Sales Outreach",
    description: "Connect with potential customers",
    info: "Reach out to qualified prospects with tailored messaging. Ideal for cold outreach, lead generation, and converting interest into sales conversations."
  },
  {
    id: "competitive",
    icon: TrendingUp,
    title: "Competitor Takeout",
    description: "Win against competitors",
    info: "Target accounts currently using competitor solutions. Highlight your unique value proposition and conversion incentives to win market share."
  },
  {
    id: "nurture",
    icon: Heart,
    title: "Nurture Campaign",
    description: "Build long-term relationships",
    info: "Develop relationships with leads over time through educational content and value-driven touchpoints. Best for longer sales cycles and relationship building."
  },
  {
    id: "product-launch",
    icon: Zap,
    title: "Awareness",
    description: "Build brand recognition",
    info: "Increase visibility and educate prospects about your brand, solutions, and value proposition. Perfect for establishing thought leadership and top-of-funnel engagement."
  }
];

const mockContactLists = [
  { id: "list-1", name: "Enterprise Prospects Q1 2024", count: 1234 },
  { id: "list-2", name: "Event Attendees - TechConf 2024", count: 856 },
  { id: "list-3", name: "Product Launch Beta Users", count: 432 },
  { id: "list-4", name: "Competitor Accounts - Top 500", count: 500 },
  { id: "list-5", name: "Nurture List - Warm Leads", count: 2150 }
];

const CampaignSetup = ({ data, onUpdate, onNext }: CampaignSetupProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Campaign Builder</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Create Your Next{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Winning Campaign
          </span>
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Build targeted campaigns with multi-stage automation in minutes
        </p>
      </div>

      {/* Form Card */}
      <Card className="border-border/50 shadow-lg">
        <CardContent className="p-8 space-y-8">
          {/* Campaign Name */}
          <div className="space-y-3">
            <Label htmlFor="campaign-name" className="text-base font-semibold">
              Campaign Name
            </Label>
            <Input
              id="campaign-name"
              placeholder="e.g., Q1 Product Launch"
              value={data.name}
              onChange={(e) => onUpdate({ ...data, name: e.target.value })}
              className="h-12 text-base"
            />
          </div>

          {/* Contact List Selection */}
          <div className="space-y-3">
            <Label htmlFor="contact-list" className="text-base font-semibold">
              Select Contact List <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.contactList}
              onValueChange={(value) => onUpdate({ ...data, contactList: value })}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Choose a contact list" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {mockContactLists.map((list) => (
                  <SelectItem key={list.id} value={list.id} className="cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span>{list.name}</span>
                      <span className="text-xs text-muted-foreground ml-3">
                        ({list.count.toLocaleString()} contacts)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campaign Theme */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Campaign Theme</Label>
            <TooltipProvider>
              <div className="grid grid-cols-3 gap-4">
                {campaignTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = data.theme === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => onUpdate({ ...data, theme: type.id })}
                      className={`relative p-4 rounded-lg border-2 text-left transition-all group ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-lg ring-4 ring-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors flex-shrink-0 ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground mb-0.5">{type.title}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-help flex-shrink-0 ml-2">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{type.info}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </button>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          {/* Number of Stages */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Number of Stages</Label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => onUpdate({ ...data, stages: num })}
                  className={`flex-1 h-14 rounded-lg border-2 font-semibold text-lg transition-all ${
                    data.stages === num
                      ? "border-primary bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Instructions */}
          <div className="space-y-3">
            <Label htmlFor="instructions" className="text-base font-semibold">
              Additional Instructions{" "}
              <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="instructions"
              placeholder="Add any specific requirements, tone preferences, or audience details..."
              value={data.instructions}
              onChange={(e) => onUpdate({ ...data, instructions: e.target.value })}
              className="min-h-32 text-base"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSetup;
