import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { publicLinkSchema } from '../../../types/performer-form.ts';
import { FormField } from '../../../components/shared/forms/FormField.tsx';
import { useEffect, useState } from 'react';
import { DropDownOptions } from '../../../models/shared.ts';
import { get_request } from '../../../utils/restUtils.ts';
import { PublicLink } from '../../../models/Performer.ts';

interface PublicLinksFormProps {
  link: PublicLink;
  onSave: (link: PublicLink) => void;
  onCancel: () => void;
}

export function PublicLinksForm({
  link,
  onSave,
  onCancel,
}: PublicLinksFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(publicLinkSchema),
    defaultValues: link,
  });

  const [publicLinkTypes, setPublicLinkTypes] = useState<DropDownOptions[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await get_request('hita/public-channels/types');
      setPublicLinkTypes(
        data.data.map(
          (contactType: string): DropDownOptions => ({
            value: contactType,
            label: contactType,
          })
        )
      );
    };
    fetchData();
  }, []);

  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.PUBLIC_LINKS_SECTION.' + text);
  };

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label={addTranslationPrefix('LINK_NAME')}
          error={errors.linkType?.message}
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
              return watch(`linkType`)?.includes(option.value as string)
                ? { value: option.value, label: t(option.label) }
                : null;
            })}
            onChange={(selected) => {
              setValue(`linkType`, selected?.value as string);
            }}
            placeholder=""
          />
        </FormField>

        <FormField
          label={addTranslationPrefix('LINK_URL')}
          error={errors.linkInfo?.message}
          required
        >
          <input
            type="url"
            {...register(`linkInfo`)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://"
          />
        </FormField>
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
