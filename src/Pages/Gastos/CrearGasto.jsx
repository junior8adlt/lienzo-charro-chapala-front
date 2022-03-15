import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import {
  Container,
  CustomButton,
  CustomDatePicker,
  CustomInput,
  Header,
  HeaderActions,
  Title,
} from '../../globalStyles';
import { Modal, Form } from 'antd';
import { MovementsCard } from '../../Components/MovementsCard/MovementsCard';
import { Autocomplete } from '../../Components/Autocomplete/Autocomplete';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_DEPARTMENTS_BY_TYPE,
  GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
  GET_PRODUCTS,
} from '../../Api/Queries';
import { generateUUID } from '../../utils/generateUUID';
import { CREATE_MOVEMENT } from '../../Api/Mutations';

import './Movements.css';

export const CrearGasto = () => {
  const [warehouseId, setWarehouseId] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [productId, setProductId] = useState(null);
  const [productsArray, setProductsArray] = useState([]);
  const [departmentsArray, setDepartmentsArray] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const history = useHistory();
  const [form] = Form.useForm();

  const { data: dataProducts } = useQuery(GET_PRODUCTS);
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_BY_TYPE, {
    variables: { type: 'warehouse' },
  });
  const [createMovements] = useMutation(CREATE_MOVEMENT);

  useEffect(() => {
    if (dataProducts) {
      setProductsArray(dataProducts.getProducts);
    }
  }, [dataProducts]);

  useEffect(() => {
    if (departmentsData) {
      setDepartmentsArray(departmentsData.getDepartments);
    }
  }, [departmentsData]);

  const onFinish = async ({ description, amount, total }) => {
    setPurchases([
      ...purchases,
      {
        id: generateUUID(),
        description,
        amount,
        total,
        productId: productId,
        departmentId: warehouseId,
      },
    ]);
    form.resetFields();
  };

  const onChangeDate = (date, dateString) => {
    setDateValue(dateString);
  };

  const onFinishFailed = (errorInfo) => {
    Modal.error({
      title: 'Error',
      content: errorInfo,
    });
  };
  const returnProductInfo = (idProduct) => {
    const product = productsArray.find((product) => product.id === idProduct);
    return product;
  };
  const removePurchase = (id) => {
    const newPurchases = purchases.filter((purchase) => purchase.id !== id);
    setPurchases(newPurchases);
  };

  const calculateTotal = (e) => {
    const amount = e.target.value;
    if (productId && amount) {
      const product = returnProductInfo(productId);
      const total = parseInt(product.factoryPrice) * parseInt(amount);
      form.setFieldsValue({ total });
    }
  };

  const createPurchases = async () => {
    try {
      const purchaseWithOutId = purchases.map((purchase) => {
        return {
          description: purchase.description,
          amount: parseInt(purchase.amount),
          total: parseInt(purchase.total),
          productId: parseInt(purchase.productId),
          departmentId: parseInt(purchase.departmentId),
          type: 'PURCHASE',
          date: dayjs(dateValue).format('YYYY-MM-DD'),
        };
      });
      const { data } = await createMovements({
        variables: {
          input: purchaseWithOutId,
        },
        refetchQueries: [
          {
            query: GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
            variables: {
              departmentId: parseInt(warehouseId),
              departmentType: 'PURCHASE',
            },
          },
        ],
      });
      if (data.createMovements) {
        Modal.success({
          content: 'Gasto Creado',
        });
        history.push('/gastos');
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
    }
  };

  return (
    <Container>
      <Header>
        <Title>Crear Gastos</Title>
        <HeaderActions style={{ justifyContent: 'flex-end' }}>
          <Autocomplete
            data={departmentsArray}
            placeholder='Seleccione un inventario'
            setAutocompleteValue={setWarehouseId}
          />
          <CustomDatePicker
            onChange={onChangeDate}
            format='DD/MM/YYYY'
            style={{ marginLeft: '20px' }}
            placeholder='Selecciona una fecha'
          />
        </HeaderActions>
      </Header>
      <Row>
        <Col span={12}>
          <div className='movements-wrapper'>
            {purchases.map((purchase) => (
              <MovementsCard
                key={purchase.id}
                movement={purchase}
                onDelete={removePurchase}
                product={returnProductInfo(purchase.productId)}
                isTransfer={false}
              />
            ))}
          </div>
        </Col>
        <Col span={12}>
          <div className='movements-form'>
            <Form
              name='basic'
              layout='vertical'
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete='off'
              form={form}
            >
              <Form.Item
                label='Motivo del gasto'
                name='description'
                rules={[{ required: true, message: 'El motivo es requerido' }]}
              >
                <CustomInput />
              </Form.Item>
              <Form.Item
                label='Producto'
                rules={[
                  { required: true, message: 'El producto es requerido' },
                ]}
              >
                <Autocomplete
                  data={productsArray}
                  placeholder='Seleccione un producto'
                  setAutocompleteValue={setProductId}
                  fullW
                />
              </Form.Item>
              <Form.Item
                label='Cantidad'
                name='amount'
                rules={[
                  { required: true, message: 'La cantidad es requerida' },
                ]}
              >
                <CustomInput onChange={calculateTotal} />
              </Form.Item>
              <Form.Item
                label='Total'
                name='total'
                rules={[{ required: true, message: 'El total es requirido' }]}
              >
                <CustomInput />
              </Form.Item>

              <Form.Item>
                <CustomButton
                  htmlType='submit'
                  disabled={!warehouseId || !dateValue || !productId}
                >
                  Agregar gasto
                </CustomButton>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
      <Row justify='end' align='middle'>
        <CustomButton
          style={{
            marginTop: '3rem',
          }}
          onClick={createPurchases}
          disabled={!purchases.length}
        >
          Crear Gastos
        </CustomButton>
      </Row>
    </Container>
  );
};
