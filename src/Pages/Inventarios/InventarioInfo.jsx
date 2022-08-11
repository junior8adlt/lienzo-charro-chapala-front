import React from 'react';
import { Link } from 'react-router-dom';
import { Container, CustomButton, Header, HeaderActions, Title } from '../../globalStyles';
import { InventarioStockTable } from './Components/InventarioStockTable';
import { FaChevronLeft } from 'react-icons/fa';
export const InventarioInfo = () => {
  return (
    <Container>
      <Header>
        <Title>Detalle de inventario</Title>
        <HeaderActions>
          <CustomButton style={{ marginRight: '10px' }}>Totalidad de gastos</CustomButton>
          <CustomButton>Totalidad de barras x día</CustomButton>
        </HeaderActions>
      </Header>

      <Link
        to='/inventarios'
        style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}
      >
        <FaChevronLeft />
        Regresar a inventarios
      </Link>

      <InventarioStockTable />
    </Container>
  );
};
