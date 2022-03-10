import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Button } from 'antd';
import { useMutation } from '@apollo/client';
import { CREATE_DEPARTMENT, UPDATE_DEPARTMENT } from '../../Api/Mutations';
import { GET_DEPARTMENTS_BY_TYPE } from '../../Api/Queries';
import { CustomInput } from '../../globalStyles';

export const DepartmentsForm = ({
  visible,
  setVisible,
  departmentSelected,
  setDepartmentSelected,
  isEdit,
  setIsEdit,
  isShop,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const customRef = useRef(null);

  const [createDepartment] = useMutation(CREATE_DEPARTMENT, {
    update(cache, { data: { createDepartment } }) {
      // Obtener el obj del cache que se desea actualizar
      const { getDepartments } = cache.readQuery({
        query: GET_DEPARTMENTS_BY_TYPE,
        variables: { type: isShop ? 'shop' : 'warehouse' },
      });

      // Reescribir el cache ya que es inmutable no debe modificarse
      cache.writeQuery({
        query: GET_DEPARTMENTS_BY_TYPE,
        data: {
          getDepartments: [...getDepartments, createDepartment],
        },
        variables: { type: isShop ? 'shop' : 'warehouse' },
      });
    },
  });
  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT);

  const handleOk = () => customRef.current.click();

  const onFinish = async ({ name, location, responsable }) => {
    setConfirmLoading(true);
    try {
      if (isEdit) {
        const { data } = await updateDepartment({
          variables: {
            updateDepartmentId: parseInt(departmentSelected.id),
            input: {
              name,
              location,
              responsable,
            },
          },
        });
        if (data.updateDepartment) {
          setConfirmLoading(false);
          handleCancel();
          Modal.success({
            content: isShop ? 'Barra Actualizada' : 'Inventario Actualizado',
          });
        }
        return;
      } else {
        const { data } = await createDepartment({
          variables: {
            input: {
              name,
              location,
              responsable,
              type: isShop ? 'shop' : 'warehouse',
            },
          },
        });
        if (data.createDepartment) {
          setConfirmLoading(false);
          handleCancel();
          Modal.success({
            content: isShop ? 'Barra Creada' : 'Inventario Creado',
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

  const handleCancel = () => {
    setVisible(false);
    setIsEdit(false);
    setConfirmLoading(false);
    setDepartmentSelected(null);
    form.resetFields();
  };

  useEffect(() => {
    if (departmentSelected) {
      form.setFieldsValue(departmentSelected);
    }
  }, [departmentSelected]);

  return (
    <Modal
      title={
        isEdit
          ? `Editar ${isShop ? 'Barra' : 'Inventario'}`
          : `Crear ${isShop ? 'Barra' : 'Inventario'}`
      }
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
          label='Nombre'
          name='name'
          rules={[{ required: true, message: 'El nombre es requerido' }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          label='Ubicación'
          name='location'
          rules={[{ required: true, message: 'La ubicación es requerida' }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          label='Responsable'
          name='responsable'
          rules={[{ required: true, message: 'El responsable es requerido' }]}
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
