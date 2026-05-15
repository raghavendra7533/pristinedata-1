interface StepProgressProps {
  current: number;
  total: number;
}

export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <p className="text-sm font-medium text-muted-foreground">
        Step {current} of {total}
      </p>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i + 1 < current
                ? "h-2 w-2 bg-primary"
                : i + 1 === current
                ? "h-2 w-5 bg-primary"
                : "h-2 w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
