import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { ImageUpload } from './ImageUpload';
import { FormField } from '../../../components/shared/forms/FormField.tsx';

// Define a specific schema for the gallery form
const galleryFormSchema = z.object({
  file: z.instanceof(File).optional(),
  description: z.string().optional(),
  isProfilePicture: z.boolean(),
});

type GalleryFormData = z.infer<typeof galleryFormSchema>;

interface GalleryFormProps {
  image: {
    imagePath: string;
    description?: string;
    isProfilePicture?: boolean;
  };
  onSave: (image: {
    file?: File;
    description?: string;
    isProfilePicture: boolean;
  }) => void;
  onCancel: () => void;
}

export function GalleryForm({ image, onSave, onCancel }: GalleryFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      description: image.description,
      isProfilePicture: image.isProfilePicture || false,
    },
  });

  const handleImageUpload = (file: File) => {
    setValue('file', file);
  };

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      <div className="space-y-6">
        <ImageUpload
          currentImage={image.imagePath}
          onImageUpload={handleImageUpload}
          error={errors.file?.message}
        />

        <FormField
          label={t('IMAGE_DESCRIPTION')}
          error={errors.description?.message}
        >
          <textarea
            {...register('description')}
            rows={3}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.description && 'border-red-300'
            )}
          />
        </FormField>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('isProfilePicture')}
            id="isProfilePicture"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isProfilePicture"
            className="ml-2 block text-sm text-gray-900"
          >
            {t('SET_AS_PROFILE_PICTURE')}
          </label>
        </div>
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
