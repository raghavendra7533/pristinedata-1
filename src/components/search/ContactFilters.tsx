import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ContactFiltersProps {
  filters: {
    jobTitles: string[];
    seniority: string[];
    personLocation: string[];
    personKeywords: string[];
  };
  onChange: (filters: {
    jobTitles: string[];
    seniority: string[];
    personLocation: string[];
    personKeywords: string[];
  }) => void;
}

export default function ContactFilters({ filters, onChange }: ContactFiltersProps) {
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const seniorityLevels = [
    "C-Level",
    "VP",
    "Director",
    "Manager",
    "Senior",
    "Entry Level"
  ];

  const addItem = (field: keyof typeof filters, value: string) => {
    if (value.trim() && !filters[field].includes(value.trim())) {
      onChange({
        ...filters,
        [field]: [...filters[field], value.trim()],
      });
    }
  };

  const removeItem = (field: keyof typeof filters, value: string) => {
    onChange({
      ...filters,
      [field]: filters[field].filter((item) => item !== value),
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof typeof filters,
    value: string,
    setValue: (value: string) => void
  ) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      addItem(field, value);
      setValue("");
    }
  };

  const toggleSeniority = (level: string) => {
    if (filters.seniority.includes(level)) {
      removeItem("seniority", level);
    } else {
      addItem("seniority", level);
    }
  };

  return (
    <div className="space-y-6">
      {/* Job Titles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job Titles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="e.g., Chief Marketing Officer, VP of Sales..."
            value={jobTitleInput}
            onChange={(e) => setJobTitleInput(e.target.value)}
            onKeyDown={(e) =>
              handleKeyDown(e, "jobTitles", jobTitleInput, setJobTitleInput)
            }
          />
          {filters.jobTitles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.jobTitles.map((title) => (
                <Badge key={title} variant="secondary" className="gap-1">
                  {title}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeItem("jobTitles", title)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seniority Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seniority Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {seniorityLevels.map((level) => (
              <Badge
                key={level}
                variant={filters.seniority.includes(level) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSeniority(level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Person Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Person Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="e.g., United States, California, San Francisco..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) =>
              handleKeyDown(e, "personLocation", locationInput, setLocationInput)
            }
          />
          {filters.personLocation.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.personLocation.map((location) => (
                <Badge key={location} variant="secondary" className="gap-1">
                  {location}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeItem("personLocation", location)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Person Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Person Keywords</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="e.g., Marketing Automation, SaaS, B2B..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) =>
              handleKeyDown(e, "personKeywords", keywordInput, setKeywordInput)
            }
          />
          {filters.personKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.personKeywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeItem("personKeywords", keyword)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
