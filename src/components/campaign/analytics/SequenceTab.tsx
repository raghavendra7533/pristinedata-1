import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

interface StepVariant {
  name: string;
  sent: number;
  opened: number;
  openRate: number;
  replied: number;
  replyRate: number;
  clicked: number;
  clickRate: number;
}

interface StepAnalytic {
  step: string;
  stepName: string;
  sent: number;
  opened: number;
  openRate: number;
  replied: number;
  replyRate: number;
  clicked: number;
  clickRate: number;
  variants: StepVariant[];
}

interface SequenceTabProps {
  stepAnalytics: StepAnalytic[];
}

interface Activity {
  id: number;
  type: "reply" | "click" | "open";
  contact: string;
  email: string;
  company: string;
  title: string;
  step: string;
  time: string;
  message?: string;
}

interface EmailMessage {
  id: number;
  from: "us" | "them";
  subject: string;
  content: string;
  timestamp: string;
}

// Mock activities data
const mockActivities: Activity[] = [
  { id: 1, type: "reply", contact: "John Smith", email: "john@acmecorp.com", company: "Acme Corp", title: "VP Sales", step: "Step 3", time: "2 hours ago", message: "Thanks for reaching out..." },
  { id: 2, type: "click", contact: "Sarah Johnson", email: "sarah@techstart.io", company: "TechStart Inc", title: "Director of Marketing", step: "Step 2", time: "3 hours ago" },
  { id: 3, type: "open", contact: "Michael Chen", email: "mchen@dataflow.com", company: "DataFlow Systems", title: "CTO", step: "Step 1", time: "4 hours ago" },
  { id: 4, type: "reply", contact: "Emily Davis", email: "emily@cloudnine.co", company: "CloudNine", title: "Head of Growth", step: "Step 3", time: "5 hours ago", message: "Let's schedule a call..." },
  { id: 5, type: "open", contact: "Robert Wilson", email: "rwilson@innovate.tech", company: "InnovateTech", title: "CEO", step: "Step 2", time: "6 hours ago" },
];

// Mock email threads for activities
const mockActivityThreads: Record<number, EmailMessage[]> = {
  1: [
    {
      id: 1,
      from: "us",
      subject: "Streamline Acme Corp's Integration Process",
      content: "Hi John,\n\nAs VP of Sales at Acme Corp, you're likely focused on reducing friction in your sales cycle and improving partner integrations.\n\nOur AI-powered platform can help you automate data flows and reduce onboarding time by 60%.\n\nWould you be open to a quick demo?\n\nBest,\nPristine Data Team",
      timestamp: "Feb 15, 2024 at 10:30 AM"
    },
    {
      id: 2,
      from: "us",
      subject: "Re: Streamline Acme Corp's Integration Process",
      content: "Hi John,\n\nJust following up on my previous message. I'd love to share how companies like yours have streamlined their integration processes.\n\nWould 15 minutes this week work for a quick call?\n\nBest,\nPristine Data Team",
      timestamp: "Feb 18, 2024 at 2:15 PM"
    },
    {
      id: 3,
      from: "them",
      subject: "Re: Streamline Acme Corp's Integration Process",
      content: "Thanks for reaching out. We're actually evaluating solutions for this. Can you send more details on pricing and implementation timeline?\n\nBest,\nJohn",
      timestamp: "Feb 19, 2024 at 9:45 AM"
    }
  ],
  2: [
    {
      id: 1,
      from: "us",
      subject: "Boost TechStart's Marketing Analytics",
      content: "Hi Sarah,\n\nAs Director of Marketing at TechStart Inc, having clean, integrated data across your marketing stack is crucial.\n\nOur platform helps marketing teams automate data flows and gain real-time insights.\n\nInterested in learning more?\n\nBest,\nPristine Data Team",
      timestamp: "Feb 16, 2024 at 11:00 AM"
    },
    {
      id: 2,
      from: "us",
      subject: "Re: Boost TechStart's Marketing Analytics",
      content: "Hi Sarah,\n\nI noticed you checked out our case studies page. Happy to discuss how we've helped similar marketing teams.\n\nBest,\nPristine Data Team",
      timestamp: "Feb 19, 2024 at 3:30 PM"
    }
  ],
  3: [
    {
      id: 1,
      from: "us",
      subject: "DataFlow Systems - Integration Solutions",
      content: "Hi Michael,\n\nAs CTO at DataFlow Systems, you understand the importance of seamless data integration.\n\nOur no-code platform can help your team integrate faster and more reliably.\n\nWould you be interested in a technical demo?\n\nBest,\nPristine Data Team",
      timestamp: "Feb 17, 2024 at 9:00 AM"
    }
  ],
  4: [
    {
      id: 1,
      from: "us",
      subject: "Scale CloudNine's Growth Operations",
      content: "Hi Emily,\n\nAs Head of Growth at CloudNine, you're focused on scaling operations efficiently.\n\nOur platform has helped growth teams reduce manual data work by 80%.\n\nWould you like to see how?\n\nBest,\nPristine Data Team",
      timestamp: "Feb 14, 2024 at 9:00 AM"
    },
    {
      id: 2,
      from: "them",
      subject: "Re: Scale CloudNine's Growth Operations",
      content: "Let's schedule a call for next week. I'd like to bring in our ops lead too.\n\nThanks,\nEmily",
      timestamp: "Feb 15, 2024 at 4:20 PM"
    }
  ],
  5: [
    {
      id: 1,
      from: "us",
      subject: "InnovateTech Partnership Opportunity",
      content: "Hi Robert,\n\nAs CEO of InnovateTech, you're always looking for ways to drive innovation.\n\nI'd love to share how our AI-powered platform can help accelerate your data initiatives.\n\nBest,\nPristine Data Team",
      timestamp: "Feb 16, 2024 at 10:00 AM"
    }
  ]
};

