import { VideoModal } from '../../../components/shared/VideoModal.tsx';
import { useState } from 'react';
import Section from '../../../components/shared/section/Section.tsx';
import { useTranslation } from 'react-i18next';
import { baseUrl } from '../../../constants.ts';

type ShowReelSectionProps = {
  username: string;
};

export const ShowReelSection = ({ username }: ShowReelSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <Section title={t('ShowReel')}>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Open Video Modal
      </button>

      <VideoModal
        isOpen={isModalOpen}
        videoUrl={`${baseUrl}/hita/show-reel/${username}/stream`}
        title={`${username} Show Reel`}
        onClose={() => setIsModalOpen(false)}
      />
    </Section>
  );
};
