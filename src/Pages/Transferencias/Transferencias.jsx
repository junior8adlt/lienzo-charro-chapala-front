import { useApolloClient, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import {
  GET_ALL_DEPARTMENTS,
  GET_TRANSFERS_BY_DEPARTMENT_AND_TYPE,
} from '../../Api/Queries';
import { Autocomplete } from '../../Components/Autocomplete/Autocomplete';
import {
  Container,
  CustomButton,
  CustomSelect,
  Header,
  HeaderActions,
  Title,
} from '../../globalStyles';
import { TransferenciasTable } from './Components/TransferenciasTable';

const { Option } = CustomSelect;

export const Transferencias = () => {
  const [departmentId, setDepartmentId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [transferType, setTransferType] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [originalTransfers, setOriginalTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();
  const { data: departmentsData } = useQuery(GET_ALL_DEPARTMENTS);

  useEffect(() => {
    if (departmentsData) {
      setDepartments(departmentsData.getDepartments);
    }
  }, [departmentsData]);

  useEffect(() => {
    if (!departmentId) {
      setTransfers([]);
      setOriginalTransfers([]);
    }
  }, [departmentId]);

  const editAction = (transfer) => {
    console.log('editAction', transfer);
  };

  const deleteAction = (transfer) => {
    console.log('deleteAction', transfer);
  };

  const searchTransfers = async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_TRANSFERS_BY_DEPARTMENT_AND_TYPE,
        variables: {
          getTransfersByDepartmentInput2: {
            id: parseInt(departmentId),
            type: transferType,
          },
        },
      });
      setTransfers(data.getTransfersByDepartment);
      setOriginalTransfers(data.getTransfersByDepartment);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Transferencias</Title>
        <HeaderActions>
          <Autocomplete
            data={departments}
            setAutocompleteValue={setDepartmentId}
            placeholder='Selecciona un departamento'
          />
          <CustomSelect
            style={{ marginLeft: 20 }}
            placeholder='Tipo de transferencia'
            onChange={(value) => setTransferType(value)}
            value={transferType}
            allowClear
          >
            <Option value='STOCK'>Inventario</Option>
            <Option value='RETURN'>Producto regresado</Option>
          </CustomSelect>
          <CustomButton
            style={{ marginLeft: 20 }}
            disabled={!departmentId || !transferType}
            onClick={searchTransfers}
          >
            Buscar
          </CustomButton>
          <CustomButton
            style={{ marginLeft: 20 }}
            onClick={() => history.push('/gastos/crear')}
          >
            Crear Transferencias
          </CustomButton>
        </HeaderActions>
      </Header>
      <TransferenciasTable
        transfers={transfers}
        originalTransfers={originalTransfers}
        loading={loading}
        editAction={editAction}
        deleteAction={deleteAction}
      />
    </Container>
  );
};
