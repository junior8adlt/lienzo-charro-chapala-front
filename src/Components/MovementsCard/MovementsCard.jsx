import React from 'react';
import PropTypes from 'prop-types';
import { DeleteFilled } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import requiredIf from 'react-required-if';

import '../CreateMovement/Movements.css';
export const MovementsCard = ({
  movement,
  onDelete,
  product,
  isSale,
  department,
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
      {isSale && (
        <p>
          Barra <span>{department}</span>
        </p>
      )}
      {isTransfer && (
        <>
          <p>
            Barra de origen <span>{departmentFrom}</span>
          </p>
          <p>
            Barra de destino <span>{departmentTo}</span>
          </p>
        </>
      )}
      {product && (
        <p>
          Producto: <span>{product.name}</span>
        </p>
      )}
      {movement && movement.amount && (
        <p>
          Cantidad: <span>{movement.amount}</span>
        </p>
      )}
      {movement && movement.saleType && isSale && (
        <p>
          Tipo de venta: <span>{movement.saleType}</span>
        </p>
      )}

      {movement && (
        <p>
          Total: <span>${movement.total}</span>
        </p>
      )}
    </div>
  );
};

MovementsCard.propTypes = {
  movement: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  isSale: PropTypes.bool.isRequired,
  department: PropTypes.string,
  isTransfer: PropTypes.bool,
  departmentFrom: requiredIf(PropTypes.string, (props) => props.isTransfer),
  departmentTo: requiredIf(PropTypes.string, (props) => props.isTransfer),
};
