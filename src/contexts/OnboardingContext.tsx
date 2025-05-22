'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '@/lib/api-client';

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  data: {
    profileSetup?: any;
    firstAgent?: any;
    knowledgeBase?: any;
    integrations?: any;
  };
  isComplete: boolean;
}

interface OnboardingContextType {
  state: OnboardingState;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (step: number, data?: any) => void;
  updateStepData: (step: number, data: any) => void;
  finishOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, organization } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    totalSteps: 5,
    completedSteps: new Set(),
    data: {},
    isComplete: false,
  });

  useEffect(() => {
    if (user && organization) {
      checkOnboardingStatus();
    }
  }, [user, organization]);

  const checkOnboardingStatus = async () => {
    try {
      const response = await apiClient.queryTable('user_onboarding', '*', { user_email: user?.email }, 1);
      if (response.data?.[0]?.completed) {
        setState(prev => ({ ...prev, isComplete: true }));
      }
    } catch (error) {
      console.error('Erro ao verificar status do onboarding:', error);
    }
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, prev.totalSteps) }));
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
  };

  const completeStep = (step: number, data?: any) => {
    setState(prev => ({
      ...prev,
      completedSteps: new Set([...prev.completedSteps, step]),
      data: data ? { ...prev.data, [`step${step}`]: data } : prev.data,
    }));
  };

  const updateStepData = (step: number, data: any) => {
    setState(prev => ({ ...prev, data: { ...prev.data, [`step${step}`]: data } }));
  };

  const finishOnboarding = async () => {
    try {
      await apiClient.insertData('user_onboarding', {
        user_email: user?.email,
        organization_id: organization?.id,
        completed: true,
        completed_at: new Date().toISOString(),
        onboarding_data: state.data,
      });

      await apiClient.updateData(
        'organizations',
        { onboarding_completed: true, updated_at: new Date().toISOString() },
        { id: organization?.id }
      );

      setState(prev => ({ ...prev, isComplete: true }));
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      throw error;
    }
  };

  return (
    <OnboardingContext.Provider value={{ state, nextStep, prevStep, completeStep, updateStepData, finishOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding deve ser usado dentro de OnboardingProvider');
  }
  return context;
};
