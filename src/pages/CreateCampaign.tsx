import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import CampaignSetup from "@/components/campaign/CampaignSetup";
import CampaignPreview from "@/components/campaign/CampaignPreview";
import CampaignReview from "@/components/campaign/CampaignReview";

type CampaignStep = 1 | 2 | 3;

interface CampaignData {
  name: string;
  theme: string;
  stages: number;
  contactList: string;
  instructions: string;
}

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CampaignStep>(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    theme: "",
    stages: 3,
    contactList: "",
    instructions: ""
  });

  const steps = [
    { number: 1, label: "Campaign", completed: currentStep > 1 },
    { number: 2, label: "Email", completed: currentStep > 2 },
    { number: 3, label: "Review & Send", completed: false }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as CampaignStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as CampaignStep);
    }
  };

  const handleSave = () => {
    // Save draft logic
    console.log("Saving campaign draft...", campaignData);
  };

  const handleLaunch = () => {
    // Launch campaign logic
    console.log("Launching campaign...", campaignData);
    navigate("/campaigns");
  };

  return (
    <div className="min-h-screen">
      {/* Header with Gradient Band */}
      <section className="relative bg-gradient-hero px-6 py-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/campaigns")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {campaignData.name || "New Campaign"}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-white/80" />
                <span className="text-xs text-white/80">Campaign Builder</span>
              </div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                      step.completed
                        ? "bg-white text-primary"
                        : currentStep === step.number
                        ? "bg-white text-primary ring-4 ring-white/30"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {step.completed ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep === step.number ? "text-white" : "text-white/70"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ${step.completed ? "bg-white" : "bg-white/30"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/campaigns")}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Exit
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleSave}
              className="text-white hover:bg-white/10"
            >
              Save
            </Button>
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext} 
                className="bg-white text-primary hover:bg-white/90"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleLaunch} 
                className="bg-white text-primary hover:bg-white/90"
              >
                Launch Campaign
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentStep === 1 && (
          <CampaignSetup
            data={campaignData}
            onUpdate={setCampaignData}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <CampaignPreview
            data={campaignData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <CampaignReview
            data={campaignData}
            onBack={handleBack}
            onLaunch={handleLaunch}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
