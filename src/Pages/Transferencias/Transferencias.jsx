import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { DELETE_TRANSFER } from '../../Api/Mutations';
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
import { TransferenciaModalForm } from './Components/TransferenciaModalForm';
import { TransferenciasTable } from './Components/TransferenciasTable';

const { Option } = CustomSelect;

export const Transferencias = () => {
  const [departmentId, setDepartmentId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [transferType, setTransferType] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [originalTransfers, setOriginalTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [transferSelected, setTransferSelected] = useState(null);
  const history = useHistory();
  const client = useApolloClient();
  const { data: departmentsData } = useQuery(GET_ALL_DEPARTMENTS);

  const [deleteTransfer] = useMutation(DELETE_TRANSFER);

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
    setVisible(true);
    setTransferSelected(transfer);
  };

  const deleteAction = async (transfer) => {
    console.log(transfer);
    try {
      const { data } = await deleteTransfer({
        variables: {
          deleteTransferId: parseInt(transfer.id),
        },
        refetchQueries: [
          {
            query: GET_TRANSFERS_BY_DEPARTMENT_AND_TYPE,
            variables: {
              getTransfersByDepartmentInput2: {
                id: parseInt(departmentId),
                type:
                  returnBarraInfo(departmentId).type === 'warehouse'
                    ? 'RETURN'
                    : 'STOCK',
              },
            },
          },
        ],
      });
      if (data.deleteTransfer) {
        Modal.success({
          content: 'Transferencia Eliminada',
        });
        // remove delete transfer
        const newTransfers = transfers.filter(
          (item) => item.id !== transfer.id
        );
        setTransfers(newTransfers);
        setOriginalTransfers(newTransfers);
      }
    } catch (error) {
      console.log(error);
    }
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

  const returnBarraInfo = (idDepartment) => {
    const department = departments.find(
      (department) => department.id === idDepartment
    );
    return department;
  };

  return (
    <Container>
      <TransferenciaModalForm
        visible={visible}
        setVisible={setVisible}
        transferSelected={transferSelected}
        setTransferSelected={setTransferSelected}
        transfers={transfers}
        setTransfers={setTransfers}
        setOriginalTransfers={setOriginalTransfers}
      />
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
            onClick={() => history.push('/transferencias/crear')}
          >
            Crear Transferencias
          </CustomButton>
        </HeaderActions>
      </Header>
      <TransferenciasTable
        transfers={transfers}
        setTransfers={setTransfers}
        originalTransfers={originalTransfers}
        loading={loading}
        editAction={editAction}
        deleteAction={deleteAction}
      />
    </Container>
  );
};
