import { Filters } from '../../components/filters/Filters.tsx';
import { actors } from '../../assets/data.ts';
import { ActorCard } from '../../components/performerCard/PerformerCard.tsx';
import Container from '../../components/container/Container.tsx';

export default function App() {
  return (
    <Container>
      <div className="flex flex-row gap-8">
        <Filters />

        <div className="flex-1">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {actors.map((actor) => (
              <ActorCard key={actor.id} actor={actor} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
