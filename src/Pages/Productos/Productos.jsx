import React, { useState } from 'react';
import { Container, CustomButton, Header, Title } from '../../globalStyles';
import { ProductosModalForm } from './Components/ProductosModalForm';
import { ProductosTable } from './Components/ProductosTable';

export const Productos = () => {
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [productSelected, setProductSelected] = useState({});
  const editAction = (product) => {
    setIsEdit(true);
    setVisible(true);
    setProductSelected(product);
  };
  return (
    <Container>
      <ProductosModalForm
        visible={visible}
        setVisible={setVisible}
        productSelected={productSelected}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />

      <Header>
        <Title>Productos</Title>
        <CustomButton onClick={() => setVisible(true)}>
          Crear Producto
        </CustomButton>
      </Header>
      <ProductosTable editAction={editAction} />
    </Container>
  );
};
