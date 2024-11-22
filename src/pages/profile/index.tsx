import React from 'react';
import Container from '../../components/container/Container';
import { ProfilePage } from './ProfileScreen.tsx';
import { useParams } from 'react-router-dom';

const Profile: React.FC = () => {
  const { username } = useParams();

  return (
    <Container>
      <ProfilePage username={username!} />
    </Container>
  );
};

export default Profile;
