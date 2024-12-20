import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactDetailsCard } from './ContactDetailsCard';
import { ContactDetailsForm } from './ContactDetailsForm';
import Section from '../../../components/shared/section/Section.tsx';
import { AddButton } from '../../../components/shared/AddButton.tsx';
import { useEditMode } from '../../../contexts/EditModeContext.tsx';
import {
  ContactDetail,
  mapContactDetailsResponseToContactDetails,
} from '../../../models/Performer.ts';
import {
  delete_request,
  get_request,
  patch_request,
  post_request,
} from '../../../utils/restUtils.ts';
import { Modal } from '../../../components/shared/confirmModal/ConfirmModal.tsx';
import { Snackbar } from '../../../components/shared/snackBar/SnackBar.tsx';
import { FaLock } from 'react-icons/fa6';

interface ContactDetailsSectionProps {
  contacts: ContactDetail[];
  isLocked: boolean;
  showLock: boolean;
}

export default function ContactDetailsSection({
  contacts: initialContacts,
  isLocked,
  showLock,
}: ContactDetailsSectionProps) {
  const { isEditMode } = useEditMode();
  const { t } = useTranslation();
  const [contacts, setContacts] = useState(initialContacts);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentContact, setCurrentContact] = useState<ContactDetail | null>(
    null
  );
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
    const newContact = {
      id: 0,
      contactType: '',
      contactInfo: '',
    };
    setIsAdding(true);
    setContacts([newContact, ...contacts]);
    setEditingIndex(0);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentContact(contacts[index]);
  };

  const mapFormDataToRequest = (
    formData: Record<string, any>
  ): Record<string, any> => ({
    contact_type: formData['contactType'],
    contact_info: formData['contactInfo'],
  });

  const handleSave = async (updatedContact: ContactDetail) => {
    try {
      if (currentContact?.id === undefined) {
        await post_request(
          `hita/contact-details`,
          mapFormDataToRequest(updatedContact)
        );
      } else {
        await patch_request(
          `hita/contact-details/${currentContact?.id}`,
          mapFormDataToRequest(updatedContact)
        );
      }

      const { data: getData } = await get_request(`hita/contact-details`);
      setContacts(mapContactDetailsResponseToContactDetails(getData.data));
      setEditingIndex(null);
      setCurrentContact(null);
      setIsAdding(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (contact: ContactDetail) => {
    setCurrentContact(contact);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await delete_request(`hita/contact-details/${currentContact?.id}`);
      setShowDeleteModal(false);

      const { data: getData } = await get_request(`hita/contact-details`);
      setContacts(mapContactDetailsResponseToContactDetails(getData.data));
    } catch (e) {
      console.error(e);
    }
    setEditingIndex(null);
    setCurrentContact(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    if (isAdding) {
      setContacts(contacts.slice(1));
    }
    setEditingIndex(null);
    setCurrentContact(null);
    setIsAdding(false);
  };

  return (
    <Section
      title={`${t('PERFORMER_PAGE.CONTACT_DETAILS.CONTACT_DETAILS')} (${contacts.length})`}
      headerActions={
        <div className="flex gap-2">
          {isLocked && !isEditMode && (
            <FaLock className="text-gray-500" size={16} />
          )}
          <AddButton
            onClick={handleAdd}
            className={editingIndex !== null ? 'invisible' : ''}
          />
        </div>
      }
    >
      {showLock ? (
        <div className="flex items-center gap-2 p-2 bg-gray-100 border border-gray-300 rounded-md">
          <FaLock className="text-gray-500" size={16} />
          <span className="text-gray-700 text-sm">
            {t('PERFORMER_PAGE.CONTACT_DETAILS.LOCKED_SECTION')}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {contacts.map((contact, index) => {
            if (editingIndex === index) {
              // Show one FormCard when in formMode
              return (
                <div key={index} className="col-span-2 lg:col-span-6">
                  <ContactDetailsForm
                    contact={contact}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>
              );
            }

            // Show two cards per row otherwise
            return (
              <div key={index} className="flex justify-center items-center">
                <ContactDetailsCard
                  contact={contact}
                  onEdit={() => handleEdit(index)}
                  onDelete={() => handleDelete(contact)}
                  isEditing={editingIndex !== null}
                />
              </div>
            );
          })}
          {contacts.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                {t('PERFORMER_PAGE.CONTACT_DETAILS.NO_CONTACTS')}
              </p>
              {isEditMode && (
                <button
                  onClick={handleAdd}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  {t('PERFORMER_PAGE.CONTACT_DETAILS.ADD_FIRST_CONTACT')}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t('PERFORMER_PAGE.CONTACT_DETAILS.DELETE_TITLE')}
        message={t('PERFORMER_PAGE.CONTACT_DETAILS.DELETE_FORM')}
        confirmText={t('PERFORMER_PAGE.CONTACT_DETAILS.DELETE_CONFIRM')}
        cancelText={t('PERFORMER_PAGE.CONTACT_DETAILS.DELETE_CANCEL')}
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
