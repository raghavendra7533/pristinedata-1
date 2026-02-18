import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Clock, Building2, Users, Lightbulb, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { SearchMode } from "@/components/search/SearchModeToggle";
import IntentChip from "@/components/search/IntentChip";

const quickStarters = [
  { label: "Tech stack", example: "Companies using Snowflake in California" },
  { label: "Industry", example: "Fintech companies, Series B+, 200-1000 employees" },
  { label: "Persona", example: "CMOs at B2B SaaS companies" },
  { label: "LinkedIn URL", example: "linkedin.com/in/..." },
];

const recentSearches = [
  { id: "1", query: "RevOps in fintech", results: 1284, type: "contacts" as const, date: "2 hours ago" },
  { id: "2", query: "Healthcare SaaS CMOs", results: 432, type: "contacts" as const, date: "Yesterday" },
  { id: "3", query: "Snowflake users US", results: 2156, type: "accounts" as const, date: "2 days ago" },
  { id: "4", query: "Series B+ using HubSpot", results: 891, type: "accounts" as const, date: "3 days ago" },
];

export default function SearchLanding() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<SearchMode>("accounts");
  const [detectedMode, setDetectedMode] = useState<SearchMode | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quickPreviewOpen, setQuickPreviewOpen] = useState(false);
  const [quickPreviewLoading, setQuickPreviewLoading] = useState(false);

  // Intent detection
  useEffect(() => {
    if (prompt.length < 5) {
      setDetectedMode(null);
      return;
    }

    const lower = prompt.toLowerCase();
    const contactKeywords = ['cmo', 'ceo', 'cto', 'cfo', 'vp', 'director', 'manager', 'head of', 'leader', 'executive', 'founder', 'contact', 'people', 'persona', 'buyer'];
    const accountKeywords = ['companies', 'company', 'business', 'organization', 'using', 'tech', 'revenue', 'employees'];

    const hasContact = contactKeywords.some(kw => lower.includes(kw));
    const hasAccount = accountKeywords.some(kw => lower.includes(kw));

    if (hasContact && !hasAccount) {
      setDetectedMode("contacts");
      setMode("contacts");
    } else if (hasAccount && !hasContact) {
      setDetectedMode("accounts");
      setMode("accounts");
    } else if (hasContact && hasAccount) {
      setDetectedMode("contacts"); // Default to contacts when both
      setMode("contacts");
    } else {
      setDetectedMode(null);
    }
  }, [prompt]);

  const handleOpenFilters = () => {
    if (!prompt.trim()) {
      navigate(`/unified-filters?mode=${mode}`);
      return;
    }

    setIsAnalyzing(true);
    
    // Check for LinkedIn URL
    const linkedinPattern = /linkedin\.com\/in\/[\w-]+/i;
    if (linkedinPattern.test(prompt)) {
      setTimeout(() => {
        const match = prompt.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?/i);
        navigate(`/contact/profile?linkedin=${encodeURIComponent(match?.[0] || "")}`);
      }, 1000);
      return;
    }

    setTimeout(() => {
      navigate(`/unified-filters?mode=${mode}&q=${encodeURIComponent(prompt)}`);
    }, 1000);
  };

  const handleQuickPreview = () => {
    setQuickPreviewOpen(true);
    setQuickPreviewLoading(true);
    setTimeout(() => setQuickPreviewLoading(false), 1500);
  };

  const handleQuickStarter = (label: string, example: string) => {
    // Tech stack goes directly to tech-first search
    if (label === "Tech stack") {
      navigate(`/unified-filters?mode=accounts&techFirst=true&q=${encodeURIComponent(example)}`);
      return;
    }
    // Industry goes to firmographic search (no persona until companies selected)
    if (label === "Industry") {
      navigate(`/unified-filters?mode=accounts&firmFirst=true&q=${encodeURIComponent(example)}`);
      return;
    }
    // Persona goes to contacts mode
    if (label === "Persona") {
      navigate(`/unified-filters?mode=contacts&q=${encodeURIComponent(example)}`);
      return;
    }
    // LinkedIn URL - handle separately
    if (label === "LinkedIn URL") {
      setPrompt(example);
      return;
    }
    setPrompt(example);
  };

  const handleReopenSearch = (search: typeof recentSearches[0]) => {
    navigate(`/unified-filters?mode=${search.type}&q=${encodeURIComponent(search.query)}`);
  };

  return (
    <div className="min-h-full">
      {/* Hero Header */}
      <section className="relative bg-gradient-hero px-6 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Find Your Ideal Customers
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Describe what you're looking for in natural language. Our AI handles the rest.
          </p>

        </div>
      </section>

      {/* Search Box Section */}
      <section className="px-6 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden bg-card/95 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute left-5 top-5">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) {
                      handleOpenFilters();
                    }
                  }}
                  placeholder="Describe your ideal accounts or contacts...

