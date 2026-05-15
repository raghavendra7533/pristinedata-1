import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "./StepProgress";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url("Enter a valid URL (include https://)"),
  companyDescription: z.string().min(10, "Please describe what your company does"),
});

type FormData = z.infer<typeof schema>;

export function StepCompany() {
  const { data, updateData, setStep } = useOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: data.companyName,
      companyWebsite: data.companyWebsite,
      companyDescription: data.companyDescription,
    },
  });

  const onSubmit = (values: FormData) => {
    updateData(values);
    setStep(4);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <StepProgress current={3} total={5} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Tell us about your company</h1>
        <p className="text-sm text-muted-foreground mt-1">This helps us surface the right accounts</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" placeholder="Acme Corp" {...register("companyName")} />
          {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="companyWebsite">Company website</Label>
          <Input id="companyWebsite" placeholder="https://acme.com" {...register("companyWebsite")} />
          {errors.companyWebsite && <p className="text-xs text-destructive">{errors.companyWebsite.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="companyDescription">What does your company do?</Label>
          <Textarea
            id="companyDescription"
            placeholder="We help B2B SaaS companies automate their outbound sales..."
            rows={4}
            {...register("companyDescription")}
          />
          {errors.companyDescription && (
            <p className="text-xs text-destructive">{errors.companyDescription.message}</p>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <Button variant="outline" className="flex-1" type="button" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
