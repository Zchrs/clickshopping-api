import { useRef } from "react";

export const useValidations = () => {
  // Definición de todas las refs necesarias
  const formRefs = {
    country: useRef(null),
    title: useRef(null),
    name: useRef(null),
    fullname: useRef(null),
    nameManager: useRef(null),
    codeAccess: useRef(null),
    idNumberManager: useRef(null),
    lastname: useRef(null),
    typeDoc: useRef(null),
    dnaId: useRef(null),
    docIdManager: useRef(null),
    expDate: useRef(null),
    state: useRef(null),
    city: useRef(null),
    address: useRef(null),
    message: useRef(null),
    phone: useRef(null),
    area: useRef(null),
    phoneManager: useRef(null),
    email: useRef(null),
    emailManager: useRef(null),
    pass: useRef(null),
    password: useRef(null),
    rePassword: useRef(null),
    price: useRef(null),
    previousPrice: useRef(null),
    district: useRef(null),
    category: useRef(null),
    furnished: useRef(null),
    admon: useRef(null),
    role: useRef(null),
    description: useRef(null),
    bedRoom: useRef(null),
    bathRoom: useRef(null),
    diningRoom: useRef(null),
    quantity: useRef(null),
    kitchen: useRef(null),
    floor: useRef(null),
    parking: useRef(null),
    stratum: useRef(null),
    clothing: useRef(null),
    action: useRef(null),
    image: useRef(null),
    img_url: useRef(null),
    user_id: useRef(null),
    product_id: useRef(null),
    verifyCode: useRef(null)
  };
  

  const validateForm = (form) => {
    let errors = {};
    
    // Expresiones regulares para validaciones
    const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    const regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]+$/;
    const regexPrice = /^\d+(\.\d{1,2})?$/;
    const regexOnlyNumbers = /^\d{6}$/;
    const regexPhone = /^\+?[\d\s-]{8,20}$/;

    

    // Función helper para manejar estilos de error
    const setFieldErrorStyle = (fieldName, hasError) => {
      const fieldRef = formRefs[fieldName]?.current;
    
      if (!fieldRef || !fieldRef.style) {
        // console.warn(`Ref inválida o aún no montada para: ${fieldName}`);
        return;
      }
    
      fieldRef.style.cssText = hasError
        ? "border: 1px solid red; border-radius: 10px;"
        : "border: 1px solid #34B0BE; border-radius: 10px;";
    };

    // Validación para cada campo
    const validateField = (fieldName, value, validationFn, errorMessage) => {
      if (!value) {
        setFieldErrorStyle(fieldName, true);
        return errorMessage.required;
      }
      
      if (validationFn && !validationFn(value)) {
        setFieldErrorStyle(fieldName, true);
        return errorMessage.invalid;
      }
      
      setFieldErrorStyle(fieldName, false);
      return null;
    };

    // Validaciones específicas
    errors.country = validateField('country', form.country, null, {
      required: "Debes seleccionar el país"
    });

    errors.name = validateField('name', form.name, 
      (val) => regexName.test(val.trim()), {
        required: "Debes ingresar el nombre",
        invalid: "El nombre debe tener solo letras"
      }
    );

    errors.title = validateField('title', form.title, 
      (val) => regexName.test(val.trim()), {
        required: "Debes ingresar el nombre",
        invalid: "El nombre debe tener solo letras"
      }
    );

    errors.role = validateField('role', form.role, 
      (val) => regexName.test(val.trim()), {
        required: "Debes ingresar una opción",
        invalid: "El nombre debe tener solo letras"
      }
    );

    errors.fullname = validateField('fullname', form.fullname, 
      (val) => regexName.test(val.trim()), {
        required: "Debes ingresar el nombre completo",
        invalid: "El nombre debe tener solo letras"
      }
    );
    errors.nameManager = validateField('nameManager', form.nameManager, 
      (val) => regexName.test(val.trim()), {
        required: "Debes ingresar el nombre",
        invalid: "El nombre debe tener solo letras"
      }
    );

    errors.lastname = validateField('lastname', form.lastname, 
      (val) => regexName.test(val.trim()), {
        required: "Debes ingresar el apellido",
        invalid: "El apellido debe tener solo letras"
      }
    );
    errors.message = validateField('message', form.message, 
      (val) => regexName.test(val.trim()), {
        required: "Debes ingresar los datos a corregor",
        invalid: "Solo se aceptan letras"
      }
    );

    errors.typeDoc = validateField('typeDoc', form.typeDoc, null, {
      required: "Debes seleccionar el tipo de documento"
    });

    errors.dnaId = validateField('dnaId', form.dnaId, 
      (val) => val.length >= 6, {
        required: "Número de documento requerido",
        invalid: "Formato de documento incorrecto"
      }
    );

    errors.docIdManager = validateField('docIdManager', form.docIdManager, 
      (val) => val.length >= 6, {
        required: "Número de documento requerido",
        invalid: "Formato de documento incorrecto"
      }
    );

    errors.area = validateField('area', form.area, 
      (val) => val.length >= 2, {
        required: "Número de documento requerido",
        invalid: "Formato de documento incorrecto"
      }
    );

    errors.expDate = validateField('expDate', form.expDate, 
      (val) => val.length >= 6, {
        required: "Fecha de expedición requerida",
        invalid: "Fecha de expedición incorrecta"
      }
    );

    errors.state = validateField('state', form.state, null, {
      required: "Debes seleccionar un departamento"
    });

    errors.city = validateField('city', form.city, null, {
      required: "Debes seleccionar una ciudad"
    });

    errors.address = validateField('address', form.address, null, {
      required: "Debes ingresar la dirección"
    });

    errors.phone = validateField('phone', form.phone, 
      (val) => regexPhone.test(val.trim()) && val.trim().length > 11, {
        required: "Teléfono requerido",
        invalid: "Formato de teléfono incorrecto"
      }
    );
    
    errors.phoneManager = validateField('phoneManager', form.phoneManager, 
      (val) => regexPhone.test(val.trim()) && val.trim().length > 11, {
        required: "Teléfono requerido",
        invalid: "Formato de teléfono incorrecto"
      }
    );

    errors.email = validateField('email', form.email, 
      (val) => regexEmail.test(val.trim()), {
        required: "Correo electrónico requerido",
        invalid: "Formato de correo incorrecto"
      }
    );

    errors.emailManager = validateField('emailManager', form.emailManager, 
      (val) => regexEmail.test(val.trim()), {
        required: "Correo electrónico requerido",
        invalid: "Formato de correo incorrecto"
      }
    );

    errors.codeAccess = validateField('codeAccess', form.codeAccess, 
      (val) => val.length > 6 && (val.trim()), {
        required: "Código de acceso requerido",
        invalid: "La contraseña debe tener al menos 6 caracteres con letras, números y símbolos"
      }
    );

    errors.verifyCode = validateField('verifyCode', form.verifyCode, 
      (val) => val.length > 5 && regexOnlyNumbers.test(val.trim()), {
        required: "Código de acceso requerido",
        invalid: "Código de acceso incorrecto"
      }
    );

    errors.pass = validateField('pass', form.pass, 
      (val) => val.length > 6 && regexPassword.test(val.trim()), {
        required: "Contraseña requerida",
        invalid: "La contraseña debe tener al menos 6 caracteres con letras, números y símbolos"
      }
    );
    errors.password = validateField('password', form.password, 
      (val) => val.length > 6 && regexPassword.test(val.trim()), {
        required: "Contraseña requerida",
        invalid: "La contraseña debe tener al menos 6 caracteres con letras, números y símbolos"
      }
    );
    errors.rePassword = validateField('rePassword', form.rePassword, 
      (val) => val.length > 6 && regexPassword.test(val.trim()), {
        required: "Contraseña requerida",
        invalid: "La contraseña debe tener al menos 6 caracteres con letras, números y símbolos"
      }
    );

    // Validaciones para propiedades (si es necesario)
    errors.price = validateField('price', form.price, 
      (val) => regexPrice.test(val.trim()), {
        required: "Precio requerido",
        invalid: "Formato de precio incorrecto"
      }
    );
    errors.previousPrice = validateField('previousPrice', form.previousPrice, 
      (val) => regexPrice.test(val.trim()), {
        required: "Precio requerido",
        invalid: "Formato de precio incorrecto"
      }
    );

    errors.district = validateField('district', form.district, null, {
      required: "Debes seleccionar el barrio"
    });

    errors.category = validateField('category', form.category, null, {
      required: "Debes agregar una categoría"
    });

    errors.furnished = validateField('furnished', form.furnished, null, {
      required: "Debes especificar si el inmueble es amoblado"
    });
    
    errors.admon = validateField('admon', form.admon, null, {
      required: "Debes especificar si el inmueble incluye administración"
    }); 

    errors.description = validateField('description', form.description, null, {
      required: "Debes añadir una descripción"
    });

    errors.bedRoom = validateField('bedRoom', form.bedRoom, null, {
      required: "Debes seleccionar el número de habitaciones"
    });

    errors.bathRoom = validateField('bathRoom', form.bathRoom, null, {
      required: "Debes seleccionar el número de baños"
    });

    errors.diningRoom = validateField('diningRoom', form.diningRoom, null, {
      required: "Debes seleccionar el número sala comedores comer"
    });

    errors.quantity = validateField('quantity', form.quantity, null, {
      required: "Debes seleccionar el número de quantity"
    });

    errors.kitchen = validateField('kitchen', form.kitchen, null, {
      required: "Debes seleccionar el tipo de cocina"
    });

    errors.floor = validateField('floor', form.floor, null, {
      required: "Debes seleccionar el tipo de piso"
    });

    errors.parking = validateField('parking', form.parking, null, {
      required: "Debes seleccionar si hay parqueadero"
    });

    errors.stratum = validateField('stratum', form.stratum, null, {
      required: "Debes seleccionar el estrato"
    });

    errors.clothing = validateField('clothing', form.clothing, null, {
      required: "Debes seleccionar si tiene zona de lavado ropa"
    });

    errors.action = validateField('action', form.action, null, {
      required: "Debes seleccionar una acción"
    });     

    // Elimina los errores nulos para tener un objeto limpio
    Object.keys(errors).forEach(key => {
      if (errors[key] === null) {
        delete errors[key];
      }
    });

    return errors;
  };

  const validateFormListPropertyClient = (form) => {
  let errors = {};

  // Expresiones regulares
  const regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
  const regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]+$/;
  const regexPrice = /^\d+(\.\d{1,2})?$/;
  const regexPhone = /^\+?[\d\s-]{8,20}$/;

  const setFieldErrorStyle = (fieldName, hasError) => {
    const fieldRef = formRefs[fieldName]?.current;
    if (!fieldRef || !fieldRef.style) return;

    fieldRef.style.cssText = hasError
      ? "border: 1px solid red; border-radius: 10px;"
      : "border: 1px solid #34B0BE; border-radius: 10px;";
  };

  const validateField = (fieldName, value, validationFn, errorMessage) => {
    if (!value) {
      setFieldErrorStyle(fieldName, true);
      return errorMessage.required;
    }

    if (validationFn && !validationFn(value)) {
      setFieldErrorStyle(fieldName, true);
      return errorMessage.invalid;
    }

    setFieldErrorStyle(fieldName, false);
    return null;
  };

  // Validaciones solo si el campo existe en el objeto form:
  if ('country' in form) {
    errors.country = validateField('country', form.country, null, {
      required: "Debes seleccionar el país"
    });
  }
  if ('role' in form) {
    errors.role = validateField('role', form.role, null, {
      required: "Debes seleccionar una opción"
    });
  }

  if ('name' in form) {
    errors.name = validateField('name', form.name, val => regexName.test(val.trim()), {
      required: "Debes ingresar el nombre",
      invalid: "El nombre debe tener solo letras"
    });
  }

  if ('title' in form) {
    errors.title = validateField('title', form.title, val => regexName.test(val.trim()), {
      required: "Debes ingresar el nombre",
      invalid: "El nombre debe tener solo letras"
    });
  }

  if ('nameManager' in form) {
    errors.nameManager = validateField('nameManager', form.nameManager, val => regexName.test(val.trim()), {
      required: "Debes ingresar el nombre",
      invalid: "El nombre debe tener solo letras"
    });
  }

  if ('lastname' in form) {
    errors.lastname = validateField('lastname', form.lastname, val => regexName.test(val.trim()), {
      required: "Debes ingresar el apellido",
      invalid: "El apellido debe tener solo letras"
    });
  }
  if ('message' in form) {
    errors.message = validateField('message', form.message, val => regexName.test(val.trim()), {
      required: "Debes ingresar el apellido",
      invalid: "El apellido debe tener solo letras"
    });
  }

  if ('typeDoc' in form) {
    errors.typeDoc = validateField('typeDoc', form.typeDoc, null, {
      required: "Debes seleccionar el tipo de documento"
    });
  }

  if ('dnaId' in form) {
    errors.dnaId = validateField('dnaId', form.dnaId, val => val.length >= 6, {
      required: "Número de documento requerido",
      invalid: "Formato de documento incorrecto"
    });
  }

  if ('docIdManager' in form) {
    errors.docIdManager = validateField('docIdManager', form.docIdManager, val => val.length >= 6, {
      required: "Número de documento requerido",
      invalid: "Formato de documento incorrecto"
    });
  }

  if ('expDate' in form) {
    errors.expDate = validateField('expDate', form.expDate, val => val.length >= 6, {
      required: "Fecha de expedición requerida",
      invalid: "Fecha de expedición incorrecta"
    });
  }

  if ('state' in form) {
    errors.state = validateField('state', form.state, null, {
      required: "Debes seleccionar un departamento"
    });
  }

  if ('city' in form) {
    errors.city = validateField('city', form.city, null, {
      required: "Debes seleccionar una ciudad"
    });
  }

  if ('address' in form) {
    errors.address = validateField('address', form.address, null, {
      required: "Debes ingresar la dirección"
    });
  }

  if ('phone' in form) {
    errors.phone = validateField('phone', form.phone, val => regexPhone.test(val.trim()) && val.trim().length > 11, {
      required: "Teléfono requerido",
      invalid: "Formato de teléfono incorrecto"
    });
  }

  if ('phoneManager' in form) {
    errors.phoneManager = validateField('phoneManager', form.phoneManager, val => regexPhone.test(val.trim()) && val.trim().length > 11, {
      required: "Teléfono requerido",
      invalid: "Formato de teléfono incorrecto"
    });
  }

  if ('email' in form) {
    errors.email = validateField('email', form.email, val => regexEmail.test(val.trim()), {
      required: "Correo electrónico requerido",
      invalid: "Formato de correo incorrecto"
    });
  }

  if ('emailManager' in form) {
    errors.emailManager = validateField('emailManager', form.emailManager, val => regexEmail.test(val.trim()), {
      required: "Correo electrónico requerido",
      invalid: "Formato de correo incorrecto"
    });
  }

  if ('password' in form) {
    errors.password = validateField('password', form.password, val => val.length > 6 && regexPassword.test(val.trim()), {
      required: "Contraseña requerida",
      invalid: "La contraseña debe tener al menos 6 caracteres con letras, números y símbolos"
    });
  }

  if ('price' in form) {
    errors.price = validateField('price', form.price, val => regexPrice.test(val.trim()), {
      required: "Precio requerido",
      invalid: "Formato de precio incorrecto"
    });
  }
  if ('previousPrice' in form) {
    errors.previousPrice = validateField('previousPrice', form.previousPrice, val => regexPrice.test(val.trim()), {
      required: "Precio requerido",
      invalid: "Formato de precio incorrecto"
    });
  }

  // Otros campos
  const optionalFields = {
    district: "Debes seleccionar el barrio",
    category: "Debes agregar una categoría",
    furnished: "Debes especificar si el inmueble es amoblado",
    admon: "Debes especificar si el inmueble incluye administración",
    description: "Debes añadir una descripción",
    bedRoom: "Debes seleccionar el número de habitaciones",
    bathRoom: "Debes seleccionar el número de baños",
    diningRoom: "Debes seleccionar el número sala comedores comer",
    quantity: "Debes seleccionar el número de quantity",
    kitchen: "Debes seleccionar el tipo de cocina",
    floor: "Debes seleccionar el tipo de piso",
    parking: "Debes seleccionar si hay parqueadero",
    stratum: "Debes seleccionar el estrato",
    clothing: "Debes seleccionar si tiene zona de lavado ropa",
    action: "Debes seleccionar una acción"
  };

  Object.entries(optionalFields).forEach(([field, message]) => {
    if (field in form) {
      errors[field] = validateField(field, form[field], null, { required: message });
    }
  });

  // Limpiar errores nulos
  Object.keys(errors).forEach((key) => {
    if (errors[key] === null) {
      delete errors[key];
    }
  });

  return errors;
};


  return { formRefs, validateForm, validateFormListPropertyClient };
};
 
