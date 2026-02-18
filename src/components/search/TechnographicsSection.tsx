import { useState } from "react";
import { Cpu, Search, Save, FolderOpen, Trash2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

interface TechFilter {
  id: string;
  name: string;
  operator: "includes" | "excludes";
}

interface SavedTechPick {
  id: string;
  label: string;
  techs: TechFilter[];
  accountCount: number;
  createdAt: string;
}

interface TechnographicsSectionProps {
  provider: string;
  onProviderChange: (provider: string) => void;
  techs: TechFilter[];
  onTechsChange: (techs: TechFilter[]) => void;
  /** When true, only shows saved Tech Picks dropdown + Create New button */
  pickOnlyMode?: boolean;
  onOpenComposer?: () => void;
}

const quickAddTechs = [
  { name: "Snowflake", icon: "❄️" },
  { name: "Salesforce", icon: "☁️" },
  { name: "HubSpot", icon: "🎯" },
  { name: "AWS", icon: "🔶" },
  { name: "GCP", icon: "☁️" },
  { name: "Azure", icon: "🔷" },
  { name: "Databricks", icon: "🧱" },
  { name: "Segment", icon: "📊" },
];

// Mock saved tech picks
const initialSavedPicks: SavedTechPick[] = [
  {
    id: "1",
    label: "Data Stack Users",
    techs: [
      { id: "t1", name: "Snowflake", operator: "includes" },
      { id: "t2", name: "Databricks", operator: "includes" },
    ],
    accountCount: 2456,
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    label: "CRM Platforms",
    techs: [
      { id: "t3", name: "Salesforce", operator: "includes" },
      { id: "t4", name: "HubSpot", operator: "includes" },
    ],
    accountCount: 8921,
    createdAt: "2024-11-28",
  },
  {
    id: "3",
    label: "Cloud Infrastructure",
    techs: [
      { id: "t5", name: "AWS", operator: "includes" },
      { id: "t6", name: "GCP", operator: "includes" },
      { id: "t7", name: "Azure", operator: "includes" },
    ],
    accountCount: 15432,
    createdAt: "2024-11-25",
  },
];

export default function TechnographicsSection({
  provider,
  onProviderChange,
  techs,
  onTechsChange,
  pickOnlyMode = false,
  onOpenComposer,
}: TechnographicsSectionProps) {
  const [techInput, setTechInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [savedPicks, setSavedPicks] = useState<SavedTechPick[]>(initialSavedPicks);
  const [selectedPickId, setSelectedPickId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newPickLabel, setNewPickLabel] = useState("");
  const [savedPicksOpen, setSavedPicksOpen] = useState(true);

  const addTech = (name: string) => {
    if (!name.trim()) return;
    if (techs.some(t => t.name.toLowerCase() === name.toLowerCase())) return;
    
    // Clear any selected pick since user is creating new selection
    setSelectedPickId(null);
    
    onTechsChange([
      ...techs,
      { id: Math.random().toString(36).substr(2, 9), name, operator: "includes" },
    ]);
    setTechInput("");
    setSuggestions([]);
  };

  const removeTech = (id: string) => {
    setSelectedPickId(null);
    onTechsChange(techs.filter(t => t.id !== id));
  };

  const updateTechOperator = (id: string, operator: "includes" | "excludes") => {
    setSelectedPickId(null);
    onTechsChange(techs.map(t => t.id === id ? { ...t, operator } : t));
  };

  const handleInputChange = (value: string) => {
    setTechInput(value);
    if (value.length > 1) {
      const matches = quickAddTechs
        .filter(t => t.name.toLowerCase().includes(value.toLowerCase()))
        .map(t => t.name);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const loadSavedPick = (pick: SavedTechPick) => {
    setSelectedPickId(pick.id);
    onTechsChange(pick.techs.map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9) })));
    toast.success(`Loaded "${pick.label}"`, {
      description: `${pick.techs.length} technologies, ${pick.accountCount.toLocaleString()} accounts`,
    });
  };

  const handleSavePick = () => {
    if (!newPickLabel.trim()) {
      toast.error("Please enter a label for your tech pick");
      return;
    }
    
    const newPick: SavedTechPick = {
      id: Math.random().toString(36).substr(2, 9),
      label: newPickLabel,
      techs: techs,
      accountCount: Math.floor(Math.random() * 5000) + 500, // Mock count
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setSavedPicks([newPick, ...savedPicks]);
    setSelectedPickId(newPick.id);
    setSaveDialogOpen(false);
    setNewPickLabel("");
    
    toast.success(`Saved "${newPickLabel}"`, {
      description: "Tech pick saved. Companies will be added to your list.",
    });
  };

  const deleteSavedPick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPicks(savedPicks.filter(p => p.id !== id));
    if (selectedPickId === id) {
      setSelectedPickId(null);
    }
    toast.success("Tech pick deleted");
  };

  const isNewSelection = techs.length > 0 && !selectedPickId;

  return (
    <div className="space-y-4">
      {/* Saved Tech Picks */}
      <Collapsible open={savedPicksOpen} onOpenChange={setSavedPicksOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full text-sm font-medium hover:text-primary transition-colors">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Saved Tech Picks ({savedPicks.length})
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${savedPicksOpen ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          {savedPicks.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {savedPicks.map((pick) => (
                <div
                  key={pick.id}
                  onClick={() => loadSavedPick(pick)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                    selectedPickId === pick.id 
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{pick.label}</span>
                      {selectedPickId === pick.id && (
                        <Badge variant="default" className="text-[10px] h-5">Active</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {pick.techs.length} tech{pick.techs.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-medium text-primary">
                        {pick.accountCount.toLocaleString()} accounts
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={(e) => deleteSavedPick(pick.id, e)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved tech picks yet. {pickOnlyMode ? "Create one to filter by technology." : "Select technologies and save them below."}
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Pick Only Mode: Show Create New button instead of inline tech builder */}
      {pickOnlyMode ? (
        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={onOpenComposer}
          >
            <Cpu className="h-4 w-4" />
            Create New Tech Pick
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Build a new technographics filter to add to your search
          </p>
        </div>
      ) : (
        <>
          <div className="h-px bg-border" />

          {/* New Selection Header */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              {isNewSelection ? "New Selection" : "Select Technologies"}
            </label>
            {isNewSelection && (
              <Badge variant="outline" className="text-xs">Unsaved</Badge>
            )}
          </div>

          {/* Quick Add Row */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Quick add:</label>
            <div className="flex flex-wrap gap-2">
              {quickAddTechs.map((tech) => (
                <Button
                  key={tech.name}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => addTech(tech.name)}
                  disabled={techs.some(t => t.name === tech.name)}
                >
                  <span>{tech.icon}</span>
                  {tech.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search technologies..."
                value={techInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech(techInput);
                  }
                }}
                className="pl-10"
              />
            </div>
            
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-popover border rounded-lg shadow-lg p-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors"
                    onClick={() => addTech(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Techs */}
          {techs.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Selected ({techs.length}):</label>
              <div className="space-y-2">
                {techs.map((tech) => (
                  <div
                    key={tech.id}
                    className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30"
                  >
                    <Select
                      value={tech.operator}
                      onValueChange={(v) => updateTechOperator(tech.id, v as "includes" | "excludes")}
                    >
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-popover">
                        <SelectItem value="includes">includes</SelectItem>
                        <SelectItem value="excludes">excludes</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="secondary" className="flex-1">
                      <Cpu className="h-3 w-3 mr-1.5" />
                      {tech.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeTech(tech.id)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          {techs.length > 0 && !selectedPickId && (
            <Button
              onClick={() => setSaveDialogOpen(true)}
              variant="outline"
              className="w-full gap-2"
            >
              <Save className="h-4 w-4" />
              Save as Tech Pick
            </Button>
          )}
        </>
      )}

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Tech Pick</DialogTitle>
            <DialogDescription>
              Save this technology selection as a reusable tech pick. The matching companies will be saved as a list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pick-label">Label</Label>
              <Input
                id="pick-label"
                placeholder="e.g., Data Stack Users, CRM Platforms..."
                value={newPickLabel}
                onChange={(e) => setNewPickLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSavePick();
                  }
                }}
              />
            </div>
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <p className="text-xs text-muted-foreground">Technologies to save:</p>
              <div className="flex flex-wrap gap-1.5">
                {techs.map((tech) => (
                  <Badge key={tech.id} variant="secondary" className="text-xs">
                    {tech.operator === "excludes" && "NOT "}
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePick}>
              <Save className="h-4 w-4 mr-2" />
              Save Tech Pick
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
