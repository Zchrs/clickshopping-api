/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeLang } from '../../actions/userActions'; 
import { getFile } from '../../reducers/globalReducer';
import { useTranslation } from 'react-i18next';
import '../../assets/sass/lang.scss'
import styled from 'styled-components';

export const Lang = () => {
  const [defaulted, setDefaulted] = useState(localStorage.getItem('lang') || 'es');
  const lang = useSelector(state => state.langUI.lang);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
//   console.log(i18n)
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

const handleChange = async (event) => {
    const selectedLang = event.target.value; // obtener datos del select
    await i18n.changeLanguage(selectedLang); // cambiar el idioma
    dispatch(changeLang({ lang: selectedLang })); //despachar el idioma en el contexto
    localStorage.setItem('lang', selectedLang ); // almacenar el idioma en localstorage
    window.location.reload();
  };

//   const handleLogout = () => {
//     dispatch(logout()).then(() => {
//       // Perform routing logic here after logout if needed
//     });
//   };

  return (
    <LaNg>
      <div className="lang">
        <div className="lang-box__select">
          <label className='lang__textop' htmlFor="lang">
          <img src={getFile('svg', `${defaulted}`, 'svg')} alt="" />
          </label>
          <select
            className={`lang-box-lang lang__textop`}
            name="lang"
            id="lang"
            value={defaulted}
            onChange={handleChange}>
            <option className="lang__textop" value="en">EN</option>
            <option className="lang__textop" value="es">ES</option>
          </select>
        </div>
      </div>
    </LaNg>
  );
};

const LaNg = styled.div`
.lang {
    align-items: center;
    display: flex;
    width: fit-content;
    height: 100%;
  
    select{
        background: transparent;
        border: none;
        border-color: transparent;
        outline: none;
    }
    option{
        padding: 10px;
        // background: yellow;
        border-radius: 8px;
        border-color: transparent;
        outline: none;
        border: none;

        &:hover{
            background-color: #000;
        }
        &:active{
            background-color: #000;
        }
    }
    // @media (max-width: 700px) {
    //       display: none;
    //     }
    &.white {
      .lang__text {
        color: #fff;
        @media (max-width: 920px) {
          color: #000;
        }
      }
      .lang__textop {
        color: black;
      }
    }
    &__text {
      font-size: 12px;
      font-weight: 500;
      line-height: 24px;
      text-align: left;
      
    }
    &__subtitle {
      text-transform: none;
    }
    &-box {
      display: flex;
      gap: 8px;
      align-items: center;
      &__select {
        display: flex;
        align-items: center;
        gap: 2px;
        background: transparent;
        border-radius: 12px;
      }
      &-lang {
        border: none;
        outline: none;
        background: transparent;
      }
    }
    &__user {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: #f6f8fa;
      border-radius: 8px;
      &-img {
        background-color: black;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        padding: 4px;
      }
    }
    label{
      img{
        width: 18px;
        height: 18px;

        @media (max-width: 720px) {
          width: 30px;
        height: 30px;
        }
      }
    }
  }
`