/* eslint-disable no-unused-vars */
import { CardProductsSmall } from "../../components/globals/CardProductsSmall";
import { Link } from "react-router-dom";
import { getFile } from "../../reducers/globalReducer";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { startChecking } from "../../actions/authActions";
import styled from "styled-components";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [appeals, setAppeals] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);

  const lang = useSelector((state) => state.langUI.lang);

  useEffect(() => {
    dispatch(startChecking());
    i18n.changeLanguage(lang);
  }, [i18n, lang, dispatch]);

  return (
    <DashUser>
      <section className="dashbuser">
        <div className="dashbuser-header">
          <Link className="dashbuser-items">
            <img src={getFile("svg", "wishlist", "svg")} alt="" />
            <p>{t("dashboard.wishlist")}</p>
          </Link>
          <Link className="dashbuser-items">
            <img src={getFile("svg", "following", "svg")} alt="" />
            <p>{t("globals.following")}</p>
          </Link>
          <Link className="dashbuser-items">
            <img src={getFile("svg", "followers", "svg")} alt="" />
            <p>{t("globals.follow")}</p>
          </Link>
          <Link to={"/dashboard/my-cart"} className="dashbuser-items">
            <img src={getFile("svg", "cart", "svg")} alt="" />
            <p>{t("globals.cart")}</p>
          </Link>
        </div>
        <div className="dashbuser-contain">
          <div className="dashbuser-orders-grid">
            <h2>{t("dashboard.orders")}</h2>
            <div className="dashbuser-orders-contain">
              <div className="dashbuser-group">
                <Link
                  to="/dashboard/orders?tab=pendingPayment"
                  className="dashbuser-orders-items">
                  <img src={getFile("svg", "wallet-red-full", "svg")} alt="" />
                  <p>{t("dashboard.pendingPay")}</p>
                </Link>

                <Link
                  to="/dashboard/orders?tab=pendingSend"
                  className="dashbuser-orders-items">
                  <img src={getFile("svg", "send-pending-red", "svg")} alt="" />
                  <p>{t("dashboard.pendingSend")}</p>
                </Link>

                <Link
                  to="/dashboard/orders?tab=send"
                  className="dashbuser-orders-items">
                  <img src={getFile("svg", "send-red", "svg")} alt="" />
                  <p>{t("dashboard.sent")}</p>
                </Link>

                <Link
                  to="/dashboard/orders?tab=ratings"
                  className="dashbuser-orders-items">
                  <img src={getFile("svg", "ratings-red", "svg")} alt="" />
                  <p>{t("dashboard.ratings")}</p>
                </Link>
              </div>
            </div>
          </div>
          <hr className="dashbuser-hr" />
          <div className="dashbuser-orders">
            <h3>{t("dashboard.appeals")}</h3>
            <div className="dashbuser-orders-inside">
              {loading ? (
                <p>{t("dashboard.appealsText")}</p>
              ) : appeals.length === 0 ? (
                <p>{t("dashboard.appealsText")}</p>
              ) : (
                appeals.map((item) => <div key={item.index}></div>)
              )}
              <img src={getFile("svg", "box-empty", "svg")} alt="" />
            </div>
          </div>
          <hr className="dashbuser-hr" />
          <div className="dashbuser-orders">
            <h3>{t("dashboard.refunds")}</h3>
            <div className="dashbuser-orders-inside">
              {loading ? (
                <p>{t("dashboard.refundsText")}</p>
              ) : appeals.length === 0 ? (
                <p>{t("dashboard.refundsText")}</p>
              ) : (
                refunds.map((item) => <div key={item.index}></div>)
              )}
              <img src={getFile("svg", "box-empty", "svg")} alt="" />
            </div>
          </div>
          <hr className="dashbuser-hr" />
          <div className="dashbuser-orders-grid">
            <h2>{t("dashboard.wouldLike")}</h2>
            <div className="dashbuser-orders-int">
              <CardProductsSmall
                addToWish={"addwishlist-red"}
                addTocart={"addcart-red"}
                img3={"maiz"}
                sellingsText={true}
                sellings={"999 Vendidos"}
                priceText={true}
                price="Cop $3.325"
                jpg3="true"
              />
              <CardProductsSmall
                addToWish={"addwishlist-red"}
                addTocart={"addcart-red"}
                img3={"maiz"}
                sellingsText={true}
                sellings={"999 Vendidos"}
                priceText={true}
                price="Cop $3.325"
                jpg3="true"
              />
              <CardProductsSmall
                addToWish={"addwishlist-red"}
                addTocart={"addcart-red"}
                img3={"maiz"}
                sellingsText={true}
                sellings={"999 Vendidos"}
                priceText={true}
                price="Cop $3.325"
                jpg3="true"
              />
              <CardProductsSmall
                addToWish={"addwishlist-red"}
                addTocart={"addcart-red"}
                img3={"maiz"}
                sellingsText={true}
                sellings={"999 Vendidos"}
                priceText={true}
                price="Cop $3.325"
                jpg3="true"
              />
            </div>
          </div>
        </div>
      </section>
    </DashUser>
  );
};

