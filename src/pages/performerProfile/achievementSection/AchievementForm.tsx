import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { achievementSchema } from '../../../types/performer-form.ts';
import { FormField } from '../../../components/shared/forms/FormField.tsx';

interface AchievementFormProps {
  achievement: {
    rank: string;
    field: string;
    showName: string;
    festivalName: string;
    year: number;
  };
  onSave: (achievement: {
    rank: string;
    field: string;
    showName: string;
    festivalName: string;
    year: number;
  }) => void;
  onCancel: () => void;
}

export function AchievementForm({
  achievement,
  onSave,
  onCancel,
}: AchievementFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(achievementSchema),
    defaultValues: achievement,
  });

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label={t('RANK')} error={errors.rank?.message} required>
          <input
            type="text"
            {...register('rank')}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.rank && 'border-red-300'
            )}
          />
        </FormField>

        <FormField label={t('FIELD')} error={errors.field?.message} required>
          <input
            type="text"
            {...register('field')}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.field && 'border-red-300'
            )}
          />
        </FormField>

        <FormField
          label={t('SHOW_NAME')}
          error={errors.showName?.message}
          required
        >
          <input
            type="text"
            {...register('showName')}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.showName && 'border-red-300'
            )}
          />
        </FormField>

        <FormField
          label={t('FESTIVAL_NAME')}
          error={errors.festivalName?.message}
          required
        >
          <input
            type="text"
            {...register('festivalName')}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.festivalName && 'border-red-300'
            )}
          />
        </FormField>

        <FormField label={t('YEAR')} error={errors.year?.message} required>
          <input
            type="number"
            {...register('year', { valueAsNumber: true })}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.year && 'border-red-300'
            )}
          />
        </FormField>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {t('CANCEL')}
        </button>
        <button
          type="submit"
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {t('SAVE')}
        </button>
      </div>
    </form>
  );
}
