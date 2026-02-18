import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Building2, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import FirmographicFilters from "@/components/search/FirmographicFilters";
import ContactFilters from "@/components/search/ContactFilters";
import TechnographicsComposer from "@/components/search/TechnographicsComposer";
import ResultsPreview from "@/components/search/ResultsPreview";
import SaveListDialog from "@/components/search/SaveListDialog";

export default function ICPFunnel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialStep = searchParams.get("step") as "accounts" | "contacts" | null;
  
  const [currentStep, setCurrentStep] = useState<"accounts" | "contacts">(initialStep === "contacts" ? "contacts" : "accounts");
  const [accountFilters, setAccountFilters] = useState({
    locations: [] as string[],
    industries: [] as string[],
    industryKeywords: [] as string[],
    employeeSize: [] as string[],
    revenue: [] as string[],
  });
  const [contactFilters, setContactFilters] = useState({
    jobTitles: [] as string[],
    seniority: [] as string[],
    personLocation: [] as string[],
    personKeywords: [] as string[],
  });
  const [techComposerOpen, setTechComposerOpen] = useState(false);
  const [activeTechPicks, setActiveTechPicks] = useState<string | null>(null);
  
  const [accountCount, setAccountCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [isCountingAccounts, setIsCountingAccounts] = useState(false);
  const [isCountingContacts, setIsCountingContacts] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewResults, setPreviewResults] = useState<any[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const hasAccountFilters = 
    accountFilters.locations.length > 0 ||
    accountFilters.industries.length > 0 ||
    accountFilters.industryKeywords.length > 0 ||
    accountFilters.employeeSize.length > 0 ||
    accountFilters.revenue.length > 0;

  const hasContactFilters = 
    contactFilters.jobTitles.length > 0 ||
    contactFilters.seniority.length > 0 ||
    contactFilters.personLocation.length > 0 ||
    contactFilters.personKeywords.length > 0;

  const progress = currentStep === "accounts" ? 50 : 100;

  // Calculate account count whenever filters change
  useEffect(() => {
    if (hasAccountFilters || activeTechPicks) {
      setIsCountingAccounts(true);
      setShowPreview(false);
      
      const timer = setTimeout(() => {
        const baseCount = 50000;
        
        const locationMultiplier = accountFilters.locations.length > 0 
          ? Math.pow(0.4, accountFilters.locations.length) 
          : 1;
        
        const industryMultiplier = accountFilters.industries.length > 0 
          ? Math.pow(0.3, accountFilters.industries.length) 
          : 1;
        
        const keywordMultiplier = accountFilters.industryKeywords.length > 0 
          ? Math.pow(0.5, accountFilters.industryKeywords.length) 
          : 1;
        
        const employeeMultiplier = accountFilters.employeeSize.length > 0 
          ? 0.3 / accountFilters.employeeSize.length 
          : 1;
        
        const revenueMultiplier = accountFilters.revenue.length > 0 
          ? 0.4 / accountFilters.revenue.length 
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
        
        setAccountCount(Math.max(calculatedCount, 25));
        setIsCountingAccounts(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setAccountCount(0);
      setShowPreview(false);
    }
  }, [accountFilters, activeTechPicks, hasAccountFilters]);

  // Calculate contact count whenever contact filters change
  useEffect(() => {
    if (currentStep === "contacts" && hasContactFilters) {
      setIsCountingContacts(true);
      
      const timer = setTimeout(() => {
        const baseContactsPerAccount = 3;
        
        const titleMultiplier = contactFilters.jobTitles.length > 0 
          ? Math.pow(0.6, contactFilters.jobTitles.length) 
          : 1;
        
        const seniorityMultiplier = contactFilters.seniority.length > 0 
          ? 0.7 / contactFilters.seniority.length 
          : 1;
        
        const locationMultiplier = contactFilters.personLocation.length > 0 
          ? Math.pow(0.5, contactFilters.personLocation.length) 
          : 1;
        
        const keywordMultiplier = contactFilters.personKeywords.length > 0 
          ? Math.pow(0.6, contactFilters.personKeywords.length) 
          : 1;
        
        const calculatedContactCount = Math.floor(
          accountCount * 
          baseContactsPerAccount *
          titleMultiplier * 
          seniorityMultiplier * 
          locationMultiplier *
          keywordMultiplier
        );
        
        setContactCount(Math.max(calculatedContactCount, accountCount > 0 ? 5 : 0));
        setIsCountingContacts(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else if (currentStep === "contacts" && !hasContactFilters) {
      setContactCount(0);
    }
  }, [contactFilters, hasContactFilters, currentStep, accountCount]);

  const handleContinueToContacts = () => {
    if (accountCount > 0) {
      setCurrentStep("contacts");
    }
  };

  const handleGetPreview = () => {
    setShowPreview(true);
    
    const mockResults = Array.from({ length: 50 }, (_, i) => ({
      id: `preview-${i}`,
      name: `Company ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      industry: accountFilters.industries[0] || "Technology",
      revenue: accountFilters.revenue[0] || "$10M-$50M",
      employees: accountFilters.employeeSize[0] || "100-500",
      location: accountFilters.locations[0] || "United States",
    }));
    
    setPreviewResults(mockResults);
    
    toast.success("Preview loaded", {
      description: `Showing first 50 of ${accountCount.toLocaleString()} matches`,
    });
  };

  const handleFinalize = () => {
    if (accountCount === 0) {
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
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-1">ICP Funnel Builder</h1>
              <p className="text-sm sm:text-base text-white/80">
                Define your target accounts, then narrow down to specific contacts
              </p>
            </div>

            {/* Progress Indicator */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "accounts" ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"}`}>
                        {currentStep === "contacts" ? <Check className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      </div>
                      <span className={currentStep === "accounts" ? "font-semibold" : ""}>
                        Step 1: Account Targeting
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "contacts" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Users className="h-4 w-4" />
                      </div>
                      <span className={currentStep === "contacts" ? "font-semibold" : "text-muted-foreground"}>
                        Step 2: Contact Targeting
                      </span>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {initialQuery && (
              <Card className="border-white/20 bg-white/10">
                <CardContent className="p-3">
                  <p className="text-sm text-white">
                    <strong>Your query:</strong> {initialQuery}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 max-w-[1800px] mx-auto">
        {currentStep === "accounts" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Account Filters */}
            <div className="lg:col-span-4 space-y-6">
              <FirmographicFilters
                filters={accountFilters}
                onChange={setAccountFilters}
              />
            </div>

            {/* Technographics & Preview */}
            <div className="lg:col-span-8 space-y-6">
              <TechnographicsComposer
                isOpen={techComposerOpen}
                onOpenChange={setTechComposerOpen}
                activeTechPicks={activeTechPicks}
                onTechPicksChange={setActiveTechPicks}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Define Your Target Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start by selecting the firmographic and technographic criteria for your ideal accounts. 
                    In the next step, you'll narrow down to specific contacts within these accounts.
                  </p>
                </CardContent>
              </Card>

              {/* Preview Results */}
              {showPreview && previewResults.length > 0 && (
                <ResultsPreview results={previewResults} totalCount={accountCount} />
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-32">
            {/* Contact Filters */}
            <div className="lg:col-span-4 space-y-6">
              <ContactFilters
                filters={contactFilters}
                onChange={setContactFilters}
              />

              {/* Account Summary */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">Targeting Within</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{accountCount.toLocaleString()} accounts</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => setCurrentStep("accounts")}
                  >
                    Modify Account Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Preview & Actions */}
            <div className="lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Target Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Now select the specific contact criteria within your {accountCount.toLocaleString()} target accounts. 
                    This creates a highly targeted list of accounts AND contacts.
                  </p>
                  
                  {!hasContactFilters ? (
                    <div className="p-8 bg-muted/30 border border-dashed rounded-lg text-center">
                      <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Add contact filters to see matching contact count
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Contact Count Overlay */}
        {currentStep === "contacts" && hasContactFilters && (
          <div className="fixed bottom-6 left-0 right-0 px-4 sm:px-6 z-30">
            <div className="max-w-[1800px] mx-auto">
              <Card className="shadow-2xl border-primary/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {isCountingContacts ? (
                              <span className="animate-pulse">Calculating...</span>
                            ) : (
                              `${contactCount.toLocaleString()} contacts`
                            )}
                          </span>
                          <Badge 
                            variant={contactCount === 0 ? "destructive" : contactCount < 50 ? "outline" : "secondary"}
                            className="text-xs font-semibold"
                          >
                            {contactCount === 0 ? "⚠️ Too Narrow" : contactCount < 50 ? "🎯 Highly Targeted" : contactCount < 500 ? "✓ Well Balanced" : "📊 Large Audience"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        From {accountCount.toLocaleString()} accounts • Results update as you adjust filters
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep("accounts")} 
                        className="flex-1"
                      >
                        Back to Accounts
                      </Button>
                      <Button 
                        onClick={handleFinalize} 
                        className="flex-1" 
                        disabled={isCountingContacts || contactCount === 0}
                      >
                        Finalize List ({contactCount.toLocaleString()} contacts)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Action Bar */}
        {currentStep === "accounts" && hasAccountFilters && accountCount > 0 && (
          <Card className="sticky bottom-6 mt-6 shadow-2xl border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">
                      {accountCount.toLocaleString()} accounts match your criteria
                    </span>
                    <Badge 
                      variant={accountCount === 0 ? "destructive" : accountCount < 100 ? "outline" : "secondary"}
                      className="text-sm font-semibold px-3 py-1"
                    >
                      {accountCount === 0 ? "⚠️ Too Narrow" : accountCount < 100 ? "🎯 Highly Targeted" : accountCount < 1000 ? "✓ Well Balanced" : "📊 Large Audience"}
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
                    <>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleGetPreview}
                        disabled={isCountingAccounts}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview Results
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleContinueToContacts}
                        disabled={isCountingAccounts}
                        className="gap-2"
                      >
                        Continue to Contacts
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleContinueToContacts}
                      disabled={isCountingAccounts}
                      className="gap-2"
                    >
                      Continue to Contact Targeting
                      <ArrowRight className="h-4 w-4" />
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
        totalCount={accountCount}
        filters={accountFilters}
      />
    </div>
  );
}
