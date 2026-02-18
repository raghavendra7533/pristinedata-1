import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Zap, 
  Plus, 
  X, 
  Play, 
  Save, 
  List, 
  Sparkles,
  Clock,
  ChevronDown
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

type SignalType = "intent" | "activity";
type IntentLevel = "emerging_intent" | "high_intent" | "very_high_intent";

interface BuyingSignalRule {
  id: string;
  signalType: SignalType;
  // Intent Topics specific (Bombora)
  topic?: string;
  intentLevel?: IntentLevel;  // For Search: emerging_intent, high_intent, very_high_intent
  minScore?: number;          // For Enrichment: integer score threshold
  // Activity Signals specific
  signal?: string;
  lookbackDays?: number;      // 30-90 days only, no custom TO date
}

interface BuyingSignalsComposerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activePicks: string | null;
  onPicksChange: (picks: string | null) => void;
}

// Activity signals list
const ACTIVITY_SIGNALS = [
  "increase_in_customer_service_department",
  "hiring_in_finance_department",
  "hiring_in_support_department",
  "increase_in_engineering_department",
  "decrease_in_customer_service_department",
  "hiring_in_operations_department",
  "hiring_in_creative_department",
  "decrease_in_engineering_department",
  "hiring_in_sales_department",
  "increase_in_operations_department",
  "hiring_in_trade_department",
  "decrease_in_marketing_department",
  "increase_in_marketing_department",
  "hiring_in_marketing_department",
  "hiring_in_health_department",
  "hiring_in_education_department",
  "increase_in_all_departments",
  "decrease_in_all_departments",
  "decrease_in_sales_department",
  "decrease_in_operations_department",
  "hiring_in_professional_service_department",
  "hiring_in_human_resources_department",
  "increase_in_sales_department",
  "hiring_in_legal_department",
  "hiring_in_unknown_department",
  "hiring_in_engineering_department",
  "company_award",
  "new_product",
  "employee_joined_company",
  "merger_and_acquisitions",
  "lawsuits_and_legal_issues",
  "outages_and_security_breaches",
  "closing_office",
  "new_investment",
  "new_office",
  "new_partnership",
  "cost_cutting",
  "new_funding_round",
  "award",
  "ipo_announcement",
];

