import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Video, RefreshCw, FlaskConical, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface ManageIntegrationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integration: any;
}

const categoryIcons: Record<string, any> = {
  CRM: Building2,
  Email: Mail,
  "Meeting notes": Video,
};

// Sample log data
const sampleLogs = [
  { time: "2:14 PM", level: "Info", source: "Scheduler", message: "Sync completed successfully" },
  { time: "9:02 AM", level: "Info", source: "Webhook", message: "New contact created" },
  { time: "Yesterday 6:41 PM", level: "Warning", source: "Scheduler", message: "Rate limit approaching" },
  { time: "Yesterday 3:22 PM", level: "Error", source: "User", message: "Authentication failed" },
  { time: "Yesterday 12:15 PM", level: "Info", source: "Scheduler", message: "Sync started" },
];

export function ManageIntegrationSheet({ open, onOpenChange, integration }: ManageIntegrationSheetProps) {
  const { toast } = useToast();
  
  if (!integration) return null;

  const Icon = categoryIcons[integration.category] || Building2;
  const needsAttention = integration.status === "Needs attention";

  const handleTest = () => {
    toast({
      title: "Testing connection",
      description: `Testing ${integration.name} connection...`,
    });
  };

  const handleSync = () => {
    toast({
      title: "Syncing data",
      description: `Started manual sync for ${integration.name}`,
    });
  };

  const handleReauth = () => {
    toast({
      title: "Re-authenticating",
      description: `Opening ${integration.name} authentication...`,
    });
  };

  const handleDisconnect = () => {
    toast({
      title: "Disconnected",
      description: `${integration.name} has been disconnected`,
      variant: "destructive",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <SheetTitle className="flex items-center gap-2">
                {integration.name}
                <Badge 
                  variant="outline" 
                  className={needsAttention ? "bg-amber-500/10 text-amber-700 border-amber-200" : "bg-green-500/10 text-green-700 border-green-200"}
                >
                  {integration.status || "Connected"}
                </Badge>
              </SheetTitle>
              <SheetDescription>{integration.category}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {needsAttention && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              We lost access on Oct 19, 2025. Re-authenticate to resume syncing.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 space-y-6">
          {/* Connection Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Connection Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connected User/Org</span>
                <span className="font-medium">Acme Corp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="font-medium">{integration.lastSync || "Never"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Sync</span>
                <span className="font-medium">In 42 minutes</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="mappings">Mappings</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Configuration settings for {integration.name} will appear here. 
                Update sync frequency, objects, and other preferences.
              </p>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Time</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleLogs.map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs">{log.time}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            log.level === "Error" ? "text-red-700 border-red-200" :
                            log.level === "Warning" ? "text-amber-700 border-amber-200" :
                            "text-blue-700 border-blue-200"
                          }
                        >
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{log.source}</TableCell>
                      <TableCell className="text-xs">{log.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="mappings" className="mt-4">
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Field mappings and advanced configuration coming soon.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleTest}>
                <FlaskConical className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              <Button variant="outline" onClick={handleSync}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </Button>
            </div>
            
            {needsAttention && (
              <Button className="w-full" onClick={handleReauth}>
                Re-authenticate
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full text-destructive hover:bg-destructive/10"
              onClick={handleDisconnect}
            >
              Disconnect Integration
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
