import { getFile } from "../reducers/globalReducer"
import { AuthRouter } from "../router/AppRouter"
import { Link, NavLink } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { startChecking } from "../actions/authActions";
import styled from'styled-components';

export const AuthLayout = () => {

  const dispatch = useDispatch();

  const lang = useSelector(state => state.langUI.lang);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
    dispatch(startChecking());
  }, [i18n, lang, dispatch]);

  return (
    <AuthLyt>
      <section className="authlayout">
        <div className="authlayout-header">
          <div className="authlayout-header-logo">
            <Link to={"/"}><img src={getFile('svg', 'logo', 'svg')} alt="" /></Link>
          </div>
        </div>
        <div className="authlayout-container">
        <div className="authlayout-container-group">
          <NavLink className={ ({isActive}) => ` ${ isActive ? 'active' : '' } ` } to={"/auth/register"}>{t('auth.newAccount')}</NavLink>
          <NavLink className={ ({isActive}) => ` ${ isActive ? 'active' : '' } ` } to={"/auth/login"}>{t('auth.login')}</NavLink>
        </div>
          <AuthRouter />
        </div>
        <div className="authlayout-footer">
        </div>
      </section>
    </AuthLyt>
  )
}


const AuthLyt = styled.section`
  .authlayout{
    display: grid;
    width: 100%;
    max-width: 1920px;

    &-header{
        display: flex;
        padding: 0 25px;
        width: 100%;
        height: 130px;
        background: var(--dark);

        @media (max-width: 550px) {
            padding: 0 12px;
        }
        @media (max-width: 300px) {
            padding: 0 6px;
        }

        &-logo{
            display: grid;
            align-items: center;
            width: 120px;
            height: 100%;
            img{
                width: 100%;
                margin: auto 0;
                filter: invert(50%) brightness(500%);
            }
        }
    }
    &-container{
        position: relative;
        display: grid;
        padding: 25px;
        width: 100%;
        height: fit-content;
        min-height: 100vh;
        align-self: baseline;
        
        
        
        @media (max-width: 720px) {
            grid-row: 2 / 3;
            padding: 12px;
            
        }
        
        @media (max-width: 300px) {
            grid-row: 2 / 3;
            padding: 25 12px;
            
        }

        &-group{
            align-self: baseline;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-self: baseline;
            // border: var(--primary) 1px solid;
            gap: 40px;
    
            a{
                color: black;
                cursor: pointer;
                font-size: 18px;
                &:hover{
                    color: var(--primary);
                }

                @media (max-width: 380px) {
                    font-size: 17px;
                    margin: 0;
                }
            }
        }
    }
    &-footer{
        display: grid;
        width: 100%;
        height: 70px;
        background: #727376;
    }
    .active{
        color: black;
        border-bottom: var(--primary) 3px solid;
        a{
            color: var(--primary);
        }
    }
}


.auth{
    grid-row: 2 / 12 ;
    animation: smooth .5s ease;
    position: relative;
    padding: 25px 0;
    margin: 0 auto;
    gap: 25px;
    display: grid;
    width: 40%;
    height: fit-content;
    align-self: baseline;
    // border: var(--primary) 1px solid;

    @media (max-width: 720px) {
        padding: 13px 0;
        width: 80%;
    }
    @media (max-width: 420px) {
        width: 100%;
    }
    @media (max-width: 300px) {
        padding: 25px 0;
        width: 70%;
        margin: 0;
    }
    
    
    form{
        position: relative;
        display: grid;
        gap: 10px;
        margin: 0;
        padding: 0 25px;
        align-self: baseline;

        .a{
            width: fit-content;
            color: var(--primary);
            &:hover{
                color: #f0abab;
            }
        }

        @media (max-width: 410px) {
            padding: 0 0;
        }

        
        .span{
            top: -8px;
            left: 21px;
            position: absolute;
            color: var(--primary);
        }

        .svg{
            position: absolute;
            right: 65px;
            top: 15px;
            width: 13px;
            fill: #34353656;
            cursor: pointer;

            &:hover{
               filter: invert(100%);
            }
        }
 
    }
    &-gruop2{
        margin: 0 auto;
        position: relative;
        display: grid;
        place-items: center;
        align-self: baseline;
        gap: 20px;
        

        hr{
            position: absolute;
            width: 320%;
            bottom: 11px;
            border: 1px groove #72737656;

            @media (max-width: 920px) {
                width: 300%;
            }
            @media (max-width: 410px) {
                width: 200%;
            }
        }

        h3{
            z-index: 10;
            margin: 0 auto;
            padding: 0 15px;
            width: fit-content;
            background: #f5f1f1;
            border-radius: 20px;
            text-align: center;
            color: black;
            
        }
    }
    &-social{
        margin: auto;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        text-align: center;
        justify-content: center;
        img{
            width: 50px;
            cursor: pointer;
        }
       
    }
    &-tyc{
        text-align: center;
        margin: 0 auto;
        display: grid;        
    }
}


@keyframes smooth {
    0% {
      opacity: 0;
      transform: translateX(50%);
    }
  
    100% {
      transform: translateX(0%);
      opacity: 1;
    }
  }

  // div contenedor
  .ReactSelectFlags-module_container__SFuNT {
    border-radius: 12px !important;
    width: 100% !important;
    height: 45px !important;
    color: black !important;
    @media (max-width: 550px) {
        height: 70px !important;
        
    }
    input{
        height: 100% !important;
    }
}

// Country select component
.ReactSelectFlags-module_selectWrapper__I7wcI{
    height: 100% !important;
    // border: #727376 1px solid;
    color: black !important;
    outline: 0 !important;
}

// input
.ReactSelectFlags-module_searchSelect__O6Fp2{
    background: transparent !important;
    border-radius: 8px !important;
    padding: 12px 45px !important;
    color: black !important;
    font-weight: 400;
    &::placeholder{
        font-size: 15px !important;
        color: #bdbbbb !important;
    }

    @media (max-width: 550px) {
        font-size: 22px !important;
        padding: 12px 60px !important;
    }
}
.ReactSelectFlags-module_optionsWrapper__ryj1d{
    border-radius: 8px !important;
}
// img up
.ReactSelectFlags-module_closeIcon__t4cEW{
    fill: #bec1c6 !important;
    width: 35px !important;
    height: 35px !important;
}
.ReactSelectFlags-module_openIcon__Bgn1-{
    fill: #505153 !important;
    width: 35px !important;
    height: 35px !important;
}
// img close
.ReactSelectFlags-module_clearIcon__EdJlf{
    width: 15px !important;
    height: 15px !important;
    right: 50px !important;
}

// img bandera 
.ReactSelectFlags-module_selectedFlagIcon__i5u-N{
    width: 30px !important;
    @media (max-width: 550px) {
        height: 50px !important;
        left: 20px !important;
    }
}

// option flag
.ReactSelectFlags-module_optionFlag__4Hybz{
    margin: 5px 0;

    svg{
        width: 50px !important;
        height: 20px !important;
        @media (max-width: 550px) {
            width: 50px !important;
            height: 25px !important;
        }
    }
}

// fin Country select component
`