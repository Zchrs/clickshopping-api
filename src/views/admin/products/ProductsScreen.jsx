import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import '../../assets/sass/products.scss'
import { 
  CancelledProducts, 
  CreateProduct, 
  OutProducts, 
  PendingProducts, 
  ProductsAdded, 
  SellingProducts 
} from '../../../../index';

import styled from 'styled-components';

export const ProductsScreen = () => {
  return (
    <ScreenProducts className="productsscreen">
      <header className="productsscreen-header">
      <h1>Productos</h1>

      </header>
      <aside className="productsscreen-aside">
      <Tabs
      defaultActiveKey="addProduct"
      id="fill-tab-example"
      className="productsscreen-tabs"
      fill
    >
      <Tab eventKey="addProduct" title="Crear">
       <CreateProduct />
      </Tab>
      <Tab eventKey="addedProducts" title="Agregados">
       <ProductsAdded />
      </Tab>

      <Tab eventKey="sellingsProduct" title="Vendidos">
        <SellingProducts />
      </Tab>
      <Tab eventKey="pendingProduct" title="Pendientes">
        <PendingProducts />
      </Tab>
      <Tab eventKey="cancelledProduct" title="Cancelados">
        <CancelledProducts />
      </Tab>
      <Tab eventKey="productsOut" title="Agotados">
        <OutProducts />
      </Tab>
    </Tabs>
      </aside>
      <footer className="productsscreen-footer">

      </footer>
    </ScreenProducts>
  )
}

const ScreenProducts = styled.section`
.productsscreen{
    display: grid;
    width: 100%;
    height: fit-content;
    align-items: baseline;
    gap: 25px;
}

`