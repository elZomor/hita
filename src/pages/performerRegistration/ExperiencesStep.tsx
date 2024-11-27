import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';
import type { PerformerFormData } from '../../types/performer-form';
import { SKILLS_OPTIONS } from '../../types/performer-form';
import { FormField } from '../../components/shared/forms/FormField.tsx';
import { StepButton } from './stepButton.tsx';

interface ExperiencesStepProps {
  onComplete: () => void;
}

export function ExperiencesStep({ onComplete }: ExperiencesStepProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext<PerformerFormData>();
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

  const handleRolesChange = async (
    selected: readonly { value: string; label: string }[],
    index: number
  ) => {
    setValue(
      `experiences.${index}.roles`,
      selected.map((option) => option.value),
      { shouldValidate: true }
    );
    await trigger(`experiences.${index}.roles`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Experiences</h2>
        <button
          type="button"
          onClick={() =>
            append({
              showName: '',
              director: '',
              venue: '',
              roles: [],
              year: currentYear,
              duration: 1,
            })
          }
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No experiences added yet. Click the button above to add one.
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
                  label="Show Name"
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
                  label="Director"
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
                  label="Venue"
                  error={errors.experiences?.[index]?.venue?.message}
                  required
                >
                  <input
                    type="text"
                    {...register(`experiences.${index}.venue`)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label="Roles"
                  error={errors.experiences?.[index]?.roles?.message}
                  required
                >
                  <Select
                    isMulti
                    options={SKILLS_OPTIONS}
                    className="react-select"
                    classNamePrefix="react-select"
                    onChange={(selected) => handleRolesChange(selected, index)}
                    value={SKILLS_OPTIONS.filter((option) =>
                      watch(`experiences.${index}.roles`)?.includes(
                        option.value
                      )
                    )}
                  />
                </FormField>

                <FormField
                  label="Year"
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

                <FormField
                  label="Duration (nights)"
                  error={errors.experiences?.[index]?.duration?.message}
                  required
                >
                  <input
                    type="number"
                    min="1"
                    {...register(`experiences.${index}.duration`, {
                      valueAsNumber: true,
                    })}
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
