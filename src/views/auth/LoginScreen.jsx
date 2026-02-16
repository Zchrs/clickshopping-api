/* eslint-disable no-unused-vars */
import { Link, Navigate } from "react-router-dom"
import { BaseButton } from "../../components/globals/BaseButton"
import { BaseInput } from "../../components/globals/BaseInput"
import { getFile } from "../../reducers/globalReducer"
import { useValidations } from'../../hooks/useValidations'
import { useTranslation } from 'react-i18next';
import { useForm } from "../../hooks/useForm";
import { useDispatch } from "react-redux";
import { startChecking } from "../../actions/authActions";
import Loader from "../../components/globals/Loader";
import Message from "../../components/globals/Message";
import { useEffect } from "react";



export const LoginScreen = () => {
  const { formRefs, validateForm } = useValidations();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startChecking());
  }, [dispatch]);

  const initialForm = {
    email: "",
    password: "",
  };

  const {
    form,
    errors,
    loading,
    response,
    handleLogin,
    loadingActive,
    handleChange,
    handleBlur
  } = useForm(initialForm, validateForm);
  return (
    <section className="auth">
      <form>
        <div>
          <BaseInput
          inputRef={formRefs.email}
          classs={"inputs normal"}
          placeholder={t('auth.email')}
          id="email"
          name="email"
          value={form.email}
          onBlur={handleBlur}
          onChange={handleChange}
          
          isEmail
          />
        </div>
        <div>
          <BaseInput
          inputRef={formRefs.password}
          classs={"inputs normal"}
          placeholder={t('auth.yourPass')}
          onChange={handleChange}
          onBlur={handleBlur}
          value={form.password}
          id="password"
          name="password" 
          isPassword
          
          />
        </div>
        <Link className="a">{t('auth.forgetPass')}</Link>
        <BaseButton 
              handleClick={handleLogin} 
              label={t('auth.login')}
              classs={'button primary'} 
              colorbtn={"var(--primary)"}
              colortextbtnprimary={"var(--light)"}
              colorbtnhoverprimary={"var(--bg-primary-tr)"}
              colortextbtnhoverprimary={"white"}  
              textLabel={true}
        />
      </form>
      <div className="auth-gruop2">
        <h3>{t('auth.sesion')}</h3>
        <hr />
      </div>
      <div className="auth-social">
        <img src={getFile('svg', 'facebook', 'svg')} alt="facebook-logo" />
        <img src={getFile('svg', 'google-icon', 'svg')} alt="google-logo" />
        <img src={getFile('svg', 'twitter', 'svg')} alt="twitter-logo" />
        <img src={getFile('svg', 'linkedin', 'svg')} alt="linkedin-linkedin" />
        <img src={getFile('svg', 'apple-logo', 'svg')} alt="apple-logo" />
      </div>
    </section>
  )
}
