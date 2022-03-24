import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  Container,
  CustomButton,
  CustomDatePicker,
  CustomInput,
  CustomSelect,
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
const { Option } = CustomSelect;

export const CreateMovement = ({ isSale }) => {
  const [warehouseId, setWarehouseId] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [productId, setProductId] = useState(null);
  const [productsArray, setProductsArray] = useState([]);
  const [departmentsArray, setDepartmentsArray] = useState([]);
  const [movements, setMovements] = useState([]);
  const [saleTypes, setSaleTypes] = useState(null);
  const [amountTotal, setAmountTotal] = useState(0);
  const history = useHistory();
  const [form] = Form.useForm();

  const { data: dataProducts } = useQuery(GET_PRODUCTS);
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_BY_TYPE, {
    variables: { type: isSale ? 'shop' : 'warehouse' },
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

  const onFinish = async ({ description, amount, total, saleType }) => {
    setMovements([
      ...movements,
      {
        id: generateUUID(),
        description,
        amount,
        total,
        productId: productId,
        departmentId: warehouseId,
        ...(isSale && { saleType }),
      },
    ]);
    setProductId(null);
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

  const returnBarraInfo = (idDepartment) => {
    const department = departmentsArray.find(
      (department) => department.id === idDepartment
    );
    return department;
  };
  const removeMovement = (id) => {
    const newMovements = movements.filter((movement) => movement.id !== id);
    setMovements(newMovements);
  };

  const calculateTotalUseCallback = useCallback(() => {
    if (productId && amountTotal) {
      const product = returnProductInfo(productId);
      const total =
        parseInt(
          isSale && saleTypes === 'GENERAL'
            ? product.price
            : isSale && saleTypes === 'CORTESIA'
            ? product.factoryPrice
            : !isSale
            ? product.factoryPrice
            : 0
        ) * parseInt(amountTotal);
      form.setFieldsValue({ total });
    }
  }, [amountTotal, productId, saleTypes]);

  useEffect(() => {
    calculateTotalUseCallback();
  }, [calculateTotalUseCallback]);

  const createAllMovements = async () => {
    try {
      const movementWithOutId = movements.map((movement) => {
        return {
          description: movement.description,
          amount: parseInt(movement.amount),
          total: parseInt(movement.total),
          productId: parseInt(movement.productId),
          departmentId: parseInt(movement.departmentId),
          type: isSale ? 'SALE' : 'PURCHASE',
          ...(isSale && { saleType: movement.saleType }),
          date: dateValue,
        };
      });
      const { data } = await createMovements({
        variables: {
          input: movementWithOutId,
        },
        refetchQueries: [
          {
            query: GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
            variables: {
              departmentId: parseInt(warehouseId),
              departmentType: isSale ? 'SALE' : 'PURCHASE',
            },
          },
        ],
      });
      if (data.createMovements) {
        Modal.success({
          content: 'Movimientos Creado',
        });
        history.push(isSale ? '/ventas' : '/gastos');
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
        <Title>{isSale ? 'Crear Ventas' : 'Crear Gastos'}</Title>
        <HeaderActions style={{ justifyContent: 'flex-end' }}>
          <Autocomplete
            data={departmentsArray}
            placeholder={
              isSale ? 'Seleccione una barra' : 'Seleccione un inventario'
            }
            setAutocompleteValue={setWarehouseId}
          />
          <CustomDatePicker
            onChange={onChangeDate}
            format='YYYY-MM-DD'
            style={{ marginLeft: '20px' }}
            placeholder='Selecciona una fecha'
          />
        </HeaderActions>
      </Header>
      <Row>
        <Col span={12}>
          <div className='movements-wrapper'>
            {movements.map((movement) => (
              <MovementsCard
                key={movement.id}
                movement={movement}
                onDelete={removeMovement}
                product={returnProductInfo(movement.productId)}
                isSale={isSale}
                department={returnBarraInfo(movement.departmentId).name}
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
                label='Motivo'
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
                  value={productId}
                />
              </Form.Item>
              <Form.Item
                label='Cantidad'
                name='amount'
                rules={[
                  { required: true, message: 'La cantidad es requerida' },
                ]}
              >
                <CustomInput onChange={(e) => setAmountTotal(e.target.value)} />
              </Form.Item>
              {isSale && (
                <Form.Item
                  label='Tipo de venta'
                  name='saleType'
                  rules={[
                    {
                      required: true,
                      message: 'El tipo de venta es requerido',
                    },
                  ]}
                >
                  <CustomSelect
                    placeholder='Tipo de venta'
                    allowClear
                    fullW
                    onChange={(value) => setSaleTypes(value)}
                  >
                    <Option value='GENERAL'>General</Option>
                    <Option value='CORTESIA'>Cortesia</Option>
                    <Option value='GRATIS'>Gratis</Option>
                  </CustomSelect>
                </Form.Item>
              )}

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
                  {isSale ? 'Agregar venta' : 'Agregar gasto'}
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
          onClick={createAllMovements}
          disabled={!movements.length}
        >
          {isSale ? 'Crear ventas' : 'Crear gastos'}
        </CustomButton>
      </Row>
    </Container>
  );
};

CreateMovement.propTypes = {
  isSale: PropTypes.bool.isRequired,
};
