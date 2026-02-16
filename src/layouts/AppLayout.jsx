
import { Footer } from "../components/globals/Footer"
import { Header } from "../components/globals/Header"
import { AppRouter } from "../router/AppRouter"
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { startChecking } from "../actions/authActions";
import styled from "styled-components";


export const AppLayout = () => {
    
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(startChecking());
    }, [dispatch]);


  return (
    <LayoutApp>
        <section className="layout">
        <section className="layout__container">
            <header className="layout-header">
                <div className="layout-header__container">
                    <Header />
                </div>
            </header>
            <section className="layout-container">
                <div className="layout-container__contain">
                    <AppRouter />
                </div>
            </section>
            <footer className="layout-footer">
                <Footer />
            </footer>
        </section>
        <div id="modal-container">
        </div>
        <div id='swiper-container'>
        </div>
        </section>
    </LayoutApp>
  )
}

const LayoutApp = styled.section`
    .layout{
    display: grid;
    width: 100%;
    height: fit-content;
    overflow: hidden;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    
   
    &__container{
        width: 100%;
        max-width: 1920px;
        margin: 0 auto;
    }
    &-header{
        display: grid;
        width: 100%;
        height: fit-content;
        top: 0;
        
    }

    &-container{
        display: grid;
        height: fit-content;
        width: 100%;
        padding: 0 5%;
        margin-top: -50px;
        @media (max-width: 500px) {
            padding: 0 2%;
        }

        &__contain{
            width: 100%;
            display: grid;
            margin: 0 auto;
            max-width: 1366px;
        }
    }
    &-footer{
        display: grid;
        width: 100%;
        height: fit-content;
        color: white;
    }
}


`