export function SequenceTab({ stepAnalytics }: SequenceTabProps) {
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localEmailThread, setLocalEmailThread] = useState<EmailMessage[]>([]);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleStep = (step: string) => {
    setExpandedSteps(prev =>
      prev.includes(step)
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  };

  const getActivityStatusColor = (type: string) => {
    switch (type) {
      case "reply": return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "click": return "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20";
      case "open": return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    const thread = mockActivityThreads[activity.id] || [{
      id: 1,
      from: "us" as const,
      subject: "Follow-up",
      content: "Hi,\n\nI wanted to reach out about potential collaboration.\n\nBest,\nPristine Data Team",
      timestamp: "Feb 17, 2024 at 10:00 AM"
    }];
    setLocalEmailThread([...thread]);
    setIsDialogOpen(true);
    setShowReplyBox(false);
    setReplyContent("");
  };

  const generateAIResponse = (type: "meeting" | "followup") => {
    if (!selectedActivity) return;

    setIsGenerating(true);

    setTimeout(() => {
      const lastMessage = localEmailThread[localEmailThread.length - 1];
      const hasReply = lastMessage.from === "them";
      const firstName = selectedActivity.contact.split(" ")[0];

      let generatedContent = "";

      if (type === "meeting") {
        if (hasReply) {
          generatedContent = `Hi ${firstName},

Thank you for your response! I'd love to set up a meeting to discuss this further.

How does your calendar look this week? I have availability on:
• Tuesday at 2:00 PM PT
• Wednesday at 10:00 AM PT
• Thursday at 3:00 PM PT

Feel free to pick a time that works best for you.

Best regards,
Pristine Data Team`;
        } else {
          generatedContent = `Hi ${firstName},

I wanted to follow up and see if you'd be interested in scheduling a quick 15-minute call to discuss how we can help ${selectedActivity.company}.

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
          generatedContent = `Hi ${firstName},

Thanks for getting back to me! I really appreciate you taking the time.

Based on what you mentioned, I think our platform could be a great fit. We've helped similar companies achieve:

• 60% faster partner onboarding
• 80% reduction in manual data work
• Real-time compliance monitoring

I'd be happy to share some specific case studies that might be relevant to ${selectedActivity.company}. Would that be helpful?

Best regards,
Pristine Data Team`;
        } else {
          generatedContent = `Hi ${firstName},

I hope this message finds you well. I wanted to circle back on my previous email about streamlining data integration at ${selectedActivity.company}.

Companies like yours have seen remarkable results with our platform, including 60% faster onboarding times and significant cost savings.

If you're curious, I'd be happy to share a quick 3-minute video overview. Just let me know!

Best regards,
Pristine Data Team`;
        }
      }

      setReplyContent(generatedContent);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSendReply = () => {
    if (!selectedActivity || !replyContent.trim()) return;

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

    setLocalEmailThread(prev => [...prev, newEmail]);
    setShowReplyBox(false);
    setReplyContent("");
  };

  return (
    <div className="space-y-6">
      {/* Sequence Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Icon icon="solar:letter-linear" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Total Steps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Icon icon="solar:letter-opened-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">52.3%</p>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Icon icon="solar:chat-round-line-linear" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">12.4%</p>
                <p className="text-sm text-muted-foreground">Overall Reply Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step Analytics</CardTitle>
          <p className="text-sm text-muted-foreground">
            Performance breakdown by email step - click to expand A/B variants
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-8"></TableHead>
                  <TableHead className="font-semibold">Step</TableHead>
                  <TableHead className="font-semibold text-right">Sent</TableHead>
                  <TableHead className="font-semibold text-right">Opened</TableHead>
                  <TableHead className="font-semibold text-right">Replied</TableHead>
                  <TableHead className="font-semibold text-right">Clicked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stepAnalytics.map((step) => (
                  <>
                    <TableRow
                      key={step.step}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => toggleStep(step.step)}
                    >
                      <TableCell className="w-8">
                        {step.variants.length > 1 ? (
                          expandedSteps.includes(step.step) ? (
                            <Icon icon="solar:alt-arrow-down-linear" className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Icon icon="solar:alt-arrow-right-linear" className="h-4 w-4 text-muted-foreground" />
                          )
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                            {step.step.split(" ")[1]}
                          </div>
                          <div>
                            <span className="font-medium">{step.step}</span>
                            <span className="text-muted-foreground ml-2 text-sm">({step.stepName})</span>
                            {step.variants.length > 1 && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {step.variants.length} variants
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {step.sent.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {step.opened.toLocaleString()}
                          </span>
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs">
                            {step.openRate}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {step.replied}
                          </span>
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs">
                            {step.replyRate}%
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold text-violet-600 dark:text-violet-400">
                            {step.clicked}
                          </span>
                          <Badge variant="secondary" className="bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs">
                            {step.clickRate}%
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Expanded variant rows */}
                    {expandedSteps.includes(step.step) && step.variants.map((variant) => (
                      <TableRow
                        key={`${step.step}-${variant.name}`}
                        className="bg-muted/20 hover:bg-muted/30 animate-fade-in"
                      >
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 pl-9">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                              {variant.name}
                            </div>
                            <span className="text-sm text-muted-foreground">Variant {variant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {variant.sent.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          <span className="font-medium">{variant.opened.toLocaleString()}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 ml-1">
                            ({variant.openRate}%)
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          <span className="font-medium">{variant.replied}</span>
                          <span className="text-amber-600 dark:text-amber-400 ml-1">
                            ({variant.replyRate}%)
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          <span className="font-medium">{variant.clicked}</span>
                          <span className="text-violet-600 dark:text-violet-400 ml-1">
                            ({variant.clickRate}%)
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log - Premium Email-Style Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click to view email thread and reply
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {mockActivities.length} activities
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden divide-y divide-border">
            {mockActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleActivityClick(activity)}
                className="flex items-start gap-4 p-4 bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
              >
                {/* Activity Type Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105",
                  activity.type === "reply" && "bg-amber-500/10",
                  activity.type === "click" && "bg-violet-500/10",
                  activity.type === "open" && "bg-emerald-500/10"
                )}>
                  {activity.type === "reply" && <Icon icon="solar:chat-round-line-linear" className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                  {activity.type === "click" && <Icon icon="solar:cursor-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
                  {activity.type === "open" && <Icon icon="solar:letter-opened-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{activity.contact}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{activity.title}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-primary">{activity.company}</span>
                    <Badge variant="secondary" className={cn("text-[10px] uppercase font-bold tracking-wide border", getActivityStatusColor(activity.type))}>
                      {activity.type}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {activity.step}
                    </Badge>
                  </div>
                  {activity.message && (
                    <p className="text-sm text-muted-foreground mt-2 truncate italic">
                      "{activity.message}"
                    </p>
                  )}
                </div>

                {/* Time & Action */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  <Icon icon="solar:arrow-right-up-linear" className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Thread Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl h-[85vh] p-0 flex flex-col overflow-hidden bg-background border-border">
          {/* Header - Fixed */}
          <header className="flex-shrink-0 px-6 py-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {selectedActivity?.contact.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <DialogHeader className="p-0 space-y-0">
                    <DialogTitle className="text-base font-semibold">
                      {selectedActivity?.contact}
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    {selectedActivity?.title} at <span className="font-medium text-foreground">{selectedActivity?.company}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs border", getActivityStatusColor(selectedActivity?.type || ""))} variant="secondary">
                  {selectedActivity?.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {selectedActivity?.step}
                </Badge>
              </div>
            </div>
          </header>

          {/* Email Thread - Scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-muted/30">
            <div className="divide-y divide-border">
              {selectedActivity && localEmailThread.map((email) => (
                <div key={email.id} className="bg-card hover:bg-accent/30 transition-colors">
                  {/* Email Header */}
                  <div className="px-6 py-3 border-b border-border/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium",
                          email.from === "us"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {email.from === "us" ? "PD" : selectedActivity.contact.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-foreground">
                              {email.from === "us" ? "Pristine Data" : selectedActivity.contact}
                            </span>
                            {email.from === "us" && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-primary border-primary/30">
                                Sent
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {email.from === "us" ? `To: ${selectedActivity.email}` : "To: me"}
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
                      To: <span className="font-medium text-foreground">{selectedActivity?.email}</span>
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
