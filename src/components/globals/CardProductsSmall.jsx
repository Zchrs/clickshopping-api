/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import { getFile } from "../../reducers/globalReducer";
import { useState } from "react";
import { Modal } from "./Modal";
import { Rating } from "./Rating";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../../actions/productActions";


import AddToCart from "./AddToCart";
import { formatPrice } from "../../../globalActions";
import styled from "styled-components";
export const CardProductsSmall = ({
  title,
  description,
  productLink,
  memberDiscount,
  thumbnails,
  img,
  price,
  previousPrice,
  discount,
  addToWish,
  prodHover,
  product_id,
  ratingss,
  ratings,
  premiumText,
  descriptionText,
  addCartBox,
  addWishBox,
  tittleText,
  priceText,
  groupBox,
  sellingsText,
  sellings,
  onClick,
  images,
}) => {
  const [modal, setModal] = useState(false);
 
  const user = useSelector((state) => state.auth.user);
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const handleOpenModal = () => {
  //   setModal(true);
  // };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setModal(false);
    console.log("click");
  };

  const dispatch = useDispatch();

  // Cuando quieras establecer el estado del producto
  const handleSetProductInfo = () => {
    // debugger
    const productInfo = {
      title,
      description,
      productLink,
      img,
      price,
      previousPrice,
      thumbnails,
    };

    dispatch(setProduct(productInfo));
    localStorage.setItem("product", productInfo);
    // console.log(productInfo)
  };

  const handleFunctions = () => {
    scrollTop(), handleSetProductInfo();
  };

  const getImageType = (url) => {
    const ext = url.split(".").pop().toLowerCase();
    return ext === "jpg" ? "jpeg" : ext;
  };

  return (
    <CardSmall>
      <div className="productcard">
        {addWishBox && (
          <div className="productcard-addwishimg">
            <img
              loading="lazy"
              src={getFile("svg", `${addToWish}`, "svg")}
              alt=""
            />
          </div>
        )}
        {addCartBox && (
          <div className="productcard-addcartimg">
            <AddToCart />
          </div>
        )}
        <Link onMouseEnter={prodHover} onClick={onClick} to={productLink}>
          <div className="productcard-contain">
            <img 
            loading="lazy"
            src={img} 
            alt="" 
            />
          </div>
        </Link>
        <div className="productcard-box">
          {descriptionText && <p className="productcard__p"> {description} </p>}
          {tittleText && <p className="productcard__p"> {title} </p>}
          {priceText && (
            <h2 className="productcard__h2"> ${formatPrice(previousPrice)} </h2>
          )}
          {sellingsText && (
            <p className="productcard__p productcard__selltext">
              {" "}
              {sellings} 999
            </p>
          )}
          {groupBox && (
            <div className="productcard-group">
              <p className="product__p2">
                {price}
                <span style={{ color: "#EC3337" }}> {discount} </span>
              </p>
            </div>
          )}
          {premiumText && <p className="productcard__p3"> {memberDiscount} </p>}
          <div className="productcard-rating">
            {ratingss && (
              <Rating
                ratings={ratings}
                productID={product_id}
                userID={user ? user.id : null}
              />
            )}
          </div>
        </div>
        {modal && (
          <Modal
            title="Título del Modal"
            img="nombre_de_la_imagen"
            click={handleCloseModal}
          />
        )}
      </div>
    </CardSmall>
  );
};
const CardSmall = styled.section`
  .productcard {
    font-family: "Quicksand", sans-serif;
    position: relative;
    display: grid;
    height: 100%;
    border-radius: 8px;
    align-content: space-between;
    box-shadow: rgba(215, 213, 213, 0.607) 1px 1px 3px,
      rgba(215, 213, 213, 0.607) -1px -1px 3px;
    background: white;
    gap: 2px;
    padding: 10px 8px;
    transition: all ease 0.9s;
    &:hover {
      transform: scale(1.12);
      box-shadow: rgba(128, 128, 128, 0.6) 1px 1px 6px,
        rgba(128, 128, 128, 0.6) -1px -1px 6px;
      z-index: 100;
    }

    @media (max-width: 580px) {
    }

    &-box {
      display: grid;
      // max-height: 200px;
    }

    &.background {
      background: #f5f1f1;
    }

    &-btn {
      margin: 5px 0;
    }

    &__p {
      grid-column: 1 / 2;
      font-size: 15px;
      font-weight: 500;
      padding: 0;
      line-height: 1.1;
      padding-bottom: 5px;
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
        color: #ec3337;
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
      // place-items: center;

      img {
        width: 100%;
        object-fit: contain;
        margin: auto;
        border-radius: 8px;
        @media (max-width: 500px) {
          height: 100%;
        }
      }
    }
    &-rating {
      display: grid;
      width: fit-content;
    }
    &-group {
      display: flex;
      gap: 5px;
    }
    &-addwishimg {
      background: black;
      cursor: pointer;
      left: 10px;
      top: 12px;
      position: absolute;
      display: grid;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      padding: 10px;
      align-items: center;
      overflow: hidden;
      transition: all ease 0.3s;

      img {
        transition: all ease 0.3s;
        position: relative;
        width: 100%;
        filter: brightness(500%);
      }
      &:hover {
        background: #ec3337;
        img {
          transform: scale(1.2);
        }
      }
    }
    &-addcartimg {
      background: black;
      cursor: pointer;
      right: 10px;
      top: 12px;
      position: absolute;
      display: grid;
      border-radius: 50%;
      align-items: center;
      padding: 10px;
      width: 40px;
      height: 40px;
      transition: all ease 0.3s;

      img {
        transition: all ease 0.3s;
        position: relative;
        filter: brightness(500%);
        width: 100%;
      }
      &:hover {
        background: #ec3337;
        img {
          transform: scale(1.2);
        }
      }
    }
  }
`;
