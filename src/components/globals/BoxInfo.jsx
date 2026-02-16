/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BaseButton } from "./BaseButton";
import { getFile } from "../../reducers/globalReducer";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../assets/sass/boxinfo.scss";
import { fetchCartUser } from "../../actions/cartActions";
// import styled from "styled-components";

export const BoxInfo = (props) => {
  // const user = useSelector((state) => state.auth.user);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const lang = useSelector((state) => state.langUI.lang);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const { t, i18n } = useTranslation();
  const {
    title,
    titleA,
    // subtible,
    text,
    textA,
    textB,
    textC,
    textD,
    icon,
    img,
    textT,
    textU,
    // linkB,
    emptyCart,
    texts,
    btns,
    social,
    btnlogin,
    newUser,
    arrow,
  } = props;

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  useEffect(() => {
    const getCartItems = async () => {
      try {
        if (userId && typeof userId === "string" && userId.trim() !== "") {
          const items = await fetchCartUser(userId);
          setCartItems(items);
          calculateTotals(items);
        } else {
          console.error("User ID is invalid or missing");
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    getCartItems();
  }, [userId]);

  const calculateTotals = (items) => {
    const subtotalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    // Puedes ajustar aquí si hay un costo de envío u otros costos adicionales
    setSubtotal(subtotalValue);
    setTotal(totalItemsCount);
  };

  return (
    // <BoxInfoStyle>
    <div className="loginbox">
      <div className="loginbox-subloginbox">
        <img
          className="loginbox-img"
          src={getFile("svg", `${icon}`, "svg")}
          alt="Icon"
        />
        {arrow && (
          <img
            className="loginbox__img"
            src={getFile("svg", "arrow-down-reed", "svg")}
            alt="Arrow"
          />
        )}
      </div>
      <div className="loginbox__box">
        {emptyCart && (
          <div>
            <h4>Tienes ({total}) artículos en tu carrito</h4>
            {loading ? (
              <p>Cargando productos...</p>
            ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
              <div className="loginbox-empty">
                <img src={getFile("svg", `${img}`, "svg")} alt="Empty Cart" />
                <h2 className="loginbox__h2">{title}</h2>
              </div>
            ) : (
              <div className="loginbox-flex">
              {cartItems.map((item) => (
                <img 
                  className="loginbox-imgproducts" 
                  key={item.id} 
                  src={item.img_urls?.[0]} 
                  alt={item.name} 
                />
              ))}
              </div>
            )}
          </div>
        )}
        {texts && (
          <div className="loginbox__container">
            <h2 className="loginbox__h4">{titleA}</h2>
            {textB && (
              <div className="loginbox-texts">
                <NavLink to={"auth/login"} className="loginbox__a">
                  {text}
                </NavLink>
                &nbsp;
                <p className="loginbox__p">{textA}</p>
                &nbsp;
                <NavLink to={"auth/register"} className="loginbox__a">
                  {textB}
                </NavLink>
              </div>
            )}
            {textC && (
              <div className="loginbox-textsa">
                <p className="loginbox__p">{textC}</p>
              </div>
            )}
            {btnlogin && (
              <BaseButton
                label={t("auth.login")}
                classs={"button primary"}
                colorbtn={"var(--primary)"}
                colortextbtnprimary={"var(--light)"}
                colorbtnhoverprimary={"var(--bg-primary-tr)"}
                colortextbtnhoverprimary={"var(--light)"}
                link={"auth/login"}
              />
            )}
            {newUser && <p className="loginbox__p2">{textD}</p>}
          </div>
        )}
        {textT && <p className="loginbox__p">{textU}</p>}
        {btns && (
          <div className="loginbox__buttons">
            <h3 className="loginbox__h3">{title}</h3>
            <p className="loginbox__p">{text}</p>
            <div className="loginbox__btns">
              <BaseButton
                label={t("auth.login")}
                classs={"button primary"}
                colorbtn={"var(--primary)"}
                colortextbtnprimary={"var(--light)"}
                colorbtnhoverprimary={"var(--primary-light)"}
                colortextbtnhoverprimary={"var(--light)"}
                link={"auth/login"}
              />
              <BaseButton
                label={t("auth.register")}
                classs="button secondary"
                colorbtn={"var(--secondary)"}
                colorbtntextsecondary={"var(--tertiary)"}
                colorbtnhoversecondary={"var(--secondary-semi)"}
                hovercolorbtntextsecondary={"var(--light)"}
                link={"auth/register"}
              />
            </div>
          </div>
        )}
        {social && (
          <div className="loginbox__social">
            <div className="loginbox__gruops">
              <h4>{t("auth.sesion")}</h4>
              <hr />
            </div>
            <div className="loginbox__social-box">
              <img src={getFile("svg", `facebook`, "svg")} alt="Facebook" />
              <img src={getFile("svg", `twitter`, "svg")} alt="Twitter" />
              <img src={getFile("svg", `linkedin`, "svg")} alt="LinkedIn" />
              <img src={getFile("svg", `instagram`, "svg")} alt="Instagram" />
            </div>
          </div>
        )}
      </div>
    </div>
    /* </BoxInfoStyle> */
  );
};

// const BoxInfoStyle = styled.div`
// .loginbox {
//   position: relative;
//   font-family: 'Quicksand', sans-serif;
//   cursor: pointer;
//   transition: all ease .3s;
//   z-index: 9999;

//   &__container {
//     display: grid;
//     height: fit-content;
//     gap: 8px;
//   }

//   &__h4 {
//     font-size: 16px;
//     font-weight: 600;
//     text-align: center;
//   }

//   &__h3 {
//     font-size: 18px;
//     font-weight: 400;
//   }

//   &__h2 {
//     font-size: 20px;
//     font-weight: 800;
//   }

//   &__p {
//     font-size: 14px;
//     text-align: center;
//   }

//   &__p2 {
//     text-align: center;
//     font-size: 12px;
//     padding: 6px;
//     height: 50px;
//   }

//   &__a {
//     font-size: 14px;
//     text-decoration: none;
//     color: var(primary);
//     cursor: pointer;

//     &:hover {
//       text-decoration: underline;
//       color: black;
//     }
//   }

//   &-empty {
//     display: grid;
//     place-items: center;
//     opacity: .5;

//     h2 {
//       opacity: .5;
//     }
//   }

//   &-texts {
//     display: flex;
//     text-align: center;
//     justify-content: center;
//   }

//   &-textsa {
//     display: flex;
//     text-align: center;
//     height: 40px;
//   }

//   &__buttons {
//     display: grid;
//     gap: 10px;
//   }

//   &__btns {
//     display: grid;
//     gap: 8px;
//   }

//   &-img {
//     height: 18px;
//     filter: grayscale(100%);
//     transition: all ease .3s;
//   }

//   &:hover &-img {
//     transition: all ease .3s;
//     filter:
//       invert(41%)
//       sepia(98%)
//       saturate(1865%)
//       hue-rotate(177deg)
//       brightness(100%)
//       contrast(101%);
//   }

//   &__img {
//     display: block;
//     height: 6px;
//     transition: all ease .3s;
//     filter: grayscale(100%);
//   }

//   &:hover &__img {
//     transform: rotateZ(180deg);
//     transition: all ease .3s;
//     filter:
//       invert(41%)
//       sepia(98%)
//       saturate(1865%)
//       hue-rotate(177deg)
//       brightness(100%)
//       contrast(101%);
//   }

//   &-subloginbox {
//     display: flex;
//     gap: 5px;
//     align-items: center;
//   }

//   &__box {
//     display: grid;
//     gap: 8px;
//     z-index: 9999;
//     position: absolute;
//     background: white;
//     cursor: default;
//     overflow: hidden;
//     border-radius: 0px 0px 10px 10px;
//     transition: all ease .5s;
//     box-shadow: gray 1px 2px 4px;
//     width: 0px;
//     height: 0;
//     padding: 0px;
//     right: 0;

//     @media (max-width: 600px) {
//       left: -45px;
//       z-index: 9999;
//     }
//   }

//   &:hover &__box {
//     transition: all ease .5s;
//     animation: boxes .5s ease;
//     width: 270px;
//     height: fit-content;
//     padding: 16px;
//     z-index: 9999;
//   }

//   &__social {
//     display: grid;
//     gap: 10px;
//     place-items: center;

//     h4 {
//       font-weight: 600;
//     }

//     &-box {
//       display: flex;
//       gap: 8px;

//       img {
//         height: 30px;
//       }
//     }
//   }

//   &__gruops {
//     position: relative;
//     display: grid;
//     margin: 0 auto;
//     place-items: center;

//     hr {
//       position: absolute;
//       bottom: -8px;
//       z-index: -1;
//       border: 1px solid #72737656;
//       width: 170%;
//     }

//     h4 {
//       font-size: 16px;
//       z-index: 10;
//       margin: 0 auto;
//       padding: 0 15px;
//       width: fit-content;
//       background: white;
//       border-radius: 20px;
//       text-align: center;
//       color: black;

//     }
//   }
// }

// @keyframes boxes {
//   0% {
//     width: 1px;
//     padding: 0px;
//     height: 0px;
//   }

//   50% {
//     width: 1px;
//     padding: 0px;
//   }

//   80% {
//     width: 1px;
//     padding: 0px;
//   }

//   100% {
//     width: 100%;
//     padding: 0px;
//   }
// }
// `
