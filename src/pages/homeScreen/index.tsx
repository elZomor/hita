import React, { useEffect, useState } from 'react';
import { Filters } from '../../components/filters/Filters.tsx';
import { ActorCard } from '../../components/performerCard/PerformerCard.tsx';
import Container from '../../components/container/Container.tsx';
import {
  mapPerformerResponseToPerformer,
  Performer,
  PerformerResponse,
} from '../../models/Performer.ts';
import { get_request } from '../../utils/restUtils.ts';
import { CardSkeleton } from '../../components/cardSkeleton/CardSkeleton.tsx';

const HomeScreen: React.FC = () => {
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActors() {
      try {
        const { data } = await get_request('hita/performers');

        const performerList = data.results.map((performer: PerformerResponse) =>
          mapPerformerResponseToPerformer(performer)
        );
        setPerformers(performerList);
      } catch (error) {
        console.error('Failed to fetch actors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActors();
  }, []);

  return (
    <Container>
      <div className="flex flex-row gap-8">
        <Filters />

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6).keys()].map((item) => (
                <CardSkeleton key={item} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {performers.map((actor: Performer) => (
                <ActorCard key={actor.username} actor={actor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default HomeScreen;