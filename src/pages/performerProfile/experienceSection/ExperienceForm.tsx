import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema } from '../../../types/performer-form.ts';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { clsx } from 'clsx';
import { Experience } from '../../../models/Performer.ts';
import { FormField } from '../../../components/shared/forms/FormField.tsx';
import { SelectField } from '../../../components/shared/forms/SelectField.tsx';

const AVAILABLE_ROLES: string[] = [];

interface ExperienceFormProps {
  experience: Experience;
  onSave: (experience: Experience) => void;
  onCancel: () => void;
}

const SHOW_TYPES = [
  { value: 'THEATER', label: 'THEATER' },
  { value: 'TV', label: 'TV' },
  { value: 'MOVIE', label: 'MOVIE' },
  { value: 'RADIO', label: 'RADIO' },
  { value: 'DUBBING', label: 'DUBBING' },
];

export function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: ExperienceFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      ...experience,
      duration: experience.duration || undefined,
    },
  });

  const showType = watch('showType');
  const isTheater = showType === 'THEATER';

  const roleOptions = AVAILABLE_ROLES.map((role) => ({
    value: role,
    label: t(role),
  }));

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <SelectField
          label={t('SHOW_TYPE')}
          error={errors.showType?.message}
          required
        >
          <Controller
            name="showType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={SHOW_TYPES}
                getOptionLabel={(option) => t(option.label)}
                getOptionValue={(option) => option.value}
                className="react-select"
                classNamePrefix="react-select"
                onChange={(selected) => field.onChange(selected?.value)}
                value={SHOW_TYPES.find(
                  (option) => option.value === field.value
                )}
              />
            )}
          />
        </SelectField>

        <FormField
          label={t('DIRECTOR')}
          error={errors.director?.message}
          required
        >
          <input
            type="text"
            {...register('director')}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.director && 'border-red-300'
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

        <div className="md:col-span-2">
          <SelectField
            label={t('ROLES')}
            error={errors.roles?.message}
            required
          >
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={roleOptions}
                  className="react-select"
                  classNamePrefix="react-select"
                  onChange={(selected) => {
                    field.onChange(selected.map((option) => option.value));
                  }}
                  value={roleOptions.filter((option) =>
                    field.value?.includes(option.value)
                  )}
                />
              )}
            />
          </SelectField>
        </div>

        {isTheater && (
          <>
            <FormField
              label={t('VENUE')}
              error={errors.venue?.message}
              required
            >
              <input
                type="text"
                {...register('venue')}
                className={clsx(
                  'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                  errors.venue && 'border-red-300'
                )}
              />
            </FormField>

            <FormField
              label={`${t('DURATION')} (${t('MINUTES')})`}
              error={errors.duration?.message}
              required
            >
              <input
                type="number"
                {...register('duration', { valueAsNumber: true })}
                className={clsx(
                  'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                  errors.duration && 'border-red-300'
                )}
              />
            </FormField>
          </>
        )}
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
