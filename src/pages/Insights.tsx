import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Users, Sparkles, ChevronRight, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Insights() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  // Mock parsed data
  const [parsedCriteria] = useState({
    firmographics: ["US", "Fintech", "Mid-market", "$5M-$50M revenue"],
    technographics: ["Snowflake"],
    people: ["RevOps", "Director+", "North America"],
  });

  const stats = {
    accounts: 1284,
    contacts: 3567,
    inICP: 892,
  };

  return (
    <div className="min-h-full bg-gradient-subtle">
      {/* Header with Gradient Band */}
      <section className="relative bg-gradient-hero px-6 py-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 mb-3 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-5 w-5 text-white" />
                <h1 className="text-2xl font-semibold text-white">Your ICP Analysis</h1>
              </div>
              <p className="text-white/80">"{query}"</p>
            </div>
            
            <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Edit3 className="h-4 w-4" />
              Refine Search
            </Button>
          </div>
        </div>
      </section>

      <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        {/* AI Parsed Criteria */}
        <Card className="border-primary/50 shadow-primary">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI-Extracted Criteria</CardTitle>
            </div>
            <CardDescription>
              We identified these filters from your description. Click any to refine.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Firmographics</h4>
              <div className="flex flex-wrap gap-2">
                {parsedCriteria.firmographics.map((item, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Technographics</h4>
              <div className="flex flex-wrap gap-2">
                {parsedCriteria.technographics.map((item, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">People Criteria</h4>
              <div className="flex flex-wrap gap-2">
                {parsedCriteria.people.map((item, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Accounts</CardDescription>
              <div className="text-4xl font-bold text-primary">
                {stats.accounts.toLocaleString()}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => navigate("/results/accounts?from=insights")}
              >
                <Building2 className="h-4 w-4" />
                View Accounts
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Contacts</CardDescription>
              <div className="text-4xl font-bold text-secondary">
                {stats.contacts.toLocaleString()}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => navigate("/results/contacts?from=insights")}
              >
                <Users className="h-4 w-4" />
                View Contacts
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-gradient-subtle">
            <CardHeader className="pb-3">
              <CardDescription>In-ICP Match</CardDescription>
              <div className="text-4xl font-bold text-primary">
                {stats.inICP.toLocaleString()}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {Math.round((stats.inICP / stats.accounts) * 100)}% match rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Preview Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Preview</CardTitle>
            <CardDescription>Sample results from your search</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="accounts">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="accounts">Accounts ({stats.accounts})</TabsTrigger>
                <TabsTrigger value="contacts">Contacts ({stats.contacts})</TabsTrigger>
              </TabsList>

              <TabsContent value="accounts" className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="hover:shadow-card transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          A
                        </div>
                        <div>
                          <h4 className="font-semibold">Account Name {i}</h4>
                          <p className="text-sm text-muted-foreground">Fintech • $10M-$25M • 150 employees</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/results/accounts?from=insights")}
                >
                  View All {stats.accounts} Accounts
                </Button>
              </TabsContent>

              <TabsContent value="contacts" className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="hover:shadow-card transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          C
                        </div>
                        <div>
                          <h4 className="font-semibold">Contact Name {i}</h4>
                          <p className="text-sm text-muted-foreground">Director of RevOps • Account Name</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/results/contacts?from=insights")}
                >
                  View All {stats.contacts} Contacts
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-hero border-0 text-white">
          <CardHeader>
            <CardTitle className="text-white">Next Steps</CardTitle>
            <CardDescription className="text-white/80">
              What would you like to do with these results?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              variant="secondary"
              onClick={() => navigate("/results/accounts?from=insights")}
            >
              Save as Account List
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate("/results/contacts?from=insights")}
            >
              Build Contact List
            </Button>
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              Export to CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
