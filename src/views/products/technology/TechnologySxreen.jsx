/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { fetchProducts, selectedProduct } from "../../../actions/productActions";
import { startChecking } from "../../../actions/authActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CardProducts, Empty, BreadCrumb, Pagination } from "../../../../index";

export const TechnologyScreen = () => {
  const [activeTab, setActiveTab] = useState("laptops");
  const [showFeatures, setShowFeatures] = useState(true);
  const dispatch = useDispatch();
  const ratings = useSelector((state) => state.product.ratings);
  const lang = useSelector((state) => state.langUI.lang);
  const allProducts = useSelector((state) => state.product.productInfo || []);
  const [currentPage, setCurrentPage] = useState(1);

  const { t, i18n } = useTranslation();
  const itemsPerPage = 24;

  /* ✅ FILTROS */
  const laptops = allProducts.filter(p => p.category === "portatiles");
  const phones = allProducts.filter(p => p.category === "celulares");
  const speakers = allProducts.filter(p => p.category === "speakers");
  const others = allProducts.filter(p => p.category === "variados");

  const productsByTab = {
    laptops,
    phones,
    speakers,
    others,
  };

  const activeProducts = productsByTab[activeTab] || [];

  /* ✅ PAGINACIÓN DINÁMICA */
  const totalPages = Math.ceil(activeProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = activeProducts.slice(startIndex, startIndex + itemsPerPage);

  /* ✅ RESET DE PAGINACIÓN AL CAMBIAR TAB */
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    dispatch(startChecking());
    i18n.changeLanguage(lang);
  }, [i18n, lang, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts()); // 👈 IMPORTANTE
  }, [dispatch]);

  const handleSetProductClick = (product) => {
    dispatch(selectedProduct(product));
  };

  return (
    <section className="productscreen">
      <div className="productscreen-header">
        <h2 className="productscreen-showroute">
          <BreadCrumb />
        </h2>
      </div>

      {/* 🔘 TABS */}
      <div className="productscreen-features">
        <div className={`productscreen-features-menu ${showFeatures ? "show" : "hide"}`}>
          <button className={activeTab === "laptops" ? "active" : ""} onClick={() => setActiveTab("laptops")}>
            Portátiles
          </button>
          <button className={activeTab === "phones" ? "active" : ""} onClick={() => setActiveTab("phones")}>
            Celulares
          </button>
          <button className={activeTab === "speakers" ? "active" : ""} onClick={() => setActiveTab("speakers")}>
            Parlantes portátiles
          </button>
          <button className={activeTab === "others" ? "active" : ""} onClick={() => setActiveTab("others")}>
            Variado
          </button>
          <div
            className={`productscreen-features-menu-btn ${showFeatures ? "showBtn" : "hideBtn"}`}
            onClick={() => setShowFeatures(!showFeatures)}
          >
            <div className="productscreen-features-btn-arrow"></div>
          </div>
        </div>
      </div>

      {/* 🟢 CONTENIDO */}
      <div className="productscreen-container">
        <div className="productscreen-contain">
          <h2 className="h2-light">
            {activeTab === "laptops" && "Portátiles"}
            {activeTab === "phones" && "Celulares"}
            {activeTab === "speakers" && "Parlantes portátiles"}
            {activeTab === "others" && "Variados"}
          </h2>

          <div className="productscreen-cards">
            {activeProducts.length === 0 ? (
              <div className="productscreen-empty">
                <Empty img="empty" message={t("globals.emptyProducts")} />
              </div>
            ) : (
              paginatedProducts.map((itemL) => (
                <CardProducts
                  key={itemL.id}
                  productLink={`/products/${itemL.id}`}
                  jpg
                  img={itemL.images?.[0]?.img_url}
                  images={itemL.images}
                  previousPrice={itemL.price}
                  price={itemL.previousPrice}
                  onClick={() => handleSetProductClick(itemL)}
                  prodHover={() => handleSetProductClick(itemL)}
                  member="10% de descuento para miembros premium"
                  previuosPrice={itemL.previousPrice}
                  description={itemL.description}
                  quantity={itemL.quantity}
                  title={itemL.title}
                  ratingss
                  ratings={ratings}
                  product_id={itemL.id}
                  classs="productcard background"
                  buyCr
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              colorText="dark"
              arrowPrev="button dark"
              arrowNext="button dark"
            />
          )}
        </div>
      </div>
    </section>
  );
};

