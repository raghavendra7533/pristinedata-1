import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url("Enter a valid URL (include https://)"),
  reason: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddToWatchlistModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddToWatchlistModal({ open, onClose }: AddToWatchlistModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormData) => {
    // TODO: Replace with POST /api/watchlist API call
    console.log("Add to watchlist:", values);
    toast.success(`${values.companyName} added to watchlist`);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Account to Watchlist</DialogTitle>
          <DialogDescription>
            Track this company for buying signals and updates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="watchlist-company">Company name</Label>
            <Input id="watchlist-company" placeholder="Acme Corp" {...register("companyName")} />
            {errors.companyName && (
              <p className="text-xs text-destructive">{errors.companyName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="watchlist-website">Company website</Label>
            <Input
              id="watchlist-website"
              placeholder="https://acme.com"
              {...register("companyWebsite")}
            />
            {errors.companyWebsite && (
              <p className="text-xs text-destructive">{errors.companyWebsite.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="watchlist-reason">
              Reason for watching <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="watchlist-reason"
              placeholder="e.g. Potential upsell — new CRO hired last month"
              rows={3}
              {...register("reason")}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>
              Cancel
            </Button>
            <Button type="submit">Add to Watchlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
