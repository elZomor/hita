import { Header } from '../header/Header.tsx';
import { Filters } from '../filters/Filters.tsx';
import { actors } from '../../assets/data.ts';
import { ActorCard } from '../performerCard/PerformerCard.tsx';
import Container from '../container/Container.tsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-8">
        <Container>
          <div className="flex flex-row gap-8">
            <Filters />

            <div className="flex-1">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {actors.map((actor) => (
                  <ActorCard key={actor.id} actor={actor} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
