import React, { useEffect, useState } from 'react';
import { Filters } from '../../components/filters/Filters.tsx';
import { ActorCard } from '../../components/performerCard/PerformerCard.tsx';
import Container from '../../components/container/Container.tsx';
import { Actor } from '../../models/Actor.ts';
import { baseUrl } from '../../constants.ts';
import { get_request } from '../../rest_utils.ts';
import { useAuth } from '@clerk/clerk-react';

const HomeScreen: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchActors() {
      try {
        const response = await get_request(
          'hita/performers',
          await getToken({ template: 'eg-theater' })
        );
        const data = await response.json();

        const transformedActors = data.results.map((performer: any) => ({
          id: performer.id,
          name: `${performer.hita_member.first_name} ${performer.hita_member.last_name}`,
          specialties: performer.skills_tags.map((tag: any) => tag.name),
          location: performer.hita_member.location,
          availability: performer.status,
          imageUrl:
            baseUrl +
              performer.gallery.find((img: any) => img.is_profile_picture)
                ?.file || '', // Default to empty string if no image
          bio: performer.bio || '', // Optional: Include a bio if available in your API
        }));
        console.log(transformedActors[0].imageUrl);
        setActors(transformedActors);
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
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {actors.map((actor) => (
                <ActorCard key={actor.id} actor={actor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default HomeScreen;