Examples:
• 'Find CMOs at B2B SaaS companies in California using HubSpot'
• 'Series B startups in fintech, 50-200 employees'
• 'RevOps leaders at mid-market companies'"
                  className="w-full pl-14 pr-6 py-5 text-lg border-0 focus:outline-none resize-none min-h-[160px] bg-transparent placeholder:text-muted-foreground/50"
                  disabled={isAnalyzing}
                />

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-t-2xl">
                    <div className="flex items-center gap-3 text-primary">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      <span className="text-lg font-medium">Analyzing your request...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Intent Chip */}
              {detectedMode && !isAnalyzing && (
                <div className="px-6 py-2 border-t bg-muted/30">
                  <IntentChip
                    detectedMode={detectedMode}
                    onSwitch={() => setMode(mode === "accounts" ? "contacts" : "accounts")}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="px-6 py-4 bg-muted/50 border-t flex items-center justify-between flex-wrap gap-3">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                      <Lightbulb className="h-4 w-4" />
                      <span className="hidden sm:inline">How it works</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">AI Parsing</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI extracts filters from your description:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Company attributes (industry, size, location)</li>
                        <li>Technology stack</li>
                        <li>People criteria (titles, seniority)</li>
                      </ul>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                
                <div className="flex items-center gap-2">
                  {prompt.trim() && (
                    <Button
                      variant="outline"
                      onClick={handleQuickPreview}
                      disabled={isAnalyzing}
                      className="gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Run Quick Preview
                    </Button>
                  )}
                  <Button
                    onClick={handleOpenFilters}
                    disabled={isAnalyzing}
                    size="lg"
                    className="gap-2 shadow-primary"
                  >
                    Open Filters
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Starters */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <p className="text-sm text-muted-foreground text-center mb-4">Quick starters:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {quickStarters.map((starter, idx) => (
            <Button
              key={idx}
              variant="secondary"
              size="sm"
              onClick={() => handleQuickStarter(starter.label, starter.example)}
              className="rounded-full px-4 gap-2 hover:scale-105 transition-transform"
            >
              {starter.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Recent Searches */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Recent Searches</h2>
            <p className="text-muted-foreground">Pick up where you left off</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentSearches.map((search) => (
            <Card
              key={search.id}
              className="group cursor-pointer hover:shadow-card hover:border-primary/30 transition-all duration-300 rounded-2xl"
              onClick={() => handleReopenSearch(search)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="gap-1.5 text-xs">
                    {search.type === "accounts" ? (
                      <Building2 className="h-3 w-3" />
                    ) : (
                      <Users className="h-3 w-3" />
                    )}
                    {search.type}
                  </Badge>
                  <span className="text-2xl font-bold text-primary">
                    {search.results.toLocaleString()}
                  </span>
                </div>
                <CardTitle className="text-base line-clamp-2">{search.query}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs">
                  <Clock className="h-3 w-3" />
                  {search.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="ghost"
                  className="w-full justify-between group-hover:bg-muted transition-colors"
                >
                  Reopen
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Preview Drawer */}
      <Sheet open={quickPreviewOpen} onOpenChange={setQuickPreviewOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Quick Preview</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-4">
            <div className="space-y-3">
              {quickPreviewLoading ? (
                Array.from({ length: 10 }).map((_, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Showing first 10 of ~2,500 results
                  </p>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <Card key={idx} className="p-3 hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Company {String.fromCharCode(65 + idx)}</p>
                          <p className="text-xs text-muted-foreground">Technology • 200-500 emp</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      setQuickPreviewOpen(false);
                      handleOpenFilters();
                    }}
                  >
                    Go to Filters
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
