import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '../../components/container/Container';

const Profile: React.FC = () => {
  const { name } = useParams();

  return (
    <Container>
      <div>profile</div>
    </Container>
  );
};

export default Profile;
