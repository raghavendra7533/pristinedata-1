import { RefreshCw, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EmptyState = () => {
  return (
    <Card className="rounded-2xl p-8 text-center space-y-4">
      <div className="w-24 h-24 mx-auto rounded-full bg-accent flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">No intelligence yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Click Refresh to run AI-powered research on this contact and generate strategic insights.
        </p>
      </div>
      <Button size="lg" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Run Research
      </Button>
    </Card>
  );
};

export const LoadingState = () => {
  return (
    <div className="space-y-4">
      <Card className="rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </Card>

      <Card className="rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </Card>
    </div>
  );
};

export const ErrorState = () => {
  return (
    <Alert variant="destructive" className="rounded-2xl">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load intelligence data. Please try again.</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <HelpCircle className="w-3 h-3" />
            Get Help
          </Button>
          <Button size="sm" className="gap-2">
            <RefreshCw className="w-3 h-3" />
            Retry
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
