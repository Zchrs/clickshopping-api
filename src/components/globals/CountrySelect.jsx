/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';

import ReactCountryFlagsSelect from 'react-country-flags-select';

export const CountrySelect = ({ placeholder, id, onClick, onSelect, onChange, required, label, selected, selectedCountry}) => {


  return (
    <div className="main-container">
       <label className='span' htmlFor={id}>
        {required && <span>*</span>}{label}
      </label>
      <ReactCountryFlagsSelect
        selected={selected}
        id="country"
        name="country"
        clearIcon={false}
        onSelect={onSelect}
        onChange={onChange}
        searchPlaceholder={placeholder}
        fullWidth
        searchable
      />
       {selectedCountry && (
      <svg className='svg' onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 94.926 94.926" data-testid="clear-icon">
        <path d="M55.931 47.463 94.306 9.09a2.118 2.118 0 0 0 0-2.994L88.833.62a2.123 2.123 0 0 0-2.996 0L47.463 38.994 9.089.62c-.795-.795-2.202-.794-2.995 0L.622 6.096a2.117 2.117 0 0 0 0 2.994l38.374 38.373L.622 85.836a2.117 2.117 0 0 0 0 2.994l5.473 5.476a2.123 2.123 0 0 0 2.995 0l38.374-38.374 38.374 38.374c.397.396.937.62 1.498.62s1.101-.224 1.498-.62l5.473-5.476a2.118 2.118 0 0 0 0-2.994L55.931 47.463z">
        </path>
      </svg>
)}
    </div>
  );
};