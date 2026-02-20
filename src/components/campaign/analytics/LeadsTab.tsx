import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  title: string;
  status: string;
  stage: string;
  lastActivity: string;
}

interface EmailMessage {
  id: number;
  from: "us" | "them";
  subject: string;
  content: string;
  timestamp: string;
}

// Mock lead data
const mockLeads: Lead[] = [
  { id: 1, name: "John Smith", email: "john@acmecorp.com", company: "Acme Corp", title: "VP Sales", status: "Replied", stage: "Step 3", lastActivity: "2 hours ago" },
  { id: 2, name: "Sarah Johnson", email: "sarah@techstart.io", company: "TechStart Inc", title: "Director of Marketing", status: "Clicked", stage: "Step 2", lastActivity: "4 hours ago" },
  { id: 3, name: "Michael Chen", email: "mchen@dataflow.com", company: "DataFlow Systems", title: "CTO", status: "Opened", stage: "Step 1", lastActivity: "1 day ago" },
  { id: 4, name: "Emily Davis", email: "emily@cloudnine.co", company: "CloudNine", title: "Head of Growth", status: "Replied", stage: "Step 3", lastActivity: "5 hours ago" },
  { id: 5, name: "Robert Wilson", email: "rwilson@innovate.tech", company: "InnovateTech", title: "CEO", status: "Opened", stage: "Step 2", lastActivity: "1 day ago" },
  { id: 6, name: "Lisa Anderson", email: "lisa@growthco.com", company: "GrowthCo", title: "Sales Manager", status: "Bounced", stage: "Step 1", lastActivity: "3 days ago" },
  { id: 7, name: "David Brown", email: "dbrown@nexgen.io", company: "NexGen Solutions", title: "VP Engineering", status: "Unsubscribed", stage: "Step 2", lastActivity: "2 days ago" },
];

// Mock email threads for each lead
const mockEmailThreads: Record<number, EmailMessage[]> = {
  1: [
    {
      id: 1,
      from: "us",
      subject: "Transform Acme Corp's Partner Onboarding Process",
      content: "Hi John,\n\nAs a leader at Acme Corp, you're likely navigating the complexities of integrating a diverse range of plan providers and TPAs. Each has unique data formats and protocols, making the onboarding process lengthy and challenging.\n\nWe simplify this with our no-code, AI-powered integration platform, which accelerates partner onboarding and ensures compliance.\n\nCan we schedule a brief call to discuss how we can help streamline your processes at Acme Corp?\n\nBest regards,\nPristine Data Team",
      timestamp: "Feb 15, 2024 at 10:30 AM"
    },
    {
      id: 2,
      from: "us",
      subject: "Re: Transform Acme Corp's Partner Onboarding Process",
      content: "Hi John,\n\nI wanted to follow up on my previous message about streamlining your partner onboarding process.\n\nI understand you're busy, but I'd love to share some quick insights on how companies similar to Acme Corp have reduced their integration time by 60%.\n\nWould a 15-minute call next week work for you?\n\nBest regards,\nPristine Data Team",
      timestamp: "Feb 18, 2024 at 2:15 PM"
    },
    {
      id: 3,
      from: "them",
      subject: "Re: Transform Acme Corp's Partner Onboarding Process",
      content: "Hi,\n\nThanks for reaching out. We're actually looking into solutions for this exact problem. Our current onboarding process takes about 3-4 weeks per partner and it's becoming a bottleneck.\n\nI'd be interested in learning more. Can you send over some case studies or a brief overview of how your platform works?\n\nBest,\nJohn",
      timestamp: "Feb 19, 2024 at 9:45 AM"
    }
  ],
  2: [
    {
      id: 1,
      from: "us",
      subject: "Streamline TechStart's Data Integration",
      content: "Hi Sarah,\n\nAs Director of Marketing at TechStart Inc, you understand the importance of having clean, integrated data across your marketing stack.\n\nOur AI-powered platform can help you automate data flows between your tools, giving you real-time insights without the manual work.\n\nWould you be open to a quick demo?\n\nBest,\nPristine Data Team",
      timestamp: "Feb 16, 2024 at 11:00 AM"
    },
    {
      id: 2,
      from: "us",
      subject: "Re: Streamline TechStart's Data Integration",
      content: "Hi Sarah,\n\nJust following up on my previous email. I noticed you clicked through to our case studies page - would love to discuss how we've helped similar marketing teams.\n\nLet me know if you have 15 minutes this week.\n\nBest,\nPristine Data Team",
      timestamp: "Feb 19, 2024 at 3:30 PM"
    }
  ],
  4: [
    {
      id: 1,
      from: "us",
      subject: "Growth Solutions for CloudNine",
      content: "Hi Emily,\n\nAs Head of Growth at CloudNine, you're probably always looking for ways to scale your operations efficiently.\n\nOur platform has helped growth teams reduce manual data work by 80%, freeing up time for strategic initiatives.\n\nInterested in learning more?\n\nBest,\nPristine Data Team",
      timestamp: "Feb 14, 2024 at 9:00 AM"
    },
    {
      id: 2,
      from: "them",
      subject: "Re: Growth Solutions for CloudNine",
      content: "Hi there,\n\nThis sounds interesting! We've been struggling with data silos across our growth stack.\n\nCould we set up a call for next Tuesday? I'd like to bring in our ops lead as well.\n\nThanks,\nEmily",
      timestamp: "Feb 15, 2024 at 4:20 PM"
    },
    {
      id: 3,
      from: "us",
      subject: "Re: Growth Solutions for CloudNine",
      content: "Hi Emily,\n\nGreat to hear from you! Tuesday works perfectly. I'll send over a calendar invite for 2 PM PT - feel free to invite your ops lead.\n\nLooking forward to it!\n\nBest,\nPristine Data Team",
      timestamp: "Feb 15, 2024 at 5:00 PM"
    }
  ]
};

