import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { achievementSchema } from '../../../types/performer-form.ts';
import { FormField } from '../../../components/shared/forms/FormField.tsx';
import { Achievement } from '../../../models/Performer.ts';
import Select from 'react-select';
import { useEffect } from 'react';

interface AchievementFormProps {
  achievement: Achievement;
  onSave: (achievement: Achievement) => void;
  onCancel: () => void;
}

export function AchievementForm({
  achievement,
  onSave,
  onCancel,
}: AchievementFormProps) {
  const { t } = useTranslation();
  const translateError = (error?: string) => {
    if (!error) return undefined;
    return error.startsWith('PERFORMER_PAGE.') ? t(error) : error;
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(achievementSchema),
    defaultValues: achievement,
  });
  useEffect(() => {
    reset(achievement);
    clearErrors();
  }, [achievement, reset, clearErrors]);
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1980 + 1 },
    (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })
  );
  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.ACHIEVEMENTS_SECTION.' + text);
  };

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label={addTranslationPrefix('RANK')}
          error={translateError(errors.rank?.message)}
          required
        >
          <input
            type="text"
            {...register('rank')}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.rank && 'border-red-300'
            )}
          />
        </FormField>

        <FormField
          label={addTranslationPrefix('FIELD')}
          error={translateError(errors.field?.message)}
          required
        >
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
          label={addTranslationPrefix('SHOW_NAME')}
          error={translateError(errors.showName?.message)}
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
          label={addTranslationPrefix('FESTIVAL_NAME')}
          error={translateError(errors.festivalName?.message)}
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

        <FormField
          label={addTranslationPrefix('YEAR')}
          error={errors.year?.message}
          required
        >
          <Select
            options={yearOptions}
            className="react-select"
            classNamePrefix="react-select"
            value={yearOptions.find(
              (option) => option.value === watch(`year`)?.toString()
            )}
            onChange={(selected) => {
              setValue(
                `year`,
                selected ? parseInt(selected.value) : currentYear
              );
            }}
          />
        </FormField>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
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
