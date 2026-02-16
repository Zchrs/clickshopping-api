/* eslint-disable no-unused-vars */
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import styled from 'styled-components';
import { BaseButton, BaseInput } from "../../../../index";
import { useForm } from "../../../hooks/useForm";
import { startCheckingAdmin } from "../../../actions/authActions";
import { useValidations } from "../../../hooks/useValidations";

import { Link } from "react-router-dom"
import { useEffect } from "react";

export const HomeScreenAdmin = () => {
  const { formRefs, validateForm } = useValidations();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startCheckingAdmin());
  }, [dispatch]);
  
  const initialForm = {
    email: "",
    pass: "",
  };


  const {
    form,
    errors,
    loading,
    response,
    handleLoginAdmin,
    handleChangeAdmin,
    handleBlur
  } = useForm(initialForm, validateForm);

  return (
    <AdminHome className="home">
         <form>
        <div>
          <BaseInput
          classs={"inputs normal"}
          placeholder={t('auth.email')}
          id="email"
          name="email"
          formRefs={formRefs.email}
          value={form.email}
          onBlur={handleBlur}
          onChange={handleChangeAdmin}
          
          isEmail
          />
        </div>
        <div>
          <BaseInput
          classs={"inputs normal"}
          placeholder={t('auth.yourPass')}
          onBlur={handleBlur}
          onChange={handleChangeAdmin}
          formRefs={formRefs.pass}
          value={form.pass}
          id="pass"
          name="pass" 
          isPassword
          
          />
        </div>
        <div>
          <Link className="home-a">{t('auth.forgetPass')}</Link>
        </div>
        <div className="home-btn">
          <BaseButton 
          handleClick={handleLoginAdmin} 
          classs={"button primary"} 
          colorbtn={"var(--primary)"}
          colortextbtnprimary={"var(--light)"}
          colorbtnhoverprimary={"var(--primary-light)"}
          colortextbtnhoverprimary={"var(--light)"}
          textLabel={true} 
          label={t('auth.login')}
          />
        </div>
      </form>
      <p className="home-p">Control panel V1.0</p>
    </AdminHome>
  )
}

const AdminHome = styled.section`

    display: grid;
    position: relative;
    width: 100%;

    .home-btn{
        display: grid;
        width: 70%;
        margin: auto;
    }

    .home-a{
        margin: auto;
        width: fit-content;
        display: grid;
        color: white;
        text-decoration: none;
        margin-top: 10px;
        // border: white 1px solid;
    }
    .home-p{
        width: 100%;
        margin-top: 15px;
        text-align: center;
        color: white;
        font-size: 14px;
       
    }

    form{
        margin: auto;
        width:20%;
        display: grid;
        gap: 10px;
        @media (max-width: 680px) {
            width: 80%;
        }
    }

`