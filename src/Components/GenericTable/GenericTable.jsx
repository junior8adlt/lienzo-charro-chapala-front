import { Table } from 'antd';
import React from 'react';

export const GenericTable = ({ columns, data, loading, emptyText }) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 10 }}
      rowKey='id'
      locale={{ emptyText: emptyText ? emptyText : 'No Data' }}
    />
  );
};
