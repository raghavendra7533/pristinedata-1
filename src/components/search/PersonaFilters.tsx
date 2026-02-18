import { useState } from "react";
import { User, Briefcase, MapPin, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import FilterChip from "./FilterChip";

interface PersonaFiltersState {
  jobTitles: string[];
  seniority: string[];
  departments: string[];
  contactLocation: string[];
}

interface PersonaFiltersProps {
  filters: PersonaFiltersState;
  onChange: (filters: PersonaFiltersState) => void;
}

const seniorityLevels = ["C-Level", "VP", "Director", "Manager", "Senior", "Entry Level"];
const departmentOptions = ["Marketing", "Sales", "Engineering", "Product", "Finance", "Operations", "HR", "Legal"];

export default function PersonaFilters({ filters, onChange }: PersonaFiltersProps) {
  const [titleInput, setTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const addItem = (field: keyof PersonaFiltersState, value: string) => {
    if (Array.isArray(filters[field])) {
      const currentArray = filters[field] as string[];
      if (!currentArray.includes(value) && value.trim()) {
        onChange({
          ...filters,
          [field]: [...currentArray, value.trim()],
        });
      }
    }
  };

  const removeItem = (field: keyof PersonaFiltersState, value: string) => {
    if (Array.isArray(filters[field])) {
      onChange({
        ...filters,
        [field]: (filters[field] as string[]).filter(item => item !== value),
      });
    }
  };

  const toggleItem = (field: keyof PersonaFiltersState, value: string) => {
    if (Array.isArray(filters[field])) {
      const currentArray = filters[field] as string[];
      if (currentArray.includes(value)) {
        removeItem(field, value);
      } else {
        addItem(field, value);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    field: keyof PersonaFiltersState,
    value: string,
    setValue: (v: string) => void
  ) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      addItem(field, value);
      setValue("");
    }
  };

  return (
    <div className="space-y-5">
      {/* Job Titles */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span>Job Titles</span>
        </div>
        <Input
          placeholder="Type title and press Enter... (e.g., CMO, VP Marketing)"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "jobTitles", titleInput, setTitleInput)}
          className="text-sm"
        />
        {filters.jobTitles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.jobTitles.map((title) => (
              <FilterChip
                key={title}
                value={title}
                onRemove={() => removeItem("jobTitles", title)}
              />
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">Press Enter to add as a chip</p>
      </div>

      <div className="h-px bg-border" />

      {/* Seniority */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>Seniority</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {seniorityLevels.map((level) => (
            <Badge
              key={level}
              variant={filters.seniority.includes(level) ? "default" : "outline"}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={() => toggleItem("seniority", level)}
            >
              {level}
            </Badge>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Department/Function */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>Department / Function</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {departmentOptions.map((dept) => (
            <Badge
              key={dept}
              variant={filters.departments.includes(dept) ? "default" : "outline"}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={() => toggleItem("departments", dept)}
            >
              {dept}
            </Badge>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Contact Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>Contact Location</span>
        </div>
        <Input
          placeholder="Type location and press Enter..."
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "contactLocation", locationInput, setLocationInput)}
          className="text-sm"
        />
        {filters.contactLocation.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.contactLocation.map((loc) => (
              <FilterChip
                key={loc}
                value={loc}
                onRemove={() => removeItem("contactLocation", loc)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
