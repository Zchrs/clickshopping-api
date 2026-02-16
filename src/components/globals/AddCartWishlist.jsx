/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { getFile } from "../../../globalActions";
import styled from "styled-components";

export const AddCartWishlist = ({
  addCart,
  addWish,
  title,
  description,
  productLink,
  img,
  price,
  previousPrice,
  onSubmit,
  onMouseEnter,
  onMouseLeave,
  onclick,
}) => {



  return (
    <CartWishlist>
      <div>
        <button onClick={onclick} onSubmit={onSubmit} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {addWish && (
              <img src={getFile("svg", `addwishlist-red`, "svg")} alt="" />
          )}
        </button>
      </div>
      <div>
        <button onClick={onclick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {addCart && (
              <img src={getFile("svg", `addcart-red`, "svg")} alt="" />
          )}
        </button>
      </div>
    </CartWishlist>
  );
};

const CartWishlist = styled.button`
  z-index: 20;
  border: none;
  outline: none;


  button{
    top: 0;
    left: 0;
    position: absolute;
    border: none;
    outline: none;
    background: black;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    display: grid;
    width: 100%;
    height: 100%;
    align-items: center;
    overflow: hidden;
    transition: all ease 0.3s;

      img {
        z-index: 100;
        padding: 11px;
        transition: all ease 0.3s;
        position: absolute;
        width: 100%;
        filter: brightness(500%);
      }
      &:active{
        border: none;
        outline: none;
      }
      &:hover {
        background: -moz-linear-gradient(top, black, black);
        background: -webkit-gradient(
          linear,
          0% 0%,
          0% 100%,
          from(black),
          to(black)
        );
        img {
          transform: scale(1.3);
        }
      }
  }

`;
