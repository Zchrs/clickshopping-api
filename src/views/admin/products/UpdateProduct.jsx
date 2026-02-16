/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from '../../../hooks/useForm';
import { BaseButton, BaseInput, DropZone } from '../../../../index';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { MultiDropZone } from '../../../components/globals/MultiDropZone';

// export const UpdateProduct = () => {
//   const selectedProduct = useSelector((state) => state.product);
//   const { t } = useTranslation();


//   const initialForm = {
//     id: '',	
//     name: '',
//     price: '',
//     previousPrice: '',
//     category: '',
//     quantity: '',
//     description: '',
//     image: ''
//   };

//   const {
//     form,
//     errors,
//     loading,
//     handleChange,
//     handleUpdateProduct,
//     handleSetImage
//   } = useForm(initialForm);


// return (
//   <ProductUpdate className="updateproducts" encType="multipart/form-data" >
//     <h2 className="updateproducts-h2">Actualizar producto</h2>
//     <p className="updateproducts-h3"> Detalle a actualizar de: <strong>{ selectedProduct.name }</strong> </p>
//     <form className="updateproducts-form" encType="multipart/form-data">
//       <div>


//         <BaseInput 
//           id="name" 
//           name="name" 
//           classs={"inputs outline"}
//           placeholder="Nombre del producto"
//           value={form.name}
//             onChange={handleChange}
             
//         />
        
//       </div>
//       <div>
//         <BaseInput 
//           id="price" 
//           name="price" 
//           classs={"inputs outline"}
//           placeholder="Precio" 
//           value={form.price}
//             onChange={handleChange}
//             isNumber={true}
            
//         />
        
//       </div>
//       <div>
//         <BaseInput 
//           id="previousPrice" 
//           name="previousPrice" 
//           classs={"inputs outline"}
//           placeholder="Precio anterior" 
//           value={form.previousPrice}
//             onChange={handleChange}
//             isNumber={true}
            
//         />
        
//       </div>
//       <div>
//         <BaseInput 
//           id="category" 
//           name="category" 
//           classs={"inputs outline"}
//           placeholder="Categoría" 
//           value={form.category}
//             onChange={handleChange}
            
//         />
        
//       </div>
//       <div>
//         <BaseInput 
//           id="quantity" 
//           name="quantity" 
//           classs={"inputs outline"}
//           placeholder="Cantidad" 
//           value={form.quantity}
//             onChange={handleChange}
            
//           isNumber={true}
//         />
       
//       </div>
//       <div>
//         <BaseInput 
//           id="description" 
//           name="description" 
//           classs={"inputs outline"}
//           placeholder="Descripción" 
//           value={form.description}
//             onChange={handleChange}
            
//           isTextarea={true}
//         />
       
//       </div>
//       <div>
//         <DropZone
//           id="image" 
//           name="image"
//           type="file"
//           setImage={handleSetImage}
//           />
          
//       </div>
//       <div>
//       <BaseButton handleClick={() => handleUpdateProduct(selectedProduct.id)} classs={"button little-red"} textLabel={true} label={"Actualizar producto"}/>
//       </div>
//     </form>
//   </ProductUpdate>
    
//   )
// }

export const UpdateProduct = ({item}) => {

  const selectedProduct = useSelector((state) => state.product);
  console.log(selectedProduct, 'selected desde update paoduct')
  const [isFormComplete, setIsFormComplete] = useState(false);

  const initialForm = {
    id: selectedProduct?.id || '',
    name: selectedProduct?.name || '',
    price: selectedProduct?.price || '',
    previousPrice: selectedProduct?.previousPrice || '',
    category: selectedProduct?.category || '',
    quantity: selectedProduct?.quantity || '',
    description: selectedProduct?.description || '',
    img_url: selectedProduct?.images || [],
  };

  const {
    form,
    errors,
    setForm,
    handleBlur,
    handleImageChange,
    handleChange,
    handleUpdateProduct,
    handleSetImage,
    loading,
  } = useForm(initialForm);

  useEffect(() => {
    const isFormFilled = Object.values(form).every(value => value !== '');
    setIsFormComplete(isFormFilled);
  }, [form]);

  useEffect(() => {
    if (item) {

      setForm({
        id: item.id || '',
        name: item.name || '',
        price: item.price || '',
        previousPrice: item.previousPrice || '',
        category: item.category || '',
        quantity: item.quantity || '',
        description: item.description || '',
        img_url: item.images || [],
    });
    }
  }, [item, setForm]);

  return (
    <ProductUpdate>
      <div className="updateselectedProduct">
        <h2 className="updateselectedProduct-h2">Actualizar producto</h2>
        <p className="updateselectedProduct-h3">
          Detalle a actualizar de: <strong>{selectedProduct?.name || ''}</strong>
        </p>
        <form 
          encType='multipart/form-data'
          className="updateselectedProduct-form" 
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateProduct(selectedProduct?.id || '');
          }}
        >
          <div>
            <BaseInput
              id="name"
              name="name"
              classs={'inputs outline'}
              placeholder="Nombre del producto"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="warnings-form">{errors.name}</p>}
          </div>
          <div>
            <BaseInput
              id="price"
              name="price"
              classs={'inputs outline'}
              placeholder="Precio"
              value={form.price}
              onChange={handleChange}
              isNumber={true}
            />
            {errors.price && <p className="warnings-form">{errors.price}</p>}
          </div>
          <div>
            <BaseInput
              id="previousPrice"
              name="previousPrice"
              classs={'inputs outline'}
              placeholder="Precio anterior"
              value={form.previousPrice}
              onChange={handleChange}
              isNumber={true}
            />
            {errors.previousPrice && <p className="warnings-form">{errors.previousPrice}</p>}
          </div>
          <div>
            <BaseInput
              id="category"
              name="category"
              classs={'inputs outline'}
              placeholder="Categoría"
              value={form.category}
              onChange={handleChange}
            />
            {errors.category && <p className="warnings-form">{errors.category}</p>}
          </div>
          <div>
            <BaseInput
              id="quantity"
              name="quantity"
              classs={'inputs outline'}
              placeholder="Cantidad"
              value={form.quantity}
              onChange={handleChange}
              isNumber={true}
            />
          </div>
          <div>
            <BaseInput
              id="description"
              name="description"
              classs={'inputs outline'}
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              isTextarea={true}
            />
            {errors.description && <p className="warnings-form">{errors.description}</p>}
          </div>
          <div>
            <MultiDropZone
              onBlur={handleBlur}
              id="img_url"
              name="img_url"
              type="file"
              onChange={handleImageChange}
              setImages={handleSetImage}
            />
            {errors.image && <p className="warnings-form">{errors.image}</p>}
          </div>
          <div>
            <BaseButton
              handleClick={() => handleUpdateProduct(selectedProduct?.id || '')}
              classs={'button little-red'}
              textLabel={true}
              label={'Actualizar producto'}
              disabled={!isFormComplete || loading}
            />
          </div>
        </form>
      </div>
    </ProductUpdate>
  );
};

const ProductUpdate = styled.section`
  display: grid;
  width: 100%;
  height: fit-content;

.updateproducts-form {
  display: grid;
  width: 100%;
  gap: 15px;
  width: 50%;
  padding: 25px;
  margin: auto;
}
.updateproducts-h2 {
  font-size: 30px;
  display: grid;
  width: fit-content;
  height: fit-content;
}
`;