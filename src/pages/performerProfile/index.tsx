import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get_request } from '../../utils/restUtils';
import {
  mapSinglePerformerResponseToSinglePerformer,
  SinglePerformer,
} from '../../models/Performer';
import Container from '../../components/container/Container';
import PerformerDetailsSection from './PerformerDetailsSection';
import GallerySection from './GallerySection';
import ExperienceSection from './experienceSection';
import AchievementSection from './AchievementSection';
import ContactDetailsSection from './ContactDetailsSection';
import PageNav from './PageNav';
import LoadingComponent from '../../components/shared/loading';
import { NotFoundComponent } from '../../components/shared/notFound';

const Profile: React.FC = () => {
  const { username } = useParams();
  const [performer, setPerformer] = useState<SinglePerformer>();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');

  const sectionRefs = {
    profile: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    achievements: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    async function fetchPerformer() {
      try {
        const { data } = await get_request(`hita/performers/${username}`);
        const performer = mapSinglePerformerResponseToSinglePerformer(
          data.data
        );
        setPerformer(performer);
      } catch (error) {
        console.error('Failed to fetch performer:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPerformer();
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

  const scrollToSection = (sectionId: string) => {
    const headerOffset = 70; // Offset of 16px
    const element = sectionRefs[sectionId as keyof typeof sectionRefs].current;

    if (element) {
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
            <div ref={sectionRefs.profile} id="profile">
              <PerformerDetailsSection performer={performer.performer} />
            </div>

            <div ref={sectionRefs.gallery} id="gallery">
              <GallerySection galleryObject={performer.galleryObject} />
            </div>

            <div ref={sectionRefs.contact} id="contact">
              <ContactDetailsSection
                contactDetailsObject={performer.contactDetailsObject}
              />
            </div>

            <div ref={sectionRefs.experience} id="experience">
              <ExperienceSection experiences={performer.experiences} />
            </div>

            <div ref={sectionRefs.achievements} id="achievements">
              <AchievementSection achievementsList={performer.achievements} />
            </div>
          </div>

          {/* Page Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <PageNav
                activeSection={activeSection}
                onSectionClick={scrollToSection}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
