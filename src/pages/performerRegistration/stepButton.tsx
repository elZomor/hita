import { useFormContext } from 'react-hook-form';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface StepButtonProps {
  onClick: () => void;
  isLastStep?: boolean;
}

export function StepButton({ onClick, isLastStep }: StepButtonProps) {
  const {
    formState: { errors, isSubmitting },
  } = useFormContext();
  const hasErrors = Object.keys(errors).length > 0;
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={hasErrors}
      className={clsx(
        'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
        {
          'bg-gray-300 text-gray-500 cursor-not-allowed': hasErrors,
          'bg-purple-600 text-white hover:bg-purple-700': !hasErrors,
          'opacity-50': isSubmitting,
        }
      )}
    >
      {isLastStep
        ? t('PERFORMER_REG.STEPS_LABELS.SUBMIT')
        : t('PERFORMER_REG.STEPS_LABELS.NEXT_STEP')}
    </button>
  );
}
