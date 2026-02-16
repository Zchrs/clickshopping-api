/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { formatPrice } from "../../../globalActions";
import styled from "styled-components";
import { BaseButton } from "./BaseButton";
import { useDispatch, useSelector } from "react-redux";
import { clearProduct, selectedProduct } from "../../actions/productActions";
import { AddCartWishlist } from "./AddCartWishlist";
import { useNavigate } from "react-router-dom";
// import { addToCart as addToCartAction } from "../actions/cartActions";
import Swal from "sweetalert2";
import { useForm, initialForm } from "../../hooks/useForm";


import { Rating } from "./Rating";
// import { Image } from "@imagekit/react";

export const CardProducts = ({
  name,
  classs,
  description,
  member,
  img,
  user_id,
  product_id,
  prodHover,
  prodLeave,
  preview,
  price,
  previousPrice,
  discount,
  productLink,
  thumbnails,
  quantity,
  ratingss,
  ratings,
  jpg,
  buyCr,
  buy,
}) => {
  const user = useSelector((state) => state.auth.user);
  const productHover = useSelector((state) => state.product.selectedProduct);
  const isProduction = import.meta.env.MODE === "production";
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const initialForm = {
    user_id: "",
    product_id: "",
    price: "",
    quantity: "",
  };
  
  const {
    form,
    errors,
    handleChangeProduct,
    handleSubmitAddCart,
    handleSubmitAddWishlist,
    setForm
  } = useForm(initialForm);
  

  // Cuando quieras establecer el estado del producto
  const handleSetProductInfo = (e) => {
    // console.log(productHover, 'producto seteado')
    if(!user) return
    
    dispatch(selectedProduct(productHover));
    localStorage.setItem("productHover", productHover);
    setForm((prevFormCart) => ({
      ...prevFormCart,
      user_id: user.id, // Assuming you want to set the user_id as well
      product_id: productHover.id,
      price: productHover.price,
      quantity: 1, // You can set a default quantity or manage it as needed
    }));
  };
  
  const handleCLearProduct = () => {

    // console.log(productHover, 'producto quitado')
    dispatch(clearProduct(productHover));
    localStorage.removeItem("productHover", productHover);
    setForm(initialForm);
  };

  const handleMouseEnter = () => {
    if (user) {
      handleSetProductInfo({ user_id, product_id, price, quantity });
    }
  };

  const handleMouseLeave = () => {
    if (user) {
      handleCLearProduct({ user_id, product_id, price, quantity });
    }
  };

  const handleAddToCart = (e) => {
    if (user) {
      handleSubmitAddCart(e);
    } else {
      Swal.fire({
        title: "Aún no eres nuestro cliente",
        text: "Regístrate para agregar productos al carrito.",
        icon: "warning",
        showCancelButton: true,
        // confirmButtonColor: '#990000',
        // cancelButtonColor: '#a4883e',
        confirmButtonText: "Registrarme",
        cancelButtonText: "Cancelar",
        background: "#f0f0f0",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/users/auth/register");
        }
      });
    }
  };
  const handleAddToWishList = (e) => {
    if (user) {
      handleSubmitAddWishlist(e);
    } else {
      Swal.fire({
        title: "Aún no eres nuestro cliente",
        text: "Regístrate para agregar productos a la lista de deseos.",
        icon: "warning",
        showCancelButton: true,
        // confirmButtonColor: '#990000',
        // cancelButtonColor: '#a4883e',
        confirmButtonText: "Registrarme",
        cancelButtonText: "Cancelar",
        background: "#f0f0f0",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "custom-confirm-button",
          cancelButton: "custom-cancel-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/users/auth/register");
        }
      });
    }
  };

  const whatsapp = () => {
     window.open(`https://wa.me/message/WUYQ32XZFQ7TG1`, '_blank')
  } 


  return (
    <ProductCard onMouseEnter={prodHover}>
      <section className={classs}>
        <div>
          <div className="productcard-addwish">
            <AddCartWishlist
              addWish={true}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onclick={handleAddToWishList}
              onSubmit={handleAddToWishList}
            />
          </div>
          <div className="productcard-addcart">
            <AddCartWishlist
              addCart={true}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onclick={handleAddToCart}
              onSubmit={handleAddToCart}
            />
          </div>
          <div className="productcard-contain">
             {!isProduction ? (
    // 🧪 DESARROLLO → imagen local
    <img
      loading="lazy"
      src={img}
      alt={name}
    />
  ) : (
    // 🚀 PRODUCCIÓN → ImageKit
    // <Image
    //   path={img}
    //   transformation={[
    //     { width: 400, height: 300 }
    //   ]}
    //   loading="lazy"
    //   alt={name}
    // />
      <img
    loading="lazy"
    src={img}
    alt={name}
    onError={(e) => {
      e.target.src = "/img/no-image.png";
    }}
  />
  )}
          </div>
        </div>
        <div className="productcard-box">
          {buy && (
            <div className="productcard-btn">
              <BaseButton
                img={true}
                icon={"whatsapp-grey"}
                classs={"button full-blue"}
                textLabel={true}
                label={"Lo quiero!"}
                handleClick={whatsapp}
              />
            </div>
          )}
          {buyCr && (<div className="productcard-btn">
            <BaseButton 
              img={true} 
              icon={"wallet"} 
              classs={'button primary'} 
              colorbtn={"var(--bg-primary)"}
              colortextbtnprimary={"var(--light)"}
              colorbtnhoverprimary={"var(--bg-primary-tr)"}
              colortextbtnhoverprimary={"white"}  
              textLabel={true} 
              label={"Comprar"} />
          </div>)}

          <p className="productcard__p"> {description} </p>
          <p className="productcard__quantity"> {name} </p>
          <p className="productcard__quantity"> {quantity} Disponibles</p>
          <h2 className="productcard__h2">
            {formatPrice(previousPrice)} <span className="productcard-span"> {discount} </span>
          </h2>
          <div className="productcard-group">
            <p className="productcard__p2">{formatPrice(price)}</p>
          </div>
          <p className="productcard__p3"> {member} </p>
          {ratingss && <Rating ratings={ratings} productID={product_id} userID={user ? user.id : null} />}
          {preview && (
            <div className="productcard-btn">
              <BaseButton
                img={true}
                classs={"button short-black"}
                link={productLink}
                label={'Previsualizar'}
              />
            </div>
          )}
        </div>
        {/* Resto del código */}
      </section>
    </ProductCard>
  );
};


