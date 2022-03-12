import React from 'react';
import PropTypes from 'prop-types';
import { CustomSelect } from '../../globalStyles';
const { Option } = CustomSelect;

export const Autocomplete = ({
  data,
  setAutocompleteValue,
  placeholder,
  fullW,
}) => {
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
    <CustomSelect
      showSearch
      placeholder={placeholder ? placeholder : 'Seleccione una opción'}
      optionFilterProp='children'
      onChange={onChange}
      allowClear
      fullW={fullW}
      className='auto-complete-select'
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {selectOptions()}
    </CustomSelect>
  );
};

Autocomplete.propTypes = {
  data: PropTypes.array.isRequired,
  setAutocompleteValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  fullW: PropTypes.bool,
};
