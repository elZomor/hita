import { VideoModal } from '../../../components/shared/VideoModal.tsx';
import { useState } from 'react';
import Section from '../../../components/shared/section/Section.tsx';
import { useTranslation } from 'react-i18next';
import { baseUrl } from '../../../constants.ts';

type ShowReelSectionProps = {
  username: string;
  profilePictureUrl: string;
};

export const ShowReelSection = ({
  username,
  profilePictureUrl,
}: ShowReelSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Section title={t('ShowReel')}>
      <div className="h-80 flex justify-center items-center hover:cursor-pointer">
        <img
          src={profilePictureUrl}
          alt="Video Thumbnail"
          className="object-cover object-center w-1/2 h-full"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <VideoModal
        isOpen={isModalOpen}
        videoUrl={`${baseUrl}/hita/show-reel/${username}/stream`}
        title={`${username} Show Reel`}
        onClose={() => setIsModalOpen(false)}
      />
    </Section>
  );
};
