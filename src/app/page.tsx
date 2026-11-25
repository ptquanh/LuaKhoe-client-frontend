import { LandingFeaturesBento } from "./_components/LandingFeaturesBento";
import { LandingHeader } from "./_components/LandingHeader";
import { LandingHero } from "./_components/LandingHero";
import { LandingSocialAndFaq } from "./_components/LandingSocialAndFaq";
import { LandingWorkflowAndDiseases } from "./_components/LandingWorkflowAndDiseases";

export default function LandingPage() {
  return (
    <div className="bg-bg-page text-text-primary min-h-screen transition-colors duration-200">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeaturesBento />
        <LandingWorkflowAndDiseases />
        <LandingSocialAndFaq />
      </main>
    </div>
  );
}
