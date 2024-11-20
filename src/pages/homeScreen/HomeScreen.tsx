import React, { useEffect, useState } from 'react';
import { Filters } from '../../components/filters/Filters.tsx';
import { ActorCard } from '../../components/performerCard/PerformerCard.tsx';
import Container from '../../components/container/Container.tsx';
import {
  mapPerformerResponseToPerformer,
  Performer,
  PerformerResponse,
} from '../../models/Performer.ts';
import { useAuth } from '@clerk/clerk-react';
import { get_request } from '../../rest_utils.ts';
import { CardSkeleton } from '../../components/cardSkeleton/CardSkeleton.tsx';

const actorsData = [
  {
    username: 'hossam',
    name: 'Hossam',
    profilePicture:
      'https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    skills: ['acting', 'directing'],
    status: 'good',
    biography: 'performed in many plays in university and m3hd',
    department: 'acting',
  },
  {
    username: 'hossam',
    name: 'Hossam',
    profilePicture:
      'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    skills: ['acting', 'directing'],
    status: 'good',
    biography: 'performed in many plays in university and m3hd',
    department: 'acting',
  },
  {
    username: 'hossam',
    name: 'Hossam',
    profilePicture:
      'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    skills: ['acting', 'directing'],
    status: 'good',
    biography: 'performed in many plays in university and m3hd',
    department: 'acting',
  },
  {
    username: 'hossam',
    name: 'Hossam',
    profilePicture:
      'https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    skills: ['acting', 'directing'],
    status: 'good',
    biography: 'performed in many plays in university and m3hd',
    department: 'acting',
  },
  {
    username: 'hossam',
    name: 'Hossam',
    profilePicture:
      'https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    skills: ['acting', 'directing'],
    status: 'good',
    biography: 'performed in many plays in university and m3hd',
    department: 'acting',
  },
  {
    username: 'hossam',
    name: 'Hossam',
    profilePicture:
      'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    skills: ['acting', 'directing'],
    status: 'good',
    biography: 'performed in many plays in university and m3hd',
    department: 'acting',
  },
];

const HomeScreen: React.FC = () => {
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
              {actorsData.map((actor: Performer) => (
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
