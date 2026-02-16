/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { DashboardRouter } from "../router/AppRouter"
import { MenuDashboard } from "../views/users/MenuDashboard"
import { Avatar } from "../components/globals/Avatar"
import { HeaderDashboard } from "../components/globals/HeaderDashboard"
import { useMenu } from "./MenuContext"
import { useDispatch } from "react-redux";
import { ScreenResolution } from "../components/globals/ScreenResolution"
import { useEffect } from 'react';
import { startChecking } from "../actions/authActions";
import styled from "styled-components"

export const DashboardLayout = () => {
  
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(startChecking());
    }, [dispatch]);

  const { menu } = useMenu();

  return (
    <DshbLyt>
      <section className="dashboard">
        <header className="dashboard-header">
          <HeaderDashboard />
        </header>
        <section className="dashboard-container">
          <nav id="menu" className="dashboard-menu">
            {/* <div className="dashboard-dashavt">
              <Avatar img={"default-avatar"} avtMedium={true} clas={"avatar"} nameSmall={"namepanel"} />
            </div> */}
            <MenuDashboard />
          </nav>
          {menu && ( <nav id="menu" className="dashboard-menumobile">
            <div className="dashboard-dashavt">
              <Avatar clas={"avatar"} nameSmall={"namepanel"} />
            </div>
            <MenuDashboard />
          </nav>)}
          <div className="dashboard-contain">
            <DashboardRouter />
          </div>
        </section>
        <footer className="dashboard-footer">
          <h2>Footer</h2>
          <ScreenResolution />
        </footer>
        <div id="modal-container">
      
      </div>
      </section>
    </DshbLyt>
  )
}

const DshbLyt = styled.section`
  .dashboard{
    margin: auto;
    display: grid;
    width: 100%;
    max-width: 1920px;
    height: fit-content;
    min-height: 100vh;
    background: #edeff4;
    align-items: baseline;
    gap: 25px;
    @media (max-width: 430px) {
        gap: 12px;
    }
    &-header{
        display: grid;
        width: 100%;
        height: 50px;
        color: red;
        padding: 25px;
        @media (max-width: 450px) {
            padding: 0 12px;
        }
    }
    &-container{
        display: grid;
        grid-template-columns: 300px 1fr;
        width: 100%;
        height: fit-content;
        min-height: 100vh;
        gap: 25px;
        padding: 24px;
        max-width: 1920px;
        margin: 0 auto;

        @media (max-width: 920px) {
            grid-template-columns: 1fr;
            margin-top: 50px;
        }

        @media (max-width: 450px) {
            grid-template-columns: 1fr;
            padding: 0 12px;
        }
        @media (max-width: 380px) {
            grid-template-columns: 1fr;
            padding: 0 12px;
        }
    }

    &-contain{
        display: grid;
        border-radius: 10px;
        // box-shadow: 1px 1px 5px #ebe9e9, -1px -1px 5px #ebe9e9;
    }

    &-menu{
        display: grid;
        width: 100%;
        height: fit-content;
        gap: 25px;
        @media (max-width: 920px) {
            display: none;
        }
    }

    &-menumobile{
         display: none;
        @media (max-width: 920px) {
            animation: slide .5s ease .2s backwards;
            transition: all;
            position: absolute;
            display: grid;
            left: 0;
            top: 120px;
            width: 100%;
            height: fit-content;
            min-height: 100vh;
            background: white;
            border-radius: 10px;
            box-shadow: 1px 1px 3px #e2e6e8;
            padding: 20px 0;
            z-index: 999;
        }

        @media (max-width: 450px) {
            padding: 10px 0;
        }
    } 
    &-dashavt{
        display: grid;
        padding: 25px; 
        background: white;
        border-radius: 10px;
        align-items: center;
        justify-content: center;

        @media (max-width: 920px) {
            display: none;
        }
    }

    &-footer{
        display: grid;
        width: 100%;
        height: fit-content;
        text-align: center;
    }
}

@keyframes slide {
    from{
        transform: translateX(-100%);
    }
    to{
        transform: translateX(0%);
    }
}
`
