/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BaseButton } from "./BaseButton";
import { Modal } from "./Modal";
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { formatPrice } from "../../../globalActions";
import { UpdateProduct } from "../../views/admin/products/UpdateProduct";
import styled from "styled-components";

export const CardProductsAdmin = ({
  id,
  title,
  classs,
  quantity,
  description,
  member,
  onDelete,
  img,
  uptBtn,
  delBtn,
  onUpdate,
  price,
  previousPrice,
  discount,
  selected,
  product,
  jpg,
  buy
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const closeModal = (e) => {
    e.stopPropagation();
    setShowModal(false);
  };

  // const openModal = () => {

  //   dispatch(setProduct(product));
  //   setSelectedProduct(product)
  //   console.log(product)
  //   setShowModal(true);
  // };

  return (
    <CardAdmin>
      <section className={classs} onClick={selected}>
        <div>
          <div className="productcard-contain">
            
              <img loading="lazy" src={img} alt="" />
            
          </div>
        </div>
        <div className="productcard-box">
          {buy && (
          <div className="productcard-btn">
            <BaseButton 
              img={true} 
            icon={"wallet"} 
            classs={"button full-outline"} 
            textLabel={true} 
            label={"Comprar"} />
          </div>
        )}
          <p className="productcard__p"> {description} </p>
          <p className="productcard__title"> {title} </p>
          <p className="productcard__quantity"> {quantity} Disponibles</p>
          <h2 className="productcard__h2">${formatPrice(previousPrice)} </h2>
          <div className="productcard-group">
            <p className="productcard__p2">${formatPrice(price)}
              <span style={{ color: '#EC3337' }}> {discount} </span>
            </p>
          </div>
          <p className="productcard__p3"> {member} </p>
        </div>
        <div className="productcard-btns">
          <div>
            {delBtn && (
            <BaseButton 
            handleClick={onDelete}  
            classs={'button delete'} 
            textLabel={true} 
            label={"Eliminar"} 
            />)}
          </div>
          <div>
            {uptBtn && (<BaseButton 
            handleClick={onUpdate} 
            classs={'button update'} 
            textLabel={true} 
            label={"Actualizar"} 
            />)}
          </div>
        </div>
        {showModal && (
          <Modal
            title="Título del Modal"
            img="nombre_de_la_imagen"
            component2={true}
            click={closeModal}
          >
            <UpdateProduct product={product} />
          </Modal>
        )}
      </section>
    </CardAdmin>
  );
};

const CardAdmin = styled.div`
display: grid;
  .productcard {
    position: relative;
      display: grid;
      max-width: 250px;
      height: fit-content;
      border-radius: 8px;
      box-shadow: 
      rgba(215, 213, 213, 0.607) 1px 1px 3px, 
      rgba(215, 213, 213, 0.607) -1px -1px 3px;
      background: white;
      gap: 10px;
      
      padding: 10px 8px;
      transition: all ease .9s;
      &:hover{
        transform: scale(1.12);
        box-shadow:rgba(128, 128, 128, 0.6) 1px 1px 6px, 
        rgba(128, 128, 128, 0.6) -1px -1px 6px;
        z-index: 100;
      }
  
      @media (max-width: 580px) {
        
      }
  
      &-box{
        display: grid;
        max-width: 230px;
      }
  
      &.background{
        background: #f5f1f1;
  
      }
  
      &-btn{
        margin: 5px 0;
      }
    
      &__p {
        font-size: 13.5px;
        font-weight: 400;
        line-height: 1.1;
        padding-bottom: 5px;
        word-wrap: break-word;
        word-break: break-word;
      }
      &__quantity{
        color: rgb(123, 120, 120);
        font-size: 14px;
        margin: 0;
        padding: 0;
      }
      &__title{
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 5px 0;
        padding: 0;
        line-height: 1;
      }
      &__selltext{
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
          color: #EC3337;
          text-decoration: none;
        }
      }
    
      &__p3 {
        font-size: 12px;
        color: #EC3337;
        line-height: 1;
        margin: 0;
  
        @media (max-width: 450px) {
          font-size: 10px;
          color: black;
        }
      }
    
      &__h2 {
        font-size: 15px;
        font-weight: 600;
        line-height: 1;
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
      &-group{
        display: flex;
        gap: 5px;
      }
      &-addwishimg{
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
        transition: all ease .3s;
  
        img{
          transition: all ease .3s;
          position: relative;
          width: 100%;
          filter: brightness(500%);
        }
        &:hover{
          background: #EC3337;
          img{
            transform: scale(1.2);
          }
        }
      }


      &-addcartimg{
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
        transition: all ease .3s;
  
        img{
          transition: all ease .3s;
          position: relative;
          filter: brightness(500%);
          width: 100%;
        }
        &:hover{
          background: #EC3337;
          img{
            transform: scale(1.2);
          }
        }
      }

      &-btns{
        display: flex;
        gap: 5px;
        margin: 0;
        padding: 0;
        justify-content: space-between;
      }
    }
`