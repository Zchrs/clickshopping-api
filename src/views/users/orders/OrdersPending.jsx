/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { formatPrice } from "../../../../globalActions";
import { BaseButton } from "../../../../index";
import { fetchUserOrders } from "../../../actions/orderActions";
import { useDispatch, useSelector } from "react-redux";
import { DropZoneCloudinary } from "../../../components/globals/DropZoneCloudinary";

export const OrdersPending = () => {
  const allOrders = useSelector((state) => state.order.orderInfo || []);
  const [imagesByOrder, setImagesByOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const pendingOrders = allOrders.filter((o) => o.status === "pending");

  useEffect(() => {
    dispatch(fetchUserOrders()).finally(() => setLoading(false));
  }, []);

  const handleImageUploaded = (orderId, imageData) => {
    setImagesByOrder((prev) => ({
      ...prev,
      [orderId]: imageData,
    }));
  };

  const handleSendProof = async (orderId) => {
    const image = imagesByOrder[orderId];
    if (!image) return;

    try {
      await axios.post(import.meta.env.VITE_APP_API_SEND_PAYMENT_PROOF_URL, {
        orderId,
        proof_url: image.url,
        proof_public_id: image.public_id,
      });

      Swal.fire({
        icon: "success",
        title: "Comprobante enviado",
        text: "Tu pago será validado pronto",
      });

      dispatch(fetchUserOrders());
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el comprobante",
      });
    }
  };

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
      <h2>Pendientes de pago</h2>

      {!pendingOrders.length ? (
        <p>No hay pedidos pendientes</p>
      ) : (
        <div className="orders">
          <div className="orders-pending-list">
            {pendingOrders.map((order) => {
              const image = imagesByOrder[order.id];

              return (
                <div key={order.id} className="orders-card">
                  {/* INFO ORDEN */}
                  <div className="orders-card-user">
                    <p><strong>Pedido #</strong> {order.id}</p>
                    <p>
                      <strong>Nombre:</strong>{" "}
                      {order.name || order.user?.name}{" "}
                      {order.lastname || order.user?.lastname}
                    </p>
                    <p><strong>Email:</strong> {order.email || order.user?.email}</p>
                    <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                    <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Estado:</strong> {order.status}</p>
                  

                  {/* 🛒 PRODUCTOS */}
                  <div className="orders-card-products">
                    <h4>Productos</h4>

                    <div className="orders-products-grid">
                      {order.items?.map((item) => (
                        <div key={item.id || item.product_id} className="orders-products-item">
                          <img
                            src={item.images?.[0]}
                            alt={item.name}
                          />
                          <div className="product-info">
                            <p className="product-name">{item.name}</p>
                            <p>Cantidad: {item.quantity}</p>
                            <p>{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 📤 SUBIR COMPROBANTE */}
                  <div className="orders-card-capturepayment">
                    <DropZoneCloudinary
                      id={`proof_${order.id}`}
                      name={`proof_${order.id}`}
                      setImage={(img) => handleImageUploaded(order.id, img)}
                      paymentProof
                    />
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};