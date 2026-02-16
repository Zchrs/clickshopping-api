/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { initialForm, useForm } from "../../../hooks/useForm";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { BaseButton, BaseInput, MultiDropZone, MultiDropZoneCloudinary } from "../../../../index";
import { MultiDropZoneImageKit } from "../../../components/globals/MultiDropZoneImageKit";
import { useValidations } from "../../../hooks/useValidations";

export const CreateProduct = () => {
  const { t } = useTranslation();
  const { formRefs, validateForm } = useValidations();
  const [isFormComplete, setIsFormComplete] = useState(null);

  const initialForm = {
    name: "",
    price: "",
    previousPrice: "",
    category: "",
    quantity: "",
    description: "",
    img_url: [],
  };

  const {
    form,
    errors,
    loading,
    response,
    modal,
    setForm,
    handleChange,
    handleBlur,
    handleSubmitProduct,
    handleSetImages,
    handleImagesChange,
  } = useForm(initialForm, validateForm);

  useEffect(() => {
    // Verificar si todos los campos del formulario están llenos
    const isFormFilled = Object.values(form).every((value) => value !== "");
    // Actualizar el estado de completitud del formulario
    // console.log("Formulario vacío:", form);
    setIsFormComplete(isFormFilled);
    
  }, [form]);

  const applyDiscount10 = (value) => {
  const num = Number(value);
  if (isNaN(num)) return "";
  return Math.round(num * 0.9);
};

  const handlePriceChange = (e) => {
  const { value } = e.target;
  
  setForm((prev) => ({
    ...prev,
    price: value,
    previousPrice: applyDiscount10(value),
  }));
};

  return (
    <section className="sections">
      <ProductUpload className="uploadproducts">
        <h2 className="uploadproducts-h2">Agregar producto</h2>
        <form className="uploadproducts-form" encType="multipart/form-data">
          <div>
            <BaseInput
              id="name"
              name="name"
              classs={"inputs normal"}
              placeholder="Nombre del producto"
              inputRef={formRefs.name}
              value={form.name}
              onBlur={handleBlur}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <BaseInput
              id="price"
              name="price"
              classs={"inputs normal"}
              placeholder="Precio"
              inputRef={formRefs.price}
              value={form.price}
              onBlur={handleBlur}
              onChange={handlePriceChange}
              isNumber={true}
              required
            />
          </div>
          <div>
            <BaseInput
              id="previousPrice"
              name="previousPrice"
              classs={"inputs normal"}
              placeholder="Precio anterior"
              inputRef={formRefs.previousPrice}
              value={form.previousPrice}
              onBlur={handleBlur}
              onChange={handleChange}
              isNumber={true}
              required
              readOnly
            />
          </div>
          <div>
            <BaseInput
              id="category"
              name="category"
              classs={"inputs normal"}
              placeholder="Categoría"
              inputRef={formRefs.category}
              value={form.category}
              onBlur={handleBlur}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <BaseInput
              id="quantity"
              name="quantity"
              classs={"inputs normal"}
              placeholder="Cantidad"
              inputRef={formRefs.quantity}
              value={form.quantity}
              onBlur={handleBlur}
              onChange={handleChange}
              required
              isNumber={true}
            />
          </div>
          <div>
            <BaseInput
              id="description"
              name="description"
              classs={"inputs normal"}
              placeholder="Descripción"
              inputRef={formRefs.description}
              value={form.description}
              onBlur={handleBlur}
              onChange={handleChange}
              required
              isTextarea={true}
            />
          </div>
          <div>
            <MultiDropZoneCloudinary
              id="images"
              name="img_url"
              type="file"
              onChange={handleImagesChange}
              setImages={handleSetImages}
              onBlur={handleBlur}
            />
          </div>
          <div>
            <BaseButton
              disabled={!isFormComplete}
              handleClick={handleSubmitProduct}
              classs={"button primary"}
              colorbtn={"var(--primary)"}
              colortextbtnprimary={"var(--light)"}
              colorbtnhoverprimary={"var(--bg-primary-tr)"}
              colortextbtnhoverprimary={"var(--light)"}
              textLabel={true}
              label={"Añadir producto"}
            />
          </div>
        </form>
      </ProductUpload>
    </section>
  );
};

// css del componente con styled components
const ProductUpload = styled.section`
  display: grid;
  width: 100%;
  height: fit-content;

  .uploadproducts-form {
    display: grid;
    width: 100%;
    gap: 15px;
    width: 50%;
    padding: 25px;
    margin: auto;
  }
  .uploadproducts-h2 {
    font-size: 30px;
    display: grid;
    width: fit-content;
    height: fit-content;
  }
`;
