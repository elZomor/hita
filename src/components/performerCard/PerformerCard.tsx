import { MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { Performer } from '../../models/Performer.ts';
import { useTranslation } from 'react-i18next';

interface ActorCardProps {
  actor: Performer;
}

export function ActorCard({ actor }: ActorCardProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={actor.profilePicture}
            alt={actor.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold text-gray-900 break-words pr-4">
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
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="break-words">{t(actor.department)}</span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap gap-1.5">
            {actor.skills?.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {t(specialty)}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600">{actor.biography}</p>
      </div>
    </div>
  );
}
