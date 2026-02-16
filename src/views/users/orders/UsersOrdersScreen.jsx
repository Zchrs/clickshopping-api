import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { OrdersComplete } from "./OrdersComplete";
import { OrdersPending } from "./OrdersPending";
import { OrdersCancelled } from "./OrdersCancelled";
import { OrdersPendingSend } from "./OrdersPendingSend";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

export const UsersOrdersScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const tabMap = {
    pendingPayment: "pendingPayment",
    pendingSend: "ordersPendingSend",
    send: "completedOrders",
    cancelled: "cancelledOrders",
  };

  const activeKey = tabMap[tabParam] || "pendingPayment";

  const handleSelect = (key) => {
    const reverseMap = {
      pendingPayment: "pendingPayment",
      ordersPendingSend: "pendingSend",
      completedOrders: "send",
      cancelledOrders: "cancelled",
    };

    setSearchParams({ tab: reverseMap[key] });
  };

  return (
    <Orders>
      <header className="productsscreen-header">
        <h1>Pedidos</h1>
      </header>

      <aside className="productsscreen-aside">
        <Tabs
          activeKey={activeKey}
          onSelect={handleSelect}
          id="fill-tab-example"
          fill
        >
          <Tab eventKey="pendingPayment" title="Pendientes de pago">
            <OrdersPending />
          </Tab>

          <Tab eventKey="ordersPendingSend" title="Pendientes de envío">
            <OrdersPendingSend />
          </Tab>

          <Tab eventKey="completedOrders" title="Enviados">
            <OrdersComplete />
          </Tab>

          <Tab eventKey="cancelledOrders" title="Cancelados">
            <OrdersCancelled />
          </Tab>
        </Tabs>
      </aside>

      <footer className="productsscreen-footer" />
    </Orders>
  );
};

const Orders = styled.section``;
