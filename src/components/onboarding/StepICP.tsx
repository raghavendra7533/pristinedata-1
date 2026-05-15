import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "./StepProgress";

const INDUSTRY_SUGGESTIONS = [
  "SaaS", "FinTech", "HealthTech", "E-commerce", "EdTech", "MarTech",
  "Cybersecurity", "DevTools", "HR Tech", "LegalTech", "PropTech", "CleanTech",
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "501-1000", label: "501–1,000 employees" },
  { value: "1001+", label: "1,001+ employees" },
];

function PillInput({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (vals: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
    if (e.key === "Backspace" && !input && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const remove = (val: string) => onChange(values.filter((v) => v !== val));

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5 p-2 min-h-[42px] border border-border rounded-lg bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        {values.map((v) => (
          <Badge key={v} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-0.5 text-xs">
            {v}
            <button type="button" onClick={() => remove(v)} className="hover:text-destructive ml-0.5">
              <Icon icon="solar:close-circle-linear" className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] text-sm bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
    </div>
  );
}

export function StepICP() {
  const { data, updateData, setStep } = useOnboarding();
  const [industryInput, setIndustryInput] = useState(data.industry);

  const canContinue = industryInput.trim() && data.companySize;

  const handleContinue = () => {
    updateData({ industry: industryInput.trim() });
    setStep(5);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <StepProgress current={4} total={5} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Define your ICP</h1>
        <p className="text-sm text-muted-foreground mt-1">Who are your ideal customers?</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            placeholder="e.g. SaaS, FinTech..."
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
          />
          <div className="flex flex-wrap gap-1.5 mt-1">
            {INDUSTRY_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setIndustryInput(s)}
                className="text-xs px-2 py-1 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Company size</Label>
          <Select value={data.companySize} onValueChange={(v) => updateData({ companySize: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PillInput
          label="Target geographies"
          placeholder="e.g. North America, EMEA..."
          values={data.geographies}
          onChange={(vals) => updateData({ geographies: vals })}
        />

        <PillInput
          label="Target job titles"
          placeholder="e.g. VP of Sales, CRO..."
          values={data.jobTitles}
          onChange={(vals) => updateData({ jobTitles: vals })}
        />

        <div className="flex gap-3 mt-2">
          <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
            Back
          </Button>
          <Button className="flex-1" disabled={!canContinue} onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
