/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { startLogout } from "../../actions/authActions";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const MenuDashboard = () => {
  const { t, i18n } = useTranslation();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(startLogout());
    navigate("/");
  };

  const routesDash = [
    {
      name: 'General',
      route: '/',
      text: `${t("globals.general")}`
    },
    {
      name: 'reports',
      route: 'reports',
      text: t("globals.reports")
    },
    {
      name: 'pending',
      route: 'orders/pending',
      text: 'Pedidos pendientes'
    },
    {
      name: 'complete',
      route: 'orders/complete',
      text: 'Pedidos completados'
    },
    {
      name: 'orders',
      route: 'orders',
      text: `${t("globals.dashboard.orders")}`
    },
    {
      name: 'memberships',
      route: 'memberships',
      text: 'Membresías'
    },

    {
      name: 'users',
      route: 'users',
      text: 'Usuarios'
    },
    {
      name: 'validations',
      route: 'validations',
      text: 'Validaciones'
    },
    {
      name: 'finances',
      route: 'finances',
      text: 'Finanzas'
    },
    {
      name: 'user verify',
      route: 'verify-profile',
      text: 'Verificación de usuarios'
    },

    {
      name: 'sugestions',
      route: 'discounts',
      text: 'Descuentos'
    },
    {
      name: 'products',
      route: '/dashboard/products',
      text: 'Productos'
    },
    {
      name: 'settings',
      route: 'settings',
      text: 'Ajustes'
    },

  ];

  return (
    <DashMenu>
      <div className="menudashb">
          <ul className="menudashb-links">
              {routesDash.map((item, index) => (
                <NavLink
                className={({isActive}) => `${ isActive ? 'active' : '' }`}
                to={item.route} key={index}
                >
                  <li>{item.text}</li>
                </NavLink>
              ))}
          </ul>
              {/* <button onClick={handleLogout}>Cerrar sesión</button> */}
      </div>
    </DashMenu>
  )
}

const DashMenu = styled.div`
.menudashb{
    display: grid;
    width: 100%;
    
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