// Format signal for display
const formatSignalName = (signal: string) => {
  return signal
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Format intent level for display
const formatIntentLevel = (level?: IntentLevel) => {
  if (!level) return "";
  const labels: Record<IntentLevel, string> = {
    emerging_intent: "Emerging",
    high_intent: "High",
    very_high_intent: "Very High",
  };
  return labels[level];
};

// Sample intent topics for quick add
const SAMPLE_TOPICS = [
  "Marketing Automation",
  "Sales Enablement",
  "Cloud Migration",
  "Data Analytics",
  "Cybersecurity",
  "Digital Transformation",
  "Customer Experience",
  "AI/Machine Learning",
];

export default function BuyingSignalsComposer({ 
  isOpen, 
  onOpenChange,
  activePicks,
  onPicksChange 
}: BuyingSignalsComposerProps) {
  const [rules, setRules] = useState<BuyingSignalRule[]>([]);
  const [selectedSignalType, setSelectedSignalType] = useState<SignalType>("intent");
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [savedPicks, setSavedPicks] = useState<Array<{name: string; count: number; date: Date}>>([
    { name: "High Intent Q1", count: 1456, date: new Date(Date.now() - 86400000) },
    { name: "Hiring Signals", count: 2843, date: new Date(Date.now() - 172800000) },
  ]);

  // Intent Topics input states (Bombora - no date range)
  const [topicInput, setTopicInput] = useState("");
  const [intentLevel, setIntentLevel] = useState<IntentLevel>("high_intent");

  // Activity Signals input states (30-90 days lookback only)
  const [activitySignal, setActivitySignal] = useState("");
  const [lookbackDays, setLookbackDays] = useState("30");

  const addRule = () => {
    if (selectedSignalType === "intent" && !topicInput.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (selectedSignalType === "activity" && !activitySignal) {
      toast.error("Please select an activity signal");
      return;
    }

    const newRule: BuyingSignalRule = {
      id: Math.random().toString(36).substr(2, 9),
      signalType: selectedSignalType,
      ...(selectedSignalType === "intent" && {
        topic: topicInput,
        intentLevel: intentLevel,
      }),
      ...(selectedSignalType === "activity" && {
        signal: activitySignal,
        lookbackDays: Math.min(90, Math.max(30, parseInt(lookbackDays) || 30)),
      }),
    };

    setRules([...rules, newRule]);
    
    // Reset inputs
    setTopicInput("");
    setActivitySignal("");
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const runQuery = () => {
    if (rules.length === 0) {
      toast.error("Add at least one buying signal filter");
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
        description: `Found ${mockCount.toLocaleString()} accounts with buying signals`,
      });
    }, 2000);
  };

  const savePicks = () => {
    if (!resultCount) {
      toast.error("Run a query first");
      return;
    }

    const name = `Signal Pick ${savedPicks.length + 1}`;
    setSavedPicks([
      { name, count: resultCount, date: new Date() },
      ...savedPicks,
    ]);
    
    toast.success("Saved as Signal Picks", {
      description: `"${name}" can now be used in account search`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Composer Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Buying Signals Composer
              </CardTitle>
              <CardDescription>
                Build queries with intent data and buying signals
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Signal Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Signal Type</Label>
            <Select value={selectedSignalType} onValueChange={(v) => setSelectedSignalType(v as SignalType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intent">
                  <div className="flex items-center gap-2">
                    <span>Intent Topics</span>
                  </div>
                </SelectItem>
                <SelectItem value="activity">
                  <div className="flex items-center gap-2">
                    <span>Activity Signals</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-border" />

          {/* Intent Topics */}
          {selectedSignalType === "intent" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Intent Topics</span>
              </div>

              {/* Sample Topic Presets */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Quick Add:</div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_TOPICS.map((topic) => (
                    <Button
                      key={topic}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopicInput(topic)}
                      className="text-xs"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Topic</Label>
                  <Input
                    placeholder="Enter intent topic..."
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addRule()}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Intent Level</Label>
                  <Select value={intentLevel} onValueChange={(v) => setIntentLevel(v as IntentLevel)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emerging_intent">Emerging Intent</SelectItem>
                      <SelectItem value="high_intent">High Intent</SelectItem>
                      <SelectItem value="very_high_intent">Very High Intent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Bombora intent data does not support date range filtering
              </p>
            </div>
          )}

          {/* Activity Signals */}
          {selectedSignalType === "activity" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4 text-primary" />
                <span>Activity Signals</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Signal</Label>
                  <Select value={activitySignal} onValueChange={setActivitySignal}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select signal..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {ACTIVITY_SIGNALS.map((signal) => (
                        <SelectItem key={signal} value={signal}>
                          {formatSignalName(signal)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Look-back Days (30-90)</Label>
                  <Select value={lookbackDays} onValueChange={setLookbackDays}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Activity signals support 30-90 day look-back from today
              </p>
            </div>
          )}

          <div className="h-px bg-border" />

          {/* Add Button */}
          <Button onClick={addRule} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add Signal Filter
          </Button>

          {/* Rules List */}
          {rules.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Active Filters ({rules.length}):</div>
              <div className="space-y-2">
                {rules.map((rule) => (
                  <Card key={rule.id} className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Badge variant="outline" className="shrink-0">
                          {rule.signalType === "intent" ? "Intent" : "Activity"}
                        </Badge>
                        <div className="text-sm truncate">
                          {rule.signalType === "intent" ? (
                            <span>
                              <strong>{rule.topic}</strong> ({formatIntentLevel(rule.intentLevel)})
                            </span>
                          ) : (
                            <span>
                              <strong>{formatSignalName(rule.signal || "")}</strong> ({rule.lookbackDays}d)
                            </span>
                          )}
                        </div>
                      </div>
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

          <div className="h-px bg-border" />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={runQuery}
              disabled={rules.length === 0 || isRunning}
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
              onClick={savePicks}
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
                    <div className="text-sm text-muted-foreground">accounts with signals</div>
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

      {/* Saved Signal Picks */}
      <Collapsible>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Saved Signal Picks ({savedPicks.length})</CardTitle>
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
                    activePicks === pick.name 
                      ? "border-primary bg-primary/5" 
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => {
                    onPicksChange(activePicks === pick.name ? null : pick.name);
                    toast.success(
                      activePicks === pick.name ? "Signal Picks removed" : "Signal Picks applied",
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
                    {activePicks === pick.name && (
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
