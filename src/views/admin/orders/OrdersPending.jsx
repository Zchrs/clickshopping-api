/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { formatPrice } from "../../../../globalActions";
import { BaseButton } from "../../../../index";
import { fetchOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";

export const OrdersPending = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const pendingOrders = allOrders.filter(o => o.status === "pending");

  const handleApprove = async (orderId) => {
    const result = await Swal.fire({
      title: "¿Aprobar pedido?",
      text: "Esta acción descontará stock y finalizará la orden",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'swal-custom-popup',
        title: 'custom-title',
        content: 'custom-content',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Procesando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.put(`${import.meta.env.VITE_APP_API_APPROVE_ORDER_URL}/${orderId}`);

      Swal.fire("Aprobado", "El pedido fue aprobado correctamente", "success");
      dispatch(fetchOrders());
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.error || "No se pudo aprobar el pedido",
        "error",
        
      );
    }
  };

  useEffect(() => {
    dispatch(fetchOrders()).finally(() => setLoading(false));
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
      <h2>Pedidos pendientes</h2>

      {!pendingOrders.length ? (
        <p>No hay pedidos pendientes</p>
      ) : (
        <div className="orders-pending-list">
          {pendingOrders.map((order) => (
            <div key={order.id} className="orders-card">
                <strong>Pedido #{order.id}</strong>
                <p><strong>Usuario ID:</strong> {order.user_id}</p>
                <p><strong>Nombre:</strong> {order.name} {order.lastname}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
              
 <p><strong>Pendiente: </strong>{order.status}</p>
              <div className="orders-card-actions">
                <BaseButton
                  textLabel
                  label="Aprobar"
                  icon="check"
                  classs={"button primary"}
                  colorbtn={"var(--bg-primary)"}
                  colortextbtnprimary={"var(--light)"}
                  colorbtnhoverprimary={"var(--bg-primary-tr)"}
                  colortextbtnhoverprimary={"white"}
                  handleClick={() => handleApprove(order.id)}
                />
                <BaseButton
                  textLabel
                  label="Rechazar"
                  icon="check"
                  classs={"button primary"}
                  colorbtn={"var(--secondary)"}
                  colortextbtnprimary={"var(--light)"}
                  colorbtnhoverprimary={"var(--secondary-semi)"}
                  colortextbtnhoverprimary={"white"}
                  // handleClick={() => handleApprove(order.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
