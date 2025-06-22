import { useState } from 'react';
import { ProfileForm } from '@/components/onboarding/ProfileForm';
import { PsychologicalTest } from '@/components/onboarding/PsychologicalTest';
import { useLocation } from 'wouter';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();

  const handleProfileComplete = () => {
    setStep(2);
  };

  const handleTestComplete = () => {
    setLocation('/dashboard');
  };

  return (
    <>
      {step === 1 && <ProfileForm onComplete={handleProfileComplete} />}
      {step === 2 && <PsychologicalTest onComplete={handleTestComplete} />}
    </>
  );
}
