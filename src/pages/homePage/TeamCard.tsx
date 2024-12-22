import { GraduationCap } from 'lucide-react';

type TeamCardProps = {
  imageUrl: string;
  name: string;
  title: string;
  bio: string;
};

const TeamCard = ({ imageUrl, name, title, bio }: TeamCardProps) => {
  return (
    <div className="cursor-pointer h-full w-[95%] m-auto max-w-[350px] transition-shadow duration-200 bg-white border border-gray-200 shadow-sm overflow-hidden rounded-xl hover:shadow-md">
      <div className="relative h-[320px] md:h-[300px] group">
        <img
          className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
          src={imageUrl}
          alt={name}
        />
      </div>

      <div className="flex flex-col gap-2 p-2 mb-2">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center px-2">
                <h3 className="pr-1 text-lg font-semibold text-gray-900 break-words">
                  {name}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
              <GraduationCap className="flex-shrink-0 w-4 h-4" />
              <span className="break-words">{title}</span>
            </div>
          </div>
        </div>
        <div className="relative flex items-start gap-2">
          <p className="text-sm text-gray-600">{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
