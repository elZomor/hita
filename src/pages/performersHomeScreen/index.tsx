import React, { useEffect, useState } from 'react';
import {
  mapPerformerResponseToPerformer,
  Performer,
  PerformerResponse,
} from '../../models/Performer.ts';
import { get_request } from '../../utils/restUtils.ts';
import Container from '../../components/container/Container.tsx';
import { Filters } from '../../components/filters';
import { CardSkeleton } from '../../components/cardSkeleton/CardSkeleton.tsx';
import { ActorCard } from '../../components/performerCard/PerformerCard.tsx';
import { Pagination } from './Pagination.tsx';
import { NoResults } from './NoResults.tsx';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAmplitude } from '../../hooks/useAmplitude.tsx';
import { useSearchParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 9;

const PerformerHome: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const { trackEvent } = useAmplitude();

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

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (filters !== undefined) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((filter) => {
            params.append(key, filter);
          });
        } else if (value) {
          params.append(key, value);
        }
      });
    }
    params.append('page', currentPage.toString());
    params.append('page_size', ITEMS_PER_PAGE.toString());

    return params.toString();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(searchText);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    async function fetchPerformers() {
      try {
        setLoading(true);
        const { data } = await get_request(
          `hita/performers?${buildQueryParams()}`
        );

        const performerList = data.results.map((performer: PerformerResponse) =>
          mapPerformerResponseToPerformer(performer)
        );

        setPerformers(performerList);
        setTotalPages(data.total_pages);
      } catch {
        // No Implementation
      } finally {
        setLoading(false);
      }
    }

    fetchPerformers();
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilter = () => {
    trackEvent('filter_clear');
    if (searchText !== '') {
      setSearchText('');
      setDebouncedText('');
    }
    if (Object.keys(filters).length !== 0) {
      setFilters({});
    }

    setRefreshKey((prevState) => prevState + 1);
  };

  // Prevent body scroll when mobile filters are open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  const resetPageNumber = () => {
    setCurrentPage(1);
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  return (
    <Container classess="w-full">
      <div className="py-8">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none focus:border-transparent"
                placeholder={t('PERFORMER_HOME.SEARCH_PLACEHOLDER')}
                value={searchText}
                onChange={(e) => {
                  resetPageNumber();
                  setSearchText(e.target.value);
                }}
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg lg:hidden hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {t('PERFORMER_HOME.FILTERS')}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Desktop Filters */}
          <aside className="flex-shrink-0 hidden lg:block lg:w-64">
            <div className="sticky top-20">
              <button
                onClick={handleClearFilter}
                className="flex items-center justify-center w-full px-2 py-2 mb-4 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                title="ClearFilters"
              >
                {t('PERFORMER_HOME.CLEAR_FILTERS')}
              </button>
              <Filters
                updateFilter={setFilters}
                initialFilters={filters}
                skills={skills}
                departments={departments}
                nameFilter={debouncedText}
                key={refreshKey}
                resetPageNumber={resetPageNumber}
              />
            </div>
          </aside>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {t('PERFORMER_HOME.FILTERS')}
                    </h2>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 -mr-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close filters</span>
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <button
                      onClick={handleClearFilter}
                      className="flex w-[80%] mx-auto items-center justify-center py-2 my-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      title="ClearFilters"
                    >
                      {t('PERFORMER_HOME.CLEAR_FILTERS')}
                    </button>
                    <Filters
                      updateFilter={setFilters}
                      initialFilters={filters}
                      skills={skills}
                      departments={departments}
                      nameFilter={debouncedText}
                      key={refreshKey}
                      resetPageNumber={resetPageNumber}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            ) : performers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {performers.map((performer: Performer) => (
                    <ActorCard key={performer.username} actor={performer} />
                  ))}
                </div>

                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <NoResults />
            )}
          </main>
        </div>
      </div>
    </Container>
  );
};

export default PerformerHome;
