import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { AddAssetDialog } from "@/components/assets/AddAssetDialog";
import { AssetCard } from "@/components/assets/AssetCard";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Asset {
  id: string;
  title: string;
  description: string;
  content: string;
  type: "pdf" | "doc" | "docx" | "ppt" | "pptx" | "txt";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fileSize?: number;
}

const PersonalizationAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    const stored = localStorage.getItem("personalization_assets");
    if (stored) {
      setAssets(JSON.parse(stored));
    } else {
      // Load mock data
      const mockAssets: Asset[] = [
        {
          id: "1",
          title: "Company Overview Deck.pptx",
          description: "Latest company presentation with value props and case studies",
          content: "[PowerPoint content]",
          type: "pptx",
          isActive: true,
          fileSize: 2458624,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          title: "ICP Definition.docx",
          description: "Detailed ideal customer profile and buyer personas",
          content: "[Word document content]",
          type: "docx",
          isActive: true,
          fileSize: 156432,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          title: "Product Features Guide.pdf",
          description: "Complete guide to all product capabilities",
          content: "[PDF content]",
          type: "pdf",
          isActive: true,
          fileSize: 1245678,
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "4",
          title: "Sales Kickoff Transcript.txt",
          description: "Q1 2024 sales kickoff meeting notes and strategy",
          content: "[Transcript content]",
          type: "txt",
          isActive: true,
          fileSize: 45231,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "5",
          title: "Competitive Analysis.docx",
          description: "Market positioning vs key competitors",
          content: "[Word document content]",
          type: "docx",
          isActive: false,
          fileSize: 234567,
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "6",
          title: "Customer Success Stories.pdf",
          description: "Case studies and testimonials from top customers",
          content: "[PDF content]",
          type: "pdf",
          isActive: true,
          fileSize: 3456789,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "7",
          title: "Product Roadmap Q2-Q4.pptx",
          description: "Upcoming features and release timeline",
          content: "[PowerPoint content]",
          type: "pptx",
          isActive: true,
          fileSize: 1876543,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "8",
          title: "Pricing Strategy Doc.docx",
          description: "Pricing tiers, packaging, and discount policies",
          content: "[Word document content]",
          type: "docx",
          isActive: true,
          fileSize: 123456,
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "9",
          title: "Team Call Transcript - Discovery.txt",
          description: "Best practices for discovery calls with prospects",
          content: "[Transcript content]",
          type: "txt",
          isActive: true,
          fileSize: 67890,
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "10",
          title: "Industry Trends Report.pdf",
          description: "2024 B2B sales intelligence market analysis",
          content: "[PDF content]",
          type: "pdf",
          isActive: false,
          fileSize: 2345678,
          createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setAssets(mockAssets);
      localStorage.setItem("personalization_assets", JSON.stringify(mockAssets));
    }
  };

  const saveAssets = (newAssets: Asset[]) => {
    localStorage.setItem("personalization_assets", JSON.stringify(newAssets));
    setAssets(newAssets);
  };

  const handleAddAsset = (asset: Omit<Asset, "id" | "createdAt" | "updatedAt">) => {
    const newAsset: Asset = {
      ...asset,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAssets([...assets, newAsset]);
    toast.success("Asset uploaded successfully");
  };

  const toggleActive = (id: string) => {
    const updated = assets.map((asset) =>
      asset.id === id
        ? { ...asset, isActive: !asset.isActive, updatedAt: new Date().toISOString() }
        : asset
    );
    saveAssets(updated);
    const asset = updated.find(a => a.id === id);
    toast.success(asset?.isActive ? "Asset activated" : "Asset deactivated");
  };

  const removeAsset = (id: string) => {
    const updated = assets.filter((asset) => asset.id !== id);
    saveAssets(updated);
    toast.success("Asset removed");
  };

  // Filtering logic
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || asset.type === filterType;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && asset.isActive) ||
                         (filterStatus === "inactive" && !asset.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const activeCount = assets.filter((a) => a.isActive).length;
  const totalCount = assets.length;
  const totalSize = assets.reduce((sum, a) => sum + (a.fileSize || 0), 0);

  const formatTotalSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  return (
    <div className="min-h-full">
      {/* Header with Gradient Band */}
      <section className="relative bg-gradient-hero px-6 py-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 leading-tight">
                Content HQ
              </h1>
              <p className="text-sm text-white/80">
                Your centralized content library powering AI personalization
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Link to="/content-iq">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Content IQ
                </Link>
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)} size="lg" variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Upload Assets
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-sm text-muted-foreground">Total Assets</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{totalCount - activeCount}</div>
              <div className="text-sm text-muted-foreground">Inactive</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{formatTotalSize(totalSize)}</div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="File type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="docx">Word</SelectItem>
              <SelectItem value="pptx">PowerPoint</SelectItem>
              <SelectItem value="txt">Text</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterType !== "all" || filterStatus !== "all" 
                ? "No assets match your filters" 
                : "No assets yet. Upload your first asset to get started."}
            </p>
            {!searchQuery && filterType === "all" && filterStatus === "all" && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Upload First Asset
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onToggleActive={toggleActive}
              onRemove={removeAsset}
            />
          ))}
        </div>
      )}

      <AddAssetDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddAsset}
      />
    </div>
  );
};

export default PersonalizationAssets;
