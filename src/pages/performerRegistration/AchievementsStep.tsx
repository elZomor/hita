import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';
import type { PerformerFormData } from '../../types/performer-form';
import { FormField } from '../../components/shared/forms/FormField.tsx';
import { StepButton } from './stepButton.tsx';
import { useTranslation } from 'react-i18next';

interface AchievementsStepProps {
  onComplete: () => void;
}

export function AchievementsStep({ onComplete }: AchievementsStepProps) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PerformerFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'achievements',
  });
  const { t, i18n } = useTranslation();

  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.ACHIEVEMENTS_SECTION.' + text);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {addTranslationPrefix('ACHIEVEMENTS')}
        </h2>
        <button
          type="button"
          onClick={() =>
            append({
              rank: '',
              field: '',
              showName: '',
              festivalName: '',
              year: currentYear,
            })
          }
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          {addTranslationPrefix('ADD_ACHIEVEMENT')}
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {addTranslationPrefix('NO_ACHIEVEMENTS')}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="p-6 bg-gray-50 rounded-lg relative">
              <button
                type="button"
                onClick={() => remove(index)}
                className={`absolute top-4 ${i18n.language === 'ar' ? 'left-4' : 'right-4'} p-1  text-gray-400 hover:text-red-500`}
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={addTranslationPrefix('RANK')}
                  error={errors.achievements?.[index]?.rank?.message}
                  required
                >
                  <input
                    type="text"
                    {...register(`achievements.${index}.rank`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label={addTranslationPrefix('FIELD')}
                  error={errors.achievements?.[index]?.field?.message}
                  required
                >
                  <input
                    type="text"
                    {...register(`achievements.${index}.field`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label={addTranslationPrefix('SHOW_NAME')}
                  error={errors.achievements?.[index]?.showName?.message}
                  required
                >
                  <input
                    type="text"
                    {...register(`achievements.${index}.showName`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label={addTranslationPrefix('FESTIVAL_NAME')}
                  error={errors.achievements?.[index]?.festivalName?.message}
                  required
                >
                  <input
                    type="text"
                    {...register(`achievements.${index}.festivalName`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label={addTranslationPrefix('YEAR')}
                  error={errors.achievements?.[index]?.year?.message}
                  required
                >
                  <Select
                    options={yearOptions}
                    className="react-select"
                    classNamePrefix="react-select"
                    value={yearOptions.find(
                      (option) =>
                        option.value ===
                        watch(`achievements.${index}.year`)?.toString()
                    )}
                    onChange={(selected) => {
                      setValue(
                        `achievements.${index}.year`,
                        selected ? parseInt(selected.value) : currentYear
                      );
                    }}
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
