/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { formatPrice } from "../../../../globalActions";
import { BaseButton } from "../../../../index";
import { fetchOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";

export const OrdersComplete = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const completeOrders = allOrders.filter(o => o.status === "approved");

  useEffect(() => {
    dispatch(fetchOrders()).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="sections">
        <h2>Pedidos completados</h2>
        <p>Cargando...</p>
      </section>
    );
  }

  return (
    <section className="sections">
      <h2>Pedidos completados</h2>

      {!completeOrders.length ? (
        <p>No hay pedidos completados</p>
      ) : (
        <div className="orders-pending-list">
          {completeOrders.map((order) => (
            <div key={order.id} className="orders-card">



              <div className="orders-card-user">
                <p><strong>Pedido #</strong>{order.id}</p>
                <p><strong>Usuario ID:</strong> {order.user_id}</p>
                <p><strong>Nombre:</strong> {order.name} {order.lastname}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Estado:</strong> {order.status}</p>
                <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
              
                <div className="orders-card-actions">
                <BaseButton
                  textLabel
                  label="Aprobada"
                  icon="success"
                  img
                  classs={"button primary"}
                  colorbtn={"var(--success)"}
                  colortextbtnprimary={"var(--light)"}
                  colorbtnhoverprimary={"var(--success)"}
                  colortextbtnhoverprimary={"white"}
                />
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};