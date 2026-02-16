import { Link, NavLink } from "react-router-dom"
import { SelectWithSearch } from "../../../components/globals/SelectWithSearch"
import { SimpleSelect } from "../../../components/globals/SimpleSelect"
import { MultiUsesCard } from "../../../components/globals/MultiUsesCard"

export const MyPurchaseScreen = () => {
  return (
    <div className="dashsections">
      <header className="dashsections-header">
        <div className="grid">
          <nav className="dashsections-header-nav">
            <NavLink>Ver todo </NavLink>
            <NavLink>Por pagar <span>()</span></NavLink>
            <NavLink>Por enviar <span>()</span></NavLink>
            <NavLink>Enviado <span>()</span></NavLink>
            <NavLink>Procesado</NavLink>
          </nav>
          <div>
            <SelectWithSearch />
          </div>
        </div>
        <div className="grid">
        <div>
          <Link>Productos Eliminados</Link>
        </div>
          <SimpleSelect />
        </div>
      </header>
      <section className="dashsections-contain">
        <MultiUsesCard
          title={"Cerrado"}
          img={"arveja"}
          text={"Auricular Bluetooth V8 auricular inalámbrico de negocios V9 auriculares B"}
          priceText={"COP $0.00"}
          btnRight={true}
          detailsBtn={true}
          detailsBox={true}
          detailText={"Detalles del pedido >"}
          orderDetails={" Pedido efectuado el: 10 jul, 2019 Nº de pedido: 103785215555894 Copiar"}
          />
      </section>
    </div>
  )
}
