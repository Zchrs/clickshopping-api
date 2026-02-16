/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import '../../assets/sass/countryselector.scss';

export const CountrySelector = ({ placeholder,name, id }) => {
  const [value, setValue] = useState('');
  const options = useMemo(() => {
    const data = countryList().getData();
    return data.map(country => {
      const flag = `https://flagcdn.com/w20/${country.value.toLowerCase()}.png`; // Reemplaza esto con la ruta real de las banderas
      return { ...country, icon: flag };
    });
  }, []);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundImage: state.data.icon ? `url(${state.data.icon})` : null,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      paddingLeft: '30px', // Ajusta según el tamaño de tus banderas
    }),
  };

  const changeHandler = value => {
    setValue(value);
  };

  return (
    <Select
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={changeHandler}
      styles={customStyles}
      name={name}
      id={id}
    />
  );
};


