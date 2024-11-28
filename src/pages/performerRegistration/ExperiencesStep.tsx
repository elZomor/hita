import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';
import type { PerformerFormData } from '../../types/performer-form';
import { FormField } from '../../components/shared/forms/FormField.tsx';
import { StepButton } from './stepButton.tsx';
import { useTranslation } from 'react-i18next';
import { DropDownOptions } from '../../models/shared.ts';

interface ExperiencesStepProps {
  onComplete: () => void;
  skillsOptions: DropDownOptions[];
}

export function ExperiencesStep({
  onComplete,
  skillsOptions,
}: ExperiencesStepProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PerformerFormData>();
  const { t } = useTranslation();
  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.EXPERIENCE_SECTION.' + text);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })
  );
  const SHOW_TYPES: DropDownOptions[] = [
    { value: 'THEATER', label: addTranslationPrefix('THEATER') },
    { value: 'TV', label: addTranslationPrefix('TV') },
    { value: 'MOVIE', label: addTranslationPrefix('MOVIE') },
    { value: 'RADIO', label: addTranslationPrefix('RADIO') },
    { value: 'DUBBING', label: addTranslationPrefix('DUBBING') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {' '}
          {addTranslationPrefix('EXPERIENCES')}
        </h2>
        <button
          type="button"
          onClick={() =>
            append({
              showName: '',
              director: '',
              venue: '',
              showType: '',
              roles: [],
              year: currentYear,
              duration: null,
            })
          }
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          {addTranslationPrefix('ADD_EXPERIENCE')}
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {addTranslationPrefix('NO_EXPERIENCE')}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="p-6 bg-gray-50 rounded-lg relative">
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={addTranslationPrefix('SHOW_NAME')}
                  error={errors.experiences?.[index]?.showName?.message}
                  required
                >
                  <input
                    type="text"
                    {...register(`experiences.${index}.showName`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </FormField>
                <FormField
                  label={addTranslationPrefix('SHOW_TYPE')}
                  error={errors.experiences?.[index]?.showType?.message}
                  required
                >
                  <Select
                    options={SHOW_TYPES.map((showType) => ({
                      label: t(showType.label),
                      value: showType.value,
                    }))}
                    className="react-select"
                    classNamePrefix="react-select"
                    onChange={(selected) => {
                      setValue(
                        `experiences.${index}.showType`,
                        selected?.value as string
                      );
                    }}
                    value={SHOW_TYPES.map((option) => {
                      return watch(`experiences.${index}.showType`)?.includes(
                        option.value as string
                      )
                        ? { value: option.value, label: t(option.label) }
                        : null;
                    })}
                    placeholder=""
                  />
                </FormField>

                <FormField
                  label={addTranslationPrefix('DIRECTOR')}
                  error={errors.experiences?.[index]?.director?.message}
                  required
                >
                  <input
                    type="text"
                    {...register(`experiences.${index}.director`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label={addTranslationPrefix('YEAR')}
                  error={errors.experiences?.[index]?.year?.message}
                  required
                >
                  <Select
                    options={yearOptions}
                    className="react-select"
                    classNamePrefix="react-select"
                    value={yearOptions.find(
                      (option) =>
                        option.value ===
                        watch(`experiences.${index}.year`)?.toString()
                    )}
                    onChange={(selected) => {
                      setValue(
                        `experiences.${index}.year`,
                        selected ? parseInt(selected.value) : currentYear,
                        { shouldValidate: true }
                      );
                    }}
                  />
                </FormField>
                <div className="md:col-span-2">
                  <FormField
                    label={addTranslationPrefix('ROLES')}
                    error={errors.experiences?.[index]?.roles?.message}
                    required
                  >
                    <Select
                      isMulti
                      options={skillsOptions.map(
                        (skill): DropDownOptions => ({
                          label: t(skill.label),
                          value: skill.value,
                        })
                      )}
                      className="react-select"
                      classNamePrefix="react-select"
                      value={skillsOptions.map((option) => {
                        return watch(`experiences.${index}.roles`)?.includes(
                          option?.value as string
                        )
                          ? { value: option.value, label: t(option.label) }
                          : null;
                      })}
                      onChange={(selected) => {
                        setValue(
                          `experiences.${index}.roles`,
                          selected
                            ? selected.map((option) => option!.value as string)
                            : []
                        );
                      }}
                      placeholder=""
                    />
                  </FormField>
                </div>
                {watch(`experiences.${index}.showType`) !== 'THEATER' ? null : (
                  <>
                    <FormField
                      label={addTranslationPrefix('VENUE')}
                      error={errors.experiences?.[index]?.venue?.message}
                      required={
                        watch(`experiences.${index}.showType`) === 'THEATER'
                      }
                    >
                      <input
                        type="text"
                        {...register(`experiences.${index}.venue`)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </FormField>
                    <FormField
                      label={addTranslationPrefix('DURATION_NIGHTS')}
                      error={errors.experiences?.[index]?.duration?.message}
                      required={
                        watch(`experiences.${index}.showType`) === 'THEATER'
                      } // Only required if showType is 'THEATER'
                    >
                      <input
                        type="number"
                        min="1"
                        {...register(`experiences.${index}.duration`, {
                          setValueAs: (value) =>
                            value === '' || value === null
                              ? undefined
                              : Number(value), // Convert to number or undefined
                        })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </FormField>
                  </>
                )}
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
