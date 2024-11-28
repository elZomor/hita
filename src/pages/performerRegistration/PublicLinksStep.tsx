import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';
import type { PerformerFormData } from '../../types/performer-form';
import { FormField } from '../../components/shared/forms/FormField.tsx';
import { StepButton } from './stepButton.tsx';
import { DropDownOptions } from '../../models/shared.ts';
import { useTranslation } from 'react-i18next';

interface PublicLinksStepProps {
  onComplete: (data: PerformerFormData) => void;
  isLastStep?: boolean;
  publicLinkTypes: DropDownOptions[];
}

export function PublicLinksStep({
  onComplete,
  isLastStep,
  publicLinkTypes,
}: PublicLinksStepProps) {
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useFormContext<PerformerFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'publicLinks',
  });
  const { t, i18n } = useTranslation();

  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.PUBLIC_LINKS_SECTION.' + text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {addTranslationPrefix('PUBLIC_LINKS')}
        </h2>
        <button
          type="button"
          onClick={() =>
            append({
              linkType: '',
              linkInfo: '',
            })
          }
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          {addTranslationPrefix('ADD_LINK')}
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {addTranslationPrefix('NO_PUBLIC_LINKS')}
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
                  label={addTranslationPrefix('LINK_NAME')}
                  error={errors.publicLinks?.[index]?.linkType?.message}
                  required
                >
                  <Select
                    options={publicLinkTypes.map((publicLinkType) => ({
                      label: t(publicLinkType.label),
                      value: publicLinkType.value,
                    }))}
                    className="react-select"
                    classNamePrefix="react-select"
                    value={publicLinkTypes.map((option) => {
                      return watch(`publicLinks.${index}.linkType`)?.includes(
                        option.value as string
                      )
                        ? { value: option.value, label: t(option.label) }
                        : null;
                    })}
                    onChange={(selected) => {
                      setValue(
                        `publicLinks.${index}.linkType`,
                        selected?.value as string
                      );
                    }}
                    placeholder=""
                  />
                </FormField>

                <FormField
                  label={addTranslationPrefix('LINK_URL')}
                  error={errors.publicLinks?.[index]?.linkInfo?.message}
                  required
                >
                  <input
                    type="url"
                    {...register(`publicLinks.${index}.linkInfo`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://"
                  />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <StepButton
          onClick={handleSubmit(onComplete)}
          isLastStep={isLastStep}
        />
      </div>
    </div>
  );
}
