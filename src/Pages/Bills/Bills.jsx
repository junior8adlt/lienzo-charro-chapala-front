import { useMutation, useQuery } from '@apollo/client';
import { Button, Modal, Popconfirm, Row, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DELETE_BILL } from '../../Api/Mutations';
import { GET_BILLS } from '../../Api/Queries';
import { BillsForm } from '../../Components/BillsForm/BillsForm';
import { GenericTable } from '../../Components/GenericTable/GenericTable';
import {
  ActionItem,
  Container,
  CustomButton,
  CustomDatePicker,
  Header,
  HeaderActions,
  Title,
} from '../../globalStyles';

export const Bills = () => {
  const [visible, setVisible] = useState(false);
  const [bill, setBill] = useState(null);
  const [billsData, setBillsData] = useState([]);
  const [originalBills, setOriginalBills] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [dateValue, setDateValue] = useState(null);

  const { loading, error } = useQuery(GET_BILLS, {
    onCompleted: (data) => {
      setBillsData(data.getBills);
      setOriginalBills(data.getBills);
    },
  });
  const [deleteBill] = useMutation(DELETE_BILL, {
    refetchQueries: [GET_BILLS],
  });

  const editAction = (record) => {
    setBill(record);
    setIsEdit(true);
    setVisible(true);
  };

  const deleteAction = async (record) => {
    try {
      const { data } = await deleteBill({
        variables: {
          deleteBillId: parseInt(record.id),
        },
      });
      if (data.deleteTransfer) {
        Modal.success({
          content: 'Bill Eliminado',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size='middle'>
          <ActionItem key={record.id} onClick={() => editAction(record)}>
            Editar
          </ActionItem>
          <ActionItem key={record.id}>
            <Popconfirm
              title='¿Eliminar?'
              okText='Si'
              cancelText='No'
              onConfirm={() => deleteAction(record)}
            >
              Eliminar
            </Popconfirm>
          </ActionItem>
        </Space>
      ),
    },
  ];
  const onChangeDate = (date, dateString) => {
    setDateValue(dateString);
  };

  const searchByDate = () => {
    if (dateValue) {
      const billsArray = [...billsData];
      const billsFiltered = billsArray.filter(
        (b) => dayjs(b.date).format('DD/MM/YYYY') === dateValue,
      );
      setBillsData(billsFiltered);
      return;
    }
    setBillsData(originalBills);
  };

  return (
    <Container>
      <BillsForm
        visible={visible}
        setVisible={setVisible}
        bill={bill}
        setBill={setBill}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <Header>
        <Title>Gastos</Title>
        <HeaderActions>
          <CustomButton style={{ marginLeft: 20 }} onClick={() => setVisible(true)}>
            Crear Bill
          </CustomButton>
          <Row>
            <PickerWrapper>
              <CustomDatePicker
                format='YYYY-MM-DD'
                placeholder='Selecciona una fecha'
                style={{ marginRight: 10 }}
                onChange={onChangeDate}
              />
              <Button type='primary' size='large' onClick={searchByDate}>
                Buscar
              </Button>
            </PickerWrapper>
          </Row>
        </HeaderActions>
      </Header>

      <GenericTable columns={columns} data={billsData} loading={loading} emptyText='No hay bills' />
    </Container>
  );
};

export const PickerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 10px;
`;
