import { useApolloClient, useQuery } from '@apollo/client';
import { Col, Modal, Row, Card, Spin } from 'antd';
import React, { useState } from 'react';
import { GET_DEPARTMENTS_BY_TYPE, GET_REPORT_BY_DEPARTMENT_AND_DATE } from '../../Api/Queries';
import { Autocomplete } from '../../Components/Autocomplete/Autocomplete';
import {
  Container,
  CustomButton,
  CustomDatePicker,
  Header,
  HeaderActions,
  Title,
} from '../../globalStyles';
import { CardContent, CardTitle, Subtitle } from './Reportes.elements';
import { ReportesTable } from './ReportesTable';
import { LoadingOutlined } from '@ant-design/icons';

export const Reportes = () => {
  const [departmentsArray, setDepartmentsArray] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();

  useQuery(GET_DEPARTMENTS_BY_TYPE, {
    variables: { type: 'shop' },
    onCompleted: (data) => {
      if (data && data.getDepartments) {
        setDepartmentsArray(data.getDepartments);
      }
    },
  });

  const onChangeDate = (date, dateString) => {
    setDateValue(dateString);
  };

  const departmentName = (departmentId) => {
    const department = departmentsArray.find((department) => department.id === departmentId);
    return department ? department.name : null;
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_REPORT_BY_DEPARTMENT_AND_DATE,
        variables: {
          departmentId: parseInt(departmentId),
          date: dateValue,
        },
      });
      setReport(data.getResumeByDepartmentAndDate);
      setLoading(false);
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
      setLoading(false);
    }
  };

  const totalCommission = (movements) => {
    const commission = movements.reduce((acc, movement) => {
      if (movement.saleType && movement.saleType === 'CORTESIA') {
        return acc + movement.totalSaleAtFactoryCost;
      }
      return acc;
    }, 0);
    return commission;
  };

  const totalCommissionAmount = (movements) => {
    const commissionAmount = movements.reduce((acc, movement) => {
      if (movement.saleType && movement.saleType === 'CORTESIA') {
        return acc + Number(movement.amount);
      }
      return acc;
    }, 0);
    return commissionAmount;
  };

  const productsThatReturns = (transfers) => {
    const totalReturn = transfers.reduce((acc, transfer) => {
      return acc + transfer.amount;
    }, 0);
    return totalReturn;
  };

  return (
    <Container>
      <Header>
        <Title>Reporte</Title>
        <HeaderActions style={{ justifyContent: 'flex-end' }}>
          <Autocomplete
            data={departmentsArray}
            placeholder='Seleccione una barra'
            setAutocompleteValue={setDepartmentId}
          />
          <CustomDatePicker
            onChange={onChangeDate}
            format='YYYY-MM-DD'
            style={{ marginLeft: '20px' }}
            placeholder='Selecciona una fecha'
          />
          <CustomButton
            style={{ marginLeft: '20px' }}
            onClick={generateReport}
            disabled={!departmentId || !dateValue}
          >
            Generar Reporte
          </CustomButton>
        </HeaderActions>
      </Header>
      <Spin
        spinning={loading}
        tip='Cargando...'
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Row style={loading ? { height: 400 } : { height: 'auto' }}>
          {report && (
            <>
              <Col span={24}>
                <Subtitle>Métricas Barra {departmentName(departmentId)}:</Subtitle>
              </Col>
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Producto Entregado</CardTitle>
                    <CardContent>{report.metrics.totalAmountProductTransfered}</CardContent>
                  </Card>
                </Col>

                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Producto Vendido</CardTitle>
                    <CardContent>{report.metrics.totalAmountSaleProduct}</CardContent>
                  </Card>
                </Col>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Venta Total Del Producto</CardTitle>
                    <CardContent>${report.metrics.totalSale}</CardContent>
                  </Card>
                </Col>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Comisión Para La Barra</CardTitle>
                    <CardContent>${report.metrics.totalSaleCommission}</CardContent>
                  </Card>
                </Col>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Cortesías</CardTitle>
                    <CardContent>{totalCommissionAmount(report.movements)}</CardContent>
                  </Card>
                </Col>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Total De Cortesías</CardTitle>
                    <CardContent>${totalCommission(report.movements)}</CardContent>
                  </Card>
                </Col>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Total A Entregar</CardTitle>
                    <CardContent>${report.metrics.wareHouseTotalFinal}</CardContent>
                  </Card>
                </Col>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Producto Regalado</CardTitle>
                    <CardContent>{report.metrics.totalFreeAmountSaleProduct}</CardContent>
                  </Card>
                </Col>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Total Producto Regalado</CardTitle>
                    <CardContent>${report.metrics.totalFreeSale}</CardContent>
                  </Card>
                </Col>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Producto Que Debió Regresar</CardTitle>
                    <CardContent>{report.metrics.totalProductAmountToReturn}</CardContent>
                  </Card>
                </Col>
                <Col md={8} lg={8} xl={6} sm={24} xs={24}>
                  <Card>
                    <CardTitle>Producto Que Regreso</CardTitle>
                    <CardContent>{productsThatReturns(report?.transfers['returned'])}</CardContent>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]} style={{ width: '100%', marginTop: '2rem' }}>
                <>
                  <Col span={24}>
                    <Subtitle>Más detalles:</Subtitle>
                    <ReportesTable movements={report.movements} transfers={report.transfers} />
                  </Col>
                </>
              </Row>
            </>
          )}
        </Row>
      </Spin>
    </Container>
  );
};
