import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Building2, Users, MapPin, Briefcase, TrendingUp, Cpu, 
  List, Shield, Wand2, Save, Download, ArrowRight, 
  Pencil, Link2, RefreshCw, Lightbulb, Info, Lock, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import SearchModeToggle, { SearchMode } from "@/components/search/SearchModeToggle";
import UnifiedFilterSection from "@/components/search/UnifiedFilterSection";
import LivePreviewPanel from "@/components/search/LivePreviewPanel";
import QuickViewDrawer from "@/components/search/QuickViewDrawer";
import FilterChip from "@/components/search/FilterChip";
import PersonaFilters from "@/components/search/PersonaFilters";
import TechnographicsSection from "@/components/search/TechnographicsSection";
import TechnographicsComposer from "@/components/search/TechnographicsComposer";
import BuyingSignalsComposer from "@/components/search/BuyingSignalsComposer";
import BuyingSignalsSection from "@/components/search/BuyingSignalsSection";
import SaveListDialog from "@/components/search/SaveListDialog";

interface FirmographicFilters {
  locations: string[];
  excludeLocations: string[];
  companyName: string;
  industries: string[];
  excludeIndustries: string[];
  companyKeywords: string[];
  excludeCompanyKeywords: string[];
  employeeSize: string[];
  revenueMin: string;
  revenueMax: string;
  ownership: string[];
  fundingStage: string[];
}

interface JobFilters {
  jobTitles: string[];
  activeJobPostingsMin: string;
  activeJobPostingsMax: string;
  jobPostedAtMin: string;
  jobPostedAtMax: string;
}

interface PersonaFiltersState {
  jobTitles: string[];
  seniority: string[];
  departments: string[];
  contactLocation: string[];
}

interface ListsFilters {
  includeAccountLists: string[];
  includeContactLists: string[];
  excludeCompanies: string[];
  excludeContacts: string[];
  excludeCompetitors: string[];
  excludeCurrentCustomers: boolean;
}

interface TechFilter {
  id: string;
  name: string;
  operator: "includes" | "excludes";
}

const employeeSizePresets = ["1-50", "51-200", "201-1000", "1001-5000", "5000+"];
const revenuePresets = ["$0-$1M", "$1M-$10M", "$10M-$50M", "$50M-$100M", "$100M+"];
const fundingPresets = ["Seed", "Series A", "Series B", "Series C+", "Public", "Private Equity"];

// Tech-related keywords that indicate technographic search
const TECH_KEYWORDS = [
  "using", "tech", "stack", "software", "platform", "tool", "system",
  "snowflake", "hubspot", "salesforce", "google cloud", "aws", "azure",
  "shopify", "stripe", "zendesk", "intercom", "marketo", "segment",
  "datadog", "splunk", "tableau", "looker", "dbt", "fivetran"
];

export default function UnifiedFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as SearchMode) || "accounts";
  const initialQuery = searchParams.get("q") || "";
  const techFirstParam = searchParams.get("techFirst") === "true";
  const firmFirstParam = searchParams.get("firmFirst") === "true";

  // Core state
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [nlsQuery, setNlsQuery] = useState(initialQuery);
  const [isEditingNLS, setIsEditingNLS] = useState(false);
  const [isTechSearch, setIsTechSearch] = useState(false);
  const [hasSavedTechList, setHasSavedTechList] = useState(false);
  
  // Filter states
  const [firmographicFilters, setFirmographicFilters] = useState<FirmographicFilters>({
    locations: [],
    excludeLocations: [],
    companyName: "",
    industries: [],
    excludeIndustries: [],
    companyKeywords: [],
    excludeCompanyKeywords: [],
    employeeSize: [],
    revenueMin: "",
    revenueMax: "",
    ownership: [],
    fundingStage: [],
  });

  const [jobFilters, setJobFilters] = useState<JobFilters>({
    jobTitles: [],
    activeJobPostingsMin: "",
    activeJobPostingsMax: "",
    jobPostedAtMin: "",
    jobPostedAtMax: "",
  });

  const [personaFilters, setPersonaFilters] = useState<PersonaFiltersState>({
    jobTitles: [],
    seniority: [],
    departments: [],
    contactLocation: [],
  });

  const [listsFilters, setListsFilters] = useState<ListsFilters>({
    includeAccountLists: [],
    includeContactLists: [],
    excludeCompanies: [],
    excludeContacts: [],
    excludeCompetitors: [],
    excludeCurrentCustomers: false,
  });

  const [techProvider, setTechProvider] = useState("provider-a");
  const [techFilters, setTechFilters] = useState<TechFilter[]>([]);
  
  // Preview state
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date | undefined>();
  const [filterTipShown, setFilterTipShown] = useState(false);
  
  // Drawer state
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [techComposerOpen, setTechComposerOpen] = useState(false);
  const [activeTechPicks, setActiveTechPicks] = useState<string | null>(null);
  const [buyingSignalsComposerOpen, setBuyingSignalsComposerOpen] = useState(false);
  const [activeBuyingSignalPicks, setActiveBuyingSignalPicks] = useState<string | null>(null);

  // Detect if query implies technographic search
  useEffect(() => {
    if (techFirstParam) {
      setIsTechSearch(true);
    } else if (initialQuery) {
      const lower = initialQuery.toLowerCase();
      const hasTechKeyword = TECH_KEYWORDS.some(kw => lower.includes(kw));
      setIsTechSearch(hasTechKeyword);
    }
  }, [initialQuery, techFirstParam]);

  // Input states
  const [locationInput, setLocationInput] = useState("");
  const [excludeLocationInput, setExcludeLocationInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [excludeIndustryInput, setExcludeIndustryInput] = useState("");
  const [companyKeywordInput, setCompanyKeywordInput] = useState("");
  const [excludeCompanyKeywordInput, setExcludeCompanyKeywordInput] = useState("");

  // Count active filters
  const firmographicCount = 
    firmographicFilters.locations.length +
    firmographicFilters.excludeLocations.length +
    (firmographicFilters.companyName ? 1 : 0) +
    firmographicFilters.industries.length +
    firmographicFilters.excludeIndustries.length +
    firmographicFilters.companyKeywords.length +
    firmographicFilters.excludeCompanyKeywords.length +
    firmographicFilters.employeeSize.length +
    (firmographicFilters.revenueMin ? 1 : 0) +
    (firmographicFilters.revenueMax ? 1 : 0) +
    firmographicFilters.ownership.length +
    firmographicFilters.fundingStage.length;

  const jobCount = 
    jobFilters.jobTitles.length +
    (jobFilters.activeJobPostingsMin ? 1 : 0) +
    (jobFilters.activeJobPostingsMax ? 1 : 0) +
    (jobFilters.jobPostedAtMin ? 1 : 0) +
    (jobFilters.jobPostedAtMax ? 1 : 0);

  const techCount = techFilters.length;

  const personaCount = 
    personaFilters.jobTitles.length +
    personaFilters.seniority.length +
    personaFilters.departments.length +
    personaFilters.contactLocation.length;

  const listsCount = 
    listsFilters.includeAccountLists.length +
    listsFilters.includeContactLists.length +
    listsFilters.excludeCompanies.length +
    listsFilters.excludeContacts.length +
    listsFilters.excludeCompetitors.length +
    (listsFilters.excludeCurrentCustomers ? 1 : 0);

  const totalFilterCount = firmographicCount + techCount + personaCount + listsCount;

  // Applied filters for preview display
  const appliedFilters = [
    ...firmographicFilters.locations,
    ...firmographicFilters.industries,
    ...firmographicFilters.employeeSize,
    ...(firmographicFilters.revenueMin || firmographicFilters.revenueMax ? [`Revenue: ${firmographicFilters.revenueMin || '0'}-${firmographicFilters.revenueMax || '∞'}`] : []),
    ...techFilters.map(t => t.name),
    ...personaFilters.jobTitles,
    ...personaFilters.seniority,
    ...jobFilters.jobTitles,
  ];

  // Parse NLS query on mount
  useEffect(() => {
    if (initialQuery) {
      parseNLSQuery(initialQuery);
    }
  }, []);

  // Debounced count update
  useEffect(() => {
    if (totalFilterCount === 0) {
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      // Mock count calculation
      let base = mode === "accounts" ? 50000 : 150000;
      
      if (firmographicFilters.locations.length > 0) base *= 0.4;
      if (firmographicFilters.industries.length > 0) base *= 0.3;
      if (firmographicFilters.employeeSize.length > 0) base *= 0.5;
      if (firmographicFilters.revenueMin || firmographicFilters.revenueMax) base *= 0.4;
      if (jobFilters.jobTitles.length > 0) base *= 0.3;
      if (techFilters.length > 0) base *= 0.2;
      if (mode === "contacts" && personaFilters.jobTitles.length > 0) base *= 0.3;
      if (mode === "contacts" && personaFilters.seniority.length > 0) base *= 0.5;

      setTotalCount(Math.max(Math.floor(base), 10));
      setLastRefresh(new Date());
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [firmographicFilters, techFilters, personaFilters, listsFilters, mode, totalFilterCount]);

  // Show tip after 3 filters
  useEffect(() => {
    if (totalFilterCount >= 3 && !filterTipShown) {
      toast.info("Pro tip: Save this search to reuse later", {
        description: "Click 'Save Search' in the bottom bar",
        duration: 5000,
      });
      setFilterTipShown(true);
    }
  }, [totalFilterCount, filterTipShown]);

  const parseNLSQuery = (query: string) => {
    // Mock NLS parsing
    const lower = query.toLowerCase();
    
    if (lower.includes("california") || lower.includes("ca")) {
      setFirmographicFilters(prev => ({ ...prev, locations: ["California"] }));
    }
    if (lower.includes("saas") || lower.includes("software")) {
      setFirmographicFilters(prev => ({ ...prev, industries: ["SaaS"] }));
    }
    if (lower.includes("snowflake")) {
      setTechFilters([{ id: "1", name: "Snowflake", operator: "includes" }]);
    }
    if (lower.includes("cmo") || lower.includes("marketing")) {
      setPersonaFilters(prev => ({ ...prev, jobTitles: ["CMO", "VP Marketing"] }));
    }
  };

  const handleModeSwitch = (newMode: SearchMode) => {
    setMode(newMode);
    // Keep firmographic/technographic filters, clear persona if switching to accounts
    if (newMode === "accounts") {
      setPersonaFilters({
        jobTitles: [],
        seniority: [],
        departments: [],
        contactLocation: [],
      });
    }
  };

  const addFirmographicItem = (field: keyof FirmographicFilters, value: string) => {
    if (!value.trim()) return;
    const current = firmographicFilters[field];
    if (!current.includes(value)) {
      setFirmographicFilters(prev => ({
        ...prev,
        [field]: [...current, value],
      }));
    }
  };

  const removeFirmographicItem = (field: keyof FirmographicFilters, value: string) => {
    const current = firmographicFilters[field];
    if (Array.isArray(current)) {
      setFirmographicFilters(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter(item => item !== value),
      }));
    }
  };

  const toggleFirmographicItem = (field: keyof FirmographicFilters, value: string) => {
    const current = firmographicFilters[field];
    if (current.includes(value)) {
      removeFirmographicItem(field, value);
    } else {
      addFirmographicItem(field, value);
    }
  };

  const resetSection = (section: string) => {
    switch (section) {
      case "firmographic":
        setFirmographicFilters({
          locations: [], excludeLocations: [], companyName: "",
          industries: [], excludeIndustries: [], companyKeywords: [],
          excludeCompanyKeywords: [], employeeSize: [], revenueMin: "",
          revenueMax: "", ownership: [], fundingStage: [],
        });
        break;
      case "job":
        setJobFilters({
          jobTitles: [], activeJobPostingsMin: "", activeJobPostingsMax: "",
          jobPostedAtMin: "", jobPostedAtMax: "",
        });
        break;
      case "technographic":
        setTechFilters([]);
        break;
      case "persona":
        setPersonaFilters({
          jobTitles: [], seniority: [], departments: [], contactLocation: [],
        });
        break;
      case "lists":
        setListsFilters({
          includeAccountLists: [], includeContactLists: [],
          excludeCompanies: [], excludeContacts: [], excludeCompetitors: [],
          excludeCurrentCustomers: false,
        });
        break;
    }
  };

  const handleQuickView = (id: string) => {
    setQuickViewId(id);
    setQuickViewOpen(true);
  };

  const handleOpenProfile = (id: string) => {
    if (mode === "accounts") {
      navigate(`/sc-workspace?account=${id}`);
    } else {
      navigate(`/contact/profile?id=${id}`);
    }
  };

  const handleUseResults = () => {
    navigate(`/results/${mode}?count=${totalCount}`);
  };

  // Match quality indicator
  const getMatchQuality = () => {
    if (totalCount === 0) return { label: "No matches", color: "destructive" as const };
    if (totalCount < 100) return { label: "🎯 Highly targeted", color: "outline" as const };
    if (totalCount < 1000) return { label: "✓ Well balanced", color: "secondary" as const };
    return { label: "📊 Broad audience", color: "secondary" as const };
  };

  const matchQuality = getMatchQuality();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-hero px-4 sm:px-6 py-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="max-w-[1800px] mx-auto relative z-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/search")}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                ← Back to Search
              </Button>
              <h1 className="text-xl font-semibold text-white">Build Your Search</h1>
            </div>
            
            <SearchModeToggle mode={mode} onChange={handleModeSwitch} />
          </div>

          {/* NLS Query Bar */}
          {nlsQuery && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Wand2 className="h-4 w-4 text-white/70" />
              {isEditingNLS ? (
                <Input
                  value={nlsQuery}
                  onChange={(e) => setNlsQuery(e.target.value)}
                  onBlur={() => setIsEditingNLS(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      parseNLSQuery(nlsQuery);
                      setIsEditingNLS(false);
                    }
                  }}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  autoFocus
                />
              ) : (
                <>
                  <span className="flex-1 text-sm text-white/90 truncate">"{nlsQuery}"</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingNLS(true)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </>
              )}
            </div>
          )}

          {mode === "contacts" && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Link2 className="h-3 w-3 mr-1" />
                Scope: within matched accounts
              </Badge>
              <Button variant="ghost" size="sm" className="text-xs text-white/70 hover:text-white">
                Detach from accounts
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Info Banner */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 pt-6">
        <Alert className="bg-gradient-to-r from-primary/10 via-secondary/10 to-pink-500/10 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <span className="font-semibold">Best-in-class data:</span>{" "}
            We combine premium firmographic and technographic providers to deliver unmatched coverage and accuracy. 
            Build each dimension separately, then blend using Intersect, Union, or Exclude for precision targeting.
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Filters */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {/* Show Technographics first only if explicitly tech-first (not just detected keywords) */}
            {techFirstParam && (
              <UnifiedFilterSection
                title="Technographics"
                icon={<Cpu className="h-5 w-5" />}
                chipCount={techCount}
                defaultOpen={true}
                onReset={() => resetSection("technographic")}
                className="ring-2 ring-primary/50 shadow-lg"
              >
                <TechnographicsSection
                  provider={techProvider}
                  onProviderChange={setTechProvider}
                  techs={techFilters}
                  onTechsChange={(newTechs) => {
                    setTechFilters(newTechs);
                    // If user added techs, mark as ready for other filters
                    if (newTechs.length > 0) {
                      setHasSavedTechList(true);
                    }
                  }}
                />
                {techFilters.length > 0 && !hasSavedTechList && (
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      onClick={() => {
                        setHasSavedTechList(true);
                        toast.success("Tech filters saved! You can now apply firmographic filters.");
                      }}
                      className="w-full gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Tech Selection & Continue
                    </Button>
                  </div>
                )}
              </UnifiedFilterSection>
            )}

            {/* Firmographics - locked only if tech-first and not saved */}
            <div className={techFirstParam && !hasSavedTechList ? "relative" : ""}>
              {techFirstParam && !hasSavedTechList && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 rounded-xl flex items-center justify-center">
                  <div className="flex items-center gap-2 text-muted-foreground bg-card/90 px-4 py-2 rounded-lg shadow-sm">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Select technographics first</span>
                  </div>
                </div>
              )}
              <UnifiedFilterSection
                title="Firmographics"
                icon={<Building2 className="h-5 w-5" />}
                chipCount={firmographicCount}
                defaultOpen={!isTechSearch}
                onReset={() => resetSection("firmographic")}
              >
                <div className="space-y-4">
                  {/* Location Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        Locations
                      </label>
                      <Input
                        placeholder="Add location..."
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && locationInput.trim()) {
                            addFirmographicItem("locations", locationInput);
                            setLocationInput("");
                          }
                        }}
                        disabled={techFirstParam && !hasSavedTechList}
                        className="h-9"
                      />
                      {firmographicFilters.locations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {firmographicFilters.locations.map((loc) => (
                            <FilterChip key={loc} value={loc} onRemove={() => removeFirmographicItem("locations", loc)} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium flex items-center gap-1.5 text-destructive/80">
                        <MapPin className="h-3.5 w-3.5" />
                        Exclude Locations
                      </label>
                      <Input
                        placeholder="Exclude location..."
                        value={excludeLocationInput}
                        onChange={(e) => setExcludeLocationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && excludeLocationInput.trim()) {
                            addFirmographicItem("excludeLocations", excludeLocationInput);
                            setExcludeLocationInput("");
                          }
                        }}
                        disabled={techFirstParam && !hasSavedTechList}
                        className="h-9"
                      />
                      {firmographicFilters.excludeLocations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {firmographicFilters.excludeLocations.map((loc) => (
                            <FilterChip key={loc} value={loc} onRemove={() => removeFirmographicItem("excludeLocations", loc)} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      Company Name
                    </label>
                    <Input
                      placeholder="Search Company Name"
                      value={firmographicFilters.companyName}
                      onChange={(e) => setFirmographicFilters(prev => ({ ...prev, companyName: e.target.value }))}
                      disabled={techFirstParam && !hasSavedTechList}
                      className="h-9"
                    />
                  </div>

                  <div className="h-px bg-border" />

                  {/* Industry Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        Industry
                      </label>
                      <Input
                        placeholder="Add industry..."
                        value={industryInput}
                        onChange={(e) => setIndustryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && industryInput.trim()) {
                            addFirmographicItem("industries", industryInput);
                            setIndustryInput("");
                          }
                        }}
                        disabled={techFirstParam && !hasSavedTechList}
                        className="h-9"
                      />
                      {firmographicFilters.industries.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {firmographicFilters.industries.map((ind) => (
                            <FilterChip key={ind} value={ind} onRemove={() => removeFirmographicItem("industries", ind)} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium flex items-center gap-1.5 text-destructive/80">
                        <Briefcase className="h-3.5 w-3.5" />
                        Exclude Industry
                      </label>
                      <Input
                        placeholder="Exclude industry..."
                        value={excludeIndustryInput}
                        onChange={(e) => setExcludeIndustryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && excludeIndustryInput.trim()) {
                            addFirmographicItem("excludeIndustries", excludeIndustryInput);
                            setExcludeIndustryInput("");
                          }
                        }}
                        disabled={techFirstParam && !hasSavedTechList}
                        className="h-9"
                      />
                      {firmographicFilters.excludeIndustries.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {firmographicFilters.excludeIndustries.map((ind) => (
                            <FilterChip key={ind} value={ind} onRemove={() => removeFirmographicItem("excludeIndustries", ind)} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Keywords Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        Company Keywords
                      </label>
                      <Input
                        placeholder="Add keyword..."
                        value={companyKeywordInput}
                        onChange={(e) => setCompanyKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && companyKeywordInput.trim()) {
                            addFirmographicItem("companyKeywords", companyKeywordInput);
                            setCompanyKeywordInput("");
                          }
                        }}
                        disabled={techFirstParam && !hasSavedTechList}
                        className="h-9"
                      />
                      {firmographicFilters.companyKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {firmographicFilters.companyKeywords.map((kw) => (
                            <FilterChip key={kw} value={kw} onRemove={() => removeFirmographicItem("companyKeywords", kw)} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium flex items-center gap-1.5 text-destructive/80">
                        <Briefcase className="h-3.5 w-3.5" />
                        Exclude Keywords
                      </label>
                      <Input
                        placeholder="Exclude keyword..."
                        value={excludeCompanyKeywordInput}
                        onChange={(e) => setExcludeCompanyKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && excludeCompanyKeywordInput.trim()) {
                            addFirmographicItem("excludeCompanyKeywords", excludeCompanyKeywordInput);
                            setExcludeCompanyKeywordInput("");
                          }
                        }}
                        disabled={techFirstParam && !hasSavedTechList}
                        className="h-9"
                      />
                      {firmographicFilters.excludeCompanyKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {firmographicFilters.excludeCompanyKeywords.map((kw) => (
                            <FilterChip key={kw} value={kw} onRemove={() => removeFirmographicItem("excludeCompanyKeywords", kw)} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Employee Size */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      Employee Size
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {employeeSizePresets.map((size) => (
                        <Badge
                          key={size}
                          variant={firmographicFilters.employeeSize.includes(size) ? "default" : "outline"}
                          className={`cursor-pointer text-xs transition-all duration-200 hover:scale-105 ${techFirstParam && !hasSavedTechList ? "pointer-events-none opacity-50" : ""}`}
                          onClick={() => toggleFirmographicItem("employeeSize", size)}
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                        Revenue (Min)
                      </label>
                      <Input
                        placeholder="e.g. 20000000"
                        value={firmographicFilters.revenueMin}
                        onChange={(e) => setFirmographicFilters(prev => ({ ...prev, revenueMin: e.target.value }))}
                        disabled={techFirstParam && !hasSavedTechList}
                        type="number"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                        Revenue (Max)
                      </label>
                      <Input
                        placeholder="e.g. 75000000"
                        value={firmographicFilters.revenueMax}
                        onChange={(e) => setFirmographicFilters(prev => ({ ...prev, revenueMax: e.target.value }))}
                        disabled={techFirstParam && !hasSavedTechList}
                        type="number"
                        className="h-9"
                      />
                    </div>
                  </div>

                  {/* Funding Stage */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Funding Stage</label>
                    <div className="flex flex-wrap gap-1.5">
                      {fundingPresets.map((stage) => (
                        <Badge
                          key={stage}
                          variant={firmographicFilters.fundingStage.includes(stage) ? "default" : "outline"}
                          className={`cursor-pointer text-xs transition-all duration-200 hover:scale-105 ${techFirstParam && !hasSavedTechList ? "pointer-events-none opacity-50" : ""}`}
                          onClick={() => toggleFirmographicItem("fundingStage", stage)}
                        >
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </UnifiedFilterSection>
            </div>

            {/* Technographics - only show here if NOT tech-first (otherwise it's at the top) */}
            {!techFirstParam && (
              <UnifiedFilterSection
                title="Technographics"
                icon={<Cpu className="h-5 w-5" />}
                chipCount={techCount}
                defaultOpen={techFilters.length > 0}
                onReset={() => resetSection("technographic")}
              >
              <TechnographicsSection
                  provider={techProvider}
                  onProviderChange={setTechProvider}
                  techs={techFilters}
                  onTechsChange={setTechFilters}
                  pickOnlyMode={true}
                  onOpenComposer={() => setTechComposerOpen(true)}
                />
              </UnifiedFilterSection>
            )}

            {/* Buying Signals Section */}
            <UnifiedFilterSection
              title="Buying Signals"
              icon={<Zap className="h-5 w-5" />}
              chipCount={activeBuyingSignalPicks ? 1 : 0}
              defaultOpen={false}
              onReset={() => setActiveBuyingSignalPicks(null)}
            >
              <BuyingSignalsSection
                selectedPickId={activeBuyingSignalPicks}
                onPickChange={setActiveBuyingSignalPicks}
                onOpenComposer={() => setBuyingSignalsComposerOpen(true)}
              />
            </UnifiedFilterSection>

            {/* Persona (Contacts only) - locked if tech-first but not saved, hidden if firmFirst */}
            {mode === "contacts" && !firmFirstParam && (
              <div className={techFirstParam && !hasSavedTechList ? "relative" : ""}>
                {techFirstParam && !hasSavedTechList && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 rounded-xl flex items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground bg-card/90 px-4 py-2 rounded-lg shadow-sm">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">Select technographics first</span>
                    </div>
                  </div>
                )}
                <UnifiedFilterSection
                  title="Persona"
                  icon={<Users className="h-5 w-5" />}
                  chipCount={personaCount}
                  defaultOpen={!techFirstParam}
                  onReset={() => resetSection("persona")}
                >
                  <PersonaFilters
                    filters={personaFilters}
                    onChange={setPersonaFilters}
                  />
                </UnifiedFilterSection>
              </div>
            )}

            {/* Lists & Exclusions */}
            <UnifiedFilterSection
              title="Lists & Exclusions"
              icon={<List className="h-5 w-5" />}
              chipCount={listsCount}
              onReset={() => resetSection("lists")}
            >
              <div className="space-y-5">
                {/* Include Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                    <Shield className="h-4 w-4" />
                    <span>Include from Lists</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Include Account Lists */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Account Lists</label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        onChange={(e) => {
                          if (e.target.value && !listsFilters.includeAccountLists.includes(e.target.value)) {
                            setListsFilters(prev => ({
                              ...prev,
                              includeAccountLists: [...prev.includeAccountLists, e.target.value]
                            }));
                          }
                          e.target.value = "";
                        }}
                        value=""
                      >
                        <option value="">Select account list...</option>
                        <option value="Enterprise Targets Q1">Enterprise Targets Q1</option>
                        <option value="Mid-Market West Coast">Mid-Market West Coast</option>
                        <option value="Tech Stack Matches">Tech Stack Matches</option>
                        <option value="High Intent Accounts">High Intent Accounts</option>
                      </select>
                      {listsFilters.includeAccountLists.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {listsFilters.includeAccountLists.map((list) => (
                            <FilterChip
                              key={list}
                              value={list}
                              onRemove={() => setListsFilters(prev => ({
                                ...prev,
                                includeAccountLists: prev.includeAccountLists.filter(l => l !== list)
                              }))}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Include Contact Lists */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Contact Lists</label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        onChange={(e) => {
                          if (e.target.value && !listsFilters.includeContactLists.includes(e.target.value)) {
                            setListsFilters(prev => ({
                              ...prev,
                              includeContactLists: [...prev.includeContactLists, e.target.value]
                            }));
                          }
                          e.target.value = "";
                        }}
                        value=""
                      >
                        <option value="">Select contact list...</option>
                        <option value="VP+ Marketing">VP+ Marketing</option>
                        <option value="Decision Makers">Decision Makers</option>
                        <option value="Engaged Prospects">Engaged Prospects</option>
                        <option value="Event Attendees 2024">Event Attendees 2024</option>
                      </select>
                      {listsFilters.includeContactLists.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {listsFilters.includeContactLists.map((list) => (
                            <FilterChip
                              key={list}
                              value={list}
                              onRemove={() => setListsFilters(prev => ({
                                ...prev,
                                includeContactLists: prev.includeContactLists.filter(l => l !== list)
                              }))}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Exclude Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                    <Shield className="h-4 w-4" />
                    <span>Exclude from Results</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Exclude Companies */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Exclude Account Lists</label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        onChange={(e) => {
                          if (e.target.value && !listsFilters.excludeCompanies.includes(e.target.value)) {
                            setListsFilters(prev => ({
                              ...prev,
                              excludeCompanies: [...prev.excludeCompanies, e.target.value]
                            }));
                          }
                          e.target.value = "";
                        }}
                        value=""
                      >
                        <option value="">Select list to exclude...</option>
                        <option value="Current Customers">Current Customers</option>
                        <option value="Competitors">Competitors</option>
                        <option value="Do Not Contact">Do Not Contact</option>
                        <option value="Closed Lost 2024">Closed Lost 2024</option>
                      </select>
                      {listsFilters.excludeCompanies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {listsFilters.excludeCompanies.map((list) => (
                            <FilterChip
                              key={list}
                              value={list}
                              onRemove={() => setListsFilters(prev => ({
                                ...prev,
                                excludeCompanies: prev.excludeCompanies.filter(l => l !== list)
                              }))}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Exclude Contacts */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Exclude Contact Lists</label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        onChange={(e) => {
                          if (e.target.value && !listsFilters.excludeContacts.includes(e.target.value)) {
                            setListsFilters(prev => ({
                              ...prev,
                              excludeContacts: [...prev.excludeContacts, e.target.value]
                            }));
                          }
                          e.target.value = "";
                        }}
                        value=""
                      >
                        <option value="">Select list to exclude...</option>
                        <option value="Unsubscribed">Unsubscribed</option>
                        <option value="Bounced Emails">Bounced Emails</option>
                        <option value="Recently Contacted">Recently Contacted</option>
                      </select>
                      {listsFilters.excludeContacts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {listsFilters.excludeContacts.map((list) => (
                            <FilterChip
                              key={list}
                              value={list}
                              onRemove={() => setListsFilters(prev => ({
                                ...prev,
                                excludeContacts: prev.excludeContacts.filter(l => l !== list)
                              }))}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </UnifiedFilterSection>

            {/* Job Search */}
            <UnifiedFilterSection
              title="Job Search"
              icon={<Briefcase className="h-5 w-5" />}
              chipCount={jobCount}
              onReset={() => resetSection("job")}
            >
              <div className="space-y-4">
                {/* Job Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Job Title
                  </label>
                  <Input
                    placeholder="Type job title and press Enter..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          setJobFilters(prev => ({
                            ...prev,
                            jobTitles: [...prev.jobTitles, target.value.trim()]
                          }));
                          target.value = "";
                        }
                      }
                    }}
                  />
                  {jobFilters.jobTitles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {jobFilters.jobTitles.map((title) => (
                        <FilterChip
                          key={title}
                          value={title}
                          onRemove={() => setJobFilters(prev => ({
                            ...prev,
                            jobTitles: prev.jobTitles.filter(t => t !== title)
                          }))}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-border" />

                {/* Active Job Postings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Active Job Postings (Min)
                    </label>
                    <Input
                      placeholder="e.g. 5"
                      type="number"
                      value={jobFilters.activeJobPostingsMin}
                      onChange={(e) => setJobFilters(prev => ({ ...prev, activeJobPostingsMin: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Active Job Postings (Max)
                    </label>
                    <Input
                      placeholder="e.g. 50"
                      type="number"
                      value={jobFilters.activeJobPostingsMax}
                      onChange={(e) => setJobFilters(prev => ({ ...prev, activeJobPostingsMax: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Job Posted Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      Job Posted At (Min)
                    </label>
                    <Input
                      placeholder="e.g. 2025-01-01"
                      type="date"
                      value={jobFilters.jobPostedAtMin}
                      onChange={(e) => setJobFilters(prev => ({ ...prev, jobPostedAtMin: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      Job Posted At (Max)
                    </label>
                    <Input
                      placeholder="e.g. 2025-12-31"
                      type="date"
                      value={jobFilters.jobPostedAtMax}
                      onChange={(e) => setJobFilters(prev => ({ ...prev, jobPostedAtMax: e.target.value }))}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Filter companies by their active job postings and hiring activity.
                </p>
              </div>
            </UnifiedFilterSection>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-[140px]">
              <LivePreviewPanel
                mode={mode}
                isLoading={isLoading}
                totalCount={totalCount}
                lastRefresh={lastRefresh}
                appliedFilters={appliedFilters}
                onQuickView={handleQuickView}
                onOpenProfile={handleOpenProfile}
                onWhyTheseResults={() => {
                  toast.info("Query explanation", {
                    description: `Matched ${mode} using ${totalFilterCount} filters across firmographic and technographic criteria.`,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar - always visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t shadow-lg z-40">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Badge variant={matchQuality.color} className="px-3 py-1.5">
                  {matchQuality.label}
                </Badge>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="font-semibold text-lg">
                      {totalCount.toLocaleString()}
                    </span>
                  )}
                  <span className="text-muted-foreground">{mode}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSaveDialogOpen(true)}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Search
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  Create List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  size="default"
                  onClick={handleUseResults}
                  disabled={totalCount === 0}
                  className="gap-2 shadow-primary"
                >
                  Use Results
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Quick View Drawer */}
      <QuickViewDrawer
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        mode={mode}
        itemId={quickViewId}
      />

      {/* Save List Dialog */}
      <SaveListDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        totalCount={totalCount}
        filters={firmographicFilters}
      />

      {/* Tech Composer Modal for creating new Tech Picks */}
      <Sheet open={techComposerOpen} onOpenChange={setTechComposerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New Tech Pick</SheetTitle>
            <SheetDescription>
              Build a new technology selection to use in your search filters.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <TechnographicsComposer
              isOpen={true}
              onOpenChange={(open) => !open && setTechComposerOpen(false)}
              activeTechPicks={activeTechPicks}
              onTechPicksChange={setActiveTechPicks}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Buying Signals Composer Modal for creating new Signal Picks */}
      <Sheet open={buyingSignalsComposerOpen} onOpenChange={setBuyingSignalsComposerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New Signal Pick</SheetTitle>
            <SheetDescription>
              Build a new buying signals filter to add to your search.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <BuyingSignalsComposer
              isOpen={true}
              onOpenChange={(open) => !open && setBuyingSignalsComposerOpen(false)}
              activePicks={activeBuyingSignalPicks}
              onPicksChange={setActiveBuyingSignalPicks}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
