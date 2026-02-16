import styled from 'styled-components';
import { getFile } from "../../reducers/globalReducer"
import { AvatarAdmin } from "../../../index"
import { useSelector } from 'react-redux';

export const HeaderAdmin = () => {

  const { fullname } = useSelector((state) => state.authAdmin.admin);
  

  return (
    <AdminHeader className="header">
        <div className="header-logo">
          <img src={getFile('svg', 'logo', 'svg')} alt="Logo" />
        </div>
        <div className="header-dashavt">
          <AvatarAdmin 
          dropData={true} 
          nameAdm={fullname} 
          img={"default-avatar"} 
          avtsmall={true} 
          clas={"avatar tumb"} />
        </div>
    </AdminHeader>
  )
}

const AdminHeader = styled.header`

    display: flex;
    justify-content: space-between;
    padding: 15px 25px;
    width: 100%;
    align-items: center;

    .header-logo{
        width: 100px;
        display: grid;
        img{
            width: 100%;
        }
    }
    .header-dashavt{
        display: grid;
        width: fit-content;
        height: fit-content;
    }

`