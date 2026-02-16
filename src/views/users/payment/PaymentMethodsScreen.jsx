import styled from "styled-components";
import { BaseButton } from "../../../components/globals/BaseButton";
import { MultiUsesCard } from "../../../components/globals/MultiUsesCard";
import { BankCards } from "../../../components/globals/BankCards";
import { Link } from "react-router-dom";
// import { getFile } from "../../../../globalActions";

export const PaymentMethodsScreen = () => {
  return (
    <PaymentMethods>
      <section className="dashsections">
        <header className="dashsections-header">
            <h2>Pago</h2>
          <BaseButton classBtn={"button btnText"} classs={"button no-border"} textLabel={true} label={"Configuración >"} />
        </header>
        
        <section className="dashsections-contain">
          <MultiUsesCard bonusInfo={"El Bonus es una cantidad de CRT en cartera."} title={"Bonificación"} detailsBonus={true} textBonus={"Total"} amount={"$0,00"} />
      </section>
      <div className="dashsections-paymentcards">
        <h2>Tarjetas</h2>
        <BaseButton classs={"button no-border"} textLabel={true} label={"Transacciones de tarjetas >"} />
      </div>
      <div className="dashsections-bankcards">
        <div className="dashsections-bankcards-cards">
          <BankCards cardNumber={"****1450"} cardStatus={"Caducada desde el 10/19"} cardIcon={"trash"} cardImg={"mastercard"} />
        </div>
        <Link className="dashsections-bankcards-cards-btn">
        <div className="flexsmall">
          <svg viewBox="0 0 1024 1024" width="2em" height="2em" fill="currentColor" aria-hidden="false" focusable="false">
            <path d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667S747.637333 938.666667 512 938.666667 85.333333 747.637333 85.333333 512 276.362667 85.333333 512 85.333333z m0 64c-200.298667 0-362.666667 162.368-362.666667 362.666667s162.368 362.666667 362.666667 362.666667 362.666667-162.368 362.666667-362.666667-162.368-362.666667-362.666667-362.666667z"></path>
            <path d="M512 298.666667a32 32 0 0 1 32 32v149.333333h149.333333a32 32 0 0 1 0 64H544v149.333333a32 32 0 0 1-64 0V544H330.666667a32 32 0 0 1 0-64h149.333333V330.666667a32 32 0 0 1 32-32z">
            </path>
          </svg>
          <h2>Agregar tarjeta</h2>
        </div>
        </Link>
      </div>
      </section>
    </PaymentMethods>
  );
};

const PaymentMethods = styled.div`
  display: grid;
  h2 {
    font-size: 1rem;
  }
  .payments {
  }

`;
