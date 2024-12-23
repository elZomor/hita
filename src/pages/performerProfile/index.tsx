import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { delete_request, get_request } from '../../utils/restUtils';
import {
  mapSinglePerformerResponseToSinglePerformer,
  SinglePerformer,
} from '../../models/Performer';
import Container from '../../components/container/Container';
import PerformerDetailsSection from './performerDetailsSection';
import GallerySection from './gallerySection';
import ExperienceSection from './experienceSection';
import AchievementSection from './achievementSection';
import ContactDetailsSection from './contactDetailsSection';
import PageNav from './PageNav';
import LoadingComponent from '../../components/shared/loading';
import { NotFoundComponent } from '../../components/shared/notFound';
import { useEditMode } from '../../contexts/EditModeContext.tsx';
import { PublicLinksSection } from './publicLinkSection';
import { Modal } from '../../components/shared/confirmModal/ConfirmModal.tsx';
import { useTranslation } from 'react-i18next';
import { Snackbar } from '../../components/shared/snackBar/SnackBar.tsx';
import { ShowReelSection } from './showReelSection';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';

const PerformerProfile: React.FC = () => {
  const { t } = useTranslation();
  const { username } = useParams();
  const [performer, setPerformer] = useState<SinglePerformer>();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const { isEditMode, setEditMode } = useEditMode();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { trackEvent } = useAmplitude();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });
  const handleEdit = () => {
    trackEvent('performer_profile_open_edit');
    setEditMode(!isEditMode);
  };
  const handleCloseEdit = () => {
    trackEvent('performer_profile_close_edit');
    setEditMode(!isEditMode);
  };

  const sectionRefs = {
    profile: useRef<HTMLDivElement>(null),
    showReel: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
    publicLinks: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    achievements: useRef<HTMLDivElement>(null),
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await delete_request(`hita/performers/${username}`);
      trackEvent('performer_delete_confirm');
    } catch {
      // Intentionally left empty
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      navigate('/performers');
    }
  };

  useEffect(() => {
    refreshPerformerPage();
  }, [username]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.9, // Trigger when 50% of the section is visible
        rootMargin: '-70px 0px 0px 0px', // Offset of 16px at the top
      }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [performer]);

  const handleClickDelete = () => {
    trackEvent('performer_delete_request');
    setShowDeleteModal(true);
  };

  const refreshPerformerPage = async () => {
    try {
      const { data } = await get_request(`hita/performers/${username}`);
      const performer = mapSinglePerformerResponseToSinglePerformer(data.data);
      setPermissions(data.permissions);
      setPerformer(performer);
    } catch {
      // No Implementation
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const headerOffset = 70; // Offset of 16px
    const element = sectionRefs[sectionId as keyof typeof sectionRefs].current;
    if (element) {
      trackEvent('navigate_' + sectionId);
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingComponent />
      </Container>
    );
  }

  if (!performer) {
    return (
      <Container>
        <NotFoundComponent resourceName="Performer" />
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            <div className="block md:hidden ">
              <PageNav
                activeSection={activeSection}
                onSectionClick={scrollToSection}
              />
              {permissions.includes('CAN_EDIT') &&
                (isEditMode ? (
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    onClick={handleCloseEdit}
                  >
                    {t('GEN.CLOSE_EDIT')}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      onClick={handleEdit}
                    >
                      {t('GEN.EDIT')}
                    </button>
                  </>
                ))}
            </div>
            <div ref={sectionRefs.profile} id="profile">
              <PerformerDetailsSection
                performer={performer.performer}
                username={username!}
                isContactDetailsProtected={
                  performer.contactDetailsObject.isLocked
                }
                isGalleryProtected={performer.galleryObject.isLocked}
                refreshPerformerPage={refreshPerformerPage}
              />
            </div>
            <div ref={sectionRefs.showReel} id="showReel">
              <ShowReelSection
                username={username!}
                hasShowReel={performer.hasShowReel!}
              />
            </div>

            <div ref={sectionRefs.gallery} id="gallery">
              <GallerySection
                images={performer.galleryObject.data!}
                isLocked={performer.galleryObject.isLocked!}
                showLock={!permissions.includes('VIEW_GALLERY')}
                refreshPerformerPage={refreshPerformerPage}
              />
            </div>

            <div ref={sectionRefs.contact} id="contact">
              <ContactDetailsSection
                contacts={performer.contactDetailsObject.data!}
                isLocked={performer.contactDetailsObject.isLocked!}
                showLock={!permissions.includes('VIEW_CONTACT_DETAILS')}
              />
            </div>

            <div ref={sectionRefs.publicLinks} id="channels">
              <PublicLinksSection links={performer.publicLinks!} />
            </div>

            <div ref={sectionRefs.experience} id="experience">
              <ExperienceSection experiences={performer.experiences} />
            </div>

            <div ref={sectionRefs.achievements} id="achievements">
              <AchievementSection achievements={performer.achievements} />
            </div>
          </div>

          {/* Page Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-10 flex flex-col items-stretch gap-4 pt-8">
              {permissions.includes('CAN_EDIT') &&
                (isEditMode ? (
                  <button
                    type="button"
                    className="hidden w-full md:flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    onClick={handleCloseEdit}
                  >
                    {t('GEN.CLOSE_EDIT')}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="hidden w-full md:flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      onClick={handleEdit}
                    >
                      {t('GEN.EDIT')}
                    </button>
                    <button
                      type="button"
                      onClick={handleClickDelete}
                      disabled={isLoading}
                      className="w-full px-6 py-3 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                    >
                      {t('GEN.DELETE')}
                    </button>
                  </>
                ))}
              <div className="w-full hidden md:block">
                <PageNav
                  activeSection={activeSection}
                  onSectionClick={scrollToSection}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t('PERFORMER_PAGE.DELETE_TITLE')}
        message={t('PERFORMER_PAGE.DELETE_FORM')}
        confirmText={t('PERFORMER_PAGE.DELETE_CONFIRM')}
        cancelText={t('PERFORMER_PAGE.DELETE_CANCEL')}
      />
      <Snackbar
        isOpen={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  );
};

export default PerformerProfile;
