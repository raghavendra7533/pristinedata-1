import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export default function Insights() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "Fintech companies in US with Snowflake";
  const [activeTab, setActiveTab] = useState("accounts");

  // Mock parsed data
  const [parsedCriteria] = useState({
    firmographics: [
      { label: "United States", type: "location" },
      { label: "Fintech", type: "industry" },
      { label: "Mid-market", type: "size" },
      { label: "$5M-$50M revenue", type: "revenue" }
    ],
    technographics: [
      { label: "Snowflake", type: "tech" },
      { label: "AWS", type: "tech" },
      { label: "Salesforce", type: "tech" }
    ],
    people: [
      { label: "RevOps", type: "department" },
      { label: "Director+", type: "seniority" },
      { label: "North America", type: "region" }
    ]
  });

  const stats = {
    accounts: 1284,
    contacts: 3567,
    inICP: 892,
    matchRate: 69
  };

  const mockAccounts = [
    { id: 1, name: "Stripe", industry: "Fintech", revenue: "$10M-$25M", employees: 2500, score: 95 },
    { id: 2, name: "Plaid", industry: "Fintech", revenue: "$25M-$50M", employees: 1200, score: 92 },
    { id: 3, name: "Brex", industry: "Fintech", revenue: "$15M-$30M", employees: 800, score: 88 }
  ];

  const mockContacts = [
    { id: 1, name: "Sarah Chen", title: "VP of Revenue Operations", company: "Stripe", email: "s.chen@stripe.com" },
    { id: 2, name: "Michael Torres", title: "Director of Sales Ops", company: "Plaid", email: "m.torres@plaid.com" },
    { id: 3, name: "Emily Johnson", title: "Head of RevOps", company: "Brex", email: "e.johnson@brex.com" }
  ];

  const criteriaTypeColors = {
    location: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    industry: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
    size: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    revenue: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    tech: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
    department: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
    seniority: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    region: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20"
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="h-10 w-10"
              >
                <Icon icon="solar:arrow-left-linear" className="h-5 w-5" />
              </Button>
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Icon icon="solar:magic-stick-3-bold" className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">ICP Analysis</h1>
                <p className="text-sm text-muted-foreground truncate max-w-md">
                  "{query}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Icon icon="solar:pen-linear" className="h-4 w-4 mr-2" />
                Refine Search
              </Button>
              <Button size="sm">
                <Icon icon="solar:bookmark-linear" className="h-4 w-4 mr-2" />
                Save Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate("/results/accounts?from=insights")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon icon="solar:buildings-2-linear" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.accounts.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate("/results/contacts?from=insights")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Icon icon="solar:users-group-rounded-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.contacts.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:target-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.inICP.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">In-ICP Match</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Icon icon="solar:chart-2-linear" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.matchRate}%</p>
                  <p className="text-xs text-muted-foreground">Match Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Extracted Criteria */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:magic-stick-3-bold" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <h3 className="font-semibold">AI-Extracted Criteria</h3>
              <Badge variant="secondary" className="text-[10px] ml-2">
                {parsedCriteria.firmographics.length + parsedCriteria.technographics.length + parsedCriteria.people.length} filters
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We identified these filters from your description. Click any to refine.
            </p>

            <div className="space-y-4">
              {/* Firmographics */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:buildings-2-linear" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Firmographics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {parsedCriteria.firmographics.map((item, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className={cn(
                        "px-3 py-1.5 cursor-pointer hover:opacity-80 transition-opacity border",
                        criteriaTypeColors[item.type as keyof typeof criteriaTypeColors]
                      )}
                    >
                      {item.label}
                      <Icon icon="solar:close-circle-linear" className="h-3 w-3 ml-1.5 opacity-50" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Technographics */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:programming-linear" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Technographics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {parsedCriteria.technographics.map((item, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className={cn(
                        "px-3 py-1.5 cursor-pointer hover:opacity-80 transition-opacity border",
                        criteriaTypeColors[item.type as keyof typeof criteriaTypeColors]
                      )}
                    >
                      {item.label}
                      <Icon icon="solar:close-circle-linear" className="h-3 w-3 ml-1.5 opacity-50" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* People Criteria */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:user-circle-linear" className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">People Criteria</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {parsedCriteria.people.map((item, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className={cn(
                        "px-3 py-1.5 cursor-pointer hover:opacity-80 transition-opacity border",
                        criteriaTypeColors[item.type as keyof typeof criteriaTypeColors]
                      )}
                    >
                      {item.label}
                      <Icon icon="solar:close-circle-linear" className="h-3 w-3 ml-1.5 opacity-50" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="accounts" className="gap-2">
                <Icon icon="solar:buildings-2-linear" className="h-4 w-4" />
                Accounts ({stats.accounts.toLocaleString()})
              </TabsTrigger>
              <TabsTrigger value="contacts" className="gap-2">
                <Icon icon="solar:users-group-rounded-linear" className="h-4 w-4" />
                Contacts ({stats.contacts.toLocaleString()})
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Icon icon="solar:filter-linear" className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-3 mt-0">
            {mockAccounts.map((account) => (
              <Card
                key={account.id}
                className="group hover:border-border/80 transition-all cursor-pointer"
                onClick={() => navigate(`/results/accounts?from=insights`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {account.name.charAt(0)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{account.name}</h3>
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        >
                          {account.score}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon icon="solar:tag-linear" className="h-3.5 w-3.5" />
                          {account.industry}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon icon="solar:wallet-money-linear" className="h-3.5 w-3.5" />
                          {account.revenue}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon icon="solar:users-group-rounded-linear" className="h-3.5 w-3.5" />
                          {account.employees.toLocaleString()} employees
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                        View
                        <Icon icon="solar:arrow-right-up-linear" className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/results/accounts?from=insights")}
            >
              View All {stats.accounts.toLocaleString()} Accounts
              <Icon icon="solar:arrow-right-linear" className="h-4 w-4 ml-2" />
            </Button>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-3 mt-0">
            {mockContacts.map((contact) => (
              <Card
                key={contact.id}
                className="group hover:border-border/80 transition-all cursor-pointer"
                onClick={() => navigate(`/contact/profile?email=${contact.email}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{contact.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{contact.title}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon icon="solar:buildings-2-linear" className="h-3.5 w-3.5" />
                          {contact.company}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon icon="solar:letter-linear" className="h-3.5 w-3.5" />
                          {contact.email}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                        View Profile
                        <Icon icon="solar:arrow-right-up-linear" className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/results/contacts?from=insights")}
            >
              View All {stats.contacts.toLocaleString()} Contacts
              <Icon icon="solar:arrow-right-linear" className="h-4 w-4 ml-2" />
            </Button>
          </TabsContent>
        </Tabs>

        {/* Next Steps CTA */}
        <Card className="mt-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon="solar:rocket-bold" className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Next Steps</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              What would you like to do with these results?
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/results/accounts?from=insights")}>
                <Icon icon="solar:bookmark-linear" className="h-4 w-4 mr-2" />
                Save as Account List
              </Button>
              <Button variant="outline" onClick={() => navigate("/results/contacts?from=insights")}>
                <Icon icon="solar:users-group-rounded-linear" className="h-4 w-4 mr-2" />
                Build Contact List
              </Button>
              <Button variant="outline">
                <Icon icon="solar:export-linear" className="h-4 w-4 mr-2" />
                Export to CSV
              </Button>
              <Button variant="outline">
                <Icon icon="solar:upload-linear" className="h-4 w-4 mr-2" />
                Push to CRM
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
