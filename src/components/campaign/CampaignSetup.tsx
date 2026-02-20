import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react";

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
    icon: "solar:users-group-rounded-linear",
    title: "Event",
    info: "Reach out to prospects before conferences, webinars, and networking events."
  },
  {
    id: "sales-outreach",
    icon: "solar:target-linear",
    title: "Sales",
    info: "Reach out to qualified prospects with tailored messaging for lead generation."
  },
  {
    id: "competitive",
    icon: "solar:graph-up-linear",
    title: "Competitor",
    info: "Target accounts currently using competitor solutions with conversion incentives."
  },
  {
    id: "nurture",
    icon: "solar:heart-linear",
    title: "Nurture",
    info: "Develop relationships over time through educational content and value-driven touchpoints."
  },
  {
    id: "product-launch",
    icon: "solar:bolt-linear",
    title: "Awareness",
    info: "Increase visibility and educate prospects about your brand and solutions."
  }
];

const mockContactLists = [
  { id: "list-1", name: "Enterprise Prospects Q1 2024", count: 1234 },
  { id: "list-2", name: "Event Attendees - TechConf 2024", count: 856 },
  { id: "list-3", name: "Product Launch Beta Users", count: 432 },
  { id: "list-4", name: "Competitor Accounts - Top 500", count: 500 },
  { id: "list-5", name: "Nurture List - Warm Leads", count: 2150 }
];

const CampaignSetup = ({ data, onUpdate }: CampaignSetupProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Campaign Details Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Icon icon="solar:document-add-linear" className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Campaign Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {/* Two column layout for name and contact list */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="campaign-name" className="text-sm font-medium">
                Campaign Name
              </Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Q1 Product Launch"
                value={data.name}
                onChange={(e) => onUpdate({ ...data, name: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-list" className="text-sm font-medium">
                Contact List <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.contactList}
                onValueChange={(value) => onUpdate({ ...data, contactList: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Choose a contact list" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockContactLists.map((list) => (
                    <SelectItem key={list.id} value={list.id} className="cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <span>{list.name}</span>
                        <span className="text-xs text-muted-foreground ml-3">
                          ({list.count.toLocaleString()})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campaign Theme - Horizontal chips */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Campaign Theme</Label>
            <TooltipProvider>
              <div className="flex flex-wrap gap-2">
                {campaignTypes.map((type) => {
                  const isSelected = data.theme === type.id;

                  return (
                    <Tooltip key={type.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => onUpdate({ ...data, theme: type.id })}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon icon={type.icon} className="h-3.5 w-3.5" />
                          {type.title}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{type.info}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          {/* Number of Stages - Compact */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Number of Stages</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => onUpdate({ ...data, stages: num })}
                  className={`w-10 h-9 rounded-md text-sm font-semibold transition-all ${
                    data.stages === num
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Instructions Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="solar:notes-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Additional Instructions</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Textarea
            id="instructions"
            placeholder="Add any specific requirements, tone preferences, or audience details..."
            value={data.instructions}
            onChange={(e) => onUpdate({ ...data, instructions: e.target.value })}
            className="min-h-24 resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSetup;
