import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2, X } from 'lucide-react';
import type { PerformerFormData } from '../../types/performer-form';
import { FormField } from '../../components/shared/forms/FormField.tsx';
import { StepButton } from '../../components/shared/stepButton.tsx';
import { useTranslation } from 'react-i18next';

interface ProfileImagesStepProps {
  onComplete: () => void;
}

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProfileImagesStep({ onComplete }: ProfileImagesStepProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PerformerFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'gallerySection.images',
  });
  const { t, i18n } = useTranslation();

  const addTranslationPrefix = (text: string) => {
    return t('PERFORMER_REG.GALLERY_SECTION.' + text);
  };

  const handleRemoveImage = (index: number) => {
    remove(index);
    if (fields.length <= 1) return;
    const images = watch('gallerySection.images');
    if (!images.some((img) => img.isProfilePicture)) {
      setValue('gallerySection.images.0.isProfilePicture', true);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPEG, PNG and WebP images are supported');
      return;
    }

    setValue(`gallerySection.images.${index}.file`, file, {
      shouldValidate: true,
    });
  };

  const handleProfilePictureChange = (index: number) => {
    // Uncheck all other profile pictures
    fields.forEach((_, i) => {
      setValue(`gallerySection.images.${i}.isProfilePicture`, i === index);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {addTranslationPrefix('GALLERY')}
        </h2>
        {fields.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() =>
              append({
                file: new File([], ''),
                description: '',
                isProfilePicture: fields.length === 0,
              })
            }
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            {addTranslationPrefix('ADD_IMAGE')}
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            {...register('gallerySection.keepProtected')}
            className="form-checkbox text-purple-600 rounded focus:ring-purple-500"
          />
          <span className="ml-2 text-gray-700">
            {addTranslationPrefix('PROTECT_GALLERY')}
          </span>
        </label>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{addTranslationPrefix('NO_IMAGES')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="p-6 bg-gray-50 rounded-lg relative">
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className={`absolute top-4 ${i18n.language === 'ar' ? 'left-4' : 'right-4'} p-1 text-gray-400 hover:text-red-500`}
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="space-y-6 mt-6">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileChange(e, index)}
                    className="hidden"
                    id={`image-${index}`}
                  />
                  <label
                    htmlFor={`image-${index}`}
                    className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-500"
                  >
                    {watch(`gallerySection.images.${index}.file`)?.name ? (
                      <div className="flex items-center justify-between px-4">
                        <span className="text-gray-600">
                          {watch(`gallerySection.images.${index}.file`)?.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setValue(
                              `gallerySection.images.${index}.file`,
                              new File([], ''),
                              { shouldValidate: true }
                            );
                          }}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        {addTranslationPrefix('CLICK_TO_UPLOAD')}
                      </div>
                    )}
                  </label>
                </div>

                <FormField
                  label={addTranslationPrefix('DESCRIPTION')}
                  error={
                    errors.gallerySection?.images?.[index]?.description?.message
                  }
                >
                  <div className="space-y-2">
                    <div className="flex justify-end">
                      <span className="text-sm text-gray-500">
                        {watch(`gallerySection.images.${index}.description`)
                          ?.length || 0}
                        /255
                      </span>
                    </div>
                    <textarea
                      {...register(
                        `gallerySection.images.${index}.description`
                      )}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      maxLength={255}
                    />
                  </div>
                </FormField>

                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="profilePicture"
                      checked={watch(
                        `gallerySection.images.${index}.isProfilePicture`
                      )}
                      onChange={() => handleProfilePictureChange(index)}
                      className="form-radio text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">
                      {addTranslationPrefix('SET_PROFILE_PICTURE')}
                    </span>
                  </label>
                </div>
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
