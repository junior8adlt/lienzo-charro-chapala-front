import React, { useState } from 'react';
import { Table, Space, Modal, Input, Row, Button } from 'antd';
import { useMutation } from '@apollo/client';
import { GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE } from '../../Api/Queries';
import {
  ActionItem,
  CustomDatePicker,
  Subtitle,
  TableActions,
} from '../../globalStyles';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DELETE_MOVEMENT } from '../../Api/Mutations';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
const { confirm } = Modal;
const { Search } = Input;

export const MovementsTable = ({
  editAction,
  movements,
  setMovements,
  originalMovements,
  departmentId,
  loading,
  isSale,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [dateFilterValue, setDateFilterValue] = useState(null);
  const [deleteMovement] = useMutation(DELETE_MOVEMENT, {
    refetchQueries: [
      {
        query: GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
        variables: {
          departmentId: parseInt(departmentId),
          departmentType: isSale ? 'SALE' : 'PURCHASE',
        },
      },
    ],
  });
  const columns = [
    {
      title: 'Motivo',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Producto',
      dataIndex: ['product', 'name'],
      key: 'product',
    },
    {
      title: 'Cantidad',
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
      title: 'Tipo de venta',
      dataIndex: 'saleType',
      key: 'responsable',
      hidden: !isSale,
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
  ].filter((item) => !item.hidden);

  const onSearch = (value) => {
    setSearchValue(value);
    const filteredMovements = originalMovements.filter((movement) =>
      movement.description.toLowerCase().includes(value.toLowerCase())
    );
    setMovements(filteredMovements);
  };

  const deleteAction = (record) => {
    confirm({
      title: 'Estás seguro de eliminar este movimiento?',
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
  const deleteMutationAction = async (idMovement) => {
    try {
      await deleteMovement({
        variables: {
          deleteMovementId: parseInt(idMovement),
        },
      });
      Modal.success({
        content: 'Movimiento Eliminado',
      });
      const filterMovements = movements.filter(
        (movement) => +movement.id !== +idMovement
      );
      setMovements(filterMovements);
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
      setMovements(originalMovements);
      return;
    }
  };

  const searchByDate = () => {
    if (dateFilterValue) {
      const newPurchases = originalMovements.filter(
        (movement) =>
          dayjs(movement.date).format('DD/MM/YYYY') === dateFilterValue
      );
      setMovements(newPurchases);
      return;
    }
    setMovements(originalMovements);
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
        dataSource={movements}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey='id'
      />
    </>
  );
};

MovementsTable.propTypes = {
  editAction: PropTypes.func.isRequired,
  movements: PropTypes.array.isRequired,
  setMovements: PropTypes.func.isRequired,
  originalMovements: PropTypes.array.isRequired,
  departmentId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  isSale: PropTypes.bool.isRequired,
};
