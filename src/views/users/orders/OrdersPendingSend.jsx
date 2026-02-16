/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { formatPrice } from "../../../../globalActions";
import { BaseButton } from "../../../../index";
import { fetchUserOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";

export const OrdersPendingSend = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const pendingOrders = allOrders.filter(o => o.status === "pending");

  useEffect(() => {
    dispatch(fetchUserOrders()).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="sections">
        <h2>Pedidos pendientes</h2>
        <p>Cargando...</p>
      </section>
    );
  }

  return (
    <section className="sections">
      <h2>Pendientes de envío</h2>

      {!pendingOrders.length ? (
        <p>No hay pedidos pendientes</p>
      ) : (
        <div className="orders-pending-list">
          {pendingOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <strong>Pedido #{order.id}</strong>
                <span className="badge pending">Pendiente</span>
              </div>

                  <div className="orders-card-user">
                    <p>
                      <strong>Nombre:</strong>{" "}
                      {order.name || order.user?.name}{" "}
                      {order.lastname || order.user?.lastname}
                    </p>
                    <p><strong>Email:</strong> {order.email || order.user?.email}</p>
                    <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                    <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Estado:</strong> {order.status}</p>
                  

              <div className="order-card-body">
                <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
