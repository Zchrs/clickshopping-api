/* eslint-disable no-unused-vars */
import { createPortal } from "react-dom";
import { DetailProductScreen } from "./DetailProductScreen";
import { UpdateProduct } from "../../../index";
import "../../assets/sass/modal.scss";




export const Modal = ({ title, image, img, btn, click, component1, component2 }) => {




    return createPortal(

      <div className="modal" id="modal">
        <span className="span" onClick={click}></span>
        <div className="modal-container">
          {component1 && <div className="modal-contain">
            <DetailProductScreen />
          </div>}
          {component2 && (<div className="modal-contain">
            <UpdateProduct />
          </div>)}
          {btn && (<button onClick={click}>Cerrar</button>)}
        </div>
      </div>,
    document.getElementById("modal-container")
  );
};