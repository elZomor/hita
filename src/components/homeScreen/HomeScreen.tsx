import { Header } from '../header/Header.tsx';
import { Filters } from '../filters/Filters.tsx';
import { ActorCard } from '../performerCard/PerformerCard.tsx';
import { useEffect, useState } from 'react';
import {
  mapPerformerResponseToPerformer,
  Performer,
  PerformerResponse,
} from '../../models/Performer.ts';
import { get_request } from '../../rest_utils.ts';
import { useAuth } from '@clerk/clerk-react';

export default function App() {
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchActors() {
      try {
        const response = await get_request(
          'hita/performers',
          await getToken({ template: 'eg-theater' })
        );
        const data = await response.json();

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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-row gap-8">
          <Filters />

          <div className="flex-1">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {performers.map((actor) => (
                  <ActorCard key={actor.username} actor={actor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
