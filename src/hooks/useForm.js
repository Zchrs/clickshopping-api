/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import { helpHttp } from "../helpers/helperHttp";
import { Form, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  startLogin,
  startLoginAdmin,
  loginSuccess,
} from "../actions/authActions";
import { fetchWithoutToken } from "../helpers/fetch";
import Swal from "sweetalert2";


export const initialForm = {
  name: "",
  lastname: "",
  country: "",
  phone: "",
  email: "",
  password: "",

  price: "",
  previousPrice: "",
  category: "",
  quantity: "",
  description: "",
  img_url: [],
  user_id: "",
  product_id: "",

  fullname: "",
  pass: "",
  codeAccess: "",
};



export const useForm = (initialForm, validateForm) => {
  // ---------------- variables de estado -----------------------
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [errorsCart, setErrorsCart] = useState({});
  // const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [response, setResponse] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const user = useSelector((state) => state.auth.user);
  
  // ----------------- funciones form -------------------------

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadingActive = (email, password) => {
    setLoading(true);
    return async (dispatch) => {
      const res = await fetchWithoutToken(
        "auth/login",
        { email, password },
        "POST"
      );
      const body = await res.json();
      if (body.ok) {
        dispatch(
          loginSuccess({
            name: body.user.name,
          })
        );
      }
      setLoading(false);
    };
  };

  const handleCountryChange = (options) => {
    if (!options) {
      setSelectedCountry(options.target.value); // Llama a la función proporcionada con el país seleccionado
    } else {
      setForm({
        ...form,
        country: options.target.value,
      });
    }
  };

  const handleClearCountry = (label, value) => {
    if (label) {
      setSelectedCountry(null);
      setSelected(null);
      console.log(value);
    }
    setForm({
      ...form,
      country: "",
      countryCode: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(value)
    setForm({
      ...form,
      [name]: value,
    });

    if (value === "email") {
      validateEmails(name);
    } else {
      return;
    }
  };

  const handleChangeAdmin = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setForm({
      ...form,
      [name]: value,
    });

    if (value === "email") {
      validateEmails(name);
    } else {
      return;
    }
  };

  const handleChecked = (e, checked) => {
    setChecked(e.target.checked);
  };

  const openModal = () => {
    setModal(true);
    console.log("click");
  };

  const handleSetImage = (imageUrls) => {
    setForm({
      ...form,
      img_url: imageUrls,
    });
  };

    const handleSetImages = (imageUrls) => {
    setForm({
      ...form,
      img_url: imageUrls,
    });
  };

    const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const imgUrls = files.map((file) => URL.createObjectURL(file));
    setForm((form) => ({
      ...form,
      img_url: imgUrls, // Guardar las URLs de las imágenes
    }));
  };

  // formularios y estados del producto
  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    // console.log(value)
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleUpdateProduct = async (id) => {
    
    setLoading(true);
    
    Swal.fire({
      title: 'Estás actualizando un producto',
      text: '¿Deseas continuar actualizando este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Volver',
      background: '#f0f0f0',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'custom-title',
        content: 'custom-content',
        confirmButton: 'swal-confirm-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) {

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('previousPrice', form.previousPrice);
      formData.append('category', form.category);
      formData.append('quantity', form.quantity);
      formData.append('description', form.description);
      formData.append('img_url', form.img_url);
      const response = axios.put(
        `${import.meta.env.VITE_APP_API_UPDATE_PRODUCT_URL}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Producto actualizado correctamente.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Volver',
          background: '#f0f0f0',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'swal-confirm-btn',
          },
        })
        console.log("Product updated successfully", response.data);
      } else {
        console.log("Failed to update product", response.data);
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al intentar actualizar este producto.',
        icon: 'error',
        background: '#f0f0f0',
        customClass: {
            popup: 'swal-custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'swal-confirm-btn',
        },
    });
    setLoading(false);
    throw error.response?.data || error.message;
    }
  }else{
    return
  }
  });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
   
    const formData = {
      name: form.name,
      price: form.price,
      previousPrice: form.previousPrice,
      category: form.category,
      quantity: form.quantity,
      description: form.description,
      img_url: form.img_url// Asumiendo que img_url es un array de objetos con una propiedad 'url'
    };
  
    if (!Array.isArray(formData.img_url) || formData.img_url.length === 0) {
      console.error("img_url debe ser un array de URLs");
      return;
    }
    
    setLoading(true);

    Swal.fire({
      title: 'Estás agregando un producto',
      text: '¿Deseas agregar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Volver',
      background: '#f0f0f0',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'custom-title',
        content: 'custom-content',
        confirmButton: 'swal-confirm-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) {
    try {
      const response = axios.post(
        import.meta.env.VITE_APP_API_UPLOAD_PRODUCT_URL,
        formData,
        {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
  
          Swal.fire({
      title: "Estamos agregando un producto.",
      text: "Cargando",
      allowOutsideClick: false,
      background: "#f9fafb",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
      },
      didOpen: () => Swal.showLoading(),
    });

      console.log(response)
      setResponse(true);
      setForm(initialForm);
      
      Swal.fire({
        title: '¡Éxito!',
        text: 'Producto agregado correctamente.',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Volver',
        background: '#f0f0f0',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'swal-confirm-btn',
        },
      })
          // Manejar acciones adicionales si es necesario
     
    } catch (error) {
      console.error('Error al enviar el producto:', error);
      setLoading(false);
      // Manejar el error de manera adecuada, como mostrar un mensaje al usuario
    }
  }else{
    return
  }
  });
};

  const deleteProduct = async (id) => {
    try {
        const result = await Swal.fire({
            title: 'Vas a eliminar un producto',
            text: '¡Estás seguro que deseas eliminar este producto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Volver',
            background: '#f0f0f0',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'custom-title',
                content: 'custom-content',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'custom-cancel-button',
            },
        });

        if (result.isConfirmed) {
            const response = await axios.delete(`${import.meta.env.VITE_APP_API_DELETE_PRODUCT_URL}/${id}`);
            console.log(response.data); // Mensaje de éxito o información adicional
            Swal.fire({
                title: 'Eliminado!',
                text: 'El producto ha sido eliminado exitosamente.',
                icon: 'success',
                background: '#f0f0f0',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'custom-title',
                    content: 'custom-content',
                    confirmButton: 'swal-confirm-btn',
                },
            });
            return response.data;
        } else {
            return;
        }
    } catch (error) {
        console.error('Error deleting product:', error.response?.data || error.message);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al intentar eliminar el producto.',
            icon: 'error',
            background: '#f0f0f0',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'custom-title',
                content: 'custom-content',
                confirmButton: 'swal-confirm-btn',
            },
        });
        throw error.response?.data || error.message;
    }
};
// fin de funciones y estados del producto

  const validateEmails = async (email) => {
    const finalForm = {
      ...form,
    };
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_API_REGISTER,
        finalForm,
        {
          // const response = await axios.post("http://localhost:4000/api/auth/register", finalForm, {

          body: email,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error, "error al verificar emails desde front");
      return;
    }
  };

  const handleBlur = (e) => {
    handleChange(e);
    setErrors(validateForm(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateForm);

    if (Object.keys(errors).length === 0) {
      alert("Enviando...");
      setLoading(true);

      console.log("EJECUTANDO LA FUNCIÓN");

      helpHttp()
        .post("http://localhost:4000/api/auth/register", {
          body: Form,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          setLoading(false);
          setResponse(true);
          setForm(initialForm);
          setTimeout(
            () => setResponse(false, initialForm, window.location.reload()),
            500
          );
        });
    } else {
      return;
    }
  };

  const handleLogin = (e) => {
    if (!form.email) return;
    if (!form.password) return;
    
    Swal.fire({
      title: "Iniciando sesión...",
      text: "Validando credenciales",
      allowOutsideClick: false,
      background: "#f9fafb",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
      },
      didOpen: () => Swal.showLoading(),
    });
    e.preventDefault();
    dispatch(startLogin(form.email, form.password));
  };

  const handleSubmitAddCart = async (e) => {

  
    const finalFormAddCart = {
      ...form,
    };
    e.preventDefault();
    setLoading(true);

    try {
      const token = user.token;
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_POST_CART_URL}/${form.product_id}`,
        finalFormAddCart,
        {
          body: finalFormAddCart,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(response);
      setLoading(false);
      setResponse(true);
      setForm(initialForm);
      // setTimeout(() => setResponse(false, initialForm, ));
      setTimeout(
        () =>
          setResponse(
            false,
            initialForm,
            Swal.fire({
              title: '¡Correcto!',
              text: `Agregaste un producto al carrito!`,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Volver',
              cancelButtonText: 'Volver',
              background: '#f0f0f0',
              customClass: {
                popup: 'swal-custom-popup',
                title: 'custom-title',
                content: 'custom-content',
                confirmButton: 'swal-confirm-btn',
              },
            })
          ),
        200
      );
    } catch (error) {
      Swal.fire({
        title: 'No se pudo agregar al carrito',
        text: 'Regresa al producto e inténtalo de nuevo',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Volver',
        cancelButtonText: 'Volver',
        background: '#f0f0f0',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'swal-confirm-btn',
        },
      })
      return;
    }
  };

  const handleSubmitAddWishlist = async (e) => {

  
    const finalFormAddWishlist = {
      ...form,
    };
    e.preventDefault();
    setLoading(true);

    try {
      const token = user.token;
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_POST_WISHLIST_URL}/${form.product_id}`,
        finalFormAddWishlist,
        {
          body: finalFormAddWishlist,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(response);
      setLoading(false);
      setResponse(true);
      setForm(initialForm);
      // setTimeout(() => setResponse(false, initialForm, ));
      setTimeout(
        () =>
          setResponse(
            false,
            initialForm,
            Swal.fire({
              title: '¡Correcto!',
              text: `Agregaste un producto en la lista de deseos!`,
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'Volver',
              cancelButtonText: 'Volver',
              background: '#f0f0f0',
              customClass: {
                popup: 'swal-custom-popup',
                title: 'custom-title',
                content: 'custom-content',
                confirmButton: 'swal-confirm-btn',
              },
            })
          ),
        200
      );
    } catch (error) {
      Swal.fire({
        title: 'No se pudo agregar al carrito',
        text: 'Regresa al producto e inténtalo de nuevo',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Volver',
        cancelButtonText: 'Volver',
        background: '#f0f0f0',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'swal-confirm-btn',
        },
      })
      return;
    }
  };

  const handleBlurAdm = (e) => {
    handleChange(e);
    setErrors(validateForm(form));
  };

  const handleSubmitsAdmin = async (e, label) => {
    const finalForm = {
      ...form,
    };
    if (!finalForm.fullname) return;
    if (!finalForm.email) return;
    if (!finalForm.pass) return;
    if (!finalForm.codeAccess) return;

    e.preventDefault();
    setErrors(validateForm);
    setLoading(true);
    try {
      helpHttp();
      const response = await axios.post(
        import.meta.env.VITE_APP_API_REGISTER_ADMIN_URL,
        finalForm,
        {
          // const response = await axios.post("http://192.168.1.2:3000/api/auth/register", finalForm, {

          body: finalForm,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setLoading(false);
      setResponse(true);
      setForm(initialForm);
      setTimeout(
        () =>
          setResponse(
            false,
            initialForm,
            (window.location.href =
              import.meta.env.VITE_APP_API_LOGIN_ADMIN_FRONT)
          ),
        200
      );
    } catch (error) {
      console.log(error.response.data);
      alert(`${error.response.data}`);
      return;
    }
    setLoading(false);
    setModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imgUrls = files.map((file) => URL.createObjectURL(file));
    setForm((form) => ({
      ...form,
      img_url: imgUrls, // Guardar las URLs de las imágenes
    }));
  };

  const handleLoginAdmin = (e) => {
    debugger
    if (!form.email) return;
    if (!form.pass) return;
    
    Swal.fire({
      title: "Iniciando sesión...",
      text: "Validando credenciales",
      allowOutsideClick: false,
      background: "#f9fafb",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
      },
      didOpen: () => Swal.showLoading(),
    });
    e.preventDefault();
    dispatch(startLoginAdmin(form.email, form.pass));

    // console.log(form)
    loadingActive();
    navigate("/admin/dashboard");
   
  };

  const handleSubmits = async (e, label) => {
    const finalForm = {
      ...form,
    };
    if (!finalForm.country) return;
    if (!finalForm.name) return;
    if (!finalForm.lastname) return;
    if (!finalForm.phone) return;
    if (!finalForm.email) return;
    if (!finalForm.password) return;

    e.preventDefault();
    setErrors(validateForm);
    setLoading(true);
    try {
      helpHttp();
      console.log("API URL:", import.meta.env.VITE_APP_API_REGISTER_URL);
      const response = await axios.post(
        import.meta.env.VITE_APP_API_REGISTER_URL,
        finalForm,
        {
          body: finalForm,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(response);
      setLoading(false);
      setResponse(true);
      setForm(initialForm);
      // setTimeout(() => setResponse(false, initialForm, ));
      setTimeout(
        () =>
          setResponse(
            false,
            initialForm,
            Swal.fire({
              title: '¡Hecho!',
              html: `Te has registrado correctamente`,
              icon: 'success',
              showCancelButton: false,
              cancelButtonText: 'Volver',
              background: '#f0f0f0',
              customClass: {
                popup: 'swal-custom-popup',
                title: 'custom-title',
                content: 'custom-content',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'custom-cancel-button',
              },
            })
          ),
        200
      );
    } catch (error) {
                  Swal.fire({
              title: '¡Error!',
              html: `No se pudo registrar el usuario`,
              icon: 'warning',
              cancelButtonText: 'Reintentar',
              confirmlButtonText: 'Reintentar',
              background: '#f0f0f0',
              customClass: {
                popup: 'swal-custom-popup',
                title: 'custom-title',
                content: 'custom-content',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'custom-cancel-button',
              },
            })
      console.log(error);
      return;
    }
    setLoading(false);
    setModal(true);
  };

  const handleSubscribeNewsletter = async (e) => {
    const finalForm = {
      ...form,
    };
    // if (!finalForm.email) return;
    if (!finalForm.email || !checked) {
      prompt("Debes aceptar los términos y condiciones");
      return;
    }
    e.preventDefault();
    setErrors(validateForm);
    setLoading(true);
    try {
      helpHttp();
      const response = await axios.post(
        import.meta.env.VITE_APP_API_NEWSLETTER_URL,
        finalForm,
        {
          body: finalForm,
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log(response);
      setLoading(false);
      setResponse(true);
      setForm(initialForm);
      prompt("Te has suscrito a nuestro boletín");
    } catch (error) {
      console.log(error);
      prompt(error);
      return;
    }
    setLoading(false);
    setModal(true);
  };

  return {
    form,
    errorsCart,
    errors,
    loading,
    response,
    modal,
    deleteProduct,
    handleChangeProduct,
    setForm,
    setLoading,
    handleImageChange,
    handleChangeAdmin,
    handleBlurAdm,
    handleSubmitsAdmin,
    handleSubmitAddCart,
    handleSubmitProduct,
    handleSetImage,
    handleSetImages,
    handleImagesChange,
    handleChecked,
    loadingActive,
    handleChange,
    handleBlur,
    handleSubmit,
    handleSubmits,
    handleLogin,
    handleLoginAdmin,
    handleSubscribeNewsletter,
    handleClearCountry,
    handleUpdateProduct,
    openModal,
    handleCountryChange,
    handleSubmitAddWishlist
  };
};
