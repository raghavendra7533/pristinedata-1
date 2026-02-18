import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Filter, Mail, MousePointer, MessageSquare, ExternalLink } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Mock lead data
const mockLeads = [
  { id: 1, name: "John Smith", email: "john@acmecorp.com", company: "Acme Corp", title: "VP Sales", status: "Replied", stage: "Step 3", lastActivity: "2 hours ago" },
  { id: 2, name: "Sarah Johnson", email: "sarah@techstart.io", company: "TechStart Inc", title: "Director of Marketing", status: "Clicked", stage: "Step 2", lastActivity: "4 hours ago" },
  { id: 3, name: "Michael Chen", email: "mchen@dataflow.com", company: "DataFlow Systems", title: "CTO", status: "Opened", stage: "Step 1", lastActivity: "1 day ago" },
  { id: 4, name: "Emily Davis", email: "emily@cloudnine.co", company: "CloudNine", title: "Head of Growth", status: "Replied", stage: "Step 3", lastActivity: "5 hours ago" },
  { id: 5, name: "Robert Wilson", email: "rwilson@innovate.tech", company: "InnovateTech", title: "CEO", status: "Opened", stage: "Step 2", lastActivity: "1 day ago" },
  { id: 6, name: "Lisa Anderson", email: "lisa@growthco.com", company: "GrowthCo", title: "Sales Manager", status: "Bounced", stage: "Step 1", lastActivity: "3 days ago" },
  { id: 7, name: "David Brown", email: "dbrown@nexgen.io", company: "NexGen Solutions", title: "VP Engineering", status: "Unsubscribed", stage: "Step 2", lastActivity: "2 days ago" },
];

const leadStatusData = [
  { name: "Replied", value: 223, color: "#f59e0b" },
  { name: "Clicked", value: 297, color: "#8b5cf6" },
  { name: "Opened Only", value: 421, color: "#10b981" },
  { name: "No Engagement", value: 828, color: "#94a3b8" },
  { name: "Bounced", value: 23, color: "#ef4444" },
  { name: "Unsubscribed", value: 8, color: "#64748b" },
];

export function LeadsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Replied": return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
      case "Clicked": return "bg-violet-500/10 text-violet-700 dark:text-violet-400";
      case "Opened": return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
      case "Bounced": return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "Unsubscribed": return "bg-slate-500/10 text-slate-700 dark:text-slate-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Replied": return <MessageSquare className="h-3.5 w-3.5" />;
      case "Clicked": return <MousePointer className="h-3.5 w-3.5" />;
      case "Opened": return <Mail className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Lead Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Lead Stats (1,800)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {leadStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {leadStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-semibold ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Overall Email Reach</CardTitle>
            <p className="text-xs text-muted-foreground">As of today</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border">
                <p className="text-3xl font-bold text-foreground">1,800</p>
                <p className="text-sm text-muted-foreground">Total Leads Contacted</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">223</p>
                <p className="text-sm text-muted-foreground">Unique Replied</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">941</p>
                <p className="text-sm text-muted-foreground">Unique Opened (52.3%)</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border">
                <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">520</p>
                <p className="text-sm text-muted-foreground">Unique Clicked (28.9%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Campaign Leads</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                All leads in this campaign with their engagement status
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Leads
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Replied">Replied</SelectItem>
                <SelectItem value="Clicked">Clicked</SelectItem>
                <SelectItem value="Opened">Opened</SelectItem>
                <SelectItem value="Bounced">Bounced</SelectItem>
                <SelectItem value="Unsubscribed">Unsubscribed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Lead</TableHead>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Stage</TableHead>
                  <TableHead className="font-semibold">Last Activity</TableHead>
                  <TableHead className="font-semibold w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.company}</p>
                        <p className="text-sm text-muted-foreground">{lead.title}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {getStatusIcon(lead.status)}
                        <span className="ml-1">{lead.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{lead.stage}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{lead.lastActivity}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
