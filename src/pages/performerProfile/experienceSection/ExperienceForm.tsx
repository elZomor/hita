import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema } from '../../../types/performer-form.ts';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { Experience } from '../../../models/Performer.ts';
import { FormField } from '../../../components/shared/forms/FormField.tsx';
import { DropDownOptions } from '../../../models/shared.ts';
import { useEffect, useState } from 'react';
import { get_request } from '../../../utils/restUtils.ts';

interface ExperienceFormProps {
  experience: Experience;
  onSave: (experience: Experience) => void;
  onCancel: () => void;
}

export function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: ExperienceFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      ...experience,
      duration: experience.duration || undefined,
    },
  });
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

  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.EXPERIENCE_SECTION.' + text);
  };

  const SHOW_TYPES: DropDownOptions[] = [
    { value: 'THEATER', label: addTranslationPrefix('THEATER') },
    { value: 'TV', label: addTranslationPrefix('TV') },
    { value: 'MOVIE', label: addTranslationPrefix('MOVIE') },
    { value: 'RADIO', label: addTranslationPrefix('RADIO') },
    { value: 'DUBBING', label: addTranslationPrefix('DUBBING') },
  ];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1980 + 1 },
    (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString(),
    })
  );

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label={addTranslationPrefix('SHOW_NAME')}
          error={errors.showName?.message}
          required
        >
          <input
            type="text"
            {...register(`showName`)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </FormField>

        <FormField
          label={addTranslationPrefix('SHOW_TYPE')}
          error={errors.showType?.message}
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
              setValue(`showType`, selected?.value as string);
            }}
            value={SHOW_TYPES.map((option) => {
              return watch(`showType`)?.includes(option.value as string)
                ? { value: option.value, label: t(option.label) }
                : null;
            })}
            placeholder=""
          />
        </FormField>

        <FormField
          label={addTranslationPrefix('DIRECTOR')}
          error={errors.director?.message}
          required
        >
          <input
            type="text"
            {...register(`director`)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </FormField>

        <FormField
          label={addTranslationPrefix('YEAR')}
          error={errors.year?.message}
          required
        >
          <Select
            options={yearOptions}
            className="react-select"
            classNamePrefix="react-select"
            value={yearOptions.find(
              (option) => option.value === watch(`year`)?.toString()
            )}
            onChange={(selected) => {
              setValue(
                `year`,
                selected ? parseInt(selected.value) : currentYear,
                { shouldValidate: true }
              );
            }}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField
            label={addTranslationPrefix('ROLES')}
            error={errors.roles?.message}
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
                return watch(`roles`)?.includes(option?.value as string)
                  ? { value: option.value, label: t(option.label) }
                  : null;
              })}
              onChange={(selected) => {
                setValue(
                  `roles`,
                  selected
                    ? selected.map((option) => option!.value as string)
                    : []
                );
              }}
              placeholder=""
            />
          </FormField>
        </div>

        {watch(`showType`) !== 'THEATER' ? null : (
          <>
            <FormField
              label={addTranslationPrefix('VENUE')}
              error={errors.venue?.message}
              required={watch(`showType`) === 'THEATER'}
            >
              <input
                type="text"
                {...register(`venue`)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </FormField>
            <FormField
              label={addTranslationPrefix('DURATION_NIGHTS')}
              error={errors.duration?.message}
              required={watch(`showType`) === 'THEATER'} // Only required if showType is 'THEATER'
            >
              <input
                type="number"
                min="1"
                {...register(`duration`, {
                  setValueAs: (value) =>
                    value === '' || value === null ? undefined : Number(value), // Convert to number or undefined
                })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </FormField>
          </>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
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
