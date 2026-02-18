import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp } from "lucide-react";

interface PreviewAccount {
  id: string;
  name: string;
  industry: string;
  revenue: string;
  employees: string;
  location: string;
}

interface ResultsPreviewProps {
  results: PreviewAccount[];
  totalCount: number;
}

export default function ResultsPreview({ results, totalCount }: ResultsPreviewProps) {
  if (results.length === 0) return null;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Preview Results
            </CardTitle>
            <CardDescription>
              Showing first {results.length} of {totalCount.toLocaleString()} matches
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {totalCount.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {results.map((account) => (
          <Card key={account.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  {account.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-2">{account.name}</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Industry</span>
                      <p className="font-medium truncate">{account.industry}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Revenue</span>
                      <p className="font-medium truncate">{account.revenue}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Employees</span>
                      <p className="font-medium truncate">{account.employees}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Location</span>
                      <p className="font-medium truncate">{account.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
