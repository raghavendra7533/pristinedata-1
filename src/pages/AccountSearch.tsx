import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock saved account searches
const mockSavedSearches = [
  {
    id: "1",
    name: "Enterprise Tech Companies",
    filters: "US, 500+ employees, SaaS",
    matchCount: 2340,
    lastRun: "2 hours ago",
    status: "Active",
  },
  {
    id: "2",
    name: "Mid-Market Fintech",
    filters: "US/UK, 100-500 employees, Fintech",
    matchCount: 890,
    lastRun: "1 day ago",
    status: "Active",
  },
  {
    id: "3",
    name: "Healthcare Vertical",
    filters: "US, Healthcare, $10M+ revenue",
    matchCount: 456,
    lastRun: "3 days ago",
    status: "Paused",
  },
];

// Quick filter presets
const quickFilters = [
  { label: "Enterprise (500+)", value: "enterprise", icon: "solar:buildings-3-linear" },
  { label: "Mid-Market (100-500)", value: "midmarket", icon: "solar:buildings-2-linear" },
  { label: "SMB (1-100)", value: "smb", icon: "solar:home-2-linear" },
  { label: "Recently Funded", value: "funded", icon: "solar:wallet-money-linear" },
  { label: "High Growth", value: "growth", icon: "solar:graph-up-linear" },
  { label: "Using Snowflake", value: "snowflake", icon: "solar:server-linear" },
];

const statusColors = {
  Active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  Paused: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
};

export default function AccountSearch() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Filter states
  const [locations, setLocations] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [employeeSize, setEmployeeSize] = useState("");
  const [revenue, setRevenue] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);

  const handleQuickFilter = (value: string) => {
    if (selectedFilters.includes(value)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== value));
    } else {
      setSelectedFilters([...selectedFilters, value]);
    }
  };

  const handleSearch = () => {
    toast.success("Searching accounts...", {
      description: "Finding accounts matching your criteria",
    });
    setTimeout(() => {
      navigate("/results/accounts?type=firmographic");
    }, 800);
  };

  const handleAddLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      setLocations([...locations, e.currentTarget.value.trim()]);
      e.currentTarget.value = "";
    }
  };

  const handleAddIndustry = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      setIndustries([...industries, e.currentTarget.value.trim()]);
      e.currentTarget.value = "";
    }
  };

  const handleAddTech = (tech: string) => {
    if (!technologies.includes(tech)) {
      setTechnologies([...technologies, tech]);
    }
  };

  const hasFilters = locations.length > 0 || industries.length > 0 || employeeSize || revenue || technologies.length > 0 || selectedFilters.length > 0;

  return (
    <div className="min-h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon icon="solar:buildings-2-bold" className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Account Intelligence</h1>
                <p className="text-sm text-muted-foreground">
                  Build targeted account lists using firmographic and technographic filters
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/sc-workspace")}
              >
                <Icon icon="solar:document-text-linear" className="h-4 w-4 mr-2" />
                SC Workspace
              </Button>
              <Button size="sm" onClick={handleSearch} disabled={!hasFilters}>
                <Icon icon="solar:magnifer-linear" className="h-4 w-4 mr-2" />
                Search Accounts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon icon="solar:database-linear" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.5M+</p>
                  <p className="text-xs text-muted-foreground">Total Accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:bookmark-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {mockSavedSearches.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Saved Searches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Icon icon="solar:server-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">150+</p>
                  <p className="text-xs text-muted-foreground">Technologies Tracked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Icon icon="solar:refresh-linear" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">Daily</p>
                  <p className="text-xs text-muted-foreground">Data Refresh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="search" className="gap-2">
                <Icon icon="solar:magnifer-linear" className="h-4 w-4" />
                New Search
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <Icon icon="solar:bookmark-linear" className="h-4 w-4" />
                Saved Searches ({mockSavedSearches.length})
              </TabsTrigger>
            </TabsList>

            {activeTab === "saved" && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Icon
                    icon="solar:magnifer-linear"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    placeholder="Search saved searches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-[280px]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* New Search Tab */}
          <TabsContent value="search" className="space-y-6 mt-0">
            {/* Quick Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="solar:bolt-linear" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Quick Filters</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={selectedFilters.includes(filter.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleQuickFilter(filter.value)}
                      className="gap-2"
                    >
                      <Icon icon={filter.icon} className="h-4 w-4" />
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filter Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Firmographic Filters */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon icon="solar:buildings-2-linear" className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Firmographic Filters</h3>
                      <p className="text-xs text-muted-foreground">Location, industry, size, and revenue</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Locations */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <Icon icon="solar:map-point-linear" className="h-3.5 w-3.5" />
                        Locations
                      </label>
                      <Input
                        placeholder="Type location and press Enter..."
                        onKeyDown={handleAddLocation}
                      />
                      {locations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {locations.map((loc, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="gap-1 cursor-pointer"
                              onClick={() => setLocations(locations.filter((_, i) => i !== idx))}
                            >
                              {loc}
                              <Icon icon="solar:close-circle-linear" className="h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Industries */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <Icon icon="solar:tag-linear" className="h-3.5 w-3.5" />
                        Industries
                      </label>
                      <Input
                        placeholder="Type industry and press Enter..."
                        onKeyDown={handleAddIndustry}
                      />
                      {industries.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {industries.map((ind, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="gap-1 cursor-pointer"
                              onClick={() => setIndustries(industries.filter((_, i) => i !== idx))}
                            >
                              {ind}
                              <Icon icon="solar:close-circle-linear" className="h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Employee Size */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <Icon icon="solar:users-group-rounded-linear" className="h-3.5 w-3.5" />
                        Employee Size
                      </label>
                      <Select value={employeeSize} onValueChange={setEmployeeSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-50">1-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="501-1000">501-1000 employees</SelectItem>
                          <SelectItem value="1001+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Revenue */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <Icon icon="solar:dollar-minimalistic-linear" className="h-3.5 w-3.5" />
                        Annual Revenue
                      </label>
                      <Select value={revenue} onValueChange={setRevenue}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select revenue range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1M">$0 - $1M</SelectItem>
                          <SelectItem value="1M-10M">$1M - $10M</SelectItem>
                          <SelectItem value="10M-50M">$10M - $50M</SelectItem>
                          <SelectItem value="50M-100M">$50M - $100M</SelectItem>
                          <SelectItem value="100M+">$100M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technographic Filters */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Icon icon="solar:programming-linear" className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Technographics</h3>
                      <p className="text-xs text-muted-foreground">Filter by technology stack</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Quick Add Technologies */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Popular Technologies
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Snowflake", "HubSpot", "Salesforce", "AWS", "Google Cloud", "Stripe"].map((tech) => (
                          <Button
                            key={tech}
                            variant={technologies.includes(tech) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              if (technologies.includes(tech)) {
                                setTechnologies(technologies.filter((t) => t !== tech));
                              } else {
                                handleAddTech(tech);
                              }
                            }}
                            className="text-xs"
                          >
                            {tech}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Custom Technology Search */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <Icon icon="solar:magnifer-linear" className="h-3.5 w-3.5" />
                        Search Technologies
                      </label>
                      <Input
                        placeholder="Search for any technology..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            handleAddTech(e.currentTarget.value.trim());
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>

                    {/* Selected Technologies */}
                    {technologies.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                          Selected ({technologies.length})
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {technologies.map((tech, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="gap-1 cursor-pointer bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20"
                              onClick={() => setTechnologies(technologies.filter((_, i) => i !== idx))}
                            >
                              {tech}
                              <Icon icon="solar:close-circle-linear" className="h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Bar */}
            {hasFilters && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:filter-bold" className="h-5 w-5 text-primary" />
                        <span className="font-semibold">
                          {locations.length + industries.length + technologies.length + selectedFilters.length + (employeeSize ? 1 : 0) + (revenue ? 1 : 0)} filters applied
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        ~12,450 accounts match
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setLocations([]);
                          setIndustries([]);
                          setEmployeeSize("");
                          setRevenue("");
                          setTechnologies([]);
                          setSelectedFilters([]);
                        }}
                      >
                        Clear All
                      </Button>
                      <Button onClick={handleSearch}>
                        <Icon icon="solar:magnifer-linear" className="h-4 w-4 mr-2" />
                        Search Accounts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Saved Searches Tab */}
          <TabsContent value="saved" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {mockSavedSearches
                    .filter((s) =>
                      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.filters.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((search) => (
                      <div
                        key={search.id}
                        className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group cursor-pointer"
                        onClick={() => navigate("/results/accounts")}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon icon="solar:bookmark-bold" className="h-5 w-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-sm">{search.name}</h3>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px] uppercase font-bold tracking-wide border",
                                statusColors[search.status as keyof typeof statusColors]
                              )}
                            >
                              {search.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{search.filters}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="text-right">
                            <p className="font-semibold text-foreground">{search.matchCount.toLocaleString()}</p>
                            <p className="text-xs">matches</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs">Last run</p>
                            <p className="text-xs">{search.lastRun}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Icon icon="solar:play-linear" className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Icon icon="solar:pen-linear" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            <Icon icon="solar:trash-bin-minimalistic-linear" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                  {mockSavedSearches.filter((s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.filters.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <Icon icon="solar:bookmark-linear" className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No saved searches found</h3>
                      <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                        {searchQuery ? "Try adjusting your search query" : "Create your first saved search to get started"}
                      </p>
                      <Button onClick={() => setActiveTab("search")}>
                        <Icon icon="solar:add-circle-linear" className="h-4 w-4 mr-2" />
                        Create New Search
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
