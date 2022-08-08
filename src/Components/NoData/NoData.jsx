import React from 'react';
import { noDataImg } from '../../assets';
import PropTypes from 'prop-types';
import './NoData.css';
export const NoData = ({ noDataTitle = 'No Data' }) => {
  return (
    <div className='no-data-wrapper'>
      <img src={noDataImg} alt='No Data Image' />
      <h1>{noDataTitle}</h1>
    </div>
  );
};

NoData.propTypes = {
  noDataTitle: PropTypes.string.isRequired,
};
