import React from 'react';
import { Container, Title } from '../globalStyles';

export const Home = () => {
  return (
    <Container>
      <div
        className='home'
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '80vh',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        <Title>Bienvenidos al sistema de gestión</Title>
      </div>
    </Container>
  );
};
