import { clsx } from 'clsx';
import { GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaFemale, FaMale } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { PerformerDetailsForm } from './PerformerDetailsForm';
import {
  mapPerformerResponseToPerformer,
  Performer,
} from '../../../models/Performer.ts';
import Section from '../../../components/shared/section/Section.tsx';
import { EditButton } from '../../../components/shared/EditButton.tsx';
import { ImageModal } from '../../../components/shared/imageModal';
import { MdMoneyOffCsred, MdOutlineAttachMoney } from 'react-icons/md';
import { FaRegCopy } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { Snackbar } from '../../../components/shared/snackBar/SnackBar.tsx';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import { get_request, patch_request } from '../../../utils/restUtils.ts';
import { format } from 'date-fns';

type PerformerDetailsSectionProps = {
  performer: Performer;
  username: string;
};

export default function PerformerDetailsSection({
  performer: initialPerformer,
  username,
}: PerformerDetailsSectionProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isEditMode, setEditMode } = useEditMode();
  const [performer, setPerformer] = useState(initialPerformer);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });
  const mapFormDataToRequest = (
    formData: Record<string, any>
  ): Record<string, any> => ({
    date_of_birth: formData['dateOfBirth']
      ? format(formData['dateOfBirth'], 'yyyy-MM-dd')
      : null,
    biography: formData['biography'],
    open_for: formData['openFor'],
    status: formData['status'],
    height: formData['height'],
    skills_tags: formData['skills'],
  });

  const handleUpdate = async (formData: any) => {
    try {
      await patch_request(
        `hita/performers/${username}`,
        mapFormDataToRequest(formData)
      );
      const { data: getData } = await get_request(
        `hita/performers/${username}`
      );
      setPerformer(mapPerformerResponseToPerformer(getData.data.performer));
      setEditMode(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isEditMode) {
      setIsEditing(false);
    }
  }, [isEditMode]);
  const handleCopyPath = () => {
    const currentPath = window.location.origin + location.pathname;
    navigator.clipboard
      .writeText(currentPath)
      .then(() => {
        setSnackbar({
          open: true,
          message: t('PERFORMER_PAGE.PERSONAL_INFO.COPIED'),
          type: 'success',
        });
      })
      .catch((err) => {
        console.error('Failed to copy path: ', err);
        setSnackbar({
          open: true,
          message: t('PERFORMER_PAGE.PERSONAL_INFO.COPY_FAILED'),
          type: 'error',
        });
      });
  };

  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'm':
        return <FaMale className="text-blue-500 h-5 w-5" />;
      case 'f':
        return <FaFemale className="text-pink-500 h-5 w-5" />;
      default:
        return null;
    }
  };

  const getOpenForIcon = (openFor: string) => {
    switch (openFor) {
      case 'PAID':
        return <MdOutlineAttachMoney className="w-6 h-6" />;
      case 'FREE':
        return <MdMoneyOffCsred className="w-6 h-6" />;
      default:
        return (
          <>
            <MdOutlineAttachMoney className="w-6 h-6" />
            <MdMoneyOffCsred className="w-6 h-6" />
          </>
        );
    }
  };

  const getGradeOrGraduationYear = ({
    grade,
    graduationYear,
    studyType,
  }: Performer) => {
    const gradeYear = graduationYear
      ? `${t('GRADUATED_IN')}: ${graduationYear}`
      : t(`GRADE_${grade}`);
    return `${gradeYear} (${t(studyType)})`;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!performer.profilePicture) {
    return null;
  }

  return (
    <Section
      title={t('PERFORMER_PAGE.PERSONAL_INFO.PERSONAL_INFO')}
      headerActions={
        <EditButton
          onClick={handleEdit}
          className={`${isEditing ? 'invisible' : ''} ${i18n.language === 'en' ? 'items-start' : 'items-end'}`}
        />
      }
    >
      {isEditing ? (
        <PerformerDetailsForm
          handleUpdate={handleUpdate}
          performer={performer}
          username={username}
          onCancel={handleCancel}
        />
      ) : (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Profile Image */}
          <div
            className="relative cursor-pointer group flex-shrink-0 w-40 h-40 md:w-48 md:h-48"
            onClick={() => setShowImageModal(true)}
          >
            <img
              src={performer.profilePicture}
              alt={performer.name}
              className="w-full h-full rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-300 flex items-center justify-center">
              <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t('VIEW_IMAGE')}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-[495px]">
            <div className={`flex justify-between w-full text-center`}>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                {getGenderIcon(performer.gender)}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
                  {performer.name}{' '}
                  {performer.nickName !== null ? `(${performer.nickName})` : ''}
                </h1>
                {getOpenForIcon(performer.openFor)}
                <div
                  className={clsx(
                    'w-3 h-3 rounded-full flex-shrink-0',
                    performer.status.toLowerCase().includes('unavailable')
                      ? 'bg-red-500'
                      : 'bg-green-500'
                  )}
                  title={
                    performer.status.toLowerCase().includes('unavailable')
                      ? t('NOT_AVAILABLE')
                      : t('AVAILABLE')
                  }
                />
              </div>
              <div className="hover:text-purple-500 cursor-pointer">
                <FaRegCopy
                  className="w-4 h-4 md:w-6 md:h-6"
                  onClick={handleCopyPath}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2 text-gray-600">
              {performer.age && (
                <p className="text-sm md:text-base">
                  {performer.age} {t('YEARS_OLD')}
                </p>
              )}
              {performer.height && (
                <p className="text-sm md:text-base">
                  {performer.height && `${performer.height} ${t('CM')}`}
                </p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">
                  {t(performer.department)} -{' '}
                  {getGradeOrGraduationYear(performer)}
                </span>
              </div>
            </div>

            {performer.skills && performer.skills?.length > 0 && (
              <div className="mt-4 md:mt-6">
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {performer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs md:text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {t(skill)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {performer.biography && (
              <div className="mt-4 md:mt-6">
                <div className="rounded-lg p-4">
                  <p className="text-sm md:text-base text-gray-600 whitespace-pre-wrap break-words">
                    {performer.biography}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ImageModal
        isOpen={showImageModal}
        imageUrl={performer.profilePicture}
        altText={performer.name}
        onClose={() => setShowImageModal(false)}
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
