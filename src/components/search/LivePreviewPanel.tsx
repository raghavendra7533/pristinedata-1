import { useState, useEffect } from "react";
import { Building2, Users, Eye, RefreshCw, HelpCircle, CheckSquare, Square, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchMode } from "./SearchModeToggle";

interface AccountPreview {
  id: string;
  name: string;
  industry: string;
  employees: string;
  revenue: string;
  location: string;
  topTechs?: string[];
  lastVerified?: string;
}

interface ContactPreview {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  seniority: string;
  emailStatus: "verified" | "likely" | "unknown";
}

interface LivePreviewPanelProps {
  mode: SearchMode;
  isLoading: boolean;
  totalCount: number;
  lastRefresh?: Date;
  appliedFilters: string[];
  onQuickView: (id: string) => void;
  onOpenProfile: (id: string) => void;
  onWhyTheseResults?: () => void;
}

const mockAccounts: AccountPreview[] = [
  { id: "1", name: "Acme Corporation", industry: "Technology", employees: "500-1000", revenue: "$50M-$100M", location: "San Francisco, CA", topTechs: ["Snowflake", "AWS", "HubSpot"], lastVerified: "2 days ago" },
  { id: "2", name: "TechFlow Inc", industry: "SaaS", employees: "200-500", revenue: "$25M-$50M", location: "New York, NY", topTechs: ["Salesforce", "GCP"], lastVerified: "1 week ago" },
  { id: "3", name: "DataStream Solutions", industry: "Analytics", employees: "100-200", revenue: "$10M-$25M", location: "Austin, TX", topTechs: ["Databricks", "Azure"], lastVerified: "3 days ago" },
  { id: "4", name: "CloudNine Software", industry: "FinTech", employees: "1000-5000", revenue: "$100M-$500M", location: "Seattle, WA", topTechs: ["AWS", "Segment"], lastVerified: "Today" },
  { id: "5", name: "Nexus Dynamics", industry: "Healthcare Tech", employees: "50-100", revenue: "$5M-$10M", location: "Boston, MA", topTechs: ["Salesforce", "HubSpot"], lastVerified: "5 days ago" },
  { id: "6", name: "Quantum Innovations", industry: "AI/ML", employees: "200-500", revenue: "$25M-$50M", location: "Palo Alto, CA", topTechs: ["GCP", "Snowflake"], lastVerified: "1 day ago" },
];

const mockContacts: ContactPreview[] = [
  { id: "1", name: "Sarah Chen", title: "VP of Marketing", company: "Acme Corporation", location: "San Francisco, CA", seniority: "VP", emailStatus: "verified" },
  { id: "2", name: "Michael Torres", title: "Director of Revenue Operations", company: "TechFlow Inc", location: "New York, NY", seniority: "Director", emailStatus: "verified" },
  { id: "3", name: "Emily Rodriguez", title: "Chief Marketing Officer", company: "DataStream Solutions", location: "Austin, TX", seniority: "C-Level", emailStatus: "likely" },
  { id: "4", name: "David Park", title: "Head of Growth", company: "CloudNine Software", location: "Seattle, WA", seniority: "Director", emailStatus: "verified" },
  { id: "5", name: "Jessica Martinez", title: "VP Sales", company: "Nexus Dynamics", location: "Boston, MA", seniority: "VP", emailStatus: "unknown" },
  { id: "6", name: "Alex Kim", title: "CRO", company: "Quantum Innovations", location: "Palo Alto, CA", seniority: "C-Level", emailStatus: "verified" },
];

export default function LivePreviewPanel({
  mode,
  isLoading,
  totalCount,
  lastRefresh,
  appliedFilters,
  onQuickView,
  onOpenProfile,
  onWhyTheseResults,
}: LivePreviewPanelProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const data = mode === "accounts" ? mockAccounts : mockContacts;

  const toggleSelection = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map(d => d.id));
    }
  };

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-emerald-500";
      case "likely": return "bg-amber-500";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-border/50">
      {/* Header */}
      <CardHeader className="pb-3 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Live Preview
            </CardTitle>
            {isLoading ? (
              <Badge variant="outline" className="animate-pulse">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Updating...
              </Badge>
            ) : (
              <Badge variant="secondary" className="font-semibold">
                {totalCount.toLocaleString()} {mode}
              </Badge>
            )}
          </div>
          {lastRefresh && (
            <span className="text-xs text-muted-foreground">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Applied Filters Summary */}
        {appliedFilters.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {appliedFilters.slice(0, 5).map((filter, idx) => (
              <Badge key={idx} variant="outline" className="text-xs py-0.5">
                {filter}
              </Badge>
            ))}
            {appliedFilters.length > 5 && (
              <Badge variant="outline" className="text-xs py-0.5">
                +{appliedFilters.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {onWhyTheseResults && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onWhyTheseResults}
            className="w-fit text-xs text-muted-foreground hover:text-primary gap-1"
          >
            <HelpCircle className="h-3 w-3" />
            Why these results?
          </Button>
        )}
      </CardHeader>

      {/* Selection Bar */}
      <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selected.length === data.length && data.length > 0}
            onCheckedChange={toggleAll}
          />
          <span className="text-sm text-muted-foreground">
            {selected.length > 0 ? `${selected.length} selected` : "Select all"}
          </span>
        </div>
        {selected.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Create List
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Results List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="p-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : mode === "accounts" ? (
            // Account cards
            (data as AccountPreview[]).map((account) => (
              <Card 
                key={account.id} 
                className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-card hover:border-primary/30 ${
                  selected.includes(account.id) ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selected.includes(account.id)}
                    onCheckedChange={() => toggleSelection(account.id)}
                    className="mt-1"
                  />
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    {account.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{account.name}</h4>
                      {account.lastVerified && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          Verified {account.lastVerified}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {account.industry} • {account.employees} emp • {account.revenue}
                    </p>
                    {account.topTechs && account.topTechs.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {account.topTechs.slice(0, 3).map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1.5">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={(e) => { e.stopPropagation(); onQuickView(account.id); }}
                    >
                      Quick View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-primary"
                      onClick={(e) => { e.stopPropagation(); onOpenProfile(account.id); }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            // Contact cards
            (data as ContactPreview[]).map((contact) => (
              <Card 
                key={contact.id} 
                className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-card hover:border-primary/30 ${
                  selected.includes(contact.id) ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selected.includes(contact.id)}
                    onCheckedChange={() => toggleSelection(contact.id)}
                    className="mt-1"
                  />
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                      {contact.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                      <div className={`h-2 w-2 rounded-full ${getEmailStatusColor(contact.emailStatus)}`} 
                           title={`Email: ${contact.emailStatus}`} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{contact.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.company} • {contact.location}
                    </p>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 mt-1">
                      {contact.seniority}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={(e) => { e.stopPropagation(); onQuickView(contact.id); }}
                    >
                      Quick View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-primary"
                      onClick={(e) => { e.stopPropagation(); onOpenProfile(contact.id); }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
