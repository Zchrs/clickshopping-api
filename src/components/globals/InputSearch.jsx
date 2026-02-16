import { useState } from 'react';
import '../../assets/sass/inputsearch.scss'
/* eslint-disable react/prop-types */
export const InputSearch = ({clas, placeholder}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
    const handleInputChange = (event) => {
      setSearchQuery(event.target.value);
    };
  
    return (
      <input className={clas}
        value={searchQuery}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    );
  }
