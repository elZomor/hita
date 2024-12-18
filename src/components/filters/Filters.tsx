import { useEffect, useState } from 'react';
import { get_request } from '../../utils/restUtils.ts';
import { useTranslation } from 'react-i18next';
import { RangeFilter } from './RangeFilter.tsx';

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
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 0]);
  const [heightRange, setHeightRange] = useState<[number, number]>([0, 0]);
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 0]);
  const [experienceRange, setExperienceRange] = useState<[number, number]>([
    0, 0,
  ]);
  const { t } = useTranslation();
  const [minAgeVal, maxAgeVal] = [16, 100];
  const [minWeightVal, maxWeightVal] = [40, 220];
  const [minHeightVal, maxHeightVal] = [50, 220];
  const [minExperiencesVal, maxExperiencesVal] = [0, 100];

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
    const updatedFilter: Record<string, string[]>[] = [
      {
        skills: selectedSpecialties,
        gender: selectedGenders,
        department: selectedDepartments,
        age_range_after: [ageRange[0].toString()],
        age_range_before: [ageRange[1].toString()],
        height_range_after: [heightRange[0].toString()],
        height_range_before: [heightRange[1].toString()],
        weight_range_after: [weightRange[0].toString()],
        weight_range_before: [weightRange[1].toString()],
        experience_range_after: [experienceRange[0].toString()],
        experience_range_before: [experienceRange[1].toString()],
      },
    ];

    updateFilter(updatedFilter);
  }, [
    selectedSpecialties,
    selectedGenders,
    selectedDepartments,
    ageRange,
    weightRange,
    heightRange,
    experienceRange,
  ]);

  const handleAgeFilter = (startVal: number, endVal: number) => {
    if (startVal === minAgeVal && endVal === maxAgeVal) {
      setAgeRange([0, 0]);
    } else {
      setAgeRange([startVal, endVal]);
    }
  };
  const handleHeightFilter = (startVal: number, endVal: number) => {
    if (startVal === minHeightVal && endVal === maxHeightVal) {
      setHeightRange([0, 0]);
    } else {
      setHeightRange([startVal, endVal]);
    }
  };
  const handleWeightFilter = (startVal: number, endVal: number) => {
    if (startVal === minWeightVal && endVal === maxWeightVal) {
      setWeightRange([0, 0]);
    } else {
      setWeightRange([startVal, endVal]);
    }
  };
  const handleExperienceFilter = (startVal: number, endVal: number) => {
    if (startVal === minExperiencesVal && endVal === maxExperiencesVal) {
      setExperienceRange([0, 0]);
    } else {
      setExperienceRange([startVal, endVal]);
    }
  };

  return (
    <div className="bg-white lg:rounded-lg lg:border lg:border-gray-200 p-4">
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {t('PERFORMER_HOME.AGE')}
          </h4>
          <div className="space-y-2">
            <RangeFilter
              minVal={minAgeVal}
              maxVal={maxAgeVal}
              onChange={handleAgeFilter}
            />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {t('PERFORMER_HOME.HEIGHT')}
          </h4>
          <div className="">
            <RangeFilter
              minVal={minHeightVal}
              maxVal={maxHeightVal}
              onChange={handleHeightFilter}
            />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {t('PERFORMER_HOME.WEIGHT')}
          </h4>
          <div className="space-y-2">
            <RangeFilter
              minVal={minWeightVal}
              maxVal={maxWeightVal}
              onChange={handleWeightFilter}
            />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {t('PERFORMER_HOME.TOTAL_EXPERIENCES')}
          </h4>
          <div className="space-y-2">
            <RangeFilter
              minVal={minExperiencesVal}
              maxVal={maxExperiencesVal}
              onChange={handleExperienceFilter}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
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
          <h4 className="text-sm font-medium text-gray-900 mb-3">
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
          <h4 className="text-sm font-medium text-gray-900 mb-3">
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
                      setSelectedSpecialties([...selectedSpecialties, skill]);
                    } else {
                      setSelectedSpecialties(
                        selectedSpecialties.filter((s) => s !== skill)
                      );
                    }
                  }}
                />
                <span className="mx-2 text-sm text-gray-600">{t(skill)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
