/* eslint-disable react/prop-types */
import { BaseInput } from "../globals/BaseInput";
import { BaseButton } from "./BaseButton";
import { BaseCheckbox } from "./BaseCheckbox";
import { getFile } from "../../reducers/globalReducer";
import { MenuBottom } from "./MenuBottom";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { initialForm, useForm } from "../../hooks/useForm";
import styled from "styled-components";
import { useRoutesFooter } from "../../views/users/routes/routes";
  

export const Footer = () => {
  const lang = useSelector((state) => state.langUI.lang);
  const user = useSelector((state) => state.auth.user);
  const currentYear = new Date().getFullYear();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);


  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validationsLogin = (form) => {
    let errors = {};
    let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;

    const email = document.getElementById("email");

    if (!form.email) {
      email.style.cssText = "border: red 1px solid";
      errors.email = "Field email is required";
    } else if (!regexEmail.test(form.email.trim())) {
      errors.email = "Email incorrect";
    } else {
      email.style.cssText = "border: #34B0BE 1px solid;";
    }

    return errors;
  };

  const {
    form,
    handleSubscribeNewsletter,
    handleBlur,
    handleChange,
    handleChecked,
  } = useForm(initialForm, validationsLogin);

  return (
    <FooTer>
      <footer className="footer">
        <div className="footer-up">
          <div onClick={scrollTop} className="footer-up__a">
            Volver arriba
          </div>
        </div>
        <div className="footer-middle">
          <div className="footer-middle__contain">
            <div className="footer-middle__links">
              <h2>Clickshopping</h2>
              {useRoutesFooter().slice(0, 5).map((item) => (
                <NavLink to={item.route} key={item.name}>
                  {item.text}
                </NavLink>
              ))}
            </div>
            <div className="footer-middle__links">
              <h2>{t("footer.earn")}</h2>
              {useRoutesFooter().slice(5, 10).map((item) => (
                <NavLink to={item.route} key={item.name}>
                  {item.text}
                </NavLink>
              ))}
            </div>
            <div className="footer-middle__links">
              <h2>{t("footer.agile")}</h2>
              {useRoutesFooter().slice(11, 17).map((item) => (
                <NavLink to={item.route} key={item.name}>
                  {item.text}
                </NavLink>
              ))}
            </div>
            <div className="footer-middle__links">
              <h2>{t("footer.helpcenter")}</h2>
              {useRoutesFooter().slice(17, 23).map((item) => (
                <NavLink to={item.route} key={item.name}>
                  {item.text}
                </NavLink>
              ))}
            </div>
            <div className="footer-middle__links">
              <h2>{t("footer.legalInfo")}</h2>
              {useRoutesFooter().slice(23, 32).map((item) => (
                <NavLink to={item.route} key={item.name}>
                  {item.text}
                </NavLink>
              ))}
            </div>
            <div className="footer-middle__newsletter">
              <div className="footer-middle__content">
                <h2>{t("footer.newsletterTitle")}</h2>
                <p className="white">
                  {t("footer.newsletterText")}
                </p>
                <form>
                  <div className="footer-middle__group">
                    <BaseInput
                      placeholder={t("footer.writeEmail")}
                      classs={"inputs normal"}
                      name="email"
                      id="email"
                      value={form.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      isEmail
                    />
                    <BaseButton
                      handleClick={handleSubscribeNewsletter}
                      link={"/"}
                      label={t("footer.subscribe")}
                      classs={'button primary'} 
                      colorbtn={"var(--bg-primary)"}
                      colortextbtnprimary={"var(--light)"}
                      colorbtnhoverprimary={"var(--bg-primary-tr)"}
                      colortextbtnhoverprimary={"white"}  
                    />
                  </div>
                  <div className="footer-middle__group2">
                    <BaseCheckbox valueChange={handleChecked} />
                    <p>
                      {t("footer.newsletterTextFull")}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-down">
          <div className="footer-down__container">
            <img src={getFile("svg", `logo`, "svg")} alt="" />
            <p>&copy; Clickshopping {currentYear} </p>
          </div>
        </div>
{ user && <div className="footer-mobile">
          <MenuBottom
            icon={"home-mobile"}
            text={t("globals.home")}
            icon1={"history-mobile"}
            text1={t("globals.history")}
            icon2={"category-mobile"}
            text2={t("globals.categories")}
            icon3={"cart-mobile"}
            text3={t("globals.cart")}
            icon4={"coupons-red"}
            text4={t("globals.coupons")}
          />
        </div>}
      </footer>
    </FooTer>
  );
};

const FooTer = styled.div`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0%);
    }
  }
  .footer {
    margin-top: 50px;

    &-up {
      display: grid;

      place-items: center;
      background: #727376;

      &__a {
        padding: 20px 0;
        text-align: center;
        width: 100%;
        height: 100%;
        text-decoration: none;
        color: white;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.086);
          color: var(--primary);
        }
      }
    }

    &-middle {
      display: grid;
      padding: 32px 24px;
      background: #4c4747;
      place-items: center;

      &__newsletter {
        grid-column: 2 / 5;
        grid-row: 2 / 3;
        align-items: center;
        display: grid;

        @media (max-width: 620px) {
          grid-row: 4;
          grid-column: 1 / 3;
        }
      }
      &__group {
        border: #575757 1px solid;
        border-radius: 18px;
        padding: 24px;
        height: fit-content;
        align-items: center;
        display: grid;
        grid-template-columns: 1fr min-content;
        width: 100%;
        gap: 8px;

        @media (max-width: 580px) {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }
      &__group2 {
        border-radius: 18px;
        padding: 0 24px;
        height: fit-content;
        align-items: center;
        display: flex;
        width: 100%;
        gap: 3px;

        p {
          color: rgb(168, 167, 167);
        }
      }
      &__content {
        display: grid;
        form{
          display: grid;
          gap: 10px;
        }
        h2 {
          font-weight: 400;
        }
        gap: 18px;
      }

      &__contain {
        display: grid;
        width: 75%;
        grid-template-columns: repeat(4, 1fr);
        height: fit-content;
        gap: 16px;

        @media (max-width: 700px) {
          grid-template-columns: repeat(2, 1fr);
          width: 100%;
        }

        @media (max-width: 399px) {
          grid-template-columns: 1fr;
          width: 100%;
        }
      }

      &__links {
        width: 100%;
        display: grid;
        height: fit-content;

        gap: 8px;

        a {
          color: rgb(168, 167, 167);
          text-decoration: none;
          font-size: 16px;
          font-weight: 200;

          &:hover {
            color: rgb(209, 206, 206);
          }
        }

        h2 {
          font-weight: 500;
          font-size: 18px;
          border-bottom: #575757 1px solid;
          padding-bottom: 5px;
        }
      }
    }

    &-down {
      display: grid;
      padding: 20px;
      background: var(--dark);
      place-items: center;
      &__container {
        display: flex;
        align-items: center;
        gap: 10px;
        img {
          height: 30px;
          filter: invert(50%) brightness(500%);
        }
      }
    }
  }
`;
