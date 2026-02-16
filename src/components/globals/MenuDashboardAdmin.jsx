/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { startLogoutAdmin } from "../../actions/authActions";
import { useRoutesDashAdmin } from "../../views/users/routes/routes";
import styled from "styled-components";

export const MenuDashboardAdmin = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(startLogoutAdmin());
    navigate("/");
  };


  return (
    <DshMnu>
      <div className="menudashbadm">
          <ul className="menudashbadm-links">
              {useRoutesDashAdmin().map((item, index) => (
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
    </DshMnu>
  )
}

const DshMnu = styled.div`
.menudashbadm{
    display: grid;
    width: 100%;
    margin: 0;
    padding: 0;
    ul{
     margin: 0;
     padding: 0;
    }
    &-links{
       display: grid;
       gap: 2px;
       list-style: none;
       
       a{
              padding: 10px 25px;
              display: block;
              background: var(--secondary-light);
              width: 250px;
              height: fit-content;
              color: white;
              text-decoration: none;
              border-radius: 7px;
              border: var(--secondary) 1px solid;
              transition: all ease .5s;
              &:hover{
                  color: black;
                  font-weight: 700;
                  border: var(--secondary-light) 1px solid;
                  border-left: var(--secondary-light) 5px solid;
                  background: transparent;
                }
                @media (max-width: 920px) {
                    // border: 1px solid black;
                    font-size: 20px;
                  }
            }
      @media (max-width: 920px) {
        gap: 10px;
        padding: 100px 50px 200px 50px;
      }

      .active{
        transition: all ease .5s;
        border: var(--secondary-light) 1px solid;
        background: transparent;
        color: black;
        font-weight: 700;
        border-left: var(--secondary-light) 5px solid;
      }
    }

}
`


