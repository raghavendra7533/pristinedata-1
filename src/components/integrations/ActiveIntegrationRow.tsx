import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Video, MoreVertical, RefreshCw, FlaskConical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ActiveIntegrationRowProps {
  integration: {
    id: string;
    name: string;
    category: string;
    status: "Connected" | "Needs attention" | "Disconnected";
    lastSync: string;
  };
  onManage: (integration: any) => void;
}

const categoryIcons: Record<string, any> = {
  CRM: Building2,
  Email: Mail,
  "Meeting notes": Video,
};

const statusConfig = {
  Connected: { color: "bg-green-500/10 text-green-700 border-green-200", label: "Connected" },
  "Needs attention": { color: "bg-amber-500/10 text-amber-700 border-amber-200", label: "Needs attention" },
  Disconnected: { color: "bg-red-500/10 text-red-700 border-red-200", label: "Disconnected" },
};

export function ActiveIntegrationRow({ integration, onManage }: ActiveIntegrationRowProps) {
  const Icon = categoryIcons[integration.category] || Building2;
  const { toast } = useToast();

  const handleTest = () => {
    toast({
      title: "Testing connection",
      description: `Testing ${integration.name} connection...`,
    });
  };

  const handleSync = () => {
    toast({
      title: "Syncing data",
      description: `Started sync for ${integration.name}`,
    });
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium truncate">{integration.name}</p>
            <Badge 
              variant="outline" 
              className={`text-xs ${statusConfig[integration.status].color}`}
            >
              {statusConfig[integration.status].label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{integration.lastSync}</p>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onManage(integration)}>
            Manage settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleTest}>
            <FlaskConical className="mr-2 h-4 w-4" />
            Test connection
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSync}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync now
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View logs</DropdownMenuItem>
          <DropdownMenuItem>Re-authenticate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
