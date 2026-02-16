/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';
import { getFile } from '../../reducers/globalReducer'
import { Avatar } from './Avatar';
import styled from 'styled-components';

export const HeaderProducts = ({headClass}) => {

    

  return (
    <ProdHead>
      <div className={headClass}>
          <div className='headproducts-logo'>
              <Link to={"/"}><img src={getFile('svg', 'logo', 'svg')} alt="" /></Link>
          </div>
          <div className="headproducts-group">
            <div className='headproducts-useravatar'>
                    <Avatar img={"default-avatar"} avtsmall={true} dropData={true} classWhite={"avatar white"} clas={"avatar tumb"} />
            </div>
          </div>
      </div>
    </ProdHead>
  )
}

const ProdHead = styled.div`
.headproducts{
   
    height: fit-content;
    width: 100%;
    @media (max-width: 920px) {
        padding: 10px 20px;
    }
    @media (max-width: 450px) {
        padding: 10px;
    }
    &.blackhead{
        display: flex;
        justify-content: space-between;
        background: black;
        align-items: center;
        padding: 25px;
    }
    &.whitehead{
        background: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px;

    }
    &-logo{
        display: grid;
        width: 150px;
        // border: white 1px solid;
        a{
            align-items: center;
            display: grid;
            width: 100%;
            height: 100%;

      img {
        height: 40px;
        filter: invert(50%) brightness(500%);
        @media (max-width: 600px) {
          height: 35px;
        }

        @media (max-width: 399px) {
          height: 20px;
        }
      }
        }
    }
    &-info{
        img{
            width: 70%;
        }
    }

    &-group{
        display: flex;
        align-items: center;
        // border: black 1px solid;
        gap: 20px;
        @media (max-width: 920px) {
            flex-direction: row-reverse;
            flex-direction: none;
        }
    }

    &-useravatar{
        position: relative;
        display: flex;
        width: fit-content;
        height: 50px;
    }

}
`