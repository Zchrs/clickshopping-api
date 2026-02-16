/* eslint-disable react/prop-types */
import styled from "styled-components"
import { BaseButton } from "./BaseButton"
import { getFile } from "../../../globalActions"


export const MultiUsesCard = ({ 
    title, 
    img, 
    text, 
    priceText, 
    orderDetails, 
    detailsBtn, 
    btnRight, 
    detailsBox, 
    detailsBonus,
    bonusInfo,
    textBonus, 
    amount }) => {
  return (
    <MultiCard>
        <div className="multicard">
        <div className="multicard-header">
            <h2>{title}</h2>
                    <div>
                        <div className="multicard-header-info">
                            <div className="multicard-header-text">
                                <p>{orderDetails}</p>
                            </div>
                            <div className="multicard-header-btn">
                                {detailsBtn && (
                                    <BaseButton classs={"button no-border"} textLabel={true} label={"Detalles del pedido >"} />
                                )}
                            </div>
                        </div>
                    </div>
        </div>
        <hr />
        {detailsBox && (
        <div className="multicard-content">
            <div className="flex">
                <img src={getFile("jpg", `${img}`, "jpg")} alt="" />
            <div>
                <p>{text}</p>
                <p>{priceText}</p>
            </div>
            </div>
            <div>
            {btnRight && (
                <BaseButton classs={"button full-red"} textLabel={true} label={"Borrar"} />
            )}
            </div>
        </div>
        )}
        {detailsBonus && (
        <div className="multicard-content-grid">
            <div className="grid-center">
            <div>
                <p>{textBonus}</p>
                <h2 className="amount">{amount}</h2>
            </div>
            <div className="multicard-boxmessage">
                <p>{bonusInfo}</p>
                <BaseButton classs={"button mini-black"} textLabel={true} label={"Saber más"} />
            </div>
            </div>
            <div>
            {btnRight && (
                <BaseButton classs={"button full-red"} textLabel={true} label={"Borrar"} />
            )}
            </div>
        </div>
        )}
        </div>
    </MultiCard>
  )
}

const MultiCard = styled.div`
    display: grid;
    width: 100%;
    height: fit-content;
    .multicard{
        display: grid;
        width: 100%;
        height: fit-content;
        background: white;
        border-radius: 10px;
        padding: 24px;

        &-header{
            height: fit-content;
            align-items: center;
            display: flex;
            justify-content: space-between;
            width: 100%;

            h2{
                font-weight: 400;
                font-size: 20px;
            }
            &-info{
                display: flex;
                justify-content: end;
                width: fit-content;
                gap: 7px;
                p{
                    font-size: 14px;  
                    width: 100%;
                }
            }
            &-text{
                width: fit-content;
                width: 50%;
                text-align: right;
            }
            &-btn{
                border-left: 1px solid #0f0f0f35;
            }
        }
        &-content{
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: fit-content;
            img{
                max-width: 150px;
            }
            &-grid{
                height: fit-content;
                display: grid;
                position: relative;
            }
        }
        &-boxmessage{
            position: relative;
            background: #ec333642;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 10px;
            padding-right: 20px;
            padding-left: 20px;
            width: 100%;
            height: 70px;
            clip-path: polygon(0% 15%, 49% 15%, 50% 0, 51% 15%, 100% 15%, 100% 100%, 0 100%);
            border-radius: 0px 0px 5px 5px;
            left: 0;
            top: 0;
        }
    }
    .amount{
        font-size: 2.5rem;
        font-weight: 700;
        color: #808080c9;
    }
`