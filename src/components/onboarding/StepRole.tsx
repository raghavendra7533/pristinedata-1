import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "./StepProgress";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "ae", label: "AE", description: "Account Executive", icon: "solar:user-hand-up-linear" },
  { id: "sdr", label: "SDR / BDR", description: "Business Development", icon: "solar:phone-calling-linear" },
  { id: "sales_manager", label: "Sales Manager", description: "Team Lead", icon: "solar:users-group-two-rounded-linear" },
  { id: "founder", label: "Founder / CEO", description: "Company Leader", icon: "solar:buildings-2-linear" },
  { id: "demand_gen", label: "Demand Gen", description: "Growth & Marketing", icon: "solar:chart-2-linear" },
  { id: "other", label: "Other", description: "Something else", icon: "solar:widget-linear" },
];

export function StepRole() {
  const { data, updateData, setStep } = useOnboarding();

  const handleSelect = (roleId: string) => {
    updateData({ role: roleId });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <StepProgress current={2} total={5} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">What's your role?</h1>
        <p className="text-sm text-muted-foreground mt-1">We'll tailor the experience for you</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => handleSelect(role.id)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-150",
              data.role === role.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/40 hover:bg-accent text-foreground"
            )}
          >
            <Icon icon={role.icon} className="h-6 w-6" />
            <span className="text-sm font-semibold leading-tight">{role.label}</span>
            <span className="text-xs text-muted-foreground leading-tight">{role.description}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!data.role}
          onClick={() => setStep(3)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
