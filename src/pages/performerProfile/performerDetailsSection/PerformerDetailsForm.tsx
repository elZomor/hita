import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { FormField } from '../../../components/shared/forms/FormField.tsx';
import { useEffect, useState } from 'react';
import { DropDownOptions } from '../../../models/shared.ts';
import { get_request } from '../../../utils/restUtils.ts';
import DatePicker from 'react-datepicker';
import { CalendarIcon } from 'lucide-react';
import { RadioField } from '../../../components/shared/forms/RadioField.tsx';
import { z } from 'zod';

interface PerformerDetailsFormProps {
  performer: any;
  username: string;
  isContactDetailsProtected: boolean;
  isGalleryProtected: boolean;
  handleUpdate: (requestData: any) => void;
  onCancel: () => void;
}

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 16);
const personalInfoSchema = z.object({
  dateOfBirth: z
    .date()
    .optional()
    .refine(
      (date) => !date || date <= maxDate,
      'Must be at least 16 years old'
    ),
  skills: z.array(z.string()).optional(),
  biography: z.string().max(300).optional(),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE']),
  openFor: z.enum(['FREE', 'PAID', 'BOTH']),
  height: z.number().max(230).optional(),
  weight: z.number().max(230).optional(),
  isContactDetailsProtected: z.boolean().optional(),
  isGalleryProtected: z.boolean().optional(),
});

export function PerformerDetailsForm({
  performer,
  onCancel,
  handleUpdate,
  username,
  isContactDetailsProtected,
  isGalleryProtected,
}: PerformerDetailsFormProps) {
  function getErrorMessage(error: any): string | undefined {
    return error as string | undefined;
  }

  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.PERSONAL_INFO.' + text);
  };

  const [skillsOptions, setSkillsOptions] = useState<DropDownOptions[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await get_request('hita/skills');
      setSkillsOptions(
        data.data.map(
          (skill: string): DropDownOptions => ({
            value: skill,
            label: skill,
          })
        )
      );
    };
    fetchData();
  }, []);
  const { t, i18n } = useTranslation();
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      ...performer,
      username,
      isContactDetailsProtected,
      isGalleryProtected,
    },
  });
  console.log(errors);

  return (
    <form
      onSubmit={handleSubmit(handleUpdate)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label={addTranslationPrefix('DATE_OF_BIRTH')}
          error={getErrorMessage(errors.dateOfBirth?.message)}
        >
          <div className="relative">
            <DatePicker
              locale={i18n.language}
              dateFormat="dd/MM/YYYY"
              selected={watch('dateOfBirth')}
              onChange={(date) => setValue('dateOfBirth', date!)}
              maxDate={maxDate}
              showYearDropdown
              dropdownMode="select"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </FormField>

        <FormField
          label={addTranslationPrefix('HEIGHT')}
          error={getErrorMessage(errors.height?.message)}
        >
          <div className="space-y-2">
            <input
              type="text"
              {...register('height', {
                setValueAs: (value) =>
                  value === '' ? undefined : Number(value),
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={3}
            />
          </div>
        </FormField>
        <FormField
          label={addTranslationPrefix('WEIGHT')}
          error={getErrorMessage(errors.weight?.message)}
        >
          <div className="space-y-2">
            <input
              type="text"
              {...register('weight', {
                setValueAs: (value) =>
                  value === '' ? undefined : Number(value),
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={4}
            />
          </div>
        </FormField>

        <RadioField
          label={addTranslationPrefix('STATUS')}
          error={getErrorMessage(errors.status?.message)}
          required
        >
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('status')}
                value="AVAILABLE"
                className="form-radio text-purple-600 focus:ring-purple-500"
              />
              <span className="mx-2">{addTranslationPrefix('AVAILABLE')}</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('status')}
                value="UNAVAILABLE"
                className="form-radio text-purple-600 focus:ring-purple-500"
              />
              <span className="mx-2">
                {addTranslationPrefix('UNAVAILABLE')}
              </span>
            </label>
          </div>
        </RadioField>

        <RadioField
          label={addTranslationPrefix('OPEN_FOR')}
          error={getErrorMessage(errors.openFor?.message)}
          required
        >
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('openFor')}
                value="FREE"
                className="form-radio text-purple-600 focus:ring-purple-500"
              />
              <span className="mx-2">{addTranslationPrefix('FREE')}</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('openFor')}
                value="PAID"
                className="form-radio text-purple-600 focus:ring-purple-500"
              />
              <span className="mx-2">{addTranslationPrefix('PAID_ONLY')}</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('openFor')}
                value="BOTH"
                className="form-radio text-purple-600 focus:ring-purple-500"
              />
              <span className="mx-2">{addTranslationPrefix('BOTH')}</span>
            </label>
          </div>
        </RadioField>
        <div className="md:col-span-2">
          <FormField
            label={addTranslationPrefix('SKILLS')}
            error={getErrorMessage(errors.skills?.message)}
            className="col-span-2"
          >
            <Select
              isMulti
              options={skillsOptions.map((skill) => ({
                label: t(skill.label),
                value: skill.value,
              }))}
              className="react-select "
              classNamePrefix="react-select"
              onChange={(selected) => {
                setValue(
                  'skills',
                  selected ? selected.map((option) => option!.value) : []
                );
              }}
              value={skillsOptions.map((option) => {
                return watch('skills')?.includes(option.value)
                  ? { value: option.value, label: t(option.label) }
                  : null;
              })}
              placeholder={''}
            />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField
            label={addTranslationPrefix('BIO')}
            error={getErrorMessage(errors.biography?.message)}
            className="col-span-2"
          >
            <div className="space-y-2">
              <div className="flex justify-end">
                <span className="text-sm text-gray-500">
                  {watch('biography')?.length}/300
                </span>
              </div>
              <textarea
                {...register('biography')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                maxLength={300}
              />
            </div>
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