// Default thread for leads without specific threads
const defaultThread: EmailMessage[] = [
  {
    id: 1,
    from: "us",
    subject: "Introduction to Pristine Data",
    content: "Hi there,\n\nI wanted to reach out about how we can help streamline your data integration processes.\n\nOur AI-powered platform helps companies reduce manual data work and accelerate partner onboarding.\n\nWould you be open to a brief conversation?\n\nBest,\nPristine Data Team",
    timestamp: "Feb 17, 2024 at 10:00 AM"
  }
];

// Engagement heatmap data - day vs time slots
const engagementHeatmapData = [
  { day: "Mon", morning: 45, afternoon: 78, evening: 32 },
  { day: "Tue", morning: 52, afternoon: 85, evening: 41 },
  { day: "Wed", morning: 38, afternoon: 92, evening: 28 },
  { day: "Thu", morning: 61, afternoon: 88, evening: 35 },
  { day: "Fri", morning: 48, afternoon: 72, evening: 22 },
  { day: "Sat", morning: 15, afternoon: 25, evening: 12 },
  { day: "Sun", morning: 8, afternoon: 18, evening: 10 },
];

const timeSlots = ["morning", "afternoon", "evening"] as const;
const timeSlotLabels = { morning: "9am-12pm", afternoon: "12pm-5pm", evening: "5pm-8pm" };

const getHeatmapStyle = (value: number) => {
  if (value >= 80) return { bg: "bg-emerald-600", text: "text-white" };
  if (value >= 60) return { bg: "bg-emerald-500", text: "text-white" };
  if (value >= 40) return { bg: "bg-emerald-400", text: "text-white" };
  if (value >= 20) return { bg: "bg-emerald-300", text: "text-emerald-900" };
  return { bg: "bg-emerald-200", text: "text-emerald-800" };
};

