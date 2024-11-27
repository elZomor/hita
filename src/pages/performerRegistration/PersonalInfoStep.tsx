import { useFormContext } from 'react-hook-form';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ar } from 'date-fns/locale/ar';
import Select from 'react-select';
import { CalendarIcon } from 'lucide-react';
import type { PerformerFormData } from '../../types/performer-form';
import 'react-datepicker/dist/react-datepicker.css';
import { FormField } from '../../components/shared/forms/FormField.tsx';
import { RadioField } from '../../components/shared/forms/RadioField.tsx';
import { StepButton } from './stepButton.tsx';
import { useTranslation } from 'react-i18next';
import { DropDownOptions } from '../../models/shared.ts';

interface PersonalInfoStepProps {
  onComplete: () => void;
  skillsOptions: DropDownOptions[];
}

export function PersonalInfoStep({
  onComplete,
  skillsOptions,
}: PersonalInfoStepProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PerformerFormData>();
  const bio = watch('personalInfo.bio') || '';
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16);
  const { t, i18n } = useTranslation();
  registerLocale(i18n.language, ar);

  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.PERSONAL_INFO.' + text);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {addTranslationPrefix('PERSONAL_INFO')}
      </h2>

      <FormField
        label={addTranslationPrefix('DATE_OF_BIRTH')}
        error={errors.personalInfo?.dateOfBirth?.message}
      >
        <div className="relative">
          <DatePicker
            locale={i18n.language}
            dateFormat="dd/MM/YYYY"
            selected={watch('personalInfo.dateOfBirth')}
            onChange={(date) => setValue('personalInfo.dateOfBirth', date!)}
            maxDate={maxDate}
            showYearDropdown
            dropdownMode="select"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </FormField>

      <FormField
        label={addTranslationPrefix('SKILLS')}
        error={errors.personalInfo?.skills?.message}
      >
        <Select
          isMulti
          options={skillsOptions.map((skill) => ({
            label: t(skill.label),
            value: skill.value,
          }))}
          className="react-select"
          classNamePrefix="react-select"
          onChange={(selected) => {
            setValue(
              'personalInfo.skills',
              selected ? selected.map((option) => option!.value) : []
            );
          }}
          value={skillsOptions.map((option) => {
            return watch('personalInfo.skills')?.includes(option.value)
              ? { value: option.value, label: t(option.label) }
              : null;
          })}
          placeholder={''}
        />
      </FormField>

      <FormField
        label={addTranslationPrefix('HEIGHT')}
        error={errors.personalInfo?.height?.message}
      >
        <div className="space-y-2">
          <input
            type="text"
            {...register('personalInfo.height', {
              setValueAs: (value) => (value === '' ? undefined : Number(value)),
            })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={3}
          />
        </div>
      </FormField>

      <FormField
        label={addTranslationPrefix('BIO')}
        error={errors.personalInfo?.bio?.message}
      >
        <div className="space-y-2">
          <div className="flex justify-end">
            <span className="text-sm text-gray-500">{bio.length}/300</span>
          </div>
          <textarea
            {...register('personalInfo.bio')}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={4}
            maxLength={300}
          />
        </div>
      </FormField>

      <RadioField
        label={addTranslationPrefix('STATUS')}
        error={errors.personalInfo?.status?.message}
        required
      >
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('personalInfo.status')}
              value="AVAILABLE"
              className="form-radio text-purple-600 focus:ring-purple-500"
            />
            <span className="mx-2">{addTranslationPrefix('AVAILABLE')}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('personalInfo.status')}
              value="UNAVAILABLE"
              className="form-radio text-purple-600 focus:ring-purple-500"
            />
            <span className="mx-2">{addTranslationPrefix('UNAVAILABLE')}</span>
          </label>
        </div>
      </RadioField>

      <RadioField
        label={addTranslationPrefix('OPEN_FOR')}
        error={errors.personalInfo?.openFor?.message}
        required
      >
        <div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('personalInfo.openFor')}
              value="FREE"
              className="form-radio text-purple-600 focus:ring-purple-500"
            />
            <span className="mx-2">{addTranslationPrefix('FREE')}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('personalInfo.openFor')}
              value="PAID"
              className="form-radio text-purple-600 focus:ring-purple-500"
            />
            <span className="mx-2">{addTranslationPrefix('PAID_ONLY')}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('personalInfo.openFor')}
              value="BOTH"
              className="form-radio text-purple-600 focus:ring-purple-500"
            />
            <span className="mx-2">{addTranslationPrefix('BOTH')}</span>
          </label>
        </div>
      </RadioField>

      <div className="flex justify-end">
        <StepButton onClick={onComplete} />
      </div>
    </div>
  );
}