const DashUser = styled.section`
  .dashbuser {
    display: grid;
    padding: 0;
    margin: 0;
    width: 100%;
    height: fit-content;

    &-group {
      width: 100%;
      display: flex;
      justify-content: space-between;
      gap: 10px;

      @media (max-width: 398px) {
        place-items: center;
        text-align: center;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
    }
    &-header {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      place-items: center;
      gap: 5px;
      padding: 25px;
      height: fit-content;
      width: 100%;
      background: white;
      border-radius: 10px;
      box-shadow:
        1px 1px 2px #e5ecec,
        -1px -1px 2px #e5ecec;

      @media (max-width: 500px) {
        display: flex;
        padding: 25px;
        justify-content: space-between;
      }
      @media (max-width: 450px) {
        justify-content: space-between;
      }
      @media (max-width: 398px) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding: 25px 0px;
        gap: 24px;
      }
      @media (max-width: 300px) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        padding: 12px 0px;
        gap: 5px;
      }
    }
    &-hr {
      width: 100&;
      height: 1px;
      margin: 25px 0;
      padding: 0;
    }
    &-contain {
      display: grid;
      padding: 25px;
      height: fit-content;
      margin-top: 25px;
      width: 100%;
      background: white;
      border-radius: 10px;
      box-shadow:
        1px 1px 2px #ebe9e9,
        -1px -1px 2px #ebe9e9;

      @media (max-width: 920px) {
        padding: 12px;
        grid-template-columns: 1fr;
      }
      @media (max-width: 380px) {
        grid-template-columns: 1fr;
        padding: 6px;
      }
    }

    &-items {
      text-align: center;
      display: grid;
      cursor: pointer;
      width: fit-content;
      color: black;
      align-items: baseline;

      @media (max-width: 450px) {
        width: fit-content;
        // border: green 1px solid;
      }

      img {
        margin: auto;
        height: 20px;
        filter: grayscale(200%);
      }
      p {
        width: 100%;
        @media (max-width: 500px) {
          font-size: 12px;
        }
      }
    }
    &-orders {
      display: flex;
      width: 100%;
      height: fit-content;
      margin: 0;
      gap: 25px;
      padding: 25px 0;
      align-items: center;
      //  border: green 1px solid;

      &-grid {
        display: grid;
        gap: 25px;
      }
      &-inside {
        margin: auto;
        gap: 5px;
        display: grid;
        width: fit-content;
        height: fit-content;
        img {
          margin: auto;
          height: 70px;
          filter: opacity(20%);
        }
        p {
          color: rgba(128, 128, 128, 0.414);
        }
      }

      @media (max-width: 550px) {
        padding: 12px 0;
        gap: 12px;
      }
      @media (max-width: 380px) {
        display: flex;
        flex-wrap: wrap;
        gap: 0;
        padding: 8px 0;
        gap: 8px;
      }

      h2,
      h3 {
        color: black;
        font-weight: 500;
      }

      &-items {
        text-align: center;
        justify-content: baseline;
        align-self: first baseline;
        display: grid;
        cursor: pointer;
        width: 100%;
        color: black;

        @media (max-width: 550px) {
          width: fit-content;
        }

        img {
          margin: auto;
          height: 30px;
          filter: var(--filter-primary);

          @media (max-width: 500px) {
            height: 25px;
          }
        }
        p {
          width: 100%;
          @media (max-width: 550px) {
            font-size: 13px;
          }
        }
      }

      &-contain {
        display: flex;
        width: 100%;
        height: fit-content;
        justify-content: space-between;
        gap: 5px;

        @media (max-width: 420px) {
          width: 100%;
        }
      }

      &-int {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;

        @media (max-width: 550px) {
          grid-template-columns: repeat(2, 1fr);
          gap: 5px;
        }
        @media (max-width: 380px) {
          grid-template-columns: 1fr;
        }
      }
    }
  }
`;
