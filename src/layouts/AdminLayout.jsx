import styled from 'styled-components';
import { AdminRouter } from "../router/AppRouter"
import { getFile } from '../reducers/globalReducer';


export const AdminLayout = () => {
  return (
    <LayoutApp className="adminlayout">
        <header className="adminlayout-header">
        </header>
        <div className="adminlayout-contain">
        <div className="adminlayout-logo">
          <img src={getFile('svg', 'logo', 'svg')} alt="Logo" />
        </div>
            <AdminRouter />
        </div>
        <footer className="adminlayout-footer">

        </footer>
    </LayoutApp>
  )
}

const LayoutApp = styled.section `
    
    display: grid;
    background: var(--dark);
    min-height: 100vh;
    height: 100%;
    

    .adminlayout-header{
        width: fit-content;
        height: fit-content;
        display: grid;
    
    }
    .adminlayout-logo{
        display: grid;
        width: 100px;
        margin: auto;
        img{
            width: 100%;
            filter: invert(50%) brightness(500%);
        }
    }
    .adminlayout-contain{
        // border: white 1px solid;
        position: relative;
        display: flex;
        flex-direction: column;
        align-self: center;
        align-items: center;
        gap: 20px;
    }
    .adminlayout-footer{

    }

`
