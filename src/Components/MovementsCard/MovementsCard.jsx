import React from 'react';
import PropTypes from 'prop-types';
import { DeleteFilled } from '@ant-design/icons';
import { Popconfirm } from 'antd';

import '../../Pages/Gastos/Movements.css';
export const MovementsCard = ({
  movement,
  onDelete,
  product,
  isTransfer,
  departmentFrom,
  departmentTo,
}) => {
  return (
    <div className='movements-card'>
      <div className='movements-card-header'>
        <h4>{movement.description}</h4>
        <Popconfirm
          title='¿Eliminar?'
          okText='Si'
          cancelText='No'
          onConfirm={() => onDelete(movement.id)}
        >
          <DeleteFilled style={{ marginLeft: 10 }} />
        </Popconfirm>
      </div>
      {isTransfer && (
        <p>
          Del departamento <span>{departmentFrom.name}</span> al{' '}
          <span>{departmentTo.name}</span>
        </p>
      )}
      <p>
        Producto: <span>{product.name}</span>
      </p>
      <p>
        Cantidad: <span>{movement.amount}</span>
      </p>
      <p>
        Total: <span>${movement.total}</span>
      </p>
    </div>
  );
};

MovementsCard.propTypes = {
  movement: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  isTransfer: PropTypes.bool.isRequired,
  departmentFrom: PropTypes.object,
  departmentTo: PropTypes.object,
};
