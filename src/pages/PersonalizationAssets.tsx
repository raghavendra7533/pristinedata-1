import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
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
import { cn } from "@/lib/utils";

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

  // Group assets by type for the sidebar
  const assetsByType = assets.reduce((acc, asset) => {
    const type = asset.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf": return "solar:document-text-bold";
      case "doc":
      case "docx": return "solar:document-bold";
      case "ppt":
      case "pptx": return "solar:presentation-graph-bold";
      case "txt": return "solar:notes-bold";
      default: return "solar:file-bold";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pdf": return "text-red-500 bg-red-500/10";
      case "doc":
      case "docx": return "text-blue-500 bg-blue-500/10";
      case "ppt":
      case "pptx": return "text-amber-500 bg-amber-500/10";
      case "txt": return "text-slate-500 bg-slate-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon icon="solar:layers-bold" className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Content HQ</h1>
                <p className="text-sm text-muted-foreground">
                  Your centralized content library powering AI personalization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/content-iq" className="gap-2">
                  <Icon icon="solar:chart-2-linear" className="h-4 w-4" />
                  Content IQ
                </Link>
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
                <Icon icon="solar:upload-linear" className="h-4 w-4 mr-2" />
                Upload Assets
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon icon="solar:folder-with-files-linear" className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCount}</p>
                  <p className="text-xs text-muted-foreground">Total Assets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon icon="solar:check-circle-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center">
                  <Icon icon="solar:eye-closed-linear" className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{totalCount - activeCount}</p>
                  <p className="text-xs text-muted-foreground">Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Icon icon="solar:server-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatTotalSize(totalSize)}</p>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-6 items-start">
          {/* Sidebar - File Type Breakdown */}
          <div className="w-64 flex-shrink-0 hidden lg:block sticky top-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Icon icon="solar:pie-chart-2-linear" className="h-4 w-4 text-primary" />
                  By File Type
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {Object.entries(assetsByType).map(([type, typeAssets]) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(filterType === type ? "all" : type)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-lg transition-colors",
                        filterType === type
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", getTypeColor(type))}>
                          <Icon icon={getTypeIcon(type)} className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium uppercase">{type}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {typeAssets.length}
                      </Badge>
                    </button>
                  ))}
                </div>

                {filterType !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-xs text-muted-foreground"
                    onClick={() => setFilterType("all")}
                  >
                    <Icon icon="solar:close-circle-linear" className="h-3.5 w-3.5 mr-1.5" />
                    Clear filter
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Icon icon="solar:bolt-linear" className="h-4 w-4 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Icon icon="solar:upload-linear" className="h-3.5 w-3.5 mr-2" />
                  Upload New Asset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  asChild
                >
                  <Link to="/content-iq">
                    <Icon icon="solar:chart-2-linear" className="h-3.5 w-3.5 mr-2" />
                    View Content IQ
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Search and Filters */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assets by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <Icon icon="solar:file-linear" className="h-4 w-4 mr-2 text-muted-foreground" />
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
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <Icon icon="solar:filter-linear" className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredAssets.length}</span> of {totalCount} assets
                </p>
                {(searchQuery || filterType !== "all" || filterStatus !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("all");
                      setFilterStatus("all");
                    }}
                  >
                    <Icon icon="solar:close-circle-linear" className="h-3.5 w-3.5 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>

            {/* Assets Grid */}
            {filteredAssets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Icon icon="solar:folder-open-linear" className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery || filterType !== "all" || filterStatus !== "all"
                      ? "No matching assets"
                      : "No assets yet"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                    {searchQuery || filterType !== "all" || filterStatus !== "all"
                      ? "Try adjusting your filters or search query"
                      : "Upload your first asset to start building your AI knowledge base"}
                  </p>
                  {!searchQuery && filterType === "all" && filterStatus === "all" && (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Icon icon="solar:upload-linear" className="h-4 w-4 mr-2" />
                      Upload First Asset
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
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
          </div>
        </div>
      </div>

      <AddAssetDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddAsset}
      />
    </div>
  );
};

export default PersonalizationAssets;
