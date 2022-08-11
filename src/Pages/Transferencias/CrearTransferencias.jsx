import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
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
  GET_ALL_DEPARTMENTS,
  GET_PRODUCTS,
  GET_TRANSFERS_BY_DEPARTMENT_AND_TYPE,
} from '../../Api/Queries';
import { CREATE_TRANSFER } from '../../Api/Mutations';
import { generateUUID } from '../../utils/generateUUID';

import '../../Components/CreateMovement/Movements.css';
import { LoadingIndicator } from '../../Components/LoadingSpinner/LoadingSpinner';

export const CrearTransferencias = () => {
  const [transfers, setTransfers] = useState([]);
  const [departmentFrom, setDepartmentFrom] = useState(null);
  const [departmentTo, setDepartmentTo] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [productId, setProductId] = useState(null);
  const [productsArray, setProductsArray] = useState([]);
  const [departmentsArray, setDepartmentsArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [form] = Form.useForm();

  const { data: dataProducts } = useQuery(GET_PRODUCTS);
  const { data: departmentsData } = useQuery(GET_ALL_DEPARTMENTS);
  const [createTransfers] = useMutation(CREATE_TRANSFER);

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

  const onFinish = async ({ description, amount }) => {
    setTransfers([
      ...transfers,
      {
        id: generateUUID(),
        description,
        departmentIdFrom: departmentFrom,
        departmentIdTo: departmentTo,
        productId,
        amount,
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
    const department = departmentsArray.find((department) => department.id === idDepartment);
    return department;
  };
  const removeMovement = (id) => {
    const newTransfers = transfers.filter((transfer) => transfer.id !== id);
    setTransfers(newTransfers);
  };
  const createAllTransfers = async () => {
    setLoading(true);
    try {
      const transfersWithOutId = transfers.map((transfer) => {
        return {
          description: transfer.description,
          departmentIdFrom: parseInt(transfer.departmentIdFrom),
          departmentIdTo: parseInt(transfer.departmentIdTo),
          productId: parseInt(transfer.productId),
          amount: parseInt(transfer.amount),
          date: dateValue,
        };
      });
      const { data } = await createTransfers({
        variables: {
          input: transfersWithOutId,
        },
        refetchQueries: [
          {
            query: GET_TRANSFERS_BY_DEPARTMENT_AND_TYPE,
            variables: {
              getTransfersByDepartmentInput2: {
                id: parseInt(departmentTo),
                type: returnBarraInfo(departmentTo).type === 'warehouse' ? 'RETURN' : 'STOCK',
              },
            },
          },
        ],
      });

      if (data.createTransfers) {
        Modal.success({
          content: 'Transferencias Creadas',
        });
        history.push('/transferencias');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      Modal.error({
        title: 'Error',
        content: error,
      });
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Crear Transferencias</Title>
        <HeaderActions style={{ justifyContent: 'flex-end' }}>
          <Autocomplete
            data={departmentsArray}
            placeholder='Departamento de origen'
            setAutocompleteValue={setDepartmentFrom}
          />
          <span style={{ marginLeft: 20 }}></span>
          <Autocomplete
            data={departmentsArray}
            placeholder='Departamento de destino'
            setAutocompleteValue={setDepartmentTo}
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
            {transfers.map((transfer) => (
              <MovementsCard
                key={transfer.id}
                movement={transfer}
                onDelete={removeMovement}
                product={returnProductInfo(transfer.productId)}
                isSale={false}
                isTransfer
                departmentFrom={returnBarraInfo(departmentFrom).name}
                departmentTo={returnBarraInfo(departmentTo).name}
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
                rules={[{ required: true, message: 'El producto es requerido' }]}
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
                rules={[{ required: true, message: 'La cantidad es requerida' }]}
              >
                <CustomInput />
              </Form.Item>

              <Form.Item>
                <CustomButton
                  htmlType='submit'
                  disabled={!departmentFrom || !departmentTo || !dateValue || !productId}
                >
                  Agregar Transferencia
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
          disabled={!transfers.length || loading}
          onClick={createAllTransfers}
        >
          {loading ? <LoadingIndicator /> : <>Crear Transferencias</>}
        </CustomButton>
      </Row>
    </Container>
  );
};
