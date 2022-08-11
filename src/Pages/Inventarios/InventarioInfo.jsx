import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, CustomButton, Header, HeaderActions, Title } from '../../globalStyles';
import { InventarioStockTable } from './Components/InventarioStockTable';
import { FaChevronLeft } from 'react-icons/fa';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineArrowRight } from 'react-icons/ai';
import { Card, Col, Modal, Row, Spin } from 'antd';
import { CardContent, CardTitle } from '../Reportes/Reportes.elements';
import { LoadingOutlined } from '@ant-design/icons';
import { GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE, GET_SALES_OF_ALL_SHOPS } from '../../Api/Queries';
import { useApolloClient } from '@apollo/client';

export const InventarioInfo = () => {
  const [showTotals, setShowTotals] = useState(false);
  const { id } = useParams();
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [totalBills, setTotalBills] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const getBillTotal = async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_MOVEMENTS_BY_DEPARTMENT_AND_TYPE,
        variables: {
          departmentId: parseInt(id),
          departmentType: 'PURCHASE',
        },
      });
      if (data.getMovementsByDepartmentAndType) {
        const total = data.getMovementsByDepartmentAndType.reduce((acc, curr) => {
          return acc + +curr.total;
        }, 0);
        setTotalBills(total);
        setShowTotals(true);
        setLoading(false);
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
      setShowTotals(false);
      setLoading(false);
    }
  };

  const getSalesTotal = async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_SALES_OF_ALL_SHOPS,
        variables: {
          date: null,
        },
      });
      if (data.getSalesTotalByAllTheShops) {
        const total = data.getSalesTotalByAllTheShops.reduce((acc, curr) => {
          return acc + +curr.total;
        }, 0);
        setTotalSales(total);
        setShowTotals(true);
        setLoading(false);
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error,
      });
      setShowTotals(false);
      setLoading(false);
    }
  };

  const getProfit = () => {
    return totalSales - totalBills;
  };

  const resetTotals = () => {
    setShowTotals(false);
    setTotalBills(0);
    setTotalSales(0);
  };

  const returnIsPositive = () => {
    return Math.sign(getProfit());
  };

  return (
    <Container>
      <Header>
        <Title>Detalle de inventario</Title>
        <HeaderActions>
          <CustomButton
            style={{ marginRight: '10px' }}
            onClick={() => {
              getBillTotal();
              getSalesTotal();
            }}
          >
            Totalidad de gastos y ventas
          </CustomButton>
        </HeaderActions>
      </Header>

      <Row justify='space-between'>
        <Link to='/inventarios' style={{ display: 'flex', alignItems: 'center' }}>
          <FaChevronLeft />
          Regresar a inventarios
        </Link>
        {showTotals && (
          <CustomButton onClick={resetTotals} style={{ marginLeft: '10px' }}>
            Limpiar Totalidades
          </CustomButton>
        )}
      </Row>

      <Spin
        spinning={loading}
        tip='Cargando...'
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Row
          style={
            loading
              ? { height: 300, marginBottom: '2rem' }
              : { height: 'auto', marginBottom: '2rem', marginTop: '2rem' }
          }
          gutter={[16, 16]}
        >
          {showTotals && !loading && (
            <>
              <Col md={8} lg={8} xl={8} sm={24} xs={24}>
                <Card>
                  <CardTitle>Gastos hasta hoy</CardTitle>
                  <CardContent>${totalBills.toLocaleString()}</CardContent>
                </Card>
              </Col>
              <Col md={8} lg={8} xl={8} sm={24} xs={24}>
                <Card>
                  <CardTitle>Ventas totales hasta hoy</CardTitle>
                  <CardContent>${totalSales.toLocaleString()}</CardContent>
                </Card>
              </Col>
              <Col md={8} lg={8} xl={8} sm={24} xs={24}>
                <Card>
                  <CardTitle>Ganancias</CardTitle>
                  <CardContent>
                    <span
                      style={{
                        marginTop: 5,
                        color:
                          returnIsPositive() === 0
                            ? '#000000'
                            : returnIsPositive() === 1
                            ? '#00a854'
                            : '#f5222d',
                      }}
                    >
                      {' '}
                      {returnIsPositive() === 0 ? (
                        <AiOutlineArrowRight />
                      ) : returnIsPositive() === 1 ? (
                        <AiOutlineArrowUp />
                      ) : (
                        <AiOutlineArrowDown />
                      )}
                    </span>
                    <span
                      style={{
                        color:
                          returnIsPositive() === 0
                            ? '#000000'
                            : returnIsPositive() === 1
                            ? '#00a854'
                            : '#f5222d',
                      }}
                    >
                      {' '}
                      ${getProfit().toLocaleString()}
                    </span>
                  </CardContent>
                </Card>
              </Col>
            </>
          )}
        </Row>
      </Spin>

      <InventarioStockTable />
    </Container>
  );
};
