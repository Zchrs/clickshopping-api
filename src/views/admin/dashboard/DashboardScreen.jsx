import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from 'styled-components';
import { startCheckingAdmin } from "../../../actions/authActions";
import { MyChart } from "../../../../index";


export const DashboardScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(startCheckingAdmin());
  }, [dispatch]);
  return (
    <ScreenDashboard className="dashboard">
      <div className="dashboard-container-cards"></div>
      <div className="dashboard-container-box">
        <div className="dashboard-container-charts">
          <h2>Ventas semanales</h2>
          <MyChart />
        </div>
        <div className="dashboard-container-charts"></div>
      </div>

      <div className="dashboard-container-contain"></div>
    </ScreenDashboard>
  );
};

const ScreenDashboard = styled.section`
   display: grid;
    width: 100%;
    gap: 25px;

    .dashboard-container{
        display: grid;
        width: 100%;
        border-radius: 10px;
        height: fit-content;
        gap: 25px;
    }
        .dashboard-container-cards{
            display: flex;
            gap: 15px;
            box-shadow: 
            rgb(190, 188, 188) 1px 1px 3px, 
            rgb(190, 188, 188) -1px -1px 3px;
            background: white;
            border-radius: 10px;
            width: 100%;
            height: fit-content;
            padding: 25px;
        }
        .dashboard-container-charts{
            border-radius: 10px;
            box-shadow: 
            rgb(190, 188, 188) 1px 1px 3px, 
            rgb(190, 188, 188) -1px -1px 3px;
            display: grid;
            padding: 25px;
            background: white;
        }
        
        .dashboard-container-box{
            gap: 15px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            border-radius: 10px;
            width: 100%;
            height: fit-content;
        }
        
        .dashboard-container-contain{
            display: grid;
            border-radius: 10px;
            background: white;
            position: relative;
            gap: 25px;
            padding: 25px;
            display: grid;
            width: 100%;
            height: 100%;
            min-height: 100vh;
                        box-shadow: 
            rgb(190, 188, 188) 1px 1px 3px, 
            rgb(190, 188, 188) -1px -1px 3px;
        }
`