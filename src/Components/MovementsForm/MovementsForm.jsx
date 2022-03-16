import { useMutation, useQuery } from '@apollo/client';
import { Modal, Form, Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
  GET_PRODUCTS,
} from '../../Api/Queries';
import { CustomInput } from '../../globalStyles';
import dayjs from 'dayjs';
import { Autocomplete } from '../../Components/Autocomplete/Autocomplete';
import { UPDATE_MOVEMENT } from '../../Api/Mutations';

export const MovementsForm = ({
  visible,
  setVisible,
  movementSelected,
  setMovementSelected,
  movements,
  setMovements,
  setOriginalMovements,
  isSale,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [productId, setProductId] = useState(null);
  const [productsArray, setProductsArray] = useState([]);
  const [warehouseId, setWarehouseId] = useState(null);

  const [form] = Form.useForm();
  const customRef = useRef(null);

  const { data: dataProducts } = useQuery(GET_PRODUCTS);
  const [updateMovement] = useMutation(UPDATE_MOVEMENT, {
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

  useEffect(() => {
    if (dataProducts) {
      setProductsArray(dataProducts.getProducts);
    }
  }, [dataProducts]);

  useEffect(() => {
    if (movementSelected) {
      form.setFieldsValue(movementSelected);
      setProductId(movementSelected.product.id);
      setWarehouseId(movementSelected.department.id);
    }
  }, [movementSelected]);

  const handleOk = () => customRef.current.click();

  const handleCancel = () => {
    setVisible(false);
    setConfirmLoading(false);
    setMovementSelected(null);
    form.resetFields();
  };
  const onFinish = async ({ description, amount, total }) => {
    setConfirmLoading(true);
    try {
      const { data } = await updateMovement({
        variables: {
          updateMovementId: parseInt(movementSelected.id),
          input: {
            description,
            amount: parseInt(amount),
            total: parseInt(total),
            type: isSale ? 'SALE' : 'PURCHASE',
            departmentId: parseInt(warehouseId),
            productId: parseInt(productId),
            date: dayjs(movementSelected.date).format('YYYY-MM-DD'),
          },
        },
      });
      if (data.updateMovement) {
        Modal.success({
          content: 'Movimiento Actualizado',
        });
        const newMovements = movements.map((movement) => {
          if (movement.id === movementSelected.id) {
            return {
              ...movement,
              description,
              amount: parseInt(amount),
              total: parseInt(total),
              product: returnProductInfo(productId),
            };
          } else {
            return movement;
          }
        });
        setMovements(newMovements);
        setOriginalMovements(newMovements);
        handleCancel();
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
      setConfirmLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    Modal.error({
      title: 'Error',
      content: errorInfo,
    });
  };

  const calculateTotal = (e) => {
    const amount = e.target.value;
    if (productId && amount) {
      const product = returnProductInfo(productId);
      const total = parseInt(product.factoryPrice) * parseInt(amount);
      form.setFieldsValue({ total });
    }
  };

  const returnProductInfo = (idProduct) => {
    const product = productsArray.find((product) => product.id === idProduct);
    return product;
  };

  return (
    <Modal
      title='Editar Movimiento'
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText='Editar'
      cancelText='Cancelar'
    >
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
          <Button
            ref={customRef}
            style={{ display: 'none' }}
            htmlType='submit'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

MovementsForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  movementSelected: PropTypes.object,
  setMovementSelected: PropTypes.func.isRequired,
  movements: PropTypes.array.isRequired,
  setMovements: PropTypes.func.isRequired,
  setOriginalMovements: PropTypes.func.isRequired,
  isSale: PropTypes.bool.isRequired,
};
