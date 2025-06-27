import { useAuth } from '@/hooks/useAuth';
import { saveUserProfile } from '@/lib/userProfile';
import { useState } from 'react';
import { ProfileForm } from '@/components/onboarding/ProfileForm';
import { PsychologicalTest } from '@/components/onboarding/PsychologicalTest';
import { useLocation } from 'wouter';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleProfileComplete = async ({ name, role }: { name: string; role: string }) => {
    try {
      await saveUserProfile({
        id: user!.id,
        name,
        role: role || 'employee',
      });
      setStep(2); // Pasar al test psicológico
    } catch (err) {
      console.error('Error guardando perfil:', err);
      alert('Ocurrió un error al guardar tu información.');
    }
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
