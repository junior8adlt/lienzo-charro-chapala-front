import { Col, Modal, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { Container, CustomButton, Header, Title } from '../../globalStyles';
import { GET_DEPARTMENTS_BY_TYPE } from '../../Api/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { DepartmentCard } from '../../Components/DepartmentCard/DepartmentCard';
import { DELETE_DEPARTMENT } from '../../Api/Mutations';
import { DepartmentsForm } from '../../Components/DepartmentsForm/DepartmentsForm';
import { NoData } from '../../Components/NoData/NoData';
import { LoadingOutlined } from '@ant-design/icons';

export const Barras = () => {
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [departmentSelected, setDepartmentSelected] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const { data, loading } = useQuery(GET_DEPARTMENTS_BY_TYPE, {
    variables: { type: 'shop' },
  });
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    refetchQueries: [{ query: GET_DEPARTMENTS_BY_TYPE, variables: { type: 'shop' } }],
  });
  const deleteAction = async (id) => {
    setDepartmentId(id);
    try {
      await deleteDepartment({
        variables: {
          deleteDepartmentId: parseInt(id),
        },
      });
      setDepartmentId(null);
      Modal.success({
        content: 'Barra Eliminada',
      });
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
    }
  };
  const editDepartment = (department) => {
    setVisible(true);
    setDepartmentSelected(department);
    setIsEdit(true);
  };
  return (
    <Container>
      <DepartmentsForm
        visible={visible}
        setVisible={setVisible}
        departmentSelected={departmentSelected}
        setDepartmentSelected={setDepartmentSelected}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        isShop
      />
      <Header>
        <Title>Barras</Title>
        <CustomButton onClick={() => setVisible(true)}>Crear Barra</CustomButton>
      </Header>
      <Spin
        spinning={loading}
        tip='Cargando...'
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Row style={loading ? { height: 400 } : { height: 'auto' }}>
          {!loading &&
            data &&
            data.getDepartments.length &&
            data.getDepartments.map((department) => (
              <Col span={4} key={department.id} style={{ marginLeft: 20, marginBottom: '3rem' }}>
                <DepartmentCard
                  department={department}
                  deleteAction={deleteAction}
                  editAction={editDepartment}
                />
              </Col>
            ))}
          {!loading && !data.getDepartments.length && (
            <NoData noDataTitle='No hay Barras creadas' />
          )}
        </Row>
      </Spin>
    </Container>
  );
};
