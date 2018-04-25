import PropTypes from 'prop-types';
import React from 'react';
import SelectInput from './SelectInput';

const searchTypeOptions = [
  { key: 'artist', value: 'Artist' },
  { key: 'album', value: 'Album' }
];

function SearchTypeSelectInput(props) {
  const values = [...searchTypeOptions];

  return (
    <SelectInput
      {...props}
      values={values}
    />
  );
}

export default SearchTypeSelectInput;
