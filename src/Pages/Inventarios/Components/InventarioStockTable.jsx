import React, { useState, useEffect } from 'react';
import { Table, Modal, Input } from 'antd';
import { useQuery } from '@apollo/client';
import { GET_INVENTORY_STOCK } from '../../../Api/Queries';
import { useParams } from 'react-router-dom';
const { Search } = Input;

export const InventarioStockTable = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_INVENTORY_STOCK, {
    variables: {
      getInventoryStockId: parseInt(id),
    },
  });
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const columns = [
    {
      title: 'Producto',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend'],
    },
    {
      title: 'Cantidad en stock',
      dataIndex: 'sum',
      key: 'sum',
    },
  ];
  useEffect(() => {
    if (data) {
      setProducts(data.getInventoryStock);
      setOriginalProducts(data.getInventoryStock);
    }
  }, [data]);
  if (error) {
    Modal.error({
      title: 'Error',
      content: error,
    });
  }
  const onSearch = (value) => {
    setSearchValue(value);
    setProducts(originalProducts.filter((product) => product.name.includes(value)));
  };

  return (
    <>
      <div className='search-action'>
        <Search
          placeholder='Buscar Por Nombre'
          onSearch={onSearch}
          enterButton
          size='large'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey='id'
        locale={{ emptyText: 'No se encontraron productos' }}
      />
    </>
  );
};
