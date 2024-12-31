import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { ImageUpload } from './ImageUpload';
import { FormField } from '../../../components/shared/forms/FormField.tsx';
import { Gallery } from '../../../models/Performer.ts';

// Define a specific schema for the gallery form
const galleryFormSchema = z.object({
  id: z.number(),
  file: z.instanceof(File).optional(),
  description: z.string(),
  isProfilePicture: z.boolean(),
  imagePath: z.string(),
});

type GalleryFormData = z.infer<typeof galleryFormSchema>;

interface GalleryFormProps {
  image: Gallery;
  onSave: (image: Gallery) => void;
  onCancel: () => void;
  isUploading: boolean;
}

export function GalleryForm({
  image,
  onSave,
  onCancel,
  isUploading,
}: GalleryFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: image,
  });

  const handleImageUpload = (file: File) => {
    setValue('file', file);
  };

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
    >
      <div
        className={`space-y-6 ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ImageUpload
          currentImage={image.imagePath}
          onImageUpload={handleImageUpload}
          error={errors.file?.message}
        />

        <FormField
          label={t('PERFORMER_PAGE.GALLERY_SECTION.IMAGE_DESCRIPTION')}
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
            {t('PERFORMER_PAGE.GALLERY_SECTION.SET_AS_PROFILE_PICTURE')}
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`flex items-center justify-center px-3 py-2 border text-sm font-medium rounded-md ${isUploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
          disabled={isUploading}
        >
          {t('CANCEL')}
        </button>
        <button
          type="submit"
          className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
          disabled={isUploading}
        >
          {t('SAVE')}
        </button>
      </div>
    </form>
  );
}
