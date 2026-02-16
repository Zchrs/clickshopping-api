import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { OrdersComplete } from "./OrdersComplete";
import { OrdersPending } from "./OrdersPending";
import { OrdersCancelled } from "./OrdersCancelled";
import styled from "styled-components";

export const PurchasesScreen = () => {
  return (
    <Orders>
      <header className="productsscreen-header">
        <h1>Pedidos</h1>
      </header>
      <aside className="productsscreen-aside">
        <Tabs
          defaultActiveKey="pendingsOrders"
          id="fill-tab-example"
          className="productsscreen-tabs"
          fill>
                      <Tab eventKey="pendingsOrders" title="Pendientes">
            <OrdersPending />
          </Tab>
          <Tab eventKey="completedOrders" title="Completados">
            <OrdersComplete />
          </Tab>
          <Tab eventKey="cancelledOrders" title="Cancelados">
            <OrdersCancelled />
          </Tab>
        </Tabs>
      </aside>
      <footer className="productsscreen-footer"></footer>
    </Orders>
  );
};

const Orders = styled.section`
  .productsscreen {
    display: grid;
    width: 100%;
    height: fit-content;
    align-items: baseline;
    gap: 25px;
  }

  
`;
