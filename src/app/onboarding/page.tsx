'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { FirstAgentStep } from '@/components/onboarding/FirstAgentStep';
import { IntegrationsStep } from '@/components/onboarding/IntegrationsStep';
import { Button } from '@/components/ui/Button';

export default function OnboardingPage() {
  const { state, nextStep } = useOnboarding();

  const renderStep = () => {
    switch (state.currentStep) {
      case 3:
        return <FirstAgentStep />;
      case 5:
        return <IntegrationsStep />;
      default:
        return (
          <div className="p-8 text-center">
            <p>Bem-vindo ao onboarding.</p>
            <Button onClick={nextStep}>Começar</Button>
          </div>
        );
    }
  };

  return <div className="min-h-screen flex items-center justify-center bg-gray-50">{renderStep()}</div>;
}
