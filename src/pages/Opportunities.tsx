import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Zap, Clock, Building2, User, ArrowRight, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data based on the screenshot reference
const mockOpportunities = [
  {
    id: "1",
    contactName: "Edgar Carrasco",
    contactTitle: "Revenue Growth Strategist",
    company: "Regpack",
    email: "edgar@regpacks.com",
    status: "Active",
    lastUpdated: "Sep 15 2025 • 7:38 am",
    summary: "Focused on expanding Regpack's market reach with 7-figure SaaS deals",
    stage: "Discovery"
  },
  {
    id: "2",
    contactName: "Sarah Chen",
    contactTitle: "VP of Sales",
    company: "TechFlow Solutions",
    email: "sarah.chen@techflow.com",
    status: "Active",
    lastUpdated: "Sep 14 2025 • 3:22 pm",
    summary: "Scaling sales operations for mid-market enterprise software",
    stage: "Proposal"
  },
  {
    id: "3",
    contactName: "Michael Rodriguez",
    contactTitle: "Director of Business Development",
    company: "DataSync Inc",
    email: "m.rodriguez@datasync.io",
    status: "On Hold",
    lastUpdated: "Sep 10 2025 • 11:15 am",
    summary: "Evaluating GTM tools for new product launch in Q1",
    stage: "Evaluation"
  },
  {
    id: "4",
    contactName: "Lisa Thompson",
    contactTitle: "Head of RevOps",
    company: "CloudScale",
    email: "lisa.t@cloudscale.com",
    status: "Active",
    lastUpdated: "Sep 8 2025 • 9:45 am",
    summary: "Building RevOps infrastructure for hypergrowth startup",
    stage: "Negotiation"
  }
];

const statusColors = {
  Active: "bg-green-500/10 text-green-700 dark:text-green-400",
  "On Hold": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  Closed: "bg-gray-500/10 text-gray-700 dark:text-gray-400"
};

const stageColors = {
  Discovery: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Evaluation: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  Proposal: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  Negotiation: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20"
};

export default function Opportunities() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = 
      opp.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.contactTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "active" && opp.status === "Active") ||
      (activeTab === "on-hold" && opp.status === "On Hold");
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-full">
      {/* Header with Gradient Band */}
      <section className="relative bg-gradient-hero px-6 py-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">Opportunity Playbooks</h1>
              <p className="text-white/80 text-sm">
                Track and manage your active deal opportunities
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/search")}
            >
              <Zap className="h-4 w-4 mr-2" />
              Create New Playbook
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="bg-background border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({mockOpportunities.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({mockOpportunities.filter(o => o.status === "Active").length})
            </TabsTrigger>
            <TabsTrigger value="on-hold">
              On Hold ({mockOpportunities.filter(o => o.status === "On Hold").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 gap-4">
          {filteredOpportunities.map((opp) => (
            <Card 
              key={opp.id} 
              className="group hover:shadow-primary transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/contact/profile?email=${opp.email}&tab=opportunity`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  {/* Left: Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {opp.contactName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold truncate">{opp.contactName}</h3>
                          <Badge className={statusColors[opp.status as keyof typeof statusColors]}>
                            {opp.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm truncate">{opp.contactTitle}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {opp.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {opp.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-16">{opp.summary}</p>
                  </div>

                  {/* Right: Stage and Action */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <Badge 
                      variant="outline" 
                      className={`${stageColors[opp.stage as keyof typeof stageColors]}`}
                    >
                      {opp.stage}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="group-hover:bg-muted"
                    >
                      View Playbook
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try adjusting your search" : "Start by creating your first opportunity playbook"}
              </p>
              <Button onClick={() => navigate("/search")}>
                <Zap className="h-4 w-4 mr-2" />
                Create Opportunity Playbook
              </Button>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
