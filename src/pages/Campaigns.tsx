import { useState } from "react";
import { Search, Download, FileText, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock campaign data
const campaigns = [
  {
    id: 1,
    name: "Qa Edgar",
    type: "Sales Outreach",
    campaignStatus: "Completed",
    mode: "Generate Email",
    processStatus: "Completed",
    createdDate: "15/09/2025 09:08 AM",
  },
  {
    id: 2,
    name: "T",
    type: "Lead Nurture",
    campaignStatus: "Completed",
    mode: "Generate Email",
    processStatus: "Completed",
    createdDate: "15/09/2025 08:45 AM",
  },
  {
    id: 3,
    name: "Qa Edgar v2",
    type: "Event Outreach",
    campaignStatus: "Completed",
    mode: "Generate Email",
    processStatus: "Completed",
    createdDate: "15/09/2025 08:41 AM",
  },
  {
    id: 4,
    name: "Qa Edgar v1",
    type: "Event Outreach",
    campaignStatus: "Completed",
    mode: "Generate Email",
    processStatus: "Completed",
    createdDate: "15/09/2025 08:37 AM",
  },
  {
    id: 5,
    name: "Edgar Event",
    type: "Event Outreach",
    campaignStatus: "Completed",
    mode: "Generate Email",
    processStatus: "Completed",
    createdDate: "15/09/2025 06:17 AM",
  },
];

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-foreground bg-gradient-hero bg-clip-text text-transparent">
              Campaign
            </h1>
            <p className="text-muted-foreground max-w-3xl text-base leading-relaxed">
              Whether you're introducing a new solution, re-engaging old leads, or targeting a niche audience — start here and we'll help craft the right message.
            </p>
          </div>
          <Button className="bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-primary hover:shadow-xl hover:scale-105">
            Create Campaign
          </Button>
        </div>

        {/* Tabs and Search */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="bg-card border border-border shadow-sm">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-gradient-hero data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="draft"
                  className="data-[state=active]:bg-gradient-hero data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  Draft
                </TabsTrigger>
                <TabsTrigger 
                  value="created"
                  className="data-[state=active]:bg-gradient-hero data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  Created
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-gradient-hero data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  Completed
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary transition-all duration-300">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary transition-all duration-300">
                  All
                </Button>
              </div>
            </div>

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-300" />
              <Input
                placeholder="Search your campaign name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border focus:border-primary transition-all duration-300 shadow-sm"
              />
            </div>

            <TabsContent value="all" className="mt-6 space-y-4 animate-fade-in">
              <div className="border border-border rounded-xl bg-card shadow-card overflow-hidden backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Campaign Status</TableHead>
                      <TableHead className="font-semibold">Mode</TableHead>
                      <TableHead className="font-semibold">Process Status</TableHead>
                      <TableHead className="font-semibold">Preview</TableHead>
                      <TableHead className="font-semibold">Created Date</TableHead>
                      <TableHead className="font-semibold">Download</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign, index) => (
                      <TableRow 
                        key={campaign.id} 
                        className="hover:bg-muted/50 transition-all duration-300 border-b border-border/50 group animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <TableCell className="font-medium text-foreground">{campaign.name}</TableCell>
                        <TableCell className="text-muted-foreground">{campaign.type}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors duration-300 border border-emerald-500/20"
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                            {campaign.campaignStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{campaign.mode}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors duration-300 border border-emerald-500/20"
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                            {campaign.processStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
                            >
                              <FileText className="h-4 w-4 text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-muted hover:scale-110 transition-all duration-300"
                            >
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm font-mono">
                          {campaign.createdDate}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all duration-300 hover:scale-105"
                            >
                              <Download className="h-3 w-3 mr-1 text-emerald-600" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2 hover:bg-destructive/10 hover:border-destructive transition-all duration-300 hover:scale-105"
                            >
                              <Download className="h-3 w-3 mr-1 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between text-sm text-muted-foreground bg-card border border-border rounded-lg p-4 shadow-sm">
                <span className="font-medium">10 of 13 items</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" disabled className="opacity-50">
                    «
                  </Button>
                  <Button variant="ghost" size="sm" disabled className="opacity-50">
                    ‹
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-gradient-hero text-primary-foreground border-0 hover:opacity-90 transition-opacity"
                  >
                    1
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-muted transition-colors">
                    2
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-muted transition-colors">
                    ›
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-muted transition-colors">
                    »
                  </Button>
                  <span className="ml-4 font-medium">Items Per Page: 10</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="draft" className="mt-6 animate-fade-in">
              <div className="text-center py-24 bg-card border border-border rounded-xl shadow-card">
                <div className="text-muted-foreground text-lg">No draft campaigns found</div>
                <p className="text-sm text-muted-foreground/70 mt-2">Create your first campaign to get started</p>
              </div>
            </TabsContent>

            <TabsContent value="created" className="mt-6 animate-fade-in">
              <div className="text-center py-24 bg-card border border-border rounded-xl shadow-card">
                <div className="text-muted-foreground text-lg">No created campaigns found</div>
                <p className="text-sm text-muted-foreground/70 mt-2">Your created campaigns will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6 animate-fade-in">
              <div className="text-center py-24 bg-card border border-border rounded-xl shadow-card">
                <div className="text-muted-foreground text-lg">Showing all completed campaigns</div>
                <p className="text-sm text-muted-foreground/70 mt-2">View and manage your completed campaigns</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
