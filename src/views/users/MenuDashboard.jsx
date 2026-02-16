/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useRoutesDash } from "./routes/routes";
import { startLogout } from "../../actions/authActions";
import { useTranslation } from 'react-i18next';
import styled from "styled-components";


export const MenuDashboard = () => {
  const routesDash = useRoutesDash();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(startLogout());
    navigate("/auth/login");
  };

  return (
    <DshMenu>
      <div className="menudashb">
          <ul className="menudashb-links">
              {routesDash.map((item, index) => (
                <NavLink to={item.route} key={index}>
                  <li>{item.text}</li>
                </NavLink>
              ))}
          </ul>
              <button onClick={handleLogout}>{t('auth.logout')}</button>
      </div>
    </DshMenu>
  )
}

const DshMenu = styled.nav`
  .menudashb{
    display: grid;
    width: 100%;
    background: white;
border-radius: 10px;
padding: 10px 0px 20px 0px;
    
    &-links{
       display: grid;
       padding: 10px 0 0 50px;
       gap: 15px;
       list-style: none;
            a{
                width: 100%;
                height: fit-content;
                font-weight: 400;
                color: black;
                @media (max-width: 920px) {
                    // border: 1px solid black;
                    font-size: 20px;
                  }
                  &:hover{
                    color: var(--primary);
                }
            }
      @media (max-width: 920px) {
        gap: 10px;
        padding: 100px 50px 200px 50px;
      }
    }
    button{
      display: flex;
      text-decoration: none;
      font-size: 17px;
      border: none;
      font-weight: 500;
      gap: 5px;
      margin: 20px 48px 0;
      padding: 0;
      background: transparent;
      place-items: center;
      align-self: center;
      color: rgb(68, 66, 66);
      &:hover{
          color: var(--primary);
          img{
              filter: grayscale(0%);
              
          }
      }
      &:focus-visible{
          border: none;
          outline: none;
      }
      &:focus{
          border: none;
          outline: none;
      }

  }
}

`