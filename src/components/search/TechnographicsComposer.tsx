import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Cpu, 
  Plus, 
  X, 
  Play, 
  Save, 
  List, 
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TechnographicsComposerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeTechPicks: string | null;
  onTechPicksChange: (picks: string | null) => void;
}

interface TechRule {
  id: string;
  technology: string;
  condition: "include" | "exclude";
  operator: "any" | "all";
}

export default function TechnographicsComposer({ 
  isOpen, 
  onOpenChange,
  activeTechPicks,
  onTechPicksChange 
}: TechnographicsComposerProps) {
  const [rules, setRules] = useState<TechRule[]>([]);
  const [techInput, setTechInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [savedPicks, setSavedPicks] = useState<Array<{name: string; count: number; date: Date}>>([
    { name: "Snowflake Users", count: 2156, date: new Date(Date.now() - 86400000) },
    { name: "HubSpot + Salesforce", count: 1843, date: new Date(Date.now() - 172800000) },
  ]);

  // Additional filter states
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [industryInput, setIndustryInput] = useState("");
  const [revenue, setRevenue] = useState<string[]>([]);

  const revenuePresets = ["$0-$1M", "$1M-$10M", "$10M-$50M", "$50M-$100M", "$100M+"];

  const addRule = () => {
    if (!techInput.trim()) return;
    
    const newRule: TechRule = {
      id: Math.random().toString(36).substr(2, 9),
      technology: techInput,
      condition: "include",
      operator: "any",
    };
    
    setRules([...rules, newRule]);
    setTechInput("");
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, updates: Partial<TechRule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const addLocation = () => {
    if (!locationInput.trim() || locations.includes(locationInput)) return;
    setLocations([...locations, locationInput]);
    setLocationInput("");
  };

  const removeLocation = (loc: string) => {
    setLocations(locations.filter(l => l !== loc));
  };

  const addIndustry = () => {
    if (!industryInput.trim() || industries.includes(industryInput)) return;
    setIndustries([...industries, industryInput]);
    setIndustryInput("");
  };

  const removeIndustry = (ind: string) => {
    setIndustries(industries.filter(i => i !== ind));
  };

  const toggleRevenue = (rev: string) => {
    if (revenue.includes(rev)) {
      setRevenue(revenue.filter(r => r !== rev));
    } else {
      setRevenue([...revenue, rev]);
    }
  };

  const runTechQuery = () => {
    if (rules.length === 0 && locations.length === 0 && industries.length === 0 && revenue.length === 0) {
      toast.error("Add at least one filter");
      return;
    }

    setIsRunning(true);
    
    // Simulate query
    setTimeout(() => {
      const mockCount = Math.floor(Math.random() * 3000) + 500;
      setResultCount(mockCount);
      setLastRun(new Date());
      setIsRunning(false);
      
      toast.success("Query complete", {
        description: `Found ${mockCount.toLocaleString()} accounts`,
      });
    }, 2000);
  };

  const saveTechPicks = () => {
    if (!resultCount) {
      toast.error("Run a query first");
      return;
    }

    const name = `Tech Pick ${savedPicks.length + 1}`;
    setSavedPicks([
      { name, count: resultCount, date: new Date() },
      ...savedPicks,
    ]);
    
    toast.success("Saved as Tech Picks", {
      description: `"${name}" can now be used in account search`,
    });
  };

  const techPresets = [
    { name: "Snowflake", icon: "❄️" },
    { name: "HubSpot", icon: "🎯" },
    { name: "Salesforce", icon: "☁️" },
    { name: "AWS", icon: "🔶" },
    { name: "Google Cloud", icon: "☁️" },
  ];

  return (
    <div className="space-y-4">
      {/* Main Composer Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Technographics Composer
              </CardTitle>
              <CardDescription>
                Build queries with technographics, location, industry, and revenue
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Provider B
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Technographics Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Cpu className="h-4 w-4 text-primary" />
              <span>Technographics</span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Quick Add:</div>
              <div className="flex flex-wrap gap-2">
                {techPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTechInput(preset.name);
                      setTimeout(() => addRule(), 100);
                    }}
                    className="gap-2"
                  >
                    <span>{preset.icon}</span>
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Add Technology Input */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Add Technology:</div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter technology name..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addRule()}
                  className="flex-1"
                />
                <Button onClick={addRule} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tech Rules List */}
            {rules.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Rules ({rules.length}):</div>
                <div className="space-y-2">
                  {rules.map((rule) => (
                    <Card key={rule.id} className="p-3">
                      <div className="flex items-center gap-3">
                        <Select
                          value={rule.condition}
                          onValueChange={(value) => updateRule(rule.id, { condition: value as "include" | "exclude" })}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="include">Include</SelectItem>
                            <SelectItem value="exclude">Exclude</SelectItem>
                          </SelectContent>
                        </Select>

                        <Badge variant="secondary" className="flex-1">
                          {rule.technology}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRule(rule.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Location Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Location</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter location and press Enter..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLocation()}
                className="flex-1"
              />
              <Button onClick={addLocation} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {locations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <Badge key={loc} variant="secondary" className="gap-2">
                    {loc}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeLocation(loc)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Industry Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Industry</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter industry and press Enter..."
                value={industryInput}
                onChange={(e) => setIndustryInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIndustry()}
                className="flex-1"
              />
              <Button onClick={addIndustry} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {industries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <Badge key={ind} variant="secondary" className="gap-2">
                    {ind}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeIndustry(ind)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Revenue Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Revenue</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {revenuePresets.map((rev) => {
                const isSelected = revenue.includes(rev);
                return (
                  <Badge
                    key={rev}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer gap-2"
                    onClick={() => toggleRevenue(rev)}
                  >
                    {rev}
                    {isSelected && <X className="h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={runTechQuery}
              disabled={(rules.length === 0 && locations.length === 0 && industries.length === 0 && revenue.length === 0) || isRunning}
              className="flex-1 gap-2"
            >
              {isRunning ? (
                <>Running...</>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Query
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={saveTechPicks}
              disabled={!resultCount}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Results
            </Button>
          </div>

          {/* Results Summary */}
          {resultCount !== null && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {resultCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">accounts found</div>
                  </div>
                  {lastRun && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {lastRun.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Saved Tech Picks */}
      <Collapsible>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Saved Tech Picks ({savedPicks.length})</CardTitle>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-2">
              {savedPicks.map((pick, idx) => (
                <Card
                  key={idx}
                  className={`p-3 cursor-pointer transition-all ${
                    activeTechPicks === pick.name 
                      ? "border-primary bg-primary/5" 
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => {
                    onTechPicksChange(activeTechPicks === pick.name ? null : pick.name);
                    toast.success(
                      activeTechPicks === pick.name ? "Tech Picks removed" : "Tech Picks applied",
                      { description: pick.name }
                    );
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{pick.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {pick.count.toLocaleString()} accounts • {pick.date.toLocaleDateString()}
                      </div>
                    </div>
                    {activeTechPicks === pick.name && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
