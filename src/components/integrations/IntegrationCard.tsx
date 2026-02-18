import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Video } from "lucide-react";

interface IntegrationCardProps {
  integration: {
    id: string;
    name: string;
    category: string;
    description: string;
    isConnected: boolean;
  };
  onConnect: (integration: any) => void;
  onManage: (integration: any) => void;
}

const categoryIcons: Record<string, any> = {
  CRM: Building2,
  Email: Mail,
  "Meeting notes": Video,
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "CRM": return "bg-blue-500/10 text-blue-700 border-blue-200";
    case "Email": return "bg-purple-500/10 text-purple-700 border-purple-200";
    case "Meeting notes": return "bg-green-500/10 text-green-700 border-green-200";
    default: return "bg-muted text-muted-foreground";
  }
};

export function IntegrationCard({ integration, onConnect, onManage }: IntegrationCardProps) {
  const Icon = categoryIcons[integration.category] || Building2;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">{integration.name}</CardTitle>
              <Badge variant="outline" className={`mt-1 text-xs ${getCategoryColor(integration.category)}`}>
                {integration.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{integration.description}</CardDescription>
        {integration.isConnected ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onManage(integration)}
          >
            Manage
          </Button>
        ) : (
          <Button 
            className="w-full"
            onClick={() => onConnect(integration)}
          >
            Connect
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
