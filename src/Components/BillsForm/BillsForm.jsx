import { useMutation } from '@apollo/client';
import { Button, Col, Form, Modal, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { CREATE_BILL, UPDATE_BILL } from '../../Api/Mutations';
import { GET_BILLS } from '../../Api/Queries';
import { CustomDatePicker, CustomInput } from '../../globalStyles';

export const BillsForm = ({ visible, setVisible, bill, setBill, isEdit, setIsEdit }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const customRef = useRef(null);
  const [createBill] = useMutation(CREATE_BILL, {
    refetchQueries: [GET_BILLS],
  });
  const [updateBill] = useMutation(UPDATE_BILL, {
    refetchQueries: [GET_BILLS],
  });

  const handleOk = () => customRef.current.click();
  const handleCancel = () => {
    setVisible(false);
    setIsEdit(false);
    setConfirmLoading(false);
    setBill(null);
    form.resetFields();
  };

  useEffect(() => {
    if (isEdit && bill) {
      form.setFieldsValue(bill);
    }
  }, [bill]);

  const onFinish = async ({ description, total, date }) => {
    setConfirmLoading(true);
    const billObj = {
      description,
      total: parseFloat(total),
      date: isEdit ? bill.date : dayjs(date).format('YYYY-MM-DD'),
    };
    if (isEdit) {
      const { data } = await updateBill({
        variables: {
          updateBillId: parseInt(bill.id),
          input: billObj,
        },
      });
      if (data) {
        handleCancel();
        Modal.success({
          title: 'Exito',
          content: 'Se ha actualizado el bill correctamente',
        });
      }
    } else {
      const { data } = await createBill({
        variables: {
          input: billObj,
        },
      });
      if (data) {
        handleCancel();
        Modal.success({
          title: 'Exito',
          content: 'Se ha creado el bill correctamente',
        });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
    Modal.error({
      title: 'Error',
      content: errorInfo,
    });
  };

  return (
    <Modal
      title={isEdit ? `Editar` : `Crear`}
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
          label='Descripción'
          name='description'
          rules={[{ required: true, message: 'La descripcion es requerida' }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          label='Total del gasto'
          name='total'
          rules={[{ required: true, message: 'El total es requerido' }]}
        >
          <CustomInput />
        </Form.Item>
        {!isEdit && (
          <Form.Item
            label='Fecha del gasto'
            name='date'
            rules={[{ required: true, message: 'La fecha es requerida' }]}
          >
            <CustomDatePicker format='YYYY-MM-DD' placeholder='Selecciona una fecha' />
          </Form.Item>
        )}
        <Form.Item>
          <Button ref={customRef} style={{ display: 'none' }} htmlType='submit' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
