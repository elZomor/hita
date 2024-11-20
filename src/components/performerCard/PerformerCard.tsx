import { GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';
import { Performer } from '../../models/Performer.ts';
import { useTranslation } from 'react-i18next';

interface ActorCardProps {
  actor: Performer;
}

export function ActorCard({ actor }: ActorCardProps) {
  const { t } = useTranslation();
  return (
    <div className="p-2 transition-shadow duration-200 bg-white border border-gray-200 shadow-sm p-4overflow-hidden rounded-xl hover:shadow-md">
      <div className="relative h-[250px] rounded-md overflow-hidden mb-2">
        <img
          className="absolute top-0 left-0 w-full h-full"
          src={actor.profilePicture}
          alt={actor.name}
        />
      </div>

      <div className="p-1 mb-2">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="pr-4 text-base font-semibold text-gray-900 break-words">
                {actor.name}
              </h3>
              <div
                className={clsx(
                  'w-2.5 h-2.5 rounded-full flex-shrink-0',
                  actor.status.toLowerCase().includes('available')
                    ? 'bg-green-500'
                    : 'bg-red-500'
                )}
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
              <GraduationCap className="flex-shrink-0 w-4 h-4" />
              <span className="break-words">{t(actor.department)}</span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap gap-1.5">
            {actor.skills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {t(skill)}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">{actor.biography}</p>
      </div>
    </div>
  );
}
