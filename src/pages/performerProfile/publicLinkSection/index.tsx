import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddButton } from '../../../components/shared/AddButton.tsx';
import Section from '../../../components/shared/section/Section.tsx';
import { PublicLinksForm } from './PublicLinksForm.tsx';
import { PublicLinksCard } from './PublicLinksCard.tsx';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import {
  mapPublicLinksResponseToPublicLinks,
  PublicLink,
} from '../../../models/Performer.ts';
import {
  delete_request,
  get_request,
  patch_request,
  post_request,
} from '../../../utils/restUtils.ts';
import { Modal } from '../../../components/shared/confirmModal/ConfirmModal.tsx';
import { Snackbar } from '../../../components/shared/snackBar/SnackBar.tsx';

interface PublicLinksSectionProps {
  links: PublicLink[];
}

export function PublicLinksSection({
  links: initialLinks,
}: PublicLinksSectionProps) {
  const { isEditMode } = useEditMode();
  const { t } = useTranslation();
  const [links, setLinks] = useState(initialLinks);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentLink, setCurrentLink] = useState<PublicLink | null>(null);
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
    const newLink = {
      id: 0,
      linkType: '',
      linkInfo: '',
    };
    setIsAdding(true);
    setLinks([newLink, ...links]);
    setEditingIndex(0);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentLink(links[index]);
    console.log('index');
    console.log(index);
    console.log(links[index]);
  };

  const mapFormDataToRequest = (
    formData: Record<string, any>
  ): Record<string, any> => ({
    channel_type: formData['linkType'],
    channel_info: formData['linkInfo'],
  });

  const handleSave = async (updatedLink: PublicLink) => {
    try {
      if (currentLink?.id === undefined) {
        await post_request(
          `hita/public-channels`,
          mapFormDataToRequest(updatedLink)
        );
      } else {
        await patch_request(
          `hita/public-channels/${currentLink?.id}`,
          mapFormDataToRequest(updatedLink)
        );
      }

      const { data: getData } = await get_request(`hita/public-channels`);
      setLinks(mapPublicLinksResponseToPublicLinks(getData.data));
      setEditingIndex(null);
      setCurrentLink(null);
      setIsAdding(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (link: PublicLink) => {
    setCurrentLink(link);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await delete_request(`hita/public-channels/${currentLink?.id}`);
      setShowDeleteModal(false);

      const { data: getData } = await get_request(`hita/public-channels`);
      setLinks(mapPublicLinksResponseToPublicLinks(getData.data));
    } catch (e) {
      console.error(e);
    }
    setEditingIndex(null);
    setCurrentLink(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    if (isAdding) {
      setLinks(links.slice(0, -1));
    }
    setEditingIndex(null);
    setCurrentLink(null);
    setIsAdding(false);
  };

  return (
    <Section
      title={t('PERFORMER_PAGE.PUBLIC_LINKS.PUBLIC_LINKS')}
      headerActions={
        <div className="flex gap-2">
          <AddButton
            onClick={handleAdd}
            className={editingIndex !== null ? 'invisible' : ''}
          />
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {links.map((link, index) => {
          if (editingIndex === index) {
            // Show one FormCard when in formMode
            return (
              <div key={index} className="col-span-6">
                <PublicLinksForm
                  link={link}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>
            );
          }

          // Show two cards per row otherwise
          return (
            <div key={index} className="flex justify-center items-center">
              <PublicLinksCard
                link={link}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(link)}
                isEditing={editingIndex !== null}
              />
            </div>
          );
        })}

        {links.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {t('PERFORMER_PAGE.PUBLIC_LINKS.NO_PUBLIC_LINKS')}
            </p>
            {isEditMode && (
              <button
                onClick={handleAdd}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                {t('PERFORMER_PAGE.PUBLIC_LINKS.ADD_FIRST_LINK')}
              </button>
            )}
          </div>
        )}
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t('PERFORMER_PAGE.PUBLIC_LINKS.DELETE_TITLE')}
        message={t('PERFORMER_PAGE.PUBLIC_LINKS.DELETE_FORM')}
        confirmText={t('PERFORMER_PAGE.PUBLIC_LINKS.DELETE_CONFIRM')}
        cancelText={t('PERFORMER_PAGE.PUBLIC_LINKS.DELETE_CANCEL')}
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
