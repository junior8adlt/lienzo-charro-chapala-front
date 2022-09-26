import React, { useState } from 'react';
import { Table, Space, Input, Row, Button, Popconfirm } from 'antd';
import { ActionItem, CustomDatePicker, Subtitle, TableActions } from '../../../globalStyles';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
const { Search } = Input;

export const TransferenciasTable = ({
  editAction,
  deleteAction,
  transfers,
  setTransfers,
  originalTransfers,
  loading,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [dateFilterValue, setDateFilterValue] = useState(null);

  const columns = [
    {
      title: 'Motivo',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Del Departamento',
      dataIndex: ['departmentFrom', 'name'],
      key: 'departmentFrom',
    },
    {
      title: 'Al Departamento',
      dataIndex: ['departmentTo', 'name'],
      key: 'departmentTo',
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

  const onSearch = (value) => {
    setSearchValue(value);
    const filteredTransfers = originalTransfers.filter((movement) =>
      movement.description.toLowerCase().includes(value.toLowerCase()),
    );
    setTransfers(filteredTransfers);
  };

  const onChangeDate = (date, dateString) => {
    setDateFilterValue(dateString);
    if (!dateString) {
      setTransfers(originalTransfers);
      return;
    }
  };

  const searchByDate = () => {
    if (dateFilterValue) {
      const newPurchases = originalTransfers.filter(
        (movement) => dayjs(movement.date).format('DD/MM/YYYY') === dateFilterValue,
      );
      setTransfers(newPurchases);
      return;
    }
    setTransfers(originalTransfers);
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
        dataSource={transfers}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey='id'
        locale={{ emptyText: 'No se encontraron transferencias' }}
        mobileBreakPoint={768}
      />
    </>
  );
};

TransferenciasTable.propTypes = {
  editAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
  transfers: PropTypes.array.isRequired,
  setTransfers: PropTypes.func.isRequired,
  originalTransfers: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};
