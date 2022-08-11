import React from 'react';
import Spin from 'antd/es/spin';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingSpinner = <LoadingOutlined style={{ fontSize: 24, color: '#ffffff' }} spin />;

export const LoadingIndicator = () => {
  return <Spin indicator={LoadingSpinner} />;
};
