import React from 'react';
import PropTypes from 'prop-types';
import { DeleteFilled } from '@ant-design/icons';
import { Popconfirm } from 'antd';

import '../CreateMovement/Movements.css';
export const MovementsCard = ({
  movement,
  onDelete,
  product,
  isSale,
  department,
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
      {isSale && (
        <p>
          Barra <span>{department}</span>
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
  isSale: PropTypes.bool.isRequired,
  department: PropTypes.string,
};
