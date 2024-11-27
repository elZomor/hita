import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';
import type { PerformerFormData } from '../../types/performer-form';
import { CONTACT_TYPES } from '../../types/performer-form';
import { FormField } from '../../components/shared/forms/FormField.tsx';
import { StepButton } from './stepButton.tsx';

interface ContactDetailsStepProps {
  onComplete: () => void;
}

export function ContactDetailsStep({ onComplete }: ContactDetailsStepProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
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
          Add Contact
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
            Keep all contact details private
          </span>
        </label>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No contact details added yet. Click the button above to add one.
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
                  label="Contact Type"
                  error={
                    errors.contactSection?.details?.[index]?.contactType
                      ?.message
                  }
                  required
                >
                  <Select
                    options={CONTACT_TYPES}
                    className="react-select"
                    classNamePrefix="react-select"
                    value={CONTACT_TYPES.find(
                      (option) =>
                        option.value ===
                        watch(`contactSection.details.${index}.contactType`)
                    )}
                    onChange={(selected) => {
                      setValue(
                        `contactSection.details.${index}.contactType`,
                        selected ? selected.value : ''
                      );
                    }}
                  />
                </FormField>

                <FormField
                  label="Contact Info"
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
