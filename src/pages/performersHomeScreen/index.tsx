import React, { useEffect, useState } from 'react';
import {
  mapPerformerResponseToPerformer,
  Performer,
  PerformerResponse,
} from '../../models/Performer.ts';
import { get_request } from '../../utils/restUtils.ts';
import Container from '../../components/container/Container.tsx';
import { Filters } from '../../components/filters/Filters.tsx';
import { CardSkeleton } from '../../components/cardSkeleton/CardSkeleton.tsx';
import { ActorCard } from '../../components/performerCard/PerformerCard.tsx';
import { Pagination } from './Pagination.tsx';
import { NoResults } from './NoResults.tsx';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = 9;

const PerformerHome: React.FC = () => {
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { t } = useTranslation();

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    params.append('page', currentPage.toString());
    params.append('page_size', ITEMS_PER_PAGE.toString());

    return params.toString();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(searchText);
    }, 1000);

    return () => clearTimeout(timer); // Clear the timer on input change
  }, [searchText]);

  useEffect(() => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (debouncedText) {
        updatedFilters.name = debouncedText; // Add or update the 'name' filter
      } else {
        delete updatedFilters.name; // Remove the 'name' key if it exists
      }

      return updatedFilters;
    });
  }, [debouncedText]);

  useEffect(() => {
    async function fetchPerformers() {
      console.log('Called');
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
      } catch (error) {
        console.error('Failed to fetch performers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPerformers();
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <div>
        <div className="mx-auto mb-6 md:flex md:justify-center">
          <div className="relative items-center w-full max-w-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-500"
              placeholder={t('SEARCH_PLACEHOLDER')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20">
              <Filters />
            </div>
          </aside>

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
