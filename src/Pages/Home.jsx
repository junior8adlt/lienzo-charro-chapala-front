import React from 'react';
import { Container } from '../globalStyles';

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
        <h1>Bienvenidos al sistema de gestión</h1>
      </div>
    </Container>
  );
};
