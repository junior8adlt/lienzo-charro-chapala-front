import React, { useState, useEffect } from 'react';
import { Table, Space, Modal, Input } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../Api/Queries';
import { ActionItem } from '../../../globalStyles';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DELETE_PRODUCT } from '../../../Api/Mutations';
import PropTypes from 'prop-types';
const { confirm } = Modal;
const { Search } = Input;

export const ProductosTable = ({ editAction }) => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [productId, setProductId] = useState('');
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    update(cache) {
      // Obtener una copia del cache que se desea actualizar
      const { getProducts } = cache.readQuery({
        query: GET_PRODUCTS,
      });
      // Reescribir el cache ya que es inmutable no debe modificarse
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: getProducts.filter(
            (product) => +product.id !== +productId
          ),
        },
      });
    },
  });
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend'],
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price !== null ? '$' + price : 'N/D'}`,
    },
    {
      title: 'Precio Proveedor',
      dataIndex: 'factoryPrice',
      key: 'factoryPrice',
      render: (factoryPrice) =>
        `${factoryPrice !== null ? '$' + factoryPrice : 'N/D'}`,
    },
    {
      title: 'Comisión',
      dataIndex: 'comission',
      key: 'comission',
      render: (comission) => `${comission !== null ? '$' + comission : 'N/D'}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size='middle'>
          <ActionItem onClick={() => editAction(record)}>Editar</ActionItem>
          <ActionItem onClick={() => deleteAction(record)}>Eliminar</ActionItem>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (data) {
      setProducts(data.getProducts);
      setOriginalProducts(data.getProducts);
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
    setProducts(
      originalProducts.filter((product) => product.name.includes(value))
    );
  };

  const deleteAction = (record) => {
    confirm({
      title: 'Estás seguro de eliminar este producto?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setProductId(record.id);
        deleteMutationAction(record.id);
      },
      onCancel() {},
    });
  };
  const deleteMutationAction = async (idProduct) => {
    try {
      await deleteProduct({
        variables: {
          deleteProductId: parseInt(idProduct),
        },
      });
      Modal.success({
        content: 'Producto Eliminado',
      });
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
    }
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
      />
    </>
  );
};

ProductosTable.propTypes = {
  editAction: PropTypes.func.isRequired,
};
