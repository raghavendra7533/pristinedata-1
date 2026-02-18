import { useState } from "react";
import { Sparkles, Info, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
const quickStarters = ["Companies in California with Revenue < $50 Million", "Companies that use Salesforce", "CMOs in Healthcare SaaS Companies", "Linkedin URL - http://www.linkedin.com/in/kylehollingsworth/"];
const recentSearches = [{
  query: "RevOps in fintech",
  results: 1284,
  type: "Mixed"
}, {
  query: "Healthcare SaaS CMOs",
  results: 432,
  type: "Contacts"
}, {
  query: "Snowflake users US",
  results: 2156,
  type: "Accounts"
}];
export default function Search() {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const handlePromptSubmit = async (customPrompt?: string) => {
    const queryText = customPrompt || prompt;
    if (queryText.trim()) {
      setIsAnalyzing(true);
      const lowerQuery = queryText.toLowerCase();

      // Check if query contains a LinkedIn URL
      const linkedinUrlPattern = /linkedin\.com\/in\/[\w-]+/i;
      if (linkedinUrlPattern.test(queryText)) {
        setTimeout(() => {
          const linkedinMatch = queryText.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?/i);
          const linkedinUrl = linkedinMatch ? linkedinMatch[0] : "";
          navigate(`/contact/profile?linkedin=${encodeURIComponent(linkedinUrl)}`);
        }, 1500);
        return;
      }

      // Detect if query contains contact/people terms
      const contactKeywords = ['cmo', 'ceo', 'cto', 'cfo', 'vp', 'director', 'manager', 'head of', 'leader', 'executive', 'founder', 'president', 'chief', 'contact', 'people', 'persona', 'buyer', 'decision maker'];

      // Detect if query contains technographic terms
      const techKeywords = ['using', 'technology', 'tech', 'stack', 'platform', 'software', 'tool', 'crm', 'erp', 'salesforce', 'hubspot', 'snowflake', 'aws', 'azure', 'google cloud', 'slack', 'zoom', 'microsoft', 'oracle', 'sap', 'workday', 'tableau', 'power bi', 'looker', 'databricks'];

      // Detect firmographic terms
      const firmographicKeywords = ['company', 'companies', 'business', 'organization', 'firm', 'industry', 'revenue', 'employee', 'size', 'location', 'region'];
      const hasContact = contactKeywords.some(keyword => lowerQuery.includes(keyword));
      const hasTech = techKeywords.some(keyword => lowerQuery.includes(keyword));
      const hasFirmographic = firmographicKeywords.some(keyword => lowerQuery.includes(keyword));

      // Simulate AI parsing
      setTimeout(() => {
        // Flow 4: Full ICP (has both account AND contact criteria)
        if (hasContact && (hasFirmographic || hasTech)) {
          navigate(`/icp-funnel?q=${encodeURIComponent(queryText)}`);
        }
        // Flow 3: Contact + Account search (contact focused, but no clear account criteria)
        else if (hasContact) {
          navigate(`/account-search?q=${encodeURIComponent(queryText)}`);
        }
        // Flow 2: Account search with Technographics
        else if (hasTech) {
          navigate(`/account-search?q=${encodeURIComponent(queryText)}`);
        }
        // Flow 1: Firmographics only - go directly to results
        else {
          navigate(`/results/accounts?q=${encodeURIComponent(queryText)}&type=firmographic`);
        }
      }, 1500);
    }
  };
  const useQuickStarter = (text: string) => {
    setPrompt(text);
    handlePromptSubmit(text);
  };
  return <div className="min-h-full">
      {/* Header with Gradient Band */}
      <section className="relative bg-gradient-hero px-6 py-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 leading-tight">
              Find Your Ideal Customers
            </h1>
            <p className="text-sm text-white/80 max-w-2xl mx-auto">
              Describe what you're looking for in natural language. Our AI will handle the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Main Search Section */}
      <section className="px-6 py-8 max-w-5xl mx-auto">
        {/* Main Prompt Box */}
        <Card className="shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && handlePromptSubmit()} placeholder="Describe what you're looking for... 

Examples:
• 'Find CMOs at B2B SaaS companies in California using HubSpot'
• 'Series B startups in fintech, 50-200 employees, using Snowflake'
• 'RevOps leaders at mid-market healthcare companies with recent funding'" className="w-full px-6 py-6 text-lg border-0 focus:outline-none resize-none min-h-[180px] bg-transparent" disabled={isAnalyzing} />
              
              {isAnalyzing && <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex items-center gap-3 text-primary">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span className="text-lg font-medium">Analyzing your request...</span>
                  </div>
                </div>}
            </div>

            <div className="px-6 py-4 bg-muted/50 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Info className="h-4 w-4" />
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
              </div>
              
              <Button onClick={() => handlePromptSubmit()} disabled={!prompt.trim() || isAnalyzing} size="lg" className="gap-2 shadow-lg">
                <Sparkles className="h-4 w-4" />
                Start Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Starters */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm mb-3">Quick starters:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickStarters.map((starter, idx) => <Button key={idx} variant="secondary" size="sm" onClick={() => useQuickStarter(starter)} className="text-xs">
                {starter}
              </Button>)}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Recent Searches</h2>
            <p className="text-muted-foreground">Pick up where you left off</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentSearches.map((search, idx) => <Card key={idx} className="group cursor-pointer hover:shadow-primary transition-all duration-300 hover:-translate-y-1" onClick={() => navigate(`/insights?q=${encodeURIComponent(search.query)}`)}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {search.type}
                  </Badge>
                  <div className="text-2xl font-bold text-primary">
                    {search.results.toLocaleString()}
                  </div>
                </div>
                <CardTitle className="text-lg">{search.query}</CardTitle>
                <CardDescription>results found</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group-hover:bg-muted">
                  View Results
                  <TrendingUp className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>)}
        </div>
      </section>
    </div>;
}