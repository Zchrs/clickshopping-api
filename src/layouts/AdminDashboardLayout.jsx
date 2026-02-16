import { DashboardAdminRouter } from "../router/AppRouter"
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import styled from 'styled-components';
import { startCheckingAdmin } from "../actions/authActions";
import { HeaderAdmin, MenuDashboardAdmin, FooterAdmin } from '../../index'

export const AdminDashboardLayout = () => {

    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(startCheckingAdmin());
    }, [dispatch]);

  return (
    <AdmDashLayout className="dashboardlayout" >
        <div className="dashboardlayout-header">
          <HeaderAdmin />
        </div>
        <div className="dashboardlayout-contain">
        <nav className="dashboardlayout-menud">
          <MenuDashboardAdmin />
        </nav>
        <div className="dashboardlayout-container">
            <DashboardAdminRouter />
        </div>
        </div>
        <div className="dashboardlayout-footer">
          <FooterAdmin />
        </div>
        <div id="modal-container">
</div>
    </AdmDashLayout>
  )
}

const AdmDashLayout = styled.section`

    margin: auto;
    display: grid;
    width: 100%;
    max-width: 1920px;
    height: fit-content;
    min-height: 100vh;
    overflow: hidden;
    background: #f2f8ff;
    align-items: baseline;
    
    .dashboardlayout-header{
        display: grid;
        width: 100%;
        height: fit-content;
                box-shadow: 
        rgb(190, 188, 188) 1px 1px 3px, 
        rgb(190, 188, 188) -1px -1px 3px;
        padding: 12px;
    }
    .dashboardlayout-menud{
        display: grid;
        width: fit-content;
        height: fit-content;
        background: white;
        border-radius: 10px;
        box-shadow: 
        rgb(190, 188, 188) 1px 1px 3px, 
        rgb(190, 188, 188) -1px -1px 3px;
        padding: 12px;

        @media (max-width: 920px) {
            display: none;
        }
    }
    .dashboardlayout-dashavt{
        position: relative;
        display: grid;
        padding: 25px 90px 0;

        @media (max-width: 920px) {
            display: none;
        }
    }

    .dashboardlayout-contain{
        display: grid;
        position: relative;
        gap: 25px;
        padding: 25px;
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: max-content 1fr;
        min-height: 100vh;
        // border: black 1px solid;
    }
    .dashboardlayout-container{
        display: grid;
        width: 100%;
        min-height: 100vh;
    }

    .dashboardlayout-footer{
        display: grid;
        width: 100%;
    }

    
   



`
