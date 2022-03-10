import { useMutation } from '@apollo/client';
import { Modal, Form, Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../Api/Mutations';
import { GET_PRODUCTS } from '../../../Api/Queries';
import { CustomInput } from '../../../globalStyles';

export const ProductosModalForm = ({
  visible,
  setVisible,
  isEdit,
  setIsEdit,
  productSelected,
  setProductSelected,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const customRef = useRef(null);
  const [createProduct] = useMutation(CREATE_PRODUCT, {
    update(cache, { data: { createProduct } }) {
      // Obtener el obj del cache que se desea actualizar
      const { getProducts } = cache.readQuery({
        query: GET_PRODUCTS,
      });

      // Reescribir el cache ya que es inmutable no debe modificarse
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: [...getProducts, createProduct],
        },
      });
    },
  });
  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const handleOk = () => customRef.current.click();

  const handleCancel = () => {
    setVisible(false);
    setIsEdit(false);
    setConfirmLoading(false);
    setProductSelected(null);
    form.resetFields();
  };
  const onFinish = async ({ name, price, factoryPrice, comission }) => {
    setConfirmLoading(true);
    try {
      if (isEdit) {
        const { data } = await updateProduct({
          variables: {
            updateProductId: parseInt(productSelected.id),
            input: {
              name,
              price: parseFloat(price),
              comission: parseFloat(comission),
              factoryPrice: parseFloat(factoryPrice),
            },
          },
        });
        if (data.updateProduct) {
          setConfirmLoading(false);
          handleCancel();
          Modal.success({
            content: 'Producto Actualizado',
          });
        }
        return;
      } else {
        const { data } = await createProduct({
          variables: {
            input: {
              name,
              price: parseFloat(price),
              factoryPrice: parseFloat(factoryPrice),
              comission: parseFloat(comission),
            },
          },
        });
        if (data.createProduct) {
          setConfirmLoading(false);
          handleCancel();
          Modal.success({
            content: 'Producto Creado',
          });
        }
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    Modal.error({
      title: 'Error',
      content: errorInfo,
    });
  };

  useEffect(() => {
    if (productSelected) {
      form.setFieldsValue(productSelected);
    }
  }, [productSelected]);

  return (
    <Modal
      title={isEdit ? 'Editar Producto' : 'Crear Producto'}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      okText={isEdit ? 'Editar' : 'Crear'}
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
          label='Nombre del Producto'
          name='name'
          rules={[{ required: true, message: 'El nombre es requerido' }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          label='Precio del Producto'
          name='price'
          rules={[{ required: true, message: 'El precio es requerido' }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          label='Precio Proveedor'
          name='factoryPrice'
          rules={[
            { required: true, message: 'El precio proveedor es requerido' },
          ]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          label='Comisión del Producto (en pesos)'
          name='comission'
          rules={[{ required: true, message: 'La comisión es requirida' }]}
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
