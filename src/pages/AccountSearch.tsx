import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Sparkles, ChevronRight, Info, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import FirmographicFilters from "@/components/search/FirmographicFilters";
import TechnographicsComposer from "@/components/search/TechnographicsComposer";
import FilterSummaryCard from "@/components/search/FilterSummaryCard";
import ResultsPreview from "@/components/search/ResultsPreview";
import SaveListDialog from "@/components/search/SaveListDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AccountSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [nlsQuery, setNlsQuery] = useState(initialQuery);
  const [firmographicFilters, setFirmographicFilters] = useState({
    locations: [] as string[],
    industries: [] as string[],
    industryKeywords: [] as string[],
    employeeSize: [] as string[],
    revenue: [] as string[],
  });
  const [techComposerOpen, setTechComposerOpen] = useState(false);
  const [activeTechPicks, setActiveTechPicks] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [isCountingMatches, setIsCountingMatches] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewResults, setPreviewResults] = useState<any[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Auto-parse if query came from home
  useEffect(() => {
    if (initialQuery && nlsQuery === initialQuery) {
      setTimeout(() => {
        parseNLS();
        setTechComposerOpen(true); // Open tech composer since we detected tech
      }, 500);
    }
  }, [initialQuery]);

  const parseNLS = () => {
    if (!nlsQuery.trim()) return;
    
    // Simulate AI parsing
    toast.info("Parsing your query...", {
      description: "Extracting firmographic and technographic criteria",
    });

    setTimeout(() => {
      // Mock parsing - extract tech terms to suggest tech composer
      const hasTech = /using|with|on|technology|tech|stack/i.test(nlsQuery);
      if (hasTech) {
        toast.success("Detected technology criteria", {
          description: "Use the Tech Composer to refine your technology filters",
          action: {
            label: "Open Composer",
            onClick: () => setTechComposerOpen(true),
          },
        });
      }

      // Mock extracted filters
      setFirmographicFilters({
        locations: ["United States", "United Kingdom"],
        industries: ["SaaS", "Fintech"],
        industryKeywords: ["B2B", "Enterprise"],
        employeeSize: ["200-1000"],
        revenue: ["$10M-$50M"],
      });
    }, 1000);
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate search
    setTimeout(() => {
      const params = new URLSearchParams();
      params.append("type", "accounts");
      if (activeTechPicks) {
        params.append("techPicks", activeTechPicks);
      }
      navigate(`/results/accounts?${params.toString()}`);
    }, 1500);
  };

  const hasAnyFilters = 
    firmographicFilters.locations.length > 0 ||
    firmographicFilters.industries.length > 0 ||
    firmographicFilters.industryKeywords.length > 0 ||
    firmographicFilters.employeeSize.length > 0 ||
    firmographicFilters.revenue.length > 0;

  // Simulate live count updates when filters change
  useEffect(() => {
    if (hasAnyFilters || activeTechPicks) {
      setIsCountingMatches(true);
      setShowPreview(false);
      
      // Simulate API call to get count
      const timer = setTimeout(() => {
        // Generate realistic count based on filters - more filters = narrower results
        const baseCount = 50000;
        
        // Each filter type reduces the pool
        const locationMultiplier = firmographicFilters.locations.length > 0 
          ? Math.pow(0.4, firmographicFilters.locations.length) 
          : 1;
        
        const industryMultiplier = firmographicFilters.industries.length > 0 
          ? Math.pow(0.3, firmographicFilters.industries.length) 
          : 1;
        
        const keywordMultiplier = firmographicFilters.industryKeywords.length > 0 
          ? Math.pow(0.5, firmographicFilters.industryKeywords.length) 
          : 1;
        
        const employeeMultiplier = firmographicFilters.employeeSize.length > 0 
          ? 0.3 / firmographicFilters.employeeSize.length 
          : 1;
        
        const revenueMultiplier = firmographicFilters.revenue.length > 0 
          ? 0.4 / firmographicFilters.revenue.length 
          : 1;
        
        const techMultiplier = activeTechPicks ? 0.15 : 1;
        
        const calculatedCount = Math.floor(
          baseCount * 
          locationMultiplier * 
          industryMultiplier * 
          keywordMultiplier *
          employeeMultiplier * 
          revenueMultiplier *
          techMultiplier
        );
        
        setMatchCount(Math.max(calculatedCount, 25)); // Minimum 25
        setIsCountingMatches(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setMatchCount(0);
      setShowPreview(false);
    }
  }, [firmographicFilters, activeTechPicks, hasAnyFilters]);

  const handleGetPreview = () => {
    setShowPreview(true);
    
    // Generate mock preview results
    const mockResults = Array.from({ length: 50 }, (_, i) => ({
      id: `preview-${i}`,
      name: `Company ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      industry: firmographicFilters.industries[0] || "Technology",
      revenue: firmographicFilters.revenue[0] || "$10M-$50M",
      employees: firmographicFilters.employeeSize[0] || "100-500",
      location: firmographicFilters.locations[0] || "United States",
    }));
    
    setPreviewResults(mockResults);
    
    toast.success("Preview loaded", {
      description: `Showing first 50 of ${matchCount.toLocaleString()} matches`,
    });
  };

  const handleFinalize = () => {
    if (matchCount === 0) {
      toast.error("No results to save");
      return;
    }
    setSaveDialogOpen(true);
  };

  return (
    <div className="min-h-full bg-gradient-subtle">
      {/* Header with Gradient Band */}
      <section className="relative bg-gradient-hero px-4 sm:px-6 py-6 sticky top-0 z-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-[1800px] mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/sc-workspace?account=acc-1")}
              className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">SC Workspace</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-1">Account Search</h1>
              <p className="text-sm sm:text-base text-white/80">
                Compose your search using firmographics and technographics
              </p>
            </div>

            {/* NLS Query Bar - Only shown when no filters applied */}
            {!hasAnyFilters && (
              <Card className="border-primary/20 bg-gradient-to-r from-background to-primary/5">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                    <Input
                      placeholder="Describe your ideal accounts... (e.g., 'US SaaS companies using Snowflake, 200-1000 employees')"
                      value={nlsQuery}
                      onChange={(e) => setNlsQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && parseNLS()}
                      className="flex-1 border-0 focus-visible:ring-0 shadow-none bg-transparent placeholder:text-muted-foreground/60"
                    />
                    <Button 
                      size="sm" 
                      disabled={!nlsQuery.trim()}
                      onClick={parseNLS}
                      className="hidden sm:flex"
                    >
                      Parse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Alert */}
            <Alert className="bg-white/10 border-white/20 text-white">
              <Info className="h-4 w-4 text-white" />
              <AlertDescription className="text-sm text-white/90">
                <strong className="text-white">Best-in-class data:</strong> We combine premium firmographic and technographic providers to deliver unmatched coverage and accuracy. 
                Build each dimension separately, then blend using Intersect, Union, or Exclude for precision targeting.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Firmographic Filters + Count */}
          <div className="lg:col-span-4 space-y-6">
            <FirmographicFilters
              filters={firmographicFilters}
              onChange={setFirmographicFilters}
            />
            
            {/* Live Count Card */}
            {hasAnyFilters && (
              <FilterSummaryCard count={matchCount} isLoading={isCountingMatches} />
            )}
          </div>

          {/* Right: Technographics Composer */}
          <div className="lg:col-span-8 space-y-6">
            <TechnographicsComposer
              isOpen={techComposerOpen}
              onOpenChange={setTechComposerOpen}
              activeTechPicks={activeTechPicks}
              onTechPicksChange={setActiveTechPicks}
            />
            
            {/* Preview Results */}
            {showPreview && previewResults.length > 0 && (
              <ResultsPreview results={previewResults} totalCount={matchCount} />
            )}
          </div>
        </div>

        {/* Action Bar */}
        {hasAnyFilters && matchCount > 0 && (
          <Card className="sticky bottom-6 mt-6 shadow-2xl border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">
                      {matchCount.toLocaleString()} accounts match your criteria
                    </span>
                    <Badge 
                      variant={matchCount === 0 ? "destructive" : matchCount < 100 ? "outline" : "secondary"}
                      className="text-sm font-semibold px-3 py-1"
                    >
                      {matchCount === 0 ? "⚠️ Too Narrow" : matchCount < 100 ? "🎯 Highly Targeted" : matchCount < 1000 ? "✓ Well Balanced" : "📊 Large Audience"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activeTechPicks ? (
                      <>Using Tech Picks: <Badge variant="secondary" className="ml-1">{activeTechPicks}</Badge></>
                    ) : (
                      "Firmographic filters applied"
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!showPreview ? (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleGetPreview}
                      disabled={isCountingMatches}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Preview Results
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleFinalize}
                      disabled={isCountingMatches}
                      className="gap-2"
                    >
                      <ChevronRight className="h-4 w-4" />
                      Finalize & Save List
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Save List Dialog */}
      <SaveListDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        totalCount={matchCount}
        filters={firmographicFilters}
      />
    </div>
  );
}
