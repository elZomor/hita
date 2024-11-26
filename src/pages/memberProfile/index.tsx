import {
  GraduationCap,
  Link as LinkIcon,
  MapPin,
  School,
  User,
  UserCircle2,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  mapMemberViewOneResponseToMemberViewOne,
  MemberViewOne,
} from '../../models/Member.ts';
import { useEffect, useState } from 'react';
import { get_request } from '../../utils/restUtils.ts';
import { useTranslation } from 'react-i18next';

export function MemberProfilePage() {
  const onCreatePerformer = () => {};
  const [member, setMember] = useState<MemberViewOne>();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMember = async () => {
      const { data } = await get_request('hita/members/me');
      setMember(mapMemberViewOneResponseToMemberViewOne(data.data));
    };

    fetchMember();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {member === undefined ? (
        <div>Loading</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <UserCircle2 className="h-12 w-12 text-purple-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {member.fullName}{' '}
                      {member.nickName ? `(${member.nickName})` : ''}
                    </h1>
                    <p className="text-gray-500">@{member.username}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
                      member.status.color
                    )}
                  >
                    <member.status.icon className="h-4 w-4" />
                    {t(`MEMBER_PROFILE.${member.status.status}`)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                  ${member.gender === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}
                  >
                    {member.gender === 'M' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4 " />
                    )}
                    {t(`MEMBER_PROFILE.${member.gender}`)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <School className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">
                    {t('GEN.DEPARTMENT')}:
                  </span>{' '}
                  {t(`GEN.${member.department}`)}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">
                    {member.isGraduated ? t('GEN.GRAD_YEAR') : t('GEN.GRADE')}:
                  </span>
                  {member.grade
                    ? t('GEN.' + member.grade)
                    : member.graduationYear}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">{t('GEN.STUDY_TYPE')}:</span>{' '}
                  {t('GEN.' + member.studyType)}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{t('GEN.LOCATION')}:</span>{' '}
                  {t('GEN.' + member.location)}
                </div>
                {member.status.status !== 'APPROVED' ? (
                  ''
                ) : (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-600">
                      {t('MEMBER_PROFILE.PERFORMER')}:
                    </span>
                    {member.hasPerformer ? (
                      <a
                        href={'/performers/' + member.username}
                        className="text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        {t('MEMBER_PROFILE.VIEW_PERFORMER')}
                      </a>
                    ) : (
                      <button
                        onClick={onCreatePerformer}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        {t('MEMBER_PROFILE.CREATE_PERFORMER')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
