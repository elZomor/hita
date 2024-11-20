import { useState } from 'react';

const specialties = [
  'Drama',
  'Comedy',
  'Action',
  'Theater',
  'Musical',
  'Voice Acting',
  'Period Drama',
  'Method Acting',
  'Dance',
];

const locations = [
  'London, UK',
  'Los Angeles, USA',
  'New York, USA',
  'Madrid, Spain',
  'Mumbai, India',
  'Berlin, Germany',
];

export function Filters() {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  return (
    <aside className="w-64 flex-shrink-0 hidden sm:block">
      <div className="sticky top-20">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Specialty
              </h4>
              <div className="space-y-2">
                {specialties.map((specialty) => (
                  <label key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSpecialties([
                            ...selectedSpecialties,
                            specialty,
                          ]);
                        } else {
                          setSelectedSpecialties(
                            selectedSpecialties.filter((s) => s !== specialty)
                          );
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {specialty}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Location
              </h4>
              <div className="space-y-2">
                {locations.map((location) => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={selectedLocations.includes(location)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLocations([
                            ...selectedLocations,
                            location,
                          ]);
                        } else {
                          setSelectedLocations(
                            selectedLocations.filter((l) => l !== location)
                          );
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {location}
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