const ProductCard = styled.div`
display: grid;

  .productcard {
    position: relative;
    display: grid;
    height: 100%;
    border-radius: 8px;
    align-content: space-between;
    gap: 2px;
    padding: 0;
    transition: all ease 0.9s;
    &:hover {
      transform: scale(1.12);
      box-shadow: rgba(128, 128, 128, 0.6) 1px 1px 6px,
        rgba(128, 128, 128, 0.6) -1px -1px 6px;
      z-index: 100;
    }

    &-form{
      display: none;
    }

    &-span {
      color: #990000;
      font-weight: 400;
    }

    &-box {
      display: grid;
      padding: 10px;
      gap: 2px;
      // max-height: 200px;
    }

    &.background {
      background: #f5f1f1;
    }

    &-btn {
      display: grid;
      width: 100%;
      // border: #660000 1px solid;
      margin: 5px 0;

      @media (max-width: 680px) {
        justify-content: center;
      }
    }

    &__p {
      font-size: 15px;
      font-weight: 500;
      padding: 0;
      line-height: 1.1;
      padding-bottom: 5px;
      word-break: break-word;
    }
    &__quantity {
      color: rgb(123, 120, 120);
      font-size: 14px;
      margin: 0;
      padding: 0;
    }
    &__selltext {
      color: rgb(190, 188, 188);
      font-size: 14px;
      margin: 0;
      padding: 0;
    }

    &__p2 {
      grid-column: 2 / 3;
      text-decoration: line-through;
      line-height: 1;
      span {
        color: #990000;
        text-decoration: none;
      }
    }

    &__p3 {
      font-size: 12px;
      color: #ec3337;
      line-height: 1.1;

      @media (max-width: 450px) {
        font-size: 10px;
        color: black;
      }
    }

    &__h2 {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.3;
      margin: 0;
      padding: 2px 0;
    }

    &-contain {
      display: grid;
      margin: 0;
      padding: 0;
      align-items: start;
      overflow: hidden;
      border-radius: 8px 8px 0px 0px;
      
      img {
        border-radius: 0px;
        width: 100%;
        height: 100%;
        object-fit: contain;
        margin: 0;
        padding: 0;
        transition: all ease 0.4s;
        &:hover {
          transform: scale(1.2);
        }
        @media (max-width: 500px) {
          max-height: 250px;
        }
      }
    }
    &-group {
      display: flex;
      gap: 5px;
    }
    &-addwish {
      left: 10px;
      top: 12px;
      position: absolute;
      display: grid;
      width: 40px;
      height: 40px;
      align-items: center;
      transition: all ease 0.3s;
      background: transparent;
    }
    &-addcart {
      right: 10px;
      top: 12px;
      background: transparent;
      position: absolute;
      display: grid;
      width: 40px;
      height: 40px;
      align-items: center;
      transition: all ease 0.3s;
    }
  }
`;
