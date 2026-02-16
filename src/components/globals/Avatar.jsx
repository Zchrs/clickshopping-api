/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import { getFile } from "../../reducers/globalReducer";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { startChecking, startLogout } from "../../actions/authActions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const Avatar = ({
  avtsmall,
  avtMedium,
  img,
  clas,
  dropData,
  classWhite,
  nameSmall,
}) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = useSelector((state) => state.langUI.lang);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(startChecking());
  }, [i18n, lang, dispatch]);

  const handleLogout = () => {
    dispatch(startLogout());
    navigate("/auth/login");
  };

  return (
    <AvaTar>
      <div className={clas}>
        {avtMedium && (
          <div className="avatar-default">
            <img src={getFile("png", `${img}`, "png")} alt="" />
          </div>
        )}
        {avtsmall && (
          <div className="tumb-default">
            <img src={getFile("png", `${img}`, "png")} alt="" />
          </div>
        )}
        <span className={classWhite}>
          {user ? (
            <strong className={nameSmall}>
              {user.name} {user.lastname}
            </strong>
          ) : (
            <strong className={nameSmall}>Default name</strong>
          )}
        </span>
        {dropData && (
          <div className="avatar-usersession">
            <NavLink to={"/dashboard"}>
              <i>
                <img src={getFile("svg", "panel-red", "svg")} alt="" />
              </i>
              {t("dashboard.dashboard")}
            </NavLink>
            <NavLink>
              <i>
                <img src={getFile("svg", "order-red", "svg")} alt="" />
              </i>
              {t("dashboard.orders")}
            </NavLink>
            <NavLink>
              <i>
                <img src={getFile("svg", "message", "svg")} alt="" />
              </i>
              {t("dashboard.messages")}
            </NavLink>
            <NavLink>
              <i>
                <img src={getFile("svg", "currency", "svg")} alt="" />
              </i>
              {t("dashboard.currency")}
            </NavLink>
            <NavLink>
              <i>
                <img src={getFile("svg", "wallet", "svg")} alt="" />
              </i>
              {t("dashboard.payment")}
            </NavLink>
            <NavLink>
              <i>
                <img src={getFile("svg", "wishlist", "svg")} alt="" />
              </i>
              {t("dashboard.wishlist")}
            </NavLink>
            <NavLink>
              <i>
                <img src={getFile("svg", "coupon", "svg")} alt="" />
              </i>
              {t("dashboard.coupons")}
            </NavLink>
            <div className="avatar-box">
              <NavLink>{t("dashboard.loginSeller")}</NavLink>
              <NavLink>{t("dashboard.buyerProtect")}</NavLink>
              <NavLink>{t("dashboard.support")}</NavLink>
              <NavLink>{t("dashboard.disputes")}</NavLink>
              <NavLink>{t("dashboard.ipr")}</NavLink>
            </div>
            <button onClick={handleLogout}>
              <i>
                <img src={getFile("svg", "off", "svg")} alt="" />
              </i>
              {t("dashboard.logout")}
            </button>
          </div>
        )}
      </div>
    </AvaTar>
  );
};

const AvaTar = styled.div`
  .avatar {
    position: relative;
    cursor: pointer;
    display: grid;
    gap: 10px;
    align-items: start;
    text-align: center;
    position: relative;
    height: fit-content;
    width: 100%;
    @media (max-width: 920px) {
      display: flex;
    }
    @media (max-width: 300px) {
      gap: 5px;
    }
    &-default {
      display: grid;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      @media (max-width: 920px) {
        width: 50px;
        height: 50px;
      }
    }
    .namesmall {
      font-size: 8px;
      font-weight: 700;
      padding: 0;
      position: absolute;
      width: 100%;
      left: 0px;
      bottom: 0;
    }
    .namepanel {
      display: flex;
      text-align: center;
      font-weight: 600;
      width: 150%;
      margin-left: -17px;
    }
    &.white {
      color: white;
    }
    .black {
      color: black;
    }

    &-usersession {
      display: grid;
      position: absolute;
      gap: 1px;
      z-index: 999;
      top: 32px;
      left: -145px;
      padding: 0px 0px;
      width: 280px;
      height: fit-content;
      transform: scaleY(0);
      background: white;
      border-radius: 10px;
      transition: all ease 0.3s;
      box-shadow:
        gray 1px 1px 4px,
        gray -1px -1px 4px;
      cursor: default;
      overflow: hidden;

      hr {
        margin: 5px 0;
      }

      @media (max-width: 301px) {
        left: -192px;
      }

      button {
        display: flex;
        text-decoration: none;
        font-size: 17px;
        border: none;
        font-weight: 400;
        cursor: pointer;
        gap: 5px;
        margin: 0;
        padding: 0;
        background: transparent;
        place-items: center;
        align-self: center;
        color: rgb(68, 66, 66);
        &:hover {
          color: var(--bg-primary);
          img {
            filter: var(--filter-primary);
          }
        }
        &:focus-visible {
          border: none;
          outline: none;
        }
        &:focus {
          border: none;
          outline: none;
        }
      }

      a,
      i {
        color: rgb(68, 66, 66);
        text-decoration: none;
        font-size: 17px;
        border: none;
        text-align: left;
        font-weight: 400;

        img {
          top: 0;
          left: 0;
          width: 18px;
          fill: var();
          filter: grayscale(200%);
        }

        &:hover {
          color: var(--bg-primary);
          img {
            filter: var(--filter-primary);
          }
        }
      }
    }
    &:hover .avatar-usersession {
      padding: 10px 15px;
      transform: scaleY(1);
      transition: all ease 0.3s;
      left: -145px;
    }

    &-box {
      border-top: rgba(128, 128, 128, 0.482) 1px solid;
      border-bottom: rgba(128, 128, 128, 0.482) 1px solid;
      padding: 15px 0;
      margin: 15px 0;
      display: grid;
      text-align: left;
      a {
        color: rgb(128, 125, 125);
        font-size: 16px;
      }
    }

    span {
      color: black;
      font-size: 18px;
    }

    img {
      width: 100%;
      @media (max-width: 920px) {
        width: 40px;
        height: 40px;
        margin: 0 auto;
      }
    }
  }

  .tumb {
    display: flex;
    gap: 7px;
    width: fit-content;
    position: relative;

    text-align: center;
    align-items: center;
    // border: yellow 1px solid;
    @media (max-width: 300px) {
      display: grid;
      gap: 1px;
      margin: 0;
    }

    &-default {
      margin: auto;
      display: grid;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      align-items: center;
      strong {
        margin-top: 20px;
      }
    }

    span {
      color: black;
      font-size: 15px;
      strong {
        font-weight: 500;
        font-size: 11px;
      }
      @media (max-width: 500px) {
        strong {
          font-weight: 500;
          font-size: 15px;
        }
      }
      @media (max-width: 300px) {
        text-align: left;
        line-height: normal;
        strong {
          font-weight: 500;
          font-size: 10px;
        }
      }
    }

    img {
      height: 100%;
      @media (max-width: 500px) {
        width: 100%;
      }
    }
  }
  .white {
    color: white;
    p,
    span {
      color: white;
    }
  }
`;
