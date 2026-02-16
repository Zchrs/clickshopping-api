/* eslint-disable react/prop-types */
import styled from "styled-components"
import { getFile } from "../../../globalActions"
import { Link } from "react-router-dom"


export const BankCards = ({cardNumber, cardStatus, cardIcon, cardImg}) => {
  return (
    <CardBank className="cardbank">
         <div className="flex">
            <h2>{cardNumber}</h2>
            <img className="cardbank-card-img" src={getFile("svg", `${cardImg}`, "svg")} alt="" />
          </div>
          <div className="flex">
            <p>{cardStatus}</p>
            <Link className="cardbank-delete"><img className="cardbank-card-icon" src={getFile("svg", `${cardIcon}`, "svg")} alt="" /></Link>
          </div>
    </CardBank>
  )
}

const CardBank = styled.div`
    display: grid;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    gap: 20px;
    background: white;

.cardbank{
    
    &-delete{
        cursor: pointer;
    }

    &-card{
      display: grid;
      align-items: center;
      
      &-img{
          width: 30px;
        }
        &-icon{
          height: 15px;
        }
        &-svg{
          width: 70px;
        }
    }
    h2{
      font-size: 1rem;
    }
    p{
      font-size: 0.8rem;
    }
}
  `
