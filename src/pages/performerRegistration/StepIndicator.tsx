import { Award, Check, Image, Link2, Phone, Trophy, User } from 'lucide-react';
import { clsx } from 'clsx';
import { FormStep, STEPS } from '../../types/performer-form';
import { useTranslation } from 'react-i18next';

const STEP_ICONS = {
  'personal-info': User,
  experiences: Award,
  achievements: Trophy,
  'contact-details': Phone,
  'profile-images': Image,
  'public-links': Link2,
};

interface StepIndicatorProps {
  currentStep: FormStep;
  completedSteps: FormStep[];
  onStepClick: (step: FormStep) => void;
}

export function StepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full lg:w-64 flex-shrink-0 py-4 lg:py-8 px-4 lg:pr-8 lg:border-r border-gray-200">
      <nav>
        <ul className="space-y-1">
          {STEPS.map((step, index) => {
            const StepIcon = STEP_ICONS[step.id];
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isClickable =
              isCompleted ||
              index === 0 ||
              completedSteps.includes(STEPS[index - 1].id);

            return (
              <li key={step.id}>
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isClickable
                      ? 'hover:bg-gray-100'
                      : 'opacity-50 cursor-not-allowed',
                    isCurrent && 'bg-purple-50 text-purple-700',
                    !isCurrent && isCompleted && 'text-green-700',
                    !isCurrent && !isCompleted && 'text-gray-700'
                  )}
                >
                  <div
                    className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                      isCurrent && 'bg-purple-100',
                      !isCurrent && isCompleted && 'bg-green-100',
                      !isCurrent && !isCompleted && 'bg-gray-100'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="truncate">
                    {t('PERFORMER_REG.STEPS_LABELS.' + step.label)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
