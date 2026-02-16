/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Comments, Pagination, CardProductsSmall } from "../../../index";
import { getFile } from "../../reducers/globalReducer";
import { startChecking } from "../../actions/authActions";

import "../home/home.scss";
import {
  fetchProducts,
  selectedProduct,
  setProduct,
} from "../../actions/productActions";

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const lang = useSelector((state) => state.langUI.lang);
  const ratings = useSelector((state) => state.product.ratings);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);

  const allProducts = useSelector((state) => state.product.productInfo);
  const rams = allProducts.filter((p) => p.category === "memorias ram");
  const hardDisks = allProducts.filter((p) => p.category === "discos duros");
  const motherBoards = allProducts.filter((p) => p.category === "motherboards");
  const [laptopsImage, setLaptopsImage] = useState(null);
  const [othersImage, setOthersImage] = useState(null);

  const itemsPerPage = 16;
  const totalPages = Math.ceil(
    rams.length / itemsPerPage ||
      hardDisks.lenght / itemsPerPage ||
      motherBoards.length / itemsPerPage,
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRams = rams.slice(startIndex, startIndex + itemsPerPage);
  const paginatedHardDisks = hardDisks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const paginatedMotherboards = motherBoards.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) return;

    setLaptopsImage((prev) => {
      if (prev) return prev; // 🔒 ya existe, no la sobrescribas

      const laptop = allProducts.find(
        (p) => p.category?.toLowerCase() === "portatiles",
      );

      return laptop?.images?.[0]?.img_url || null;
    });

    setOthersImage((prev) => {
      if (prev) return prev; // 🔒 ya existe, no la sobrescribas

      const other = allProducts.find(
        (p) => p.category?.toLowerCase() === "variados",
      );

      return other?.images?.[0]?.img_url || null;
    });
  }, [allProducts]);

