import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { FooterControls } from '../components/FooterControls';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n/useTranslation';
import { ChevronRight } from 'lucide-react';

type Step = 'role' | 'experience' | 'safety';

export function Onboarding() {
  const t = useTranslation();
  const setScreen = useAppStore((state) => state.setScreen);
  const setUserMeta = useAppStore((state) => state.setUserMeta);

  const [currentStep, setCurrentStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<'give' | 'receive' | 'both' | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<'newbie' | 'curious' | 'experienced' | null>(null);
  const [safetyAgreed, setSafetyAgreed] = useState(false);

  const steps: Step[] = ['role', 'experience', 'safety'];
  const currentStepIndex = steps.indexOf(currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case 'role':
        return selectedRole !== null;
      case 'experience':
        return selectedExperience !== null;
      case 'safety':
        return safetyAgreed;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;

    if (currentStep === 'safety') {
      setUserMeta({
        mode: selectedRole!,
        experience: selectedExperience!,
        agreedToTerms: safetyAgreed
      });
      setScreen('category-selection');
      return;
    }

    const nextStep = steps[currentStepIndex + 1];
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setCurrentStep(prevStep);
    } else {
      setScreen('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg sm:max-w-md">
        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentStepIndex
                    ? 'bg-primary'
                    : index < currentStepIndex
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep === 'role' && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center">{t.onboarding.roleTitle}</h2>
            <div className="grid gap-3">
              {[
                { value: 'give', label: t.onboarding.roleGiver },
                { value: 'receive', label: t.onboarding.roleReceiver },
                { value: 'both', label: t.onboarding.roleBoth }
              ].map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all ${
                    selectedRole === option.value
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedRole(option.value as 'give' | 'receive' | 'both')}
                >
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg">{option.label}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'experience' && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center">{t.onboarding.experienceTitle}</h2>
            <div className="grid gap-3">
              {[
                { value: 'newbie', label: t.onboarding.experienceNewbie },
                { value: 'curious', label: t.onboarding.experienceCurious },
                { value: 'experienced', label: t.onboarding.experienceExperienced }
              ].map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all ${
                    selectedExperience === option.value
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedExperience(option.value as 'newbie' | 'curious' | 'experienced')}
                >
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg">{option.label}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'safety' && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl">{t.onboarding.safetyTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-3 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground">{t.onboarding.safetyText}</p>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="safety"
                  checked={safetyAgreed}
                  onCheckedChange={(checked) => setSafetyAgreed(checked as boolean)}
                />
                <label
                  htmlFor="safety"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t.onboarding.safetyAgree}
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            {t.onboarding.back}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1"
          >
            {t.onboarding.continue}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {/* Footer with Controls */}
        <div className="mt-6">
          <FooterControls />
        </div>
      </div>
    </div>
  );
}
