/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styled from "styled-components";
import { formatPrice, getFile } from "../../../globalActions";
import { BaseButton } from "./BaseButton";

export const CardWishlist = ({
  name,
  quantity,
  price,
  img,
  onRemove,
  onSendToCart,
}) => {
  return (
    <WishlistCard>
      <div className="cardwishlist">
        <div className="cardwishlist-left">
          <img src={img} alt="Product image" />
        </div>
        <div>
          <div className="cardwishlist-left-flex">
            <div>
              <h3>{name}</h3>
            </div>
          </div>
          <div>
            <div className="cardwishlist-left-flex">
              <div>
                <h4>{formatPrice(price)}</h4>
                <p>Envío: gratis</p>
              </div>
              
            </div>
          </div>
        </div>
        <div className="cardwishlist-left-grid">
          <BaseButton
            handleClick={onSendToCart}
            label={"Mover al carrito"}
            textLabel={true}
            classs={"button full-outline"}
            img={true}
            icon={"cart-user"}
          />
          <div className="cardwishlist-left-flex">
          <BaseButton
            handleClick={onRemove}
            label={"Quitar"}
            textLabel={true}
            classs={"button full-outline"}
            img={true}
            icon={"trash"}
          />
          <BaseButton
            label={"Más"}
            textLabel={true}
            classs={"button full-outline"}
          />
          </div>
        </div>
      </div>
    </WishlistCard>
  );
};

const WishlistCard = styled.div`
  display: grid;

  .cardwishlist {
    display: grid;
    width: 100%;
    grid-template-columns: 15% 1fr 20%;
    height: fit-content;
    background: white;
    border-radius: 0px 10px 10px 0px;
    padding: 10px;
    gap: 10px;
    align-items: center;
    box-shadow: 1px 1px 3px #ebe9e9, -1px -1px 3px #ebe9e9;

    @media (max-width: 680px) {
      grid-template-columns: 1fr;
    }

    h3 {
      font-weight: 500;
      color: gray;
      font-size: 16px;
    }
    p {
      font-size: 14px;
      color: #c2c0c0;
    }

    &-left {
      position: relative;

      img {
        width: 100%;
      }

      &-flex {
        display: flex;
        gap: 10px;
        justify-content: space-between;
      }
      &-grid {
        display: grid;
        gap: 10px;
      }
    }
    &-right {
      display: flex;
      border: yellow 1px solid;
    }
    &-icons {
      display: flex;
      gap: 15px;

      img {
        width: 10px;
        cursor: pointer;
        &:first-child {
          width: 14px;
          filter: invert(50%);
        }
      }
    }
  }
`;
