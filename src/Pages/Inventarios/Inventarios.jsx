import { Col, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { Container, CustomButton, Header, Title } from '../../globalStyles';
import { GET_DEPARTMENTS_BY_TYPE } from '../../Api/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { DepartmentCard } from '../../Components/DepartmentCard/DepartmentCard';
import { DELETE_DEPARTMENT } from '../../Api/Mutations';
import { DepartmentsForm } from '../../Components/DepartmentsForm/DepartmentsForm';
export const Inventarios = () => {
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [departmentSelected, setDepartmentSelected] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const { data } = useQuery(GET_DEPARTMENTS_BY_TYPE, {
    variables: { type: 'warehouse' },
  });
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    refetchQueries: [
      { query: GET_DEPARTMENTS_BY_TYPE, variables: { type: 'warehouse' } },
    ],
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
        <CustomButton onClick={() => setVisible(true)}>
          Crear Inventario
        </CustomButton>
      </Header>
      <Row>
        {data &&
          data.getDepartments.map((department) => (
            <Col
              span={4}
              key={department.id}
              style={{ marginLeft: 20, marginBottom: '3rem' }}
            >
              <DepartmentCard
                department={department}
                deleteAction={deleteAction}
                editAction={editDepartment}
              />
            </Col>
          ))}
      </Row>
    </Container>
  );
};
