/* eslint-disable no-unused-vars */
import { getFile } from "../../../../globalActions";
import { BreadCrumb } from "../../../components/globals/BreadCrumb";
import { BaseButton } from "../../../components/globals/BaseButton";


export const ClothingScreen = () => {
  

  return (
    <section className="containers sections">
      <div className="productscreen-header">
        <h2 className="productscreen-showroute">
          <BreadCrumb />
        </h2>
        <h2 className="h2-light">Servicios</h2>
      </div>
      <div className="productscreen-contains">
        <div className="productscreen-contains-services">
          <img src={getFile("svg", "devapps", "svg")} alt="" />
          <div className="productscreen-contains-services-info">
            <h2>Desarrollo Web y móvil</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis,
              quibusdam assumenda consequuntur perferendis reiciendis sint porro
              voluptatem neque sapiente? Reiciendis natus quod laudantium amet
              id sunt sint omnis repellendus voluptates.
            </p>
            <BaseButton
              // handleClick={handleLogin}
              label={"Contratar"}
              classs={"button primary"}
              colorbtn={"var(--primary)"}
              colortextbtnprimary={"var(--light)"}
              colorbtnhoverprimary={"var(--bg-primary-tr)"}
              colortextbtnhoverprimary={"white"}
              textLabel={true}
            />
          </div>
        </div>
        <div className="productscreen-contains-services">
          <img src={getFile("svg", "graphic-design", "svg")} alt="" />
          <div className="productscreen-contains-services-info">
            <h2>Diseño Gráfico</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis,
              quibusdam assumenda consequuntur perferendis reiciendis sint porro
              voluptatem neque sapiente? Reiciendis natus quod laudantium amet
              id sunt sint omnis repellendus voluptates.
            </p>
            <BaseButton
              // handleClick={handleLogin}
              label={"Contratar"}
              classs={"button primary"}
              colorbtn={"var(--secondary)"}
              colortextbtnprimary={"var(--light)"}
              colorbtnhoverprimary={"var(--secondary-semi)"}
              colortextbtnhoverprimary={"white"}
              textLabel={true}
            />
          </div>
        </div>
                <div className="productscreen-contains-services">
          <img src={getFile("svg", "technical", "svg")} alt="" />
          <div className="productscreen-contains-services-info">
            <h2>Reparación y mantenimiento de pc</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis,
              quibusdam assumenda consequuntur perferendis reiciendis sint porro
              voluptatem neque sapiente? Reiciendis natus quod laudantium amet
              id sunt sint omnis repellendus voluptates.
            </p>
            <BaseButton
              // handleClick={handleLogin}
              label={"Contratar"}
              classs={"button primary"}
              colorbtn={"var(--primary)"}
              colortextbtnprimary={"var(--light)"}
              colorbtnhoverprimary={"var(--bg-primary-tr)"}
              colortextbtnhoverprimary={"white"}
              textLabel={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
