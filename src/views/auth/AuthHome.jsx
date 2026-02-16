import { Link } from "react-router-dom"
import { AuthRouter } from "../../router/AppRouter"
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { startChecking } from "../../actions/authActions";

const grid = {
    display: 'grid',
}

export const AuthHome = () =>{
  const dispatch = useDispatch();
    const lang = useSelector(state => state.langUI.lang);
    const { t, i18n } = useTranslation();
    useEffect(() => {
      dispatch(startChecking());
        i18n.changeLanguage(lang);
      }, [i18n, lang, dispatch]);



    return (
        <section className="authhome" style={ grid }>
          <h1>Bienvenido</h1>

          <Link to={'/register'}>{t('auth.newAccount')}</Link>
          <Link to={'/login'}>{t('auth.login')}</Link>
          <Link to={'/'}>{t('globals.backHome')}</Link>

          <AuthRouter />
        </section>
    )
}
