import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import Select from 'react-select';
import { FormField } from '../../../components/shared/forms/FormField.tsx';
import { SelectField } from '../../../components/shared/forms/SelectField.tsx';

const performerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.string().min(1, 'Gender is required'),
  age: z.number().min(1, 'Age is required'),
  height: z.number().optional(),
  department: z.string().min(1, 'Department is required'),
  grade: z.number().optional(),
  graduationYear: z.number().optional(),
  studyType: z.string().min(1, 'Study type is required'),
  status: z.string().min(1, 'Status is required'),
  biography: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

interface PerformerDetailsFormProps {
  performer: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function PerformerDetailsForm({
  performer,
  onSave,
  onCancel,
}: PerformerDetailsFormProps) {
  function getErrorMessage(error: any): string | undefined {
    return error?.message as string | undefined;
  }

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(performerSchema),
    defaultValues: performer,
  });

  const genderOptions = [
    { value: 'm', label: t('MALE') },
    { value: 'f', label: t('FEMALE') },
  ];

  const statusOptions = [
    { value: 'AVAILABLE', label: t('AVAILABLE') },
    { value: 'NOT_AVAILABLE', label: t('NOT_AVAILABLE') },
  ];

  const skillsOptions = [
    { value: 'ACTING', label: t('ACTING') },
    { value: 'SINGING', label: t('SINGING') },
    { value: 'DANCING', label: t('DANCING') },
    // Add more skills as needed
  ];

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label={t('NAME')}
          error={getErrorMessage(errors.name?.message)}
          required
        >
          <input
            type="text"
            {...register('name')}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.name && 'border-red-300'
            )}
          />
        </FormField>

        <SelectField
          label={t('GENDER')}
          error={getErrorMessage(errors.gender?.message)}
          required
        >
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={genderOptions}
                className="react-select"
                classNamePrefix="react-select"
                value={genderOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(selected) => field.onChange(selected?.value)}
              />
            )}
          />
        </SelectField>

        <FormField
          label={t('AGE')}
          error={getErrorMessage(errors.age?.message)}
          required
        >
          <input
            type="number"
            {...register('age', { valueAsNumber: true })}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.age && 'border-red-300'
            )}
          />
        </FormField>

        <FormField
          label={t('HEIGHT')}
          error={getErrorMessage(errors.height?.message)}
        >
          <input
            type="number"
            {...register('height', { valueAsNumber: true })}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.height && 'border-red-300'
            )}
          />
        </FormField>

        <SelectField
          label={t('STATUS')}
          error={getErrorMessage(errors.status?.message)}
          required
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={statusOptions}
                className="react-select"
                classNamePrefix="react-select"
                value={statusOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(selected) => field.onChange(selected?.value)}
              />
            )}
          />
        </SelectField>

        <SelectField
          label={t('SKILLS')}
          error={getErrorMessage(errors.skills?.message)}
        >
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={skillsOptions}
                className="react-select"
                classNamePrefix="react-select"
                value={skillsOptions.filter((option) =>
                  field.value?.includes(option.value)
                )}
                onChange={(selected) =>
                  field.onChange(selected.map((item) => item.value))
                }
              />
            )}
          />
        </SelectField>

        <div className="md:col-span-2">
          <FormField
            label={t('BIOGRAPHY')}
            error={getErrorMessage(errors.biography?.message)}
          >
            <textarea
              {...register('biography')}
              rows={4}
              className={clsx(
                'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                errors.biography && 'border-red-300'
              )}
            />
          </FormField>
        </div>
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
