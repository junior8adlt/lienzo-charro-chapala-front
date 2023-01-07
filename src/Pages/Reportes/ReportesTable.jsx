import { Table } from 'antd';
import React from 'react';

export const ReportesTable = ({ movements, transfers }) => {
  const [transferReturned, setTransferReturned] = React.useState([]);
  const [transfer, setTransfer] = React.useState([]);
  const [movement, setMovement] = React.useState([]);

  React.useEffect(() => {
    if (movements && transfers) {
      setTransfer(transfers.send);
      setTransferReturned(transfers.returned);
      setMovement(movements);
    }
  }, [transfers, movements]);

  const columns = [
    {
      title: 'Producto',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Se llevo',
      dataIndex: 'takes',
      key: 'takes',
    },
    {
      title: 'Vendio',
      dataIndex: 'sales',
      key: 'sales',
    },
    {
      title: 'Cortesia',
      dataIndex: 'courtesy',
      key: 'courtesy',
    },
    {
      title: 'Gratis',
      dataIndex: 'free',
      key: 'free',
    },
    {
      title: 'Regreso',
      dataIndex: 'returns',
      key: 'returns',
    },
    {
      title: 'Total Vendido',
      dataIndex: 'totalSales',
      key: 'totalSales',
      render: (totalSales) => `${totalSales !== null ? '$' + totalSales : 'N/D'}`,
    },
  ];

  const buildReportData = () => {
    const reportData = [];

    for (let index = 0; index < transfer.length; index++) {
      const element = transfer[index];
      const newElement = {};
      newElement.takes = element.amount;
      const found = transferReturned.find((item) => +item.product.id === +element.product.id);
      if (found) {
        newElement.returns = found.amount;
      } else {
        newElement.returns = 0;
      }
      const productSalesAmoun = movement.find(
        (item) => +item.product.id === +element.product.id && item.saleType === 'GENERAL',
      );
      const productFreeAmount = movement.find(
        (item) => +item.product.id === +element.product.id && item.saleType === 'GRATIS',
      );
      const productCourtesyAmount = movement.find(
        (item) => +item.product.id === +element.product.id && item.saleType === 'CORTESIA',
      );
      newElement.name = element.product.name;
      newElement.takes = element.amount;
      if (productSalesAmoun) {
        newElement.sales = productSalesAmoun.amount;
        newElement.totalSales = productSalesAmoun.total;
      } else {
        newElement.sales = 0;
      }
      if (productFreeAmount) {
        newElement.free = productFreeAmount.amount;
      } else {
        newElement.free = 0;
      }
      if (productCourtesyAmount) {
        newElement.courtesy = productCourtesyAmount.amount;
      } else {
        newElement.courtesy = 0;
      }

      reportData.push(newElement);
    }
    return reportData;
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={buildReportData()}
        loading={false}
        pagination={{ pageSize: 10 }}
        rowKey='id'
        locale={{ emptyText: 'No se encontraron movimientos' }}
      />
    </>
  );
};
