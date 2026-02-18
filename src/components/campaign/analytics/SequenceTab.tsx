import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, Mail, MousePointer, MessageSquare } from "lucide-react";
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

export function SequenceTab({ stepAnalytics }: SequenceTabProps) {
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  const toggleStep = (step: string) => {
    setExpandedSteps(prev =>
      prev.includes(step)
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  };

  return (
    <div className="space-y-6">
      {/* Sequence Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Total Steps</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <MousePointer className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">52.3%</p>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
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
      <Card className="border-2">
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
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
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

      {/* Activity Log moved to Sequence tab */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest engagement events from this sequence
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: "reply", contact: "John Smith", company: "Acme Corp", step: "Step 3", time: "2 hours ago", message: "Thanks for reaching out..." },
              { type: "click", contact: "Sarah Johnson", company: "TechStart Inc", step: "Step 2", time: "3 hours ago" },
              { type: "open", contact: "Michael Chen", company: "DataFlow Systems", step: "Step 1", time: "4 hours ago" },
              { type: "reply", contact: "Emily Davis", company: "CloudNine", step: "Step 3", time: "5 hours ago", message: "Let's schedule a call..." },
              { type: "open", contact: "Robert Wilson", company: "InnovateTech", step: "Step 2", time: "6 hours ago" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  activity.type === "reply" && "bg-amber-500/10",
                  activity.type === "click" && "bg-violet-500/10",
                  activity.type === "open" && "bg-emerald-500/10"
                )}>
                  {activity.type === "reply" && <MessageSquare className="h-5 w-5 text-amber-600" />}
                  {activity.type === "click" && <MousePointer className="h-5 w-5 text-violet-600" />}
                  {activity.type === "open" && <Mail className="h-5 w-5 text-emerald-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{activity.contact}</span>
                    <span className="text-muted-foreground">at</span>
                    <span className="font-medium text-primary">{activity.company}</span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {activity.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {activity.step}
                    </Badge>
                  </div>
                  {activity.message && (
                    <p className="text-sm text-muted-foreground truncate">"{activity.message}"</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
