import PerformerDetailsSection from '../../components/profileScreenComponents/PerformerDetailsSection.tsx';
import ExperienceSection from '../../components/profileScreenComponents/ExperienceSection.tsx';
import AchievementSection from '../../components/profileScreenComponents/AchievementSection.tsx';
import ContactDetailsSection from '../../components/profileScreenComponents/ContactDetailsSection.tsx';
import GallerySection from '../../components/profileScreenComponents/GallerySection.tsx';
import {
  achievementsList,
  contactDetailsObject,
  experienceList,
  galleryObject,
  performer,
} from '../../assets/actorProfile.ts';

type ProfilePageProps = {
  username: string;
};

export function ProfilePage({ username }: ProfilePageProps) {
  console.log(username);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PerformerDetailsSection performer={performer} />
          <ExperienceSection experienceList={experienceList} />
          <AchievementSection achievementsList={achievementsList} />
        </div>

        <div className="lg:col-span-1">
          <ContactDetailsSection contactDetailsObject={contactDetailsObject} />
          <GallerySection galleryObject={galleryObject} />
        </div>
      </div>
    </div>
  );
}
