import React, { useState } from 'react';
import { Table, Space, Modal, Input, Row, Button } from 'antd';
import { useMutation } from '@apollo/client';
import { GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE } from '../../../Api/Queries';
import {
  ActionItem,
  CustomDatePicker,
  Subtitle,
  TableActions,
} from '../../../globalStyles';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DELETE_MOVEMENT } from '../../../Api/Mutations';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
const { confirm } = Modal;
const { Search } = Input;

export const GastosTable = ({
  editAction,
  purchases,
  setPurchases,
  originalPurchases,
  departmentId,
  loading,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [dateFilterValue, setDateFilterValue] = useState(null);
  const [deleteMovement] = useMutation(DELETE_MOVEMENT, {
    refetchQueries: [
      {
        query: GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
        variables: {
          departmentId: parseInt(departmentId),
          departmentType: 'PURCHASE',
        },
      },
    ],
  });
  const columns = [
    {
      title: 'Motivo del gasto',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Producto Comprado',
      dataIndex: ['product', 'name'],
      key: 'product',
    },
    {
      title: 'Cantidad comprada',
      dataIndex: 'amount',
      key: 'amnount',
    },
    {
      title: 'Departamento',
      dataIndex: ['department', 'name'],
      key: 'responsable',
    },
    {
      title: 'Responsable',
      dataIndex: ['department', 'responsable'],
      key: 'responsable',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `${total !== null ? '$' + total : 'N/D'}`,
    },
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: (date) => `${dayjs(date).format('DD/MM/YYYY')}`,
      defaultSortOrder: 'ascend',
      sorter: (a, b) => dayjs(a.date) - dayjs(b.date),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size='middle'>
          <ActionItem key={record.id} onClick={() => editAction(record)}>
            Editar
          </ActionItem>
          <ActionItem key={record.id} onClick={() => deleteAction(record)}>
            Eliminar
          </ActionItem>
        </Space>
      ),
    },
  ];

  const onSearch = (value) => {
    setSearchValue(value);
    const filteredPurchases = originalPurchases.filter((purchase) =>
      purchase.description.toLowerCase().includes(value.toLowerCase())
    );
    setPurchases(filteredPurchases);
  };

  const deleteAction = (record) => {
    confirm({
      title: 'Estás seguro de eliminar este gasto?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteMutationAction(record.id);
      },
      onCancel() {},
    });
  };
  const deleteMutationAction = async (idPurchase) => {
    try {
      await deleteMovement({
        variables: {
          deleteMovementId: parseInt(idPurchase),
        },
      });
      Modal.success({
        content: 'Gasto Eliminado',
      });
      const filterPurchases = purchases.filter(
        (purchase) => +purchase.id !== +idPurchase
      );
      setPurchases(filterPurchases);
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
    }
  };

  const onChangeDate = (date, dateString) => {
    setDateFilterValue(dateString);
    if (!dateString) {
      setPurchases(originalPurchases);
      return;
    }
  };

  const searchByDate = () => {
    if (dateFilterValue) {
      const newPurchases = originalPurchases.filter(
        (purchase) =>
          dayjs(purchase.date).format('DD/MM/YYYY') === dateFilterValue
      );
      setPurchases(newPurchases);
      return;
    }
    setPurchases(originalPurchases);
  };

  return (
    <>
      <Row justify='space-between'>
        <Subtitle>Filtros</Subtitle>
        <TableActions>
          <Search
            placeholder='Buscar Por Motivo'
            onSearch={onSearch}
            enterButton
            size='large'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            allowClear
          />
          <CustomDatePicker
            onChange={onChangeDate}
            format='DD/MM/YYYY'
            style={{ marginLeft: '20px' }}
            placeholder='Selecciona una fecha'
          />
          <Button
            type='primary'
            size='large'
            style={{ marginLeft: '20px', height: 44 }}
            onClick={searchByDate}
          >
            Buscar x Fecha
          </Button>
        </TableActions>
      </Row>
      <Table
        columns={columns}
        dataSource={purchases}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey='id'
      />
    </>
  );
};

GastosTable.propTypes = {
  editAction: PropTypes.func.isRequired,
  purchases: PropTypes.array.isRequired,
  setPurchases: PropTypes.func.isRequired,
  originalPurchases: PropTypes.array.isRequired,
  departmentId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};
