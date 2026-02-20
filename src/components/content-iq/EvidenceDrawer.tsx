import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EvidenceDrawerProps {
  files: string[];
}

export const EvidenceDrawer = ({ files }: EvidenceDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon icon="solar:document-text-linear" className="w-5 h-5 text-primary" />
                Evidence & Referenced Files
                <span className="text-sm font-normal text-muted-foreground">
                  ({files.length} files)
                </span>
              </CardTitle>
              <Icon
                icon={isOpen ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                className="w-5 h-5 text-muted-foreground"
              />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Icon icon="solar:document-linear" className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{file}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
