// Onboarding Context
// Stores onboarding data locally during the flow
// Only saves to Firebase at the end of step 5
// BACKUP CREATED: Production Migration Preparation
// DO NOT MODIFY - This is a backup of the current working version

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OnboardingStepData {
  step1?: { gender: string };
  step2?: { goal: string; trainingLevel: string };
  step3?: { experienceLevel: string };
  step4?: { injuries: string[]; otherDetails: string };
  step5?: { goal: string };
}

interface OnboardingContextType {
  stepData: OnboardingStepData;
  updateStep1: (data: { gender: string }) => void;
  updateStep2: (data: { goal: string; trainingLevel: string }) => void;
  updateStep3: (data: { experienceLevel: string }) => void;
  updateStep4: (data: { injuries: string[]; otherDetails: string }) => void;
  updateStep5: (data: { goal: string }) => void;
  clearOnboarding: () => void;
  getCompleteData: () => OnboardingStepData;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [stepData, setStepData] = useState<OnboardingStepData>({});

  const updateStep1 = (data: { gender: string }) => {
    setStepData(prev => ({ ...prev, step1: data }));
  };

  const updateStep2 = (data: { goal: string; trainingLevel: string }) => {
    setStepData(prev => ({ ...prev, step2: data }));
  };

  const updateStep3 = (data: { experienceLevel: string }) => {
    setStepData(prev => ({ ...prev, step3: data }));
  };

  const updateStep4 = (data: { injuries: string[]; otherDetails: string }) => {
    setStepData(prev => ({ ...prev, step4: data }));
  };

  const updateStep5 = (data: { goal: string }) => {
    setStepData(prev => ({ ...prev, step5: data }));
  };

  const clearOnboarding = () => {
    setStepData({});
  };

  const getCompleteData = () => {
    return stepData;
  };

  return (
    <OnboardingContext.Provider
      value={{
        stepData,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStep4,
        updateStep5,
        clearOnboarding,
        getCompleteData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

