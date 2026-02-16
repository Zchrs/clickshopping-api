/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom"
import { getFile } from "../../reducers/globalReducer"
import styled from "styled-components"


export const MenuBottom = ({
    icon, 
    icon1,
    icon2, 
    icon3, 
    icon4, 
    text, 
    text1, 
    text2, 
    text3, 
    text4
}) => {
  
  return (
    <BottomMenu>
      <div className="menubottom">
          <div className="menubottom-container">
              <div className="menubottom-itemss"><NavLink to={"/"}><i><img src={getFile('svg', `${icon}`, 'svg')} alt="" /></i><p>{text}</p></NavLink></div>
              <div className="menubottom-itemss"><NavLink><i><img src={getFile('svg', `${icon1}`, 'svg')} alt="" /></i><p>{text1}</p></NavLink></div>
              <div className="menubottom-itemss"><NavLink><i><img src={getFile('svg', `${icon2}`, 'svg')} alt="" /></i><p>{text2}</p></NavLink></div>
              <div className="menubottom-itemss"><NavLink><i><img src={getFile('svg', `${icon3}`, 'svg')} alt="" /></i><p>{text3}</p></NavLink></div>
              <div className="menubottom-itemss"><NavLink><i><img src={getFile('svg', `${icon4}`, 'svg')} alt="" /></i><p>{text4}</p></NavLink></div>
            </div>
      </div>
    </BottomMenu>
  )
}

const BottomMenu = styled.div`
  .menubottom{
    display: none;
    border: none;
    @media (max-width: 920px) {
      z-index: 999;
      margin: auto;
      bottom: 0;
      position: fixed;
      display: grid;
      width: 100%;
      height: fit-content;
      animation: fadeIn ease .7s backwards .3s;
      background: white;
      border: none;
      box-shadow: gray -1px -1px 2px;
    }

    &-container{
      display: grid;
      width: 100%;
      height: 100%;
      grid-template-columns: repeat(5, 1fr);
      padding: 10px 0;  
      border: none;
    }
    &-itemss{
      display: grid;
      width: 100%;
      height: 100%;
    //   padding:10px;
      align-items: baseline;
      text-align: center;
      border: none;

      img{
        height: 25px;
        border: none;
        filter: brightness(500%);
          filter: var(--filter-primary)
        }
      p{
        color: black;
        text-align: center;
        border: none;
      }
    }
  }
`