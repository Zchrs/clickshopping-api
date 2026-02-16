/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartUser, moveFromCartToWishlist, removeFromCart } from "../../actions/cartActions";
import { BaseButton, CardProductCart, Empty } from "../../../index";
import styled from "styled-components";
import { formatPrice } from "../../../globalActions";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";


export const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const { id } = useSelector((state) => state.auth.user);
  const lang = useSelector((state) => state.langUI.lang);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const userId = id;

  useEffect(() => {
    const getCartItems = async () => {
      try {
        if (userId && typeof userId === "string" && userId.trim() !== "") {
          const items = await fetchCartUser(userId);
          setCartItems(items);
          calculateTotals(items);
        } else {
          console.error("User ID is invalid or missing");
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    getCartItems();
  }, [userId]);

  const handleRemoveFromCart = async (productId, name) => {
    const result = await Swal.fire({
      title: 'Vas a eliminar un producto',
      html: `¡Estás seguro que deseas eliminar <strong>${name}</strong> del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Volver',
      background: '#f0f0f0',
      customClass: {
        popup: 'custom-popup',
        title: 'custom-title',
        content: 'custom-content',
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
      },
    });

    if (result.isConfirmed) {
      await dispatch(removeFromCart(productId));
      // Después de eliminar el producto del carrito, recargar los elementos del carrito
      const items = await fetchCartUser(userId);
      setCartItems(items);
      calculateTotals(items);
    }
  };

  const handleMoveToWishlist = async (productId, name) => {
    try {
      const result = await Swal.fire({
        title: 'Enviando a lista de deseos',
        html: `¿Estás seguro que deseas mover <strong>${name}</strong> a la lista de deseos?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Volver',
        background: '#f0f0f0',
        customClass: {
          popup: 'custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'custom-confirm-button',
          cancelButton: 'custom-cancel-button',
        },
      });

      if (result.isConfirmed) {
        await dispatch(moveFromCartToWishlist(productId));

        Swal.fire({
          title: '¡Hecho!',
          html: `¡<strong>${name}</strong>, se ha enviado a la lista de deseos!`,
          icon: 'success',
          showCancelButton: false,
          cancelButtonText: 'Volver',
          background: '#f0f0f0',
          customClass: {
            popup: 'custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'custom-confirm-button',
            cancelButton: 'custom-cancel-button',
          },
        });

        // Después de mover el producto al wishlist, recargar los elementos del carrito
        const items = await fetchCartUser(userId);
        setCartItems(items);
        calculateTotals(items);
      }
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al intentar mover el producto.',
        icon: 'error',
        background: '#f0f0f0',
        customClass: {
          popup: 'custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'custom-confirm-button',
        },
      });
      throw error.response?.data || error.message;
    }
  };

  const calculateTotals = (items) => {
    const subtotalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    // Puedes ajustar aquí si hay un costo de envío u otros costos adicionales
    setSubtotal(subtotalValue);
    setTotal(totalItemsCount);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MyCart>
      <div className="mycart">
        <div className="mycart-contain">
          <div className="mycart-contain-header">
            <h2>Mi carrito ({total})</h2>
          </div>
          <div className="mycart-contain-items">
            {loading ? (
              <p>Cargando productos...</p>
            ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
                <Empty img="empty" message={t("globals.emptyProducts")} />
              
            ) : (
              cartItems.map((item) => (
                <CardProductCart
                  key={item.id}
                  img={
                    item.img_urls && item.img_urls.length > 0
                      ? item.img_urls[0]
                      : ""
                  }
                  price={`COP $${item.price}`}
                  name={item.name}
                  quantity={item.quantity}
                  onRemove={() => handleRemoveFromCart(item.product_id, item.name)}
                  onWishlist={() => handleMoveToWishlist(item.product_id, item.name)}
                />
              ))
            )}
          </div>
        </div>
        <section className="mycart-summary">
          <h3>Resumen</h3>
          <div className="mycart-flex">
            <p>Subtotal:</p>
            <strong>${formatPrice(subtotal)}</strong>
          </div>
          <div className="mycart-flex">
            <p>Envío: </p>
            <strong>0</strong>
          </div>
          <div className="mycart-flex">
            <p>Total:</p> <strong>${formatPrice(subtotal)}</strong>
          </div>
          <BaseButton
            textLabel={true}
            label={`Pagar (${total})`}
            icon={"pay"}
            classs={'button primary'} 
            colorbtn={"var(--bg-primary)"}
            colortextbtnprimary={"var(--light)"}
            colorbtnhoverprimary={"var(--bg-primary-tr)"}
            colortextbtnhoverprimary={"white"}  
          />
          <div>
            <h5>Entrega Rápida</h5>
            <p className="texts txsm">
              Cupón de descuento de COP $50.000 por entrega tardía,
              nos tomamos muy en serio las entregas a tiempo,
            </p>
          </div>
          <div>
            <h5>Seguridad y privacidad</h5>
            <p className="texts txsm">
            Pagos seguros - Datos personales seguros
            </p>
          </div>
        </section>
      </div>
    </MyCart>
  );
};

const MyCart = styled.div`
  display: grid;

  .mycart {
    display: grid;
    grid-template-columns: 70% 1fr;
    width: 100%;
    align-items: start;
    height: fit-content;
    gap: 15px;

    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }

    &-summary {
      display: grid;
      align-items: start;
      height: fit-content;
      gap: 15px;
      background: white;
      box-shadow: 1px 1px 3px #ebe9e9, -1px -1px 3px #ebe9e9;
      border-radius: 0px 10px 10px 0px;
      padding: 15px;

    }

    &-contain {
      align-items: start;
      display: grid;
      height: fit-content;
      gap: 15px;

      &-header {
        display: grid;
        background: white;
        border-radius: 0px;
        box-shadow: 1px 1px 3px #ebe9e9, -1px -1px 3px #ebe9e9;
        width: 100%;
        height: fit-content;
        padding: 10px;
      }

      &-items {
        display: grid;
        gap: 15px;
      }
    }

    &-flex{
      display: flex;
      justify-content: space-between;
    }
  }
`;

