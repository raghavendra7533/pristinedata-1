import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, List, Sparkles, SlidersHorizontal, X, Layers, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import FirmographicFilters from "@/components/search/FirmographicFilters";
import { toast } from "sonner";
const mockAccounts = [{
  id: "1",
  name: "Acme Corp",
  industry: "Fintech",
  revenue: "$10M-$25M",
  employees: "150",
  location: "San Francisco, CA",
  source: "both" as const
}, {
  id: "2",
  name: "Beta Systems",
  industry: "Fintech",
  revenue: "$25M-$50M",
  employees: "250",
  location: "New York, NY",
  source: "firmo" as const
}, {
  id: "3",
  name: "Gamma Tech",
  industry: "Fintech",
  revenue: "$5M-$10M",
  employees: "75",
  location: "Austin, TX",
  source: "tech" as const
}, {
  id: "4",
  name: "Delta Innovations",
  industry: "Fintech",
  revenue: "$50M-$100M",
  employees: "400",
  location: "Chicago, IL",
  source: "both" as const
}, {
  id: "5",
  name: "Epsilon Labs",
  industry: "Fintech",
  revenue: "$10M-$25M",
  employees: "180",
  location: "Seattle, WA",
  source: "firmo" as const
}];
const mockContacts = [{
  id: "1",
  name: "Sarah Johnson",
  title: "Director of Revenue Operations",
  company: "Acme Corp",
  location: "San Francisco, CA"
}, {
  id: "2",
  name: "Michael Chen",
  title: "VP of Revenue Operations",
  company: "Beta Systems",
  location: "New York, NY"
}, {
  id: "3",
  name: "Emily Rodriguez",
  title: "Head of RevOps",
  company: "Gamma Tech",
  location: "Austin, TX"
}, {
  id: "4",
  name: "David Park",
  title: "Chief Revenue Officer",
  company: "Delta Innovations",
  location: "Chicago, IL"
}, {
  id: "5",
  name: "Jessica Martinez",
  title: "VP Revenue Operations",
  company: "Epsilon Labs",
  location: "Seattle, WA"
}];
export default function Results() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = window.location.pathname.includes("/contacts") ? "contacts" : "accounts";
  const hasTechPicks = searchParams.get("techPicks");
  const isFirmographicSearch = searchParams.get("type") === "firmographic";
  const initialQuery = searchParams.get("q") || "";
  const [selected, setSelected] = useState<string[]>([]);
  const [refinement, setRefinement] = useState("");
  const [blendMode, setBlendMode] = useState<"intersect" | "union" | "exclude">("union");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [firmographicFilters, setFirmographicFilters] = useState({
    locations: [] as string[],
    industries: [] as string[],
    industryKeywords: [] as string[],
    employeeSize: [] as string[],
    revenue: [] as string[]
  });
  const [activeFilters, setActiveFilters] = useState([{
    id: "1",
    label: "Fintech"
  }, {
    id: "2",
    label: "Mid-market"
  }, {
    id: "3",
    label: "US"
  }]);
  const [liveMatchCount, setLiveMatchCount] = useState(0);
  const [isCountingMatches, setIsCountingMatches] = useState(false);

  // Parse initial query if coming from firmographic search
  useEffect(() => {
    if (isFirmographicSearch && initialQuery) {
      // Simulate parsing the query
      setTimeout(() => {
        setFirmographicFilters({
          locations: ["United States"],
          industries: ["Technology", "SaaS"],
          industryKeywords: ["B2B"],
          employeeSize: ["100-500"],
          revenue: ["$10M-$50M"]
        });
        toast.success("Filters extracted from your query");
      }, 500);
    }
  }, [isFirmographicSearch, initialQuery]);

  // Update live count when filters change (only when sheet is open)
  useEffect(() => {
    if (filterSheetOpen) {
      setIsCountingMatches(true);
      
      const timer = setTimeout(() => {
        // Generate realistic count based on filters
        const baseCount = 5000;
        
        const locationMultiplier = firmographicFilters.locations.length > 0 
          ? Math.pow(0.5, firmographicFilters.locations.length) 
          : 1;
        
        const industryMultiplier = firmographicFilters.industries.length > 0 
          ? Math.pow(0.4, firmographicFilters.industries.length) 
          : 1;
        
        const keywordMultiplier = firmographicFilters.industryKeywords.length > 0 
          ? Math.pow(0.6, firmographicFilters.industryKeywords.length) 
          : 1;
        
        const employeeMultiplier = firmographicFilters.employeeSize.length > 0 
          ? 0.4 / firmographicFilters.employeeSize.length 
          : 1;
        
        const revenueMultiplier = firmographicFilters.revenue.length > 0 
          ? 0.5 / firmographicFilters.revenue.length 
          : 1;
        
        const calculatedCount = Math.floor(
          baseCount * 
          locationMultiplier * 
          industryMultiplier * 
          keywordMultiplier *
          employeeMultiplier * 
          revenueMultiplier
        );
        
        setLiveMatchCount(Math.max(calculatedCount, 5));
        setIsCountingMatches(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [firmographicFilters, filterSheetOpen]);
  const handleApplyFilters = () => {
    toast.success("Filters updated", {
      description: "Results refreshed with new criteria"
    });
    setFilterSheetOpen(false);
  };
  const data = type === "accounts" ? mockAccounts : mockContacts;
  const toggleSelection = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };
  return <div className="min-h-full bg-gradient-subtle">
      <section className="relative bg-gradient-hero px-4 sm:px-6 py-6 sticky top-0 z-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-1">
                {type === "accounts" ? "Account Results" : "Contact Results"}
              </h1>
              <p className="text-sm sm:text-base text-white/80">
                {data.length.toLocaleString()} {type} found
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto space-y-6">
        {/* AI Refinement Bar */}
        

        {/* Blend Control - only for accounts with tech picks */}
        {type === "accounts" && hasTechPicks && <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Blend Mode:</span>
                </div>
                <div className="flex gap-2">
                  {(["intersect", "union", "exclude"] as const).map(mode => <Button key={mode} variant={blendMode === mode ? "default" : "outline"} size="sm" onClick={() => setBlendMode(mode)} className="capitalize">
                      {mode}
                    </Button>)}
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  Combining Firmographics + Tech Picks
                </div>
              </div>
            </CardContent>
          </Card>}

        {/* Active Filters */}
        {activeFilters.length > 0 && <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground hidden sm:inline">Filters:</span>
            {activeFilters.map(filter => <Badge key={filter.id} variant="secondary" className="px-3 py-1.5 gap-2 cursor-pointer hover:bg-secondary/80 transition-colors">
                {filter.label}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter.id)} />
              </Badge>)}
            {isFirmographicSearch ? <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="default" size="sm" className="gap-2 ml-auto">
                    <Settings2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Edit Search Filters</SheetTitle>
                    <SheetDescription>
                      Adjust your firmographic criteria to refine results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 pb-32">
                    <FirmographicFilters filters={firmographicFilters} onChange={setFirmographicFilters} />
                  </div>

                  {/* Live Count Overlay */}
                  <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {isCountingMatches ? (
                              <span className="animate-pulse">Calculating...</span>
                            ) : (
                              `${liveMatchCount.toLocaleString()} ${type}`
                            )}
                          </span>
                          <Badge 
                            variant={liveMatchCount === 0 ? "destructive" : liveMatchCount < 100 ? "outline" : "secondary"}
                            className="text-xs font-semibold"
                          >
                            {liveMatchCount === 0 ? "⚠️ Too Narrow" : liveMatchCount < 100 ? "🎯 Highly Targeted" : liveMatchCount < 1000 ? "✓ Well Balanced" : "📊 Large Audience"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Results update as you adjust filters
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setFilterSheetOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleApplyFilters} className="flex-1" disabled={isCountingMatches}>
                        Apply Filters ({liveMatchCount.toLocaleString()})
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet> : <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced Filters</span>
              </Button>}
          </div>}

        {/* Selection Header */}
        <Card className="sticky top-[120px] z-10 shadow-sm">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Checkbox checked={selected.length === data.length && data.length > 0} onCheckedChange={checked => setSelected(checked ? data.map(d => d.id) : [])} />
              <span className="text-sm font-medium">
                {selected.length > 0 ? `${selected.length} selected` : `Select all ${data.length}`}
              </span>
            </div>
            
            {selected.length > 0 && <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Save as List</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                {type === "accounts" && <Button size="sm" className="gap-2">
                    Find Contacts →
                  </Button>}
                {type === "contacts" && <Button size="sm" className="gap-2">
                    Start Campaign →
                  </Button>}
              </div>}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-3">
          {data.map(item => <Card key={item.id} className="hover:shadow-card hover:border-primary/20 transition-all duration-200 group">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Checkbox checked={selected.includes(item.id)} onCheckedChange={() => toggleSelection(item.id)} className="mt-1" />
                  
                  {type === "accounts" ? <>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          {hasTechPicks && (item as any).source && <Badge variant={(item as any).source === "both" ? "default" : "outline"} className="flex-shrink-0 text-xs">
                              {(item as any).source === "both" ? "Firmo + Tech" : (item as any).source === "firmo" ? "Firmo" : "Tech"}
                            </Badge>}
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground text-xs block mb-1">Industry</span>
                            <p className="font-medium truncate">{(item as any).industry}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs block mb-1">Revenue</span>
                            <p className="font-medium truncate">{(item as any).revenue}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs block mb-1">Employees</span>
                            <p className="font-medium truncate">{(item as any).employees}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs block mb-1">Location</span>
                            <p className="font-medium truncate">{(item as any).location}</p>
                          </div>
                        </div>
                      </div>
                    </> : <>
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm sm:text-base">
                          {item.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1 truncate">{(item as any).title}</p>
                        <p className="text-sm text-muted-foreground truncate">{(item as any).company} • {(item as any).location}</p>
                      </div>
                    </>}
                  
                  <Button variant="outline" size="sm" className="flex-shrink-0 hidden sm:flex">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>;
}