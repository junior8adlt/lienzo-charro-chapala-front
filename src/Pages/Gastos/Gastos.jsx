import { useApolloClient, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import {
  GET_DEPARTMENTS_BY_TYPE,
  GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
} from '../../Api/Queries';
import { Autocomplete } from '../../Components/Autocomplete/Autocomplete';
import { Modal } from 'antd';
import { GastosTable } from './Components/GastosTable';
import { useHistory } from 'react-router-dom';
import { EditGastosModalForm } from './Components/EditGastosModalForm';
import {
  Container,
  CustomButton,
  Header,
  HeaderActions,
  Title,
} from '../../globalStyles';

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
      <EditGastosModalForm
        visible={visible}
        setVisible={setVisible}
        purchaseSelected={purchaseSelected}
        setPurchaseSelected={setPurchaseSelected}
        purchases={purchases}
        setPurchases={setPurchases}
        setOriginalPurchases={setOriginalPurchases}
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
            Crear Gasto
          </CustomButton>
        </HeaderActions>
      </Header>
      <GastosTable
        editAction={editAction}
        purchases={purchases}
        setPurchases={setPurchases}
        originalPurchases={originalPurchases}
        departmentId={departmentId}
        loading={loading}
      />
    </Container>
  );
};
