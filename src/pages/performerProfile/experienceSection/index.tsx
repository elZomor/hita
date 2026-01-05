import Section from '../../../components/shared/section/Section.tsx';
import {
  Experience,
  mapExperienceResponseToExperience,
} from '../../../models/Performer.ts';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { AddButton } from '../../../components/shared/AddButton.tsx';
import { ExperienceCard } from './ExperienceCard.tsx';
import { ExperienceForm } from './ExperienceForm.tsx';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import {
  delete_request,
  get_request,
  patch_request,
  post_request,
} from '../../../utils/restUtils.ts';
import { Modal } from '../../../components/shared/confirmModal/ConfirmModal.tsx';
import { Snackbar } from '../../../components/shared/snackBar/SnackBar.tsx';

const FIELD_ERROR_TRANSLATIONS: Record<string, string> = {
  show_name: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.SHOW_NAME_MAX',
  role_name: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.ROLE_NAME_MAX',
  role_brief: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.ROLE_BRIEF_MAX',
  director: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.DIRECTOR_MAX',
  venue: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.VENUE_MAX',
  festival_name: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.FESTIVAL_NAME_MAX',
  producer: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.PRODUCER_MAX',
};

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({
  experiences: initialExperiences,
}: ExperienceSectionProps) {
  const { isEditMode } = useEditMode();
  const { t } = useTranslation();
  const [experiences, setExperiences] =
    useState<Experience[]>(initialExperiences);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });
  const [serverErrors, setServerErrors] = useState<Record<
    string,
    string[]
  > | null>(null);

  const handleAdd = () => {
    const newExperience: Experience = {
      id: 0,
      showName: '',
      showType: 'THEATER',
      director: '',
      year: new Date().getFullYear(),
      roles: [],
      venue: '',
      duration: undefined,
      producer: '',
      brief: '',
      roleName: '',
      festivalName: '',
    };
    setIsAdding(true);
    setExperiences([newExperience, ...experiences]);
    setEditingIndex(0);
    setServerErrors(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentExperience(experiences[index]);
    setServerErrors(null);
  };
  const mapFormDataToRequest = (
    formData: Record<string, any>
  ): Record<string, any> => ({
    show_name: formData['showName'],
    show_type: formData['showType'],
    director: formData['director'],
    year: formData['year'],
    roles: formData['roles'],
    venue: formData['venue'],
    producer: formData['producer'],
    role_name: formData['roleName'],
    role_brief: formData['brief'],
    duration: formData['duration'],
    festival_name: formData['festivalName'],
  });

  const handleSave = async (updatedExperience: Experience) => {
    try {
      if (currentExperience?.id === undefined) {
        await post_request(
          `hita/experiences`,
          mapFormDataToRequest(updatedExperience)
        );
      } else {
        await patch_request(
          `hita/experiences/${currentExperience?.id}`,
          mapFormDataToRequest(updatedExperience)
        );
      }

      const { data: getData } = await get_request(`hita/experiences`);
      setExperiences(mapExperienceResponseToExperience(getData.data));
      setEditingIndex(null);
      setCurrentExperience(null);
      setIsAdding(false);
      setServerErrors(null);
    } catch (error) {
      const axiosError = error as AxiosError<{
        data?: Record<string, string[]>;
        message?: string;
      }>;
      const responseData = axiosError.response?.data;
      if (responseData?.data) {
        const transformedErrors: Record<string, string[]> = {};
        Object.entries(responseData.data).forEach(([field, messages]) => {
          if (FIELD_ERROR_TRANSLATIONS[field]) {
            transformedErrors[field] = [FIELD_ERROR_TRANSLATIONS[field]];
          } else {
            transformedErrors[field] = messages;
          }
        });
        setServerErrors(transformedErrors);
      } else {
        setServerErrors(null);
      }
      const backendMessage =
        responseData?.message === 'Data not create successfully!'
          ? t('PERFORMER_PAGE.EXPERIENCE.DATA_NOT_CREATED')
          : responseData?.message;
      setSnackbar({
        open: true,
        message: backendMessage || t('PERFORMER_PAGE.EXPERIENCE.SAVE_ERROR'),
        type: 'error',
      });
    }
  };

  const handleDelete = (experience: Experience) => {
    setCurrentExperience(experience);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await delete_request(`hita/experiences/${currentExperience?.id}`);
      setShowDeleteModal(false);

      const { data: getData } = await get_request(`hita/experiences`);
      setEditingIndex(null);
      setExperiences(mapExperienceResponseToExperience(getData.data));
    } catch {
      // No Implementation
    }
    setEditingIndex(null);
    setCurrentExperience(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    if (isAdding) {
      setExperiences(experiences.slice(1));
    }
    setEditingIndex(null);
    setCurrentExperience(null);
    setIsAdding(false);
    setServerErrors(null);
  };

  return (
    <Section
      title={`${t('PERFORMER_PAGE.EXPERIENCE.EXPERIENCES')} (${experiences.length})`}
      headerActions={
        <div className="flex gap-2">
          <AddButton
            onClick={handleAdd}
            className={editingIndex !== null ? 'invisible' : ''}
          />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {experiences.map((experience, index) => {
            if (editingIndex === index) {
              // Show one FormCard when in formMode
              return (
                <div key={index} className="md:col-span-2">
                  <ExperienceForm
                    experience={experience}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    serverErrors={serverErrors}
                    onShowTypeChange={() => setServerErrors(null)}
                  />
                </div>
              );
            }

            // Show two cards per row otherwise
            return (
              <div key={index} className="md:h-180">
                <ExperienceCard
                  experience={experience}
                  onEdit={() => handleEdit(index)}
                  onDelete={() => handleDelete(experience)}
                  isEditing={editingIndex !== null}
                />
              </div>
            );
          })}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {t('PERFORMER_PAGE.EXPERIENCE.NO_EXPERIENCES')}
            </p>
            {isEditMode && (
              <button
                onClick={handleAdd}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('PERFORMER_PAGE.EXPERIENCE.ADD_FIRST_EXPERIENCE')}
              </button>
            )}
          </div>
        )}
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t('PERFORMER_PAGE.EXPERIENCE.DELETE_TITLE')}
        message={t('PERFORMER_PAGE.EXPERIENCE.DELETE_FORM')}
        confirmText={t('PERFORMER_PAGE.EXPERIENCE.DELETE_CONFIRM')}
        cancelText={t('PERFORMER_PAGE.EXPERIENCE.DELETE_CANCEL')}
      />
      <Snackbar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Section>
  );
}
