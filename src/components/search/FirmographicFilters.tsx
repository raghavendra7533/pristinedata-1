import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, MapPin, Building2, TrendingUp, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FirmographicFiltersProps {
  filters: {
    locations: string[];
    industries: string[];
    industryKeywords: string[];
    employeeSize: string[];
    revenue: string[];
  };
  onChange: (filters: any) => void;
}

export default function FirmographicFilters({ filters, onChange }: FirmographicFiltersProps) {
  const [locationInput, setLocationInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const addItem = (key: string, value: string) => {
    if (!value.trim()) return;
    const currentItems = filters[key as keyof typeof filters];
    if (!currentItems.includes(value)) {
      onChange({
        ...filters,
        [key]: [...currentItems, value],
      });
    }
  };

  const removeItem = (key: string, value: string) => {
    onChange({
      ...filters,
      [key]: filters[key as keyof typeof filters].filter((item: string) => item !== value),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, key: string, value: string, setValue: (val: string) => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem(key, value);
      setValue("");
    }
  };

  const employeeSizePresets = ["1-50", "51-200", "201-1000", "1001-5000", "5000+"];
  const revenuePresets = ["$0-$1M", "$1M-$10M", "$10M-$50M", "$50M-$100M", "$100M+"];

  return (
    <Card className="h-fit sticky top-[200px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Firmographic Filters
        </CardTitle>
        <CardDescription>Location, industry, size, and revenue criteria</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Locations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Locations</span>
          </div>
          <Input
            placeholder="Type location and press Enter..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "locations", locationInput, setLocationInput)}
            className="text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {filters.locations.map((loc) => (
              <Badge key={loc} variant="secondary" className="gap-2">
                {loc}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeItem("locations", loc)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Industries */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>Industries</span>
          </div>
          <Input
            placeholder="Type industry and press Enter..."
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "industries", industryInput, setIndustryInput)}
            className="text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {filters.industries.map((ind) => (
              <Badge key={ind} variant="secondary" className="gap-2">
                {ind}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeItem("industries", ind)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Industry Keywords */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>Industry Keywords</span>
          </div>
          <Input
            placeholder="Type keyword and press Enter..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "industryKeywords", keywordInput, setKeywordInput)}
            className="text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {filters.industryKeywords.map((kw) => (
              <Badge key={kw} variant="secondary" className="gap-2">
                {kw}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeItem("industryKeywords", kw)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Employee Size */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Employee Size</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {employeeSizePresets.map((size) => {
              const isSelected = filters.employeeSize.includes(size);
              return (
                <Badge
                  key={size}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer gap-2"
                  onClick={() => {
                    if (isSelected) {
                      removeItem("employeeSize", size);
                    } else {
                      addItem("employeeSize", size);
                    }
                  }}
                >
                  {size}
                  {isSelected && <X className="h-3 w-3" />}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Revenue */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>Revenue</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {revenuePresets.map((rev) => {
              const isSelected = filters.revenue.includes(rev);
              return (
                <Badge
                  key={rev}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer gap-2"
                  onClick={() => {
                    if (isSelected) {
                      removeItem("revenue", rev);
                    } else {
                      addItem("revenue", rev);
                    }
                  }}
                >
                  {rev}
                  {isSelected && <X className="h-3 w-3" />}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
