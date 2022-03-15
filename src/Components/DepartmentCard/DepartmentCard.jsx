import React from 'react';
import PropTypes from 'prop-types';
import requiredIf from 'react-required-if';

import { Popconfirm } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import './DepartmentCard.css';
export const DepartmentCard = ({
  department,
  deleteAction,
  editAction,
  actions,
  actionButtonOnClick,
  actionButtonText,
}) => {
  return (
    <div className='custom-card'>
      <div className='card-header'>
        <div className='card-title'>
          <h3>{department.name}</h3>
        </div>
        <div className='card-actions'>
          <EditFilled onClick={() => editAction(department)} />
          <Popconfirm
            title='¿Eliminar?'
            okText='Si'
            cancelText='No'
            onConfirm={() => deleteAction(department.id)}
          >
            <DeleteFilled style={{ marginLeft: 10 }} />
          </Popconfirm>
        </div>
      </div>
      <div className='card-body'>
        <p>
          Ubicación: <span>{department.location}</span>
        </p>
        <p>
          Responsable: <span>{department.responsable}</span>
        </p>
      </div>
      {actions && (
        <div className='card-footer'>
          <span onClick={actionButtonOnClick}>{actionButtonText}</span>
        </div>
      )}
    </div>
  );
};

DepartmentCard.propTypes = {
  department: PropTypes.object.isRequired,
  deleteAction: PropTypes.func.isRequired,
  editAction: PropTypes.func.isRequired,
  actions: PropTypes.bool.isRequired,
  actionButtonOnClick: requiredIf(PropTypes.func, (props) => props.actions),
  actionButtonText: requiredIf(PropTypes.string, (props) => props.actions),
};
