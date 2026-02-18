import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export const ExtensionLogin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-8 bg-background">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-primary-foreground rounded-sm" />
          </div>
          <div className="text-left">
            <div className="text-xl font-semibold">Pristine</div>
            <div className="text-xl font-semibold">Data AI</div>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="text-center text-base text-foreground">
        You must be logged in to use the Pristine Data Browser Extension.
      </p>

      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-base rounded-xl"
          />
        </div>

        <Button
          className="w-full h-14 text-base font-semibold rounded-full"
          disabled={loading || !email}
          onClick={() => setLoading(true)}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>

        <button className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
          Continue with SSO →
        </button>
      </div>
    </div>
  );
};
