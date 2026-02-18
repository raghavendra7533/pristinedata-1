import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Download } from "lucide-react";

interface AnalyticsTabProps {
  dailyData: Array<{
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
  }>;
}

// Step-level analytics data
const stepAnalytics = [
  {
    step: "1. Email",
    sent: 594,
    opened: 173,
    openRate: 29.12,
    clicked: 160,
    clickRate: 92.49,
    replied: 0,
    replyRate: 0,
    positiveReplies: 0,
    bounced: 3,
    bounceRate: 0.51,
    unsubscribed: 0,
  },
  {
    step: "2. Email",
    sent: 0,
    opened: 0,
    openRate: 0,
    clicked: 0,
    clickRate: 0,
    replied: 0,
    replyRate: 0,
    positiveReplies: 0,
    bounced: 0,
    bounceRate: 0,
    unsubscribed: 0,
  },
  {
    step: "3. Email",
    sent: 0,
    opened: 0,
    openRate: 0,
    clicked: 0,
    clickRate: 0,
    replied: 0,
    replyRate: 0,
    positiveReplies: 0,
    bounced: 0,
    bounceRate: 0,
    unsubscribed: 0,
  },
];

export function AnalyticsTab({ dailyData }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      {/* Engagement Over Time Chart */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Engagement Over Time</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Daily breakdown of campaign performance
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-muted-foreground">Opened</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                <span className="text-muted-foreground">Clicked</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs fill-muted-foreground"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs fill-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                />
                <Legend />
                <Bar 
                  dataKey="sent" 
                  name="Sent"
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="opened" 
                  name="Opened"
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="clicked" 
                  name="Clicked"
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Step Analytics / Sequence Breakup Table */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Step Analytics</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Performance breakdown by sequence step
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download as CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Step</TableHead>
                  <TableHead className="font-semibold text-right">Sent</TableHead>
                  <TableHead className="font-semibold text-right">Opened</TableHead>
                  <TableHead className="font-semibold text-right">Clicked</TableHead>
                  <TableHead className="font-semibold text-right">Replied</TableHead>
                  <TableHead className="font-semibold text-right">Bounced</TableHead>
                  <TableHead className="font-semibold text-right">Unsubscribed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stepAnalytics.map((step) => (
                  <TableRow key={step.step} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{step.step}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 underline cursor-pointer">
                        {step.sent}
                      </span>
                      <span className="text-muted-foreground text-xs block">Sent</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 underline cursor-pointer">
                        {step.opened}
                      </span>
                      {step.opened > 0 && (
                        <span className="text-muted-foreground text-xs ml-1">({step.openRate}%)</span>
                      )}
                      <span className="text-muted-foreground text-xs block">Opened</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-violet-600 dark:text-violet-400 underline cursor-pointer">
                        {step.clicked}
                      </span>
                      {step.clicked > 0 && (
                        <span className="text-muted-foreground text-xs ml-1">({step.clickRate}%)</span>
                      )}
                      <span className="text-muted-foreground text-xs block">Clicked</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {step.replied}
                      </span>
                      <span className="text-muted-foreground text-xs block">Replied</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {step.bounced}
                      </span>
                      {step.bounced > 0 && (
                        <span className="text-muted-foreground text-xs ml-1">({step.bounceRate}%)</span>
                      )}
                      <span className="text-muted-foreground text-xs block">Bounced</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        {step.unsubscribed}
                      </span>
                      <span className="text-muted-foreground text-xs block">Unsubscribed</span>
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