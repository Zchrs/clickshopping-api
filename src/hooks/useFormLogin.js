import { useState } from 'react';


export const useFormLogin = ( initialState = {} ) => {
    const [errors, setErrors] = useState({});
    
    const [values, setValues] = useState(initialState);

    const reset = () => {
        setValues( initialState );
    }

    const handleBlur = (e) => {
        handleChange(e);
        setErrors(validateForm(form));
      };


    const handleInputChange = ({ target }) => {

        setValues({
            ...values,
            [ target.name ]: target.value
        });

    }

    return [ values, handleInputChange, reset, handleBlur, errors ];

}