import { MarketingLayout } from "@/components/si/MarketingLayout";
import { HeroSection } from "@/components/si/landing/HeroSection";
import { PainSection } from "@/components/si/landing/PainSection";
import { HowItWorksSection } from "@/components/si/landing/HowItWorksSection";
import { FeatureTiles } from "@/components/si/landing/FeatureTiles";
import { CTAFooter } from "@/components/si/landing/CTAFooter";

export default function SILanding() {
  return (
    <MarketingLayout>
      <HeroSection />
      <PainSection />
      <HowItWorksSection />
      <FeatureTiles />
      <CTAFooter />
    </MarketingLayout>
  );
}
