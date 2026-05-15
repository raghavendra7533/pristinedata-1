import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "./StepProgress";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    icon: "solar:radar-linear",
    title: "Spot buying signals instantly",
    description:
      "Pristine monitors 50+ intent signals across your target accounts — job changes, funding rounds, tech installs, and more — so you always know when to reach out.",
  },
  {
    icon: "solar:bolt-linear",
    title: "Run plays, not guesswork",
    description:
      "Every signal triggers a recommended playbook. We tell you who to contact, what to say, and why now is the right moment — backed by your ICP and deal history.",
  },
  {
    icon: "solar:chart-2-linear",
    title: "Your pipeline, always in motion",
    description:
      "Your Sales Intelligence Dashboard surfaces the accounts that need attention today, keeps your watchlist fresh, and shows you exactly what's moving in your pipeline.",
  },
];

export function StepWalkthrough() {
  const { setStep, completeOnboarding } = useOnboarding();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const isLast = current === SLIDES.length - 1;

  const handleLetsGo = () => {
    completeOnboarding();
    navigate("/sales-dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <StepProgress current={5} total={5} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Here's what you can do</h1>
        <p className="text-sm text-muted-foreground mt-1">A quick look at the platform</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 mb-6 text-center min-h-[220px] flex flex-col items-center justify-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon icon={SLIDES[current].icon} className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{SLIDES[current].title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{SLIDES[current].description}</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "rounded-full transition-all duration-200",
              i === current ? "h-2 w-5 bg-primary" : "h-2 w-2 bg-muted hover:bg-muted-foreground"
            )}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => (current === 0 ? setStep(4) : setCurrent((c) => c - 1))}
        >
          {current === 0 ? "Back" : "Previous"}
        </Button>
        {isLast ? (
          <Button className="flex-1" onClick={handleLetsGo}>
            Let's go
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => setCurrent((c) => c + 1)}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
