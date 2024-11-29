import React, { useEffect, useState } from 'react';
import Container from '../../components/container/Container';
import { useParams } from 'react-router-dom';
import PerformerDetailsSection from '../../components/profileScreenComponents/PerformerDetailsSection.tsx';
import ExperienceSection from '../../components/profileScreenComponents/ExperienceSection.tsx';
import AchievementSection from '../../components/profileScreenComponents/AchievementSection.tsx';
import ContactDetailsSection from '../../components/profileScreenComponents/ContactDetailsSection.tsx';
import GallerySection from '../../components/profileScreenComponents/GallerySection.tsx';
import { get_request } from '../../utils/restUtils.ts';
import {
  mapSinglePerformerResponseToSinglePerformer,
  SinglePerformer,
} from '../../models/Performer.ts';
import LoadingComponent from '../../components/shared/loading';
import { NotFoundComponent } from '../../components/shared/notFound';

const Profile: React.FC = () => {
  const { username } = useParams();
  const [performer, setPerformer] = useState<SinglePerformer>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerformer() {
      try {
        const { data } = await get_request(`hita/performers/${username}`);

        const performer = mapSinglePerformerResponseToSinglePerformer(
          data.data
        );
        setPerformer(performer);
      } catch (error) {
        console.error('Failed to fetch actors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPerformer();
  }, [username]);

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingComponent />
        ) : performer === undefined ? (
          <NotFoundComponent resourceName={'Performer'} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PerformerDetailsSection performer={performer.performer} />
              <ExperienceSection experienceList={performer.experiences} />
              <AchievementSection achievementsList={performer.achievements} />
            </div>

            <div className="lg:col-span-1">
              <ContactDetailsSection
                contactDetailsObject={performer.contactDetailsObject}
              />
              <GallerySection galleryObject={performer.galleryObject} />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Profile;