export function LeadsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [localEmailThread, setLocalEmailThread] = useState<EmailMessage[]>([]);

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
      case "Replied": return <Icon icon="solar:chat-round-line-linear" className="h-3.5 w-3.5" />;
      case "Clicked": return <Icon icon="solar:cursor-linear" className="h-3.5 w-3.5" />;
      case "Opened": return <Icon icon="solar:letter-opened-linear" className="h-3.5 w-3.5" />;
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

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    // Initialize local thread from mock data
    const initialThread = mockEmailThreads[lead.id] || defaultThread;
    setLocalEmailThread([...initialThread]);
    setIsDialogOpen(true);
    setShowReplyBox(false);
    setReplyContent("");
  };

  const generateAIResponse = (type: "meeting" | "followup") => {
    if (!selectedLead) return;

    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const lastMessage = localEmailThread[localEmailThread.length - 1];
      const hasReply = lastMessage.from === "them";

      let generatedContent = "";

      if (type === "meeting") {
        if (hasReply) {
          generatedContent = `Hi ${selectedLead.name.split(" ")[0]},

Thank you for your response! I'd love to set up a meeting to discuss this further.

How does your calendar look this week? I have availability on:
• Tuesday at 2:00 PM PT
• Wednesday at 10:00 AM PT
• Thursday at 3:00 PM PT

Feel free to pick a time that works best for you, or suggest an alternative. I'll send over a calendar invite once we confirm.

Looking forward to connecting!

Best regards,
Pristine Data Team`;
        } else {
          generatedContent = `Hi ${selectedLead.name.split(" ")[0]},

I wanted to follow up and see if you'd be interested in scheduling a quick 15-minute call to discuss how we can help ${selectedLead.company}.

I have some availability this week:
• Tuesday at 2:00 PM PT
• Wednesday at 10:00 AM PT
• Thursday at 3:00 PM PT

Would any of these times work for you?

Best regards,
Pristine Data Team`;
        }
      } else {
        if (hasReply) {
          generatedContent = `Hi ${selectedLead.name.split(" ")[0]},

Thanks for getting back to me! I really appreciate you taking the time.

Based on what you mentioned about your current challenges, I think our platform could be a great fit. We've helped similar companies in the ${selectedLead.company.includes("Tech") ? "tech" : "enterprise"} space achieve:

• 60% faster partner onboarding
• 80% reduction in manual data work
• Real-time compliance monitoring

I'd be happy to share some specific case studies that might be relevant to ${selectedLead.company}. Would that be helpful?

Looking forward to hearing from you.

Best regards,
Pristine Data Team`;
        } else {
          generatedContent = `Hi ${selectedLead.name.split(" ")[0]},

I hope this message finds you well. I wanted to circle back on my previous email about streamlining data integration at ${selectedLead.company}.

I understand you're busy, so I'll keep this brief: companies like yours have seen remarkable results with our platform, including 60% faster onboarding times and significant cost savings.

If you're curious, I'd be happy to share a quick 3-minute video overview - no call required. Just let me know!

Best regards,
Pristine Data Team`;
        }
      }

      setReplyContent(generatedContent);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSendReply = () => {
    if (!selectedLead || !replyContent.trim()) return;

    // Create new email message
    const newEmail: EmailMessage = {
      id: localEmailThread.length + 1,
      from: "us",
      subject: `Re: ${localEmailThread[localEmailThread.length - 1]?.subject || "Follow-up"}`,
      content: replyContent.trim(),
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) + " at " + new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    // Append to thread
    setLocalEmailThread(prev => [...prev, newEmail]);
    setShowReplyBox(false);
    setReplyContent("");
  };

  return (
    <div className="space-y-6">
      {/* Lead Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Engagement Heatmap</CardTitle>
            <p className="text-xs text-muted-foreground">Best times for opens & replies</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {/* Time slot labels */}
              <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-1 text-[10px] text-muted-foreground">
                <div></div>
                {timeSlots.map((slot) => (
                  <div key={slot} className="text-center">{timeSlotLabels[slot]}</div>
                ))}
              </div>

              {/* Heatmap grid */}
              {engagementHeatmapData.map((row) => (
                <div key={row.day} className="grid grid-cols-[40px_1fr_1fr_1fr] gap-1">
                  <div className="text-[11px] font-medium text-muted-foreground flex items-center">{row.day}</div>
                  {timeSlots.map((slot) => {
                    const value = row[slot];
                    const style = getHeatmapStyle(value);
                    return (
                      <div
                        key={slot}
                        className={`h-7 rounded flex items-center justify-center text-[10px] font-medium ${style.bg} ${style.text}`}
                        title={`${row.day} ${timeSlotLabels[slot]}: ${value}% engagement`}
                      >
                        {value}%
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Legend */}
              <div className="flex items-center justify-center gap-3 pt-2 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-emerald-200"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-emerald-400"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-emerald-600"></div>
                  <span>High</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversion Funnel</CardTitle>
            <p className="text-xs text-muted-foreground">Lead progression through stages</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Contacted</span>
                  <span className="font-medium">1,800</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Opened</span>
                  <span className="font-medium">941 <span className="text-emerald-600">(52.3%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '52.3%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Clicked</span>
                  <span className="font-medium">520 <span className="text-violet-600">(28.9%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: '28.9%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Replied</span>
                  <span className="font-medium">223 <span className="text-amber-600">(12.4%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '12.4%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Meetings Booked</span>
                  <span className="font-medium">47 <span className="text-primary">(2.6%)</span></span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '2.6%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Campaign Leads</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                All leads in this campaign with their engagement status
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Icon icon="solar:download-linear" className="h-4 w-4 mr-2" />
              Export Leads
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Icon icon="solar:filter-linear" className="h-4 w-4 mr-2" />
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
                  <TableRow
                    key={lead.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleLeadClick(lead)}
                  >
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
                        <Icon icon="solar:arrow-right-up-linear" className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Dialog - Email Style */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl h-[85vh] p-0 flex flex-col overflow-hidden bg-background border-border">
          {/* Header - Fixed */}
          <header className="flex-shrink-0 px-6 py-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {selectedLead?.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <DialogHeader className="p-0 space-y-0">
                    <DialogTitle className="text-base font-semibold">
                      {selectedLead?.name}
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    {selectedLead?.title} at <span className="font-medium text-foreground">{selectedLead?.company}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(selectedLead?.status || "")} text-xs`}>
                  {selectedLead?.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {selectedLead?.stage}
                </Badge>
              </div>
            </div>
          </header>

          {/* Email Thread - Scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-muted/30">
            <div className="divide-y divide-border">
              {selectedLead && localEmailThread.map((email) => (
                <div key={email.id} className="bg-card hover:bg-accent/30 transition-colors">
                  {/* Email Header */}
                  <div className="px-6 py-3 border-b border-border/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                          email.from === "us"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {email.from === "us" ? "PD" : selectedLead.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-foreground">
                              {email.from === "us" ? "Pristine Data" : selectedLead.name}
                            </span>
                            {email.from === "us" && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-primary border-primary/30">
                                Sent
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {email.from === "us" ? `To: ${selectedLead.email}` : `To: me`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {email.timestamp}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {email.subject}
                    </p>
                  </div>
                  {/* Email Body */}
                  <div className="px-6 py-4 pl-[4.25rem]">
                    <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground/90">
                      {email.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Section - Fixed */}
          <footer className="flex-shrink-0 px-6 py-4 border-t border-border bg-card">
            {!showReplyBox ? (
              <Button
                className="w-full"
                onClick={() => setShowReplyBox(true)}
              >
                <Icon icon="solar:reply-linear" className="h-4 w-4 mr-2" />
                Reply
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:reply-linear" className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      To: <span className="font-medium text-foreground">{selectedLead?.email}</span>
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isGenerating}
                        className="h-8 px-3 gap-1.5 bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30"
                      >
                        {isGenerating ? (
                          <>
                            <Icon icon="solar:refresh-linear" className="h-3.5 w-3.5 animate-spin text-primary" />
                            <span className="text-xs text-primary">Writing...</span>
                          </>
                        ) : (
                          <>
                            <Icon icon="solar:magic-stick-3-linear" className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-medium text-primary">AI Write</span>
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => generateAIResponse("meeting")} className="gap-2 cursor-pointer">
                        <Icon icon="solar:calendar-linear" className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Request Meeting</p>
                          <p className="text-xs text-muted-foreground">Propose a call</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => generateAIResponse("followup")} className="gap-2 cursor-pointer">
                        <Icon icon="solar:letter-linear" className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Follow-up</p>
                          <p className="text-xs text-muted-foreground">Continue the conversation</p>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[140px] max-h-[200px] resize-none text-sm"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowReplyBox(false);
                      setReplyContent("");
                    }}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendReply}
                    disabled={!replyContent.trim()}
                  >
                    <Icon icon="solar:letter-linear" className="h-3.5 w-3.5 mr-1.5" />
                    Send
                  </Button>
                </div>
              </div>
            )}
          </footer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
