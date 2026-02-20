import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScoreRow {
  category: string;
  score: string;
  notes: string;
}

interface ScoreTableProps {
  scores: ScoreRow[];
}

export const ScoreTable = ({ scores }: ScoreTableProps) => {
  const copyTable = () => {
    const text = scores.map(row => `${row.category}\t${row.score}\t${row.notes}`).join('\n');
    navigator.clipboard.writeText(text);
    toast.success("Score table copied to clipboard");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Category Breakdown</CardTitle>
        <Button variant="ghost" size="sm" onClick={copyTable}>
          <Icon icon="solar:copy-linear" className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Score</TableHead>
              <TableHead className="font-semibold">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((row, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                <TableCell className="font-medium">{row.category}</TableCell>
                <TableCell>{row.score}</TableCell>
                <TableCell className="text-muted-foreground">{row.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
