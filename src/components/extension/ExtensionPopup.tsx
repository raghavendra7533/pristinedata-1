import { Search, Grid, BarChart3, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ExtensionPopup = () => {
  return (
    <Card className="w-[400px] h-[520px] rounded-2xl shadow-lg border-0 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-primary-foreground rounded-sm" />
          </div>
          <div>
            <div className="text-base font-semibold">Pristine</div>
            <div className="text-base font-semibold">Data AI</div>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          ×
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2">
        <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-colors group">
          <Search className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          <span className="text-base font-medium">Search on Pristine Data AI</span>
        </button>

        <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-colors group">
          <Grid className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          <span className="text-base font-medium">Manage content</span>
        </button>

        <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-colors group">
          <BarChart3 className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          <span className="text-base font-medium">Usage</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-6 border-t">
        <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 text-sm font-medium">
          Open Web App
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
};
