import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RangeFilter } from './RangeFilter.tsx';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';

const genders = ['M', 'F'];

type FilterProps = {
  updateFilter: (filtersList: Record<string, string[]>) => void;
  initialFilters: Record<string, string[]>;
  skills: string[];
  departments: string[];
  nameFilter: string;
};

export function Filters({
  updateFilter,
  initialFilters,
  skills,
  departments,
  nameFilter,
}: FilterProps) {
  const [filters, setFilters] =
    useState<Record<string, string[]>>(initialFilters);
  const { t } = useTranslation();
  const [minAgeVal, maxAgeVal] = [16, 100];
  const [minWeightVal, maxWeightVal] = [40, 220];
  const [minHeightVal, maxHeightVal] = [50, 220];
  const [minExperiencesVal, maxExperiencesVal] = [0, 100];
  const { trackEvent } = useAmplitude();

  useEffect(() => {
    if (nameFilter === '') {
      if (!('name' in filters)) return;
      setFilters((prevFilters) =>
        removeFilters(prevFilters, { ['name']: null }, true)
      );
      return;
    }
    trackEvent('filter_name');
    setFilters((prevFilters) =>
      updateFilters(
        prevFilters,
        {
          name: nameFilter,
        },
        true
      )
    );
  }, [nameFilter]);

  useEffect(() => {
    updateFilter(filters);
  }, [filters]);

  const removeFilters = (
    prevFilters: Record<string, string[]>,
    removedFilters: Record<string, string | null>,
    removeKey: boolean
  ) => {
    const updatedFilters = { ...prevFilters };
    if (removeKey) {
      Object.keys(removedFilters).map((filter) => {
        if (filter in updatedFilters) {
          delete updatedFilters[filter];
        }
      });
    } else {
      Object.entries(removedFilters).forEach(([key, value]) => {
        if (key in updatedFilters) {
          updatedFilters[key] = updatedFilters[key].filter(
            (filteredValue) => filteredValue !== value
          );
          if (updatedFilters[key].length === 0) {
            delete updatedFilters[key];
          }
        }
      });
    }
    return updatedFilters;
  };

  const updateFilters = (
    prevFilters: Record<string, string[]>,
    addedFilters: Record<string, string>,
    override: boolean
  ) => {
    const updatedFilters = { ...prevFilters };

    Object.entries(addedFilters).map(([key, value]) => {
      if (override) {
        updatedFilters[key] = [value];
      } else {
        updatedFilters[key] = !updatedFilters[key]
          ? [value]
          : [...updatedFilters[key], value];
      }
    });

    return updatedFilters;
  };

  type HandleRangeFilterProps = {
    startVal: number;
    endVal: number;
    startAttribute: string;
    endAttribute: string;
    minVal: number;
    maxVal: number;
  };

  const handleRangeFilter = (props: HandleRangeFilterProps) => {
    if (
      props.startVal === props.minVal &&
      props.endVal === props.maxVal &&
      props.startAttribute in filters &&
      props.endAttribute in filters
    ) {
      setFilters((prevFilters) =>
        removeFilters(
          prevFilters,
          {
            [props.startAttribute]: null,
            [props.endAttribute]: null,
          },
          true
        )
      );
    } else {
      setFilters((prevFilters) =>
        updateFilters(
          prevFilters,
          {
            [props.startAttribute]: props.startVal.toString(),
            [props.endAttribute]: props.endVal.toString(),
          },
          true
        )
      );
    }
  };

  const handleAgeFilter = (startVal: number, endVal: number) => {
    trackEvent('filter_age');
    handleRangeFilter({
      startVal: startVal,
      endVal: endVal,
      startAttribute: 'age_range_after',
      endAttribute: 'age_range_before',
      minVal: minAgeVal,
      maxVal: maxAgeVal,
    });
  };
  const handleHeightFilter = (startVal: number, endVal: number) => {
    trackEvent('filter_height');
    handleRangeFilter({
      startVal: startVal,
      endVal: endVal,
      startAttribute: 'height_range_after',
      endAttribute: 'height_range_before',
      minVal: minHeightVal,
      maxVal: maxHeightVal,
    });
  };
  const handleWeightFilter = (startVal: number, endVal: number) => {
    trackEvent('filter_weight');
    handleRangeFilter({
      startVal: startVal,
      endVal: endVal,
      startAttribute: 'weight_range_after',
      endAttribute: 'weight_range_before',
      minVal: minWeightVal,
      maxVal: maxWeightVal,
    });
  };
  const handleExperienceFilter = (startVal: number, endVal: number) => {
    trackEvent('filter_experience');
    handleRangeFilter({
      startVal: startVal,
      endVal: endVal,
      startAttribute: 'experience_range_after',
      endAttribute: 'experience_range_before',
      minVal: minExperiencesVal,
      maxVal: maxExperiencesVal,
    });
  };

  const handleCheckBoxFilter = (
    checked: boolean,
    value: string,
    filter: string
  ) => {
    if (checked) {
      trackEvent('filter_' + filter);
      setFilters((prevFilters) =>
        updateFilters(prevFilters, { [filter]: value }, false)
      );
    } else {
      setFilters((prevFilters) =>
        removeFilters(prevFilters, { [filter]: value }, false)
      );
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
                  checked={filters['gender']?.includes(gender)}
                  onChange={(e) => {
                    handleCheckBoxFilter(e.target.checked, gender, 'gender');
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
                  checked={filters['department']?.includes(department)}
                  onChange={(e) => {
                    handleCheckBoxFilter(
                      e.target.checked,
                      department,
                      'department'
                    );
                  }}
                />
                <span className="mx-2 text-sm text-gray-600">
                  {t('DEPARTMENTS.' + department)}
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
                  checked={filters['skills']?.includes(skill)}
                  onChange={(e) => {
                    handleCheckBoxFilter(e.target.checked, skill, 'skills');
                  }}
                />
                <span className="mx-2 text-sm text-gray-600">
                  {t('SKILLS.' + skill)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
