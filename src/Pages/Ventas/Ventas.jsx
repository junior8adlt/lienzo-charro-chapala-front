import { useApolloClient, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Autocomplete } from '../../Components/Autocomplete/Autocomplete';
import { Modal } from 'antd';
import { MovementsTable } from '../../Components/MovementsTable/MovementsTable';
import {
  Container,
  CustomButton,
  Header,
  HeaderActions,
  Title,
} from '../../globalStyles';
import { MovementsForm } from '../../Components/MovementsForm/MovementsForm';
import { useHistory } from 'react-router-dom';
import {
  GET_DEPARTMENTS_BY_TYPE,
  GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
} from '../../Api/Queries';

export const Ventas = () => {
  const [loading, setLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [sales, setSales] = useState([]);
  const [originalSales, setOriginalSales] = useState([]);
  const [saleSelected, setSaleSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const client = useApolloClient();

  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_BY_TYPE, {
    variables: { type: 'shop' },
  });

  useEffect(() => {
    if (!departmentId) {
      setSales([]);
      setOriginalSales([]);
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
          departmentType: 'SALE',
        },
      });
      if (data) {
        setSales(data.getMovementsByDepartmentAndType);
        setOriginalSales(data.getMovementsByDepartmentAndType);
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
    setSaleSelected(purchase);
  };

  return (
    <Container>
      <MovementsForm
        visible={visible}
        setVisible={setVisible}
        movementSelected={saleSelected}
        setMovementSelected={setSaleSelected}
        movements={sales}
        setMovements={setSales}
        setOriginalMovements={setOriginalSales}
        isSale={true}
      />
      <Header>
        <Title>Ventas</Title>
        <HeaderActions>
          <Autocomplete
            data={departments}
            setAutocompleteValue={setDepartmentId}
            placeholder='Selecciona una barra'
          />
          <CustomButton
            style={{ marginLeft: 20 }}
            disabled={!departmentId || loading}
            loading={loading}
            onClick={searchMovementsByDepartment}
          >
            Buscar Ventas
          </CustomButton>
          <CustomButton
            style={{ marginLeft: 20 }}
            onClick={() => history.push('/ventas/crear')}
          >
            Crear Ventas
          </CustomButton>
        </HeaderActions>
      </Header>
      <MovementsTable
        editAction={editAction}
        movements={sales}
        setMovements={setSales}
        originalMovements={originalSales}
        departmentId={departmentId}
        loading={loading}
        isSales={true}
      />
    </Container>
  );
};
