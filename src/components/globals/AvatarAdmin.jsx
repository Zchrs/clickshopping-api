/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getFile } from "../../reducers/globalReducer"
import { startCheckingAdmin, startLogoutAdmin } from "../../actions/authActions";
import '../../assets/sass/avatarAdmin.scss'

export const AvatarAdmin = ({avtsmall, avtMedium, img, clas, dropData, classWhite, nameSmall, nameAdm}) => {
    
const admin = useSelector((state) => state.authAdmin.admin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lang = useSelector(state => state.langUI.lang);
    const { t, i18n } = useTranslation();

    useEffect(() => {
      i18n.changeLanguage(lang);
      dispatch(startCheckingAdmin());
    }, [i18n, lang, dispatch]);

    const handleLogout = () => {
      dispatch(startLogoutAdmin());
      navigate("/");
    };
    
  return (
    <div className={clas}>
        {avtMedium && (<div className="avatar-default"><img src={getFile('png', `${img}`, 'png')} alt="" /></div>)}
        {avtsmall && (<div className="tumb-default"><img src={getFile('png', `${img}`, 'png')} alt="" /></div>)}
        <span className={classWhite}>
          {admin ? <strong className={nameSmall}>{nameAdm}</strong> : <strong className={nameSmall}>Default name</strong>}
        </span>
        {dropData && (
        <div>
          <div className="avatar-usersession">

              <button onClick={handleLogout}><i><img src={getFile('svg', 'off', 'svg')} alt="" /></i>{ t("dashboard.logout") }</button>
          </div>
        </div> )}
    </div>
  )
}
