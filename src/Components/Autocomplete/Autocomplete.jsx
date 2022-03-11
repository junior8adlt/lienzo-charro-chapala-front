import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import './Autocomplete.css';
const { Option } = Select;

export const Autocomplete = ({ data, setAutocompleteValue, placeholder }) => {
  const onChange = (value) => {
    setAutocompleteValue(value);
  };

  const selectOptions = () => {
    return data.map((item) => {
      return (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      );
    });
  };
  return (
    <Select
      showSearch
      placeholder={placeholder ? placeholder : 'Seleccione una opción'}
      optionFilterProp='children'
      onChange={onChange}
      allowClear
      className='auto-complete-select'
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {selectOptions()}
    </Select>
  );
};

Autocomplete.propTypes = {
  data: PropTypes.array.isRequired,
  setAutocompleteValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
