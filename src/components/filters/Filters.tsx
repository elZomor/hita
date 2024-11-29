import { useEffect, useState } from 'react';
import { get_request } from '../../utils/restUtils.ts';
import { useTranslation } from 'react-i18next';

const genders = ['M', 'F'];

type FilterProps = {
  updateFilter: (filtersList: Record<string, string[]>[]) => void;
};

export function Filters({ updateFilter }: FilterProps) {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await get_request('hita/skills');
      setSkills(data.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchDepartments() {
      const { data } = await get_request(`hita/departments`);
      setDepartments(data.data);
    }

    fetchDepartments();
  }, []);

  useEffect(() => {
    console.log('called in filters');
    updateFilter([
      {
        skills: selectedSpecialties,
        gender: selectedGenders,
        department: selectedDepartments,
      },
    ]);
  }, [selectedSpecialties, selectedGenders, selectedDepartments]);

  return (
    <aside className="w-64 flex-shrink-0 hidden sm:block">
      <div className="sticky top-20">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('PERFORMER_HOME.FILTERS')}
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {t('PERFORMER_HOME.GENDER')}
              </h4>
              <div className="space-y-2">
                {genders.map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedGenders.includes(gender)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGenders([...selectedGenders, gender]);
                        } else {
                          setSelectedGenders(
                            selectedGenders.filter((l) => l !== gender)
                          );
                        }
                      }}
                    />
                    <span className="mx-2 text-sm text-gray-600">
                      {t('PERFORMER_HOME.' + gender)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {t('PERFORMER_HOME.DEPARTMENT')}
              </h4>
              <div className="space-y-2">
                {departments.map((department) => (
                  <label key={department} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedDepartments.includes(department)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDepartments([
                            ...selectedDepartments,
                            department,
                          ]);
                        } else {
                          setSelectedDepartments(
                            selectedDepartments.filter((l) => l !== department)
                          );
                        }
                      }}
                    />
                    <span className="mx-2 text-sm text-gray-600">
                      {t(department)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {t('PERFORMER_HOME.SKILL')}
              </h4>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedSpecialties.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSpecialties([
                            ...selectedSpecialties,
                            skill,
                          ]);
                        } else {
                          setSelectedSpecialties(
                            selectedSpecialties.filter((s) => s !== skill)
                          );
                        }
                      }}
                    />
                    <span className="mx-2 text-sm text-gray-600">
                      {t(skill)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
