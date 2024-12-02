import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { clsx } from 'clsx';
import { contactDetailSchema } from '../../../types/performer-form.ts';
import { SelectField } from '../../../components/shared/forms/SelectField.tsx';
import { FormField } from '../../../components/shared/forms/FormField.tsx';

interface ContactDetailsFormProps {
  contact: {
    contactType: string;
    contactInfo: string;
  };
  onSave: (contact: { contactType: string; contactInfo: string }) => void;
  onCancel: () => void;
}

const CONTACT_TYPES = [
  { value: 'EMAIL', label: 'EMAIL' },
  { value: 'PHONE', label: 'PHONE' },
  { value: 'WHATSAPP', label: 'WHATSAPP' },
  { value: 'TELEGRAM', label: 'TELEGRAM' },
  { value: 'FACEBOOK', label: 'FACEBOOK' },
  { value: 'INSTAGRAM', label: 'INSTAGRAM' },
  { value: 'LINKEDIN', label: 'LINKEDIN' },
  { value: 'TWITTER', label: 'TWITTER' },
  { value: 'YOUTUBE', label: 'YOUTUBE' },
  { value: 'WEBSITE', label: 'WEBSITE' },
];

export function ContactDetailsForm({
  contact,
  onSave,
  onCancel,
}: ContactDetailsFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactDetailSchema),
    defaultValues: contact,
  });

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label={t('CONTACT_TYPE')}
          error={errors.contactType?.message}
          required
        >
          <Controller
            name="contactType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={CONTACT_TYPES}
                getOptionLabel={(option) => t(option.label)}
                getOptionValue={(option) => option.value}
                className="react-select"
                classNamePrefix="react-select"
                onChange={(selected) => field.onChange(selected?.value)}
                value={CONTACT_TYPES.find(
                  (option) => option.value === field.value
                )}
              />
            )}
          />
        </SelectField>

        <FormField
          label={t('CONTACT_INFO')}
          error={errors.contactInfo?.message}
          required
        >
          <input
            type="text"
            {...register('contactInfo')}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.contactInfo && 'border-red-300'
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
