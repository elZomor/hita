import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AchievementCard } from './AchievementCard';
import { AchievementForm } from './AchievementForm';
import Section from '../../../components/shared/section/Section.tsx';
import { AddButton } from '../../../components/shared/AddButton.tsx';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import {
  Achievement,
  mapAchievementsResponseToAchievements,
} from '../../../models/Performer.ts';
import {
  delete_request,
  get_request,
  patch_request,
  post_request,
} from '../../../utils/restUtils.ts';
import { Modal } from '../../../components/shared/confirmModal/ConfirmModal.tsx';
import { Snackbar } from '../../../components/shared/snackBar/SnackBar.tsx';

interface AchievementSectionProps {
  achievements: Achievement[];
}

export default function AchievementSection({
  achievements: initialAchievements,
}: AchievementSectionProps) {
  const { isEditMode } = useEditMode();
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState(initialAchievements);
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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
    const newAchievement = {
      id: 0,
      rank: '',
      field: '',
      showName: '',
      festivalName: '',
      year: new Date().getFullYear(),
    };
    setIsAdding(true);
    setAchievements([newAchievement, ...achievements]);
    setEditingIndex(0);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentAchievement(achievements[index]);
  };

  const mapFormDataToRequest = (
    formData: Record<string, any>
  ): Record<string, any> => ({
    position: formData['rank'],
    field: formData['field'],
    show_name: formData['showName'],
    festival_name: formData['festivalName'],
    year: formData['year'],
  });

  const handleSave = async (updatedAchievement: Achievement) => {
    try {
      console.log('currentAchievement');
      console.log(currentAchievement);
      if (currentAchievement?.id === undefined) {
        await post_request(
          `hita/achievements`,
          mapFormDataToRequest(updatedAchievement)
        );
      } else {
        await patch_request(
          `hita/achievements/${currentAchievement?.id}`,
          mapFormDataToRequest(updatedAchievement)
        );
      }
      const { data: getData } = await get_request(`hita/achievements`);
      setAchievements(mapAchievementsResponseToAchievements(getData.data));
      setEditingIndex(null);
      setCurrentAchievement(null);
      setIsAdding(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (achievement: Achievement) => {
    console.log('achievement');
    console.log(achievement);
    setCurrentAchievement(achievement);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await delete_request(`hita/achievements/${currentAchievement?.id}`);
      setShowDeleteModal(false);

      const { data: getData } = await get_request(`hita/achievements`);
      setEditingIndex(null);
      setAchievements(mapAchievementsResponseToAchievements(getData.data));
    } catch (e) {
      console.error(e);
    }
    setEditingIndex(null);
    setCurrentAchievement(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    if (isAdding) {
      setAchievements(achievements.slice(1));
    }
    setEditingIndex(null);
    setCurrentAchievement(null);
    setIsAdding(false);
  };

  return (
    <Section
      title={t('PERFORMER_PAGE.ACHIEVEMENT.ACHIEVEMENTS')}
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
          {achievements.map((achievement, index) => {
            if (editingIndex === index) {
              // Show one FormCard when in formMode
              return (
                <div key={index} className="col-span-1 md:col-span-2">
                  <AchievementForm
                    achievement={achievement}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>
              );
            }

            // Show two cards per row otherwise
            return (
              <div key={index}>
                <AchievementCard
                  achievement={achievement}
                  onEdit={() => handleEdit(index)}
                  onDelete={() => handleDelete(achievement)}
                  isEditing={editingIndex !== null}
                />
              </div>
            );
          })}
        </div>
        {achievements.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {t('PERFORMER_PAGE.ACHIEVEMENT.NO_ACHIEVEMENTS')}
            </p>
            {isEditMode && (
              <button
                onClick={handleAdd}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('PERFORMER_PAGE.ACHIEVEMENT.ADD_FIRST_ACHIEVEMENT')}
              </button>
            )}
          </div>
        )}
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t('PERFORMER_PAGE.ACHIEVEMENT.DELETE_TITLE')}
        message={t('PERFORMER_PAGE.ACHIEVEMENT.DELETE_FORM')}
        confirmText={t('PERFORMER_PAGE.ACHIEVEMENT.DELETE_CONFIRM')}
        cancelText={t('PERFORMER_PAGE.ACHIEVEMENT.DELETE_CANCEL')}
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
