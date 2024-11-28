import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';
import type { PerformerFormData } from '../../types/performer-form';
import { FormField } from '../../components/shared/forms/FormField.tsx';
import { StepButton } from './stepButton.tsx';
import { DropDownOptions } from '../../models/shared.ts';
import { useTranslation } from 'react-i18next';

interface ContactDetailsStepProps {
  onComplete: () => void;
  contactTypes: DropDownOptions[];
}

export function ContactDetailsStep({
  onComplete,
  contactTypes,
}: ContactDetailsStepProps) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PerformerFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactSection.details',
  });
  const { t, i18n } = useTranslation();
  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.CONTACT_DETAILS_SECTION.' + text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {addTranslationPrefix('CONTACT_DETAILS')}
        </h2>
        <button
          type="button"
          onClick={() =>
            append({
              contactType: '',
              contactInfo: '',
            })
          }
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          {addTranslationPrefix('ADD_CONTACT_DETAILS')}
        </button>
      </div>

      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            {...register('contactSection.keepProtected')}
            className="form-checkbox text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="ml-2 text-gray-700">
            {addTranslationPrefix('PROTECT_CONTACT_DETAILS')}
          </span>
        </label>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {addTranslationPrefix('NO_CONTACT_DETAILS')}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="p-6 bg-gray-50 rounded-lg relative">
              <button
                type="button"
                onClick={() => remove(index)}
                className={`absolute top-4 ${i18n.language === 'ar' ? 'left-4' : 'right-4'} p-1 text-gray-400 hover:text-red-500`}
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={addTranslationPrefix('CONTACT_TYPE')}
                  error={
                    errors.contactSection?.details?.[index]?.contactType
                      ?.message
                  }
                  required
                >
                  <Select
                    options={contactTypes.map((contactType) => ({
                      label: t(contactType.label),
                      value: contactType.value,
                    }))}
                    className="react-select"
                    classNamePrefix="react-select"
                    value={contactTypes.map((option) => {
                      return watch(
                        `contactSection.details.${index}.contactType`
                      )?.includes(option.value as string)
                        ? { value: option.value, label: t(option.label) }
                        : null;
                    })}
                    onChange={(selected) => {
                      setValue(
                        `contactSection.details.${index}.contactType`,
                        selected?.value as string
                      );
                    }}
                    placeholder=""
                  />
                </FormField>

                <FormField
                  label={addTranslationPrefix('CONTACT_INFO')}
                  error={
                    errors.contactSection?.details?.[index]?.contactInfo
                      ?.message
                  }
                  required
                >
                  <input
                    type="text"
                    {...register(`contactSection.details.${index}.contactInfo`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <StepButton onClick={onComplete} />
      </div>
    </div>
  );
}