useEffect(() => {
  dispatch(startChecking());
  i18n.changeLanguage(lang);

  let eventSource;
  let retryTimeout;
  let active = true;

  const connectSSE = () => {
    if (!active) return;

    eventSource = new EventSource(
      `${import.meta.env.VITE_APP_API_URL}/products/stream`,
      { withCredentials: true }
    );

    eventSource.addEventListener("products", (event) => {
      try {
        const products = JSON.parse(event.data);
        setProducts(products);
      } catch (e) {
        console.error("❌ Error parseando SSE", e);
      }
    });

    eventSource.addEventListener("heartbeat", () => {
      // 💓 conexión viva
    });

    eventSource.onerror = () => {
      console.warn("⚠️ SSE desconectado. Reintentando...");
      eventSource.close();

      // 🔁 reconexión silenciosa
      retryTimeout = setTimeout(connectSSE, 1500);
    };
  };

  // 🔌 primera conexión
  connectSSE();

  return () => {
    active = false;
    clearTimeout(retryTimeout);
    eventSource?.close();
  };
}, [lang, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts()); // 👈 IMPORTANTE
    dispatch(startChecking());
  }, [dispatch]);

  const handleSetProductClick = (product) => {
    dispatch(selectedProduct(product));
  };

  return (
    <section className="homescreen">
      <header className="homescreen-header">
        <div className="homescreen-header__contain">
          <div className="homescreen-header__contain-item">
            <img src={laptopsImage} alt="" />
            <div className="homescreen-titles">
              <h2 className="homescreen__h2">{t("globals.takeLookLaptop")}</h2>
              <p className="homescreen__p2">
                {t("globals.takeLookTechTextLap")}
                <strong className="homescreen__strong">
                  <a className="homescreen-a" href="">
                    {" "}
                    {t("globals.readMore")}
                  </a>
                </strong>
              </p>
            </div>
          </div>
          <div className="homescreen-header__contain-item1">
            <img
              src={getFile("img/images/technology", `phones`, "jpeg")}
              alt=""
            />
            <div className="homescreen-titles-a">
              <h2 className="homescreen__h3">{t("globals.takeLookTech")}</h2>
              <p className="homescreen__p3">
                {t("globals.takeLookTechText")}
                <strong className="homescreen__strong">
                  <a className="homescreen-a" href="">
                    {" "}
                    {t("globals.readMore")}
                  </a>
                </strong>
              </p>
            </div>
          </div>
          <div className="homescreen-header__contain-item2">
            <img src={othersImage} alt="" />
            <div className="homescreen-titles-b">
              <h2 className="homescreen__h4">{t("globals.takeLookGrain")}</h2>
              <p className="homescreen__p4">
                {t("globals.takeLookGrainText")}
                <strong className="homescreen__strong">
                  <a className="homescreen-a" href="">
                    {" "}
                    {t("globals.readMore")}
                  </a>
                </strong>
              </p>
            </div>
          </div>
          <div className="homescreen-header__contain-item3">
            <img src={getFile("img/images", `canasta-basica`, "jpg")} alt="" />
            <div className="homescreen-titles-b">
              <h2 className="homescreen__h5">{t("globals.takeLookGrocery")}</h2>
              <p className="homescreen__p5">
                {t("globals.takeLookGroceryText")}
                <strong className="homescreen__strong">
                  <a className="homescreen-a" href="">
                    {" "}
                    {t("globals.readMore")}
                  </a>
                </strong>
              </p>
            </div>
          </div>
        </div>
      </header>
      <div className="homescreen__container">
        <h1 className="homescreen__h1">{t("globals.buyCategory")}</h1>
        <h2>{t("products.ramMemory")}</h2>
        <div className="homescreen__container-contain">
          {loading ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : rams.length === 0 ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : (
            paginatedRams.map((itemL) => (
              <CardProductsSmall
                key={itemL.id}
                productLink={`/products/${itemL.id}`}
                addToWish={"addwishlist-red"}
                img={itemL.images?.[0]?.img_url} // ✅ imagen principal
                images={itemL.images} // ✅ PASAR EL ARRAY
                sellingsText
                sellings={t("globals.sellings")}
                priceText
                previousPrice={itemL.previousPrice}
                onClick={() => handleSetProductClick(itemL)}
                prodHover={() => handleSetProductClick(itemL)}
                description={itemL.description}
                title={itemL.title}
                ratingss
                ratings={ratings}
                product_id={itemL.id}
              />
            ))
          )}
        </div>
        {totalPages.length > itemsPerPage && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              colorText="dark"
              arrowPrev="button dark"
              arrowNext="button dark"
            />
          </div>
        )}
      </div>
      <div className="homescreen__container">
        <h2>{t("products.hardDisks")}</h2>
        <div className="homescreen__container-contain">
          {loading ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : hardDisks.length === 0 ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : (
            paginatedHardDisks.map((itemC) => (
              <CardProductsSmall
                key={itemC.id}
                productLink={`/products/${itemC.id}`}
                onClick={() => handleSetProductClick(itemC)}
                prodHover={() => handleSetProductClick(itemC)}
                addToWish={"addwishlist-red"}
                addTocart={"addcart-red"}
                img={itemC.images[0].img_url}
                sellingsText={true}
                sellings={t("globals.sellings")}
                priceText={true}
                previousPrice={itemC.previousPrice}
                productInfo={itemC}
                jpg="true"
                description={itemC.description}
                title={itemC.title}
                thumbnails={itemC.thumbnails}
                products="ropa para niños"
                ratingss={true}
                ratings={ratings}
                product_id={itemC.id}
              />
            ))
          )}
        </div>
        {totalPages.length > itemsPerPage && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              colorText="dark"
              arrowPrev="button dark"
              arrowNext="button dark"
            />
          </div>
        )}
      </div>
      <div className="homescreen__container">
        <h2>{t("products.motherBoards")}</h2>
        <div className="homescreen__container-contain">
          {loading ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : motherBoards.length === 0 ? (
            <p>{t("globals.emptyProducts")}</p>
          ) : (
            paginatedMotherboards.map((itemCl) => (
              <CardProductsSmall
                key={itemCl.id}
                productLink={`/products/${itemCl.id}`}
                onClick={() => handleSetProductClick(itemCl)}
                prodHover={() => handleSetProductClick(itemCl)}
                addToWish={"addwishlist-red"}
                addTocart={"addcart-red"}
                img={itemCl.images?.[0]?.img_url}
                thumbnails={itemCl.images}
                sellingsText={true}
                sellings={t("globals.sellings")}
                priceText={true}
                previousPrice={itemCl.previousPrice}
                productInfo={itemCl}
                jpg="true"
                description={itemCl.description}
                beforePrice={itemCl.previousPrice}
                title={itemCl.name}
                category={"Celulares"}
                ratingss={true}
                ratings={ratings}
                product_id={itemCl.id}
              />
            ))
          )}
        </div>
        {totalPages.length > itemsPerPage && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              colorText="dark"
              arrowPrev="button dark"
              arrowNext="button dark"
            />
          </div>
        )}
      </div>

      <div className="homescreen__container">
        <Comments />
      </div>
    </section>
  );
};
