import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for different time periods
const generateDailyData = () => {
  const data = [];
  const today = new Date();
  for (let i = 14; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      credits: Math.floor(Math.random() * 500) + 50,
    });
  }
  return data;
};

const generateWeeklyData = () => {
  const data = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));
    data.push({
      date: `Week ${12 - i}`,
      credits: Math.floor(Math.random() * 2500) + 500,
    });
  }
  return data;
};

const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    data.push({
      date: months[monthIndex],
      credits: Math.floor(Math.random() * 8000) + 2000,
    });
  }
  return data;
};

type TimeRange = 'daily' | 'weekly' | 'monthly';

export function UsageGraph() {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  
  const getData = () => {
    switch (timeRange) {
      case 'daily':
        return generateDailyData();
      case 'weekly':
        return generateWeeklyData();
      case 'monthly':
        return generateMonthlyData();
      default:
        return generateDailyData();
    }
  };

  const data = getData();
  const totalCredits = data.reduce((sum, item) => sum + item.credits, 0);

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-1">Usage</CardTitle>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Credits Used</div>
              <div className="text-3xl font-bold">{totalCredits.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('daily')}
            >
              Daily
            </Button>
            <Button
              variant={timeRange === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={timeRange === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--accent))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Credits']}
            />
            <Bar 
              dataKey="credits" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}