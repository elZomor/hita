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

const ITEMS_PER_PAGE = 9;

const PerformerHome: React.FC = () => {
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPerformers() {
      try {
        setLoading(true);
        const { data } = await get_request(
          `hita/performers?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`
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
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
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
    </Container>
  );
};

export default PerformerHome;
