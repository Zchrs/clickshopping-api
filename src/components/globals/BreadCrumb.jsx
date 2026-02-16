import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const BreadCrumb = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const pathnames = location.pathname
    .split("/")
    .filter(Boolean);

  // 🔹 Mapa route → texto
  const routeNameMap = {
    home: t("globals.home"),
    categories: t("globals.categories"),
    "spare-parts": t("globals.foods"),
    technology: t("globals.technology"),
    clothing: t("globals.clothing"),
    products: t("globals.products"),
    services: t("globals.services"),
  };

  return (
    <BreadCrumbStyle>
        <div className="breadcrumb">
          <Link to="/">{t("globals.home")}&nbsp; </Link>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const label = routeNameMap[value] || value;
            return (
              <span key={to}>
                {" / "}
                {isLast ? (
                  <span className="breadcrumb-current"> {label} </span>
                ) : (
                  <Link to={to}>{label}&nbsp;</Link>
                )}
              </span>
            );
          })}
        </div>
    </BreadCrumbStyle>
  );
};

const BreadCrumbStyle = styled.div`


.breadcrumb{
  display: flex;
  width: 100%;
  a{
    color: var(--dark);
    &:hover{
        color: var(--Primary);
          text-decoration: underline;
      }
  }
  span{
    a{
      color: var(--dark);
      &:hover{
          color: var(--Primary);
            text-decoration: underline;
        }
    }
  }
    

}

`