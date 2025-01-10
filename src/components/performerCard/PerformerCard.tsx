import { Banknote, Eye, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { Performer } from '../../models/Performer.ts';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ImageModal } from '../shared/imageModal';
import { FaFemale, FaMale } from 'react-icons/fa';

interface ActorCardProps {
  actor: Performer;
}

export function ActorCard({ actor }: ActorCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on the image view button
    if ((e.target as HTMLElement).closest('.image-view-button')) {
      e.stopPropagation();
      return;
    }
    navigate(`/artists/${actor?.username}`);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const isBioLong = actor.biography?.length > 100;
  const truncatedBio = isBioLong
    ? `${actor.biography.slice(0, 100)}...`
    : actor.biography;

  const getGenderIcon = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'm':
        return <FaMale className="w-5 h-5 text-blue-500" />;
      case 'f':
        return <FaFemale className="w-5 h-5 text-pink-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="w-full h-full overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
      >
        <div className="relative h-[400px] md:h-[330px] rounded-md overflow-hidden group">
          <img
            className="absolute top-0 left-0 object-contain w-full h-full"
            src={actor.profilePicture}
            alt={actor.name}
          />

          {/* Mobile view eye icon */}
          <button
            onClick={handleImageClick}
            className="absolute p-2 text-white transition-opacity bg-black bg-opacity-50 rounded-full image-view-button md:hidden top-2 right-2 hover:bg-opacity-70"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Desktop view hover overlay */}
          <div
            onClick={handleImageClick}
            className="absolute inset-0 items-center justify-center hidden transition-all duration-200 bg-black bg-opacity-0 opacity-0 cursor-pointer image-view-button md:flex group-hover:bg-opacity-50 group-hover:opacity-100"
          >
            <span className="flex items-center gap-2 font-medium text-white">
              <Eye className="w-5 h-5" />
              {t('VIEW_IMAGE')}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 mb-2">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-gray-800 break-words">
                    {actor.name}
                    {actor.nickName !== null && actor.nickName !== ''
                      ? `(${actor.nickName})`
                      : ''}
                  </h3>
                </div>
                <div className="flex items-center">
                  <span>{getGenderIcon(actor.gender)} </span>
                  {actor.openFor === 'PAID' && <Banknote />}
                  <div
                    className={clsx(
                      'w-2.5 h-2.5 rounded-full flex-shrink-0 mx-2',
                      actor.status.toLowerCase().includes('unavailable')
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                {actor.age !== 0 && actor.age !== null && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                    <span className="break-words">
                      <span className="font-bold"> {actor.age}</span>{' '}
                      {t('YEARS_OLD')}
                    </span>
                  </div>
                )}
                {actor.height !== 0 && actor.height !== null && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                    <span className="break-words">
                      <span className="font-bold"> {actor.height}</span>{' '}
                      {t('CM')}
                    </span>
                  </div>
                )}
                {actor.weight !== 0 && actor.weight !== null && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                    <span className="break-words">
                      <span className="font-bold">{actor.weight}</span>{' '}
                      {t('KG')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                <span className="break-words">
                  <span className="font-bold">{actor.total_experiences}</span>{' '}
                  {t('PERFORMER_HOME.SHOWS')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 my-1">
                <GraduationCap className="flex-shrink-0 w-4 h-4 " />
                <span className="break-words">
                  {t('DEPARTMENTS.' + actor.department)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {actor.skills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {t('SKILLS.' + skill)}
              </span>
            ))}
          </div>

          <div className="relative flex items-start gap-2">
            <p
              className={clsx('text-sm text-gray-600', {
                'md:truncate': isBioLong,
              })}
            >
              {truncatedBio}
            </p>

            <button
              className={`text-purple-500 hover:text-purple-700 cursor-pointer
              ${isBioLong ? 'block' : 'hidden'}`}
              onMouseEnter={() => setShowFullBio(true)}
              onMouseLeave={() => setShowFullBio(false)}
              onClick={(e) => {
                e.stopPropagation();
                setShowFullBio((prev) => !prev);
              }}
              title={t('PERFORMER_HOME.SHOW_BIO')}
            >
              ℹ️
            </button>

            {isBioLong && showFullBio && (
              <div className="absolute left-0 z-10 w-full p-2 bg-purple-100 border border-gray-200 rounded-lg shadow-lg bottom-full">
                <p className="text-sm text-gray-700">{actor.biography}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={showImageModal}
        imageUrl={actor.profilePicture}
        altText={actor.name}
        onClose={() => setShowImageModal(false)}
      />
    </>
  );
}
