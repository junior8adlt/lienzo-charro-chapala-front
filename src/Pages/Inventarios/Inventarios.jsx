import { Col, Modal, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { Container, CustomButton, Header, Title } from '../../globalStyles';
import { GET_DEPARTMENTS_BY_TYPE } from '../../Api/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { DepartmentCard } from '../../Components/DepartmentCard/DepartmentCard';
import { DELETE_DEPARTMENT } from '../../Api/Mutations';
import { DepartmentsForm } from '../../Components/DepartmentsForm/DepartmentsForm';
import { useHistory } from 'react-router-dom';
import { NoData } from '../../Components/NoData/NoData';
import { LoadingOutlined } from '@ant-design/icons';

export const Inventarios = () => {
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [departmentSelected, setDepartmentSelected] = useState(null);
  const history = useHistory();
  const { data, loading } = useQuery(GET_DEPARTMENTS_BY_TYPE, {
    variables: { type: 'warehouse' },
  });
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    refetchQueries: [{ query: GET_DEPARTMENTS_BY_TYPE, variables: { type: 'warehouse' } }],
  });
  const deleteAction = async (id) => {
    try {
      await deleteDepartment({
        variables: {
          deleteDepartmentId: parseInt(id),
        },
      });
      Modal.success({
        content: 'Inventario Eliminado',
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
      />
      <Header>
        <Title>Inventarios</Title>
        <CustomButton onClick={() => setVisible(true)}>Crear Inventario</CustomButton>
      </Header>
      <Spin
        spinning={loading}
        tip='Cargando...'
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Row style={loading ? { height: 400 } : { height: 'auto' }}>
          {!loading &&
            data.getDepartments.length &&
            data.getDepartments.map((department) => (
              <Col span={4} key={department.id} style={{ marginLeft: 20, marginBottom: '3rem' }}>
                <DepartmentCard
                  department={department}
                  deleteAction={deleteAction}
                  editAction={editDepartment}
                  actions
                  actionButtonText='Ver Inventario'
                  actionButtonOnClick={() => history.push(`/inventarios/detalles/${department.id}`)}
                />
              </Col>
            ))}
          {!loading && !data.getDepartments.length && (
            <NoData noDataTitle='No hay inventarios creados' />
          )}
        </Row>
      </Spin>
    </Container>
  );
};
