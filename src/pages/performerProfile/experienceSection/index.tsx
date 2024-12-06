import Section from '../../../components/shared/section/Section.tsx';
import {
  Experience,
  mapExperienceResponseToExperience,
} from '../../../models/Performer.ts';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
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
    };
    setIsAdding(true);
    setExperiences([newExperience, ...experiences]);
    setEditingIndex(0);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentExperience(experiences[index]);
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
    duration: formData['duration'],
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
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
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
  };

  return (
    <Section
      title={t('PERFORMER_PAGE.EXPERIENCE.EXPERIENCES')}
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
                <div key={index} className="col-span-2">
                  <ExperienceForm
                    experience={experience}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>
              );
            }

            // Show two cards per row otherwise
            return (
              <div key={index} className="h-180">
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
