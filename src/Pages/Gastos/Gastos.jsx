import { useApolloClient, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  CustomButton,
  Header,
  HeaderActions,
  Title,
} from '../../globalStyles';
import { Autocomplete } from '../../Components/Autocomplete/Autocomplete';
import { Modal } from 'antd';
import { MovementsTable } from '../../Components/MovementsTable/MovementsTable';
import { MovementsForm } from '../../Components/MovementsForm/MovementsForm';
import { useHistory } from 'react-router-dom';
import {
  GET_DEPARTMENTS_BY_TYPE,
  GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
} from '../../Api/Queries';

export const Gastos = () => {
  const [loading, setLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [purchaseSelected, setPurchaseSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [originalPurchases, setOriginalPurchases] = useState([]);
  const history = useHistory();
  const client = useApolloClient();

  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_BY_TYPE, {
    variables: { type: 'warehouse' },
  });

  useEffect(() => {
    if (!departmentId) {
      setPurchases([]);
      setOriginalPurchases([]);
    }
  }, [departmentId]);

  useEffect(() => {
    if (departmentsData) {
      setDepartments(departmentsData.getDepartments);
    }
  }, [departmentsData]);

  const searchMovementsByDepartment = async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
        variables: {
          departmentId: parseInt(departmentId),
          departmentType: 'PURCHASE',
        },
      });
      if (data) {
        setPurchases(data.getMovementsByDepartmentAndType);
        setOriginalPurchases(data.getMovementsByDepartmentAndType);
        setLoading(false);
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
      setLoading(false);
    }
  };
  const editAction = (purchase) => {
    setVisible(true);
    setPurchaseSelected(purchase);
  };

  return (
    <Container>
      <MovementsForm
        visible={visible}
        setVisible={setVisible}
        movementSelected={purchaseSelected}
        setMovementSelected={setPurchaseSelected}
        movements={purchases}
        setMovements={setPurchases}
        setOriginalMovements={setOriginalPurchases}
        isSale={false}
      />
      <Header>
        <Title>Gastos</Title>
        <HeaderActions>
          <Autocomplete
            data={departments}
            setAutocompleteValue={setDepartmentId}
            placeholder='Selecciona un inventario'
          />
          <CustomButton
            style={{ marginLeft: 20 }}
            disabled={!departmentId || loading}
            loading={loading}
            onClick={searchMovementsByDepartment}
          >
            Buscar Gastos
          </CustomButton>
          <CustomButton
            style={{ marginLeft: 20 }}
            onClick={() => history.push('/gastos/crear')}
          >
            Crear Gastos
          </CustomButton>
        </HeaderActions>
      </Header>
      <MovementsTable
        editAction={editAction}
        movements={purchases}
        setMovements={setPurchases}
        originalMovements={originalPurchases}
        departmentId={departmentId}
        loading={loading}
        isSale={false}
      />
    </Container>
  );
};
