import Section from "../shared/section/Section.tsx";
import {Achievement} from "../../types.ts";
import {useTranslation} from "react-i18next";

type AchievementSectionProps = {
    achievementsList: Achievement[];
}

const AchievementSection = ({achievementsList}: AchievementSectionProps) => {
    const {t} = useTranslation();
    return (
        <Section title={t('ACHIEVEMENTS')}>
            <div className="space-y-4">

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    {achievementsList.map((achievement, index) => (
                        <div key={index} className={`${index !== 0 ? 'mt-10' : ''}`}>
                            <div key={index} className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{achievement.rank} {achievement.field}</h3>
                                    <p className="text-purple-600">{achievement.festivalName} ({achievement.year})</p>
                                    <p >{t('RANK_FOR')}: {achievement.showName}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </Section>
    )
        ;
};

export default AchievementSection;