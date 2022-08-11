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
      const found2 = movement.find((item) => +item.product.id === +element.product.id);
      if (found2) {
        newElement.name = element.product.name;
        newElement.takes = element.amount;
        newElement.sales = found2.amount;
        newElement.totalSales = found2.total;
      } else {
        newElement.sales = 0;
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
