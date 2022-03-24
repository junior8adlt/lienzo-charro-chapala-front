import { useMutation, useQuery } from '@apollo/client';
import { Modal, Form, Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { UPDATE_TRANSFER } from '../../../Api/Mutations';
import {
  GET_ALL_DEPARTMENTS,
  GET_PRODUCTS,
  GET_TRANSFERS_BY_DEPARTMENT_AND_TYPE,
} from '../../../Api/Queries';
import { Autocomplete } from '../../../Components/Autocomplete/Autocomplete';

import { CustomInput } from '../../../globalStyles';

export const TransferenciaModalForm = ({
  visible,
  setVisible,
  transferSelected,
  setTransferSelected,
  setTransfers,
  setOriginalTransfers,
  transfers,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [departmentFrom, setDepartmentFrom] = useState(null);
  const [departmentTo, setDepartmentTo] = useState(null);
  const [productId, setProductId] = useState(null);
  const [productsArray, setProductsArray] = useState([]);
  const [departmentsArray, setDepartmentsArray] = useState([]);
  const [form] = Form.useForm();
  const customRef = useRef(null);
  const { data: dataProducts } = useQuery(GET_PRODUCTS);
  const { data: departmentsData } = useQuery(GET_ALL_DEPARTMENTS);

  const [updateTransfer] = useMutation(UPDATE_TRANSFER);

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

  useEffect(() => {
    if (transferSelected) {
      form.setFieldsValue(transferSelected);
      setProductId(transferSelected.product.id);
      setDepartmentFrom(transferSelected.departmentFrom.id);
      setDepartmentTo(transferSelected.departmentTo.id);
    }
  }, [transferSelected]);

  const handleOk = () => customRef.current.click();

  const handleCancel = () => {
    setVisible(false);
    setConfirmLoading(false);
    setTransferSelected(null);
    form.resetFields();
  };
  const onFinish = async ({ description, amount }) => {
    setConfirmLoading(true);
    try {
      const { data } = await updateTransfer({
        variables: {
          updateTransferId: parseInt(transferSelected.id),
          input: {
            description,
            departmentIdFrom: parseInt(departmentFrom),
            departmentIdTo: parseInt(departmentTo),
            productId: parseInt(productId),
            amount: parseInt(amount),
            date: transferSelected.date,
          },
        },
        refetchQueries: [
          {
            query: GET_TRANSFERS_BY_DEPARTMENT_AND_TYPE,
            variables: {
              getTransfersByDepartmentInput2: {
                id: parseInt(departmentTo),
                type:
                  returnBarraInfo(departmentTo).type === 'warehouse'
                    ? 'RETURN'
                    : 'STOCK',
              },
            },
          },
        ],
      });
      if (data.updateTransfer) {
        handleCancel();
        Modal.success({
          content: 'Transferencia Actualizada',
        });
        // replace the old transfer with the new one
        const newTransfers = transfers.map((transfer) => {
          if (transfer.id === transferSelected.id) {
            return {
              description,
              amount: parseInt(amount),
              date: transferSelected.date,
              departmentFrom: returnBarraInfo(departmentFrom),
              departmentTo: returnBarraInfo(departmentTo),
              id: parseInt(transferSelected.id),
              product: returnProductInfo(productId),
            };
          }
          return transfer;
        });
        setTransfers(newTransfers);
        setOriginalTransfers(newTransfers);
      }
    } catch (error) {
      console.log(error);
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

  const returnBarraInfo = (idDepartment) => {
    const department = departmentsArray.find(
      (department) => department.id === idDepartment
    );
    return department;
  };

  const returnProductInfo = (idProduct) => {
    const product = productsArray.find((product) => product.id === idProduct);
    return product;
  };

  return (
    <Modal
      title='Editar Transferencia'
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
        <Form.Item label='Departamento de origen'>
          <Autocomplete
            data={departmentsArray}
            placeholder='Departamento de origen'
            setAutocompleteValue={setDepartmentFrom}
            fullW
            value={departmentFrom}
          />
        </Form.Item>
        <Form.Item label='Departamento de destino'>
          <Autocomplete
            data={departmentsArray}
            placeholder='Departamento de destino'
            setAutocompleteValue={setDepartmentTo}
            fullW
            value={departmentTo}
          />
        </Form.Item>
        <Form.Item label='Producto'>
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
