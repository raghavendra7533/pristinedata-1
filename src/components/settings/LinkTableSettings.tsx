import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface LinkEntry {
  id: string;
  keyword: string;
  url: string;
}

const MOCK_LINKS: LinkEntry[] = [
  { id: "1", keyword: "Pristine Data AI", url: "https://pristinedata.ai" },
  { id: "2", keyword: "case study", url: "https://pristinedata.ai/case-studies" },
  { id: "3", keyword: "book a demo", url: "https://pristinedata.ai/demo" },
];

export default function LinkTableSettings() {
  const [links, setLinks] = useState<LinkEntry[]>(MOCK_LINKS);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = () => {
    if (!keyword.trim() || !url.trim()) return;
    setLinks((prev) => [...prev, { id: crypto.randomUUID(), keyword: keyword.trim(), url: url.trim() }]);
    setKeyword("");
    setUrl("");
    setOpen(false);
  };

  const handleRemove = (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          <Icon icon="solar:add-circle-linear" className="h-4 w-4 mr-1.5" />
          Add Keyword
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5">Keyword</th>
              <th className="text-left font-medium text-muted-foreground px-4 py-2.5">Replacement URL</th>
              <th className="text-right font-medium text-muted-foreground px-4 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-t border-border">
                <td className="px-4 py-2.5 font-medium text-foreground">{link.keyword}</td>
                <td className="px-4 py-2.5 text-muted-foreground truncate max-w-xs">{link.url}</td>
                <td className="px-4 py-2.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(link.id)}
                  >
                    <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  No keywords yet. Add one to start auto-linking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Keyword</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="link-keyword">Keyword</Label>
              <Input
                id="link-keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. book a demo"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="link-url">Replacement URL</Label>
              <Input
                id="link-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Keyword</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
