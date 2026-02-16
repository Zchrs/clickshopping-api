
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartUser, moveFromCartToWishlist, removeFromCart } from "../../../actions/cartActions";
import { BaseButton,  CardProductCart, Empty, BaseCheckbox } from "../../../../index";
import styled from "styled-components";
import { formatPrice } from "../../../../globalActions";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const UserCartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [lastCheckedIndex, setLastCheckedIndex] = useState(null);
  const [paying, setPaying] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userId = id;

  /* -------------------- LOAD -------------------- */

  useEffect(() => {
    const getCartItems = async () => {
      try {
        if (userId && typeof userId === "string" && userId.trim() !== "") {
          const items = await fetchCartUser(userId);
          setCartItems(items);
          setSelectedIds([]);
          calculateTotals(items, []);
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    getCartItems();
  }, [userId]);

  /* -------------------- SELECT LOGIC -------------------- */

  const allSelected =
    cartItems.length > 0 && selectedIds.length === cartItems.length;

  const toggleSelectAll = () => {
    const next = allSelected ? [] : cartItems.map((i) => i.product_id);
    setSelectedIds(next);
  };

  const toggleOne = (productId, index, checked, shiftKey) => {
    if (shiftKey && lastCheckedIndex !== null) {
      const start = Math.min(lastCheckedIndex, index);
      const end = Math.max(lastCheckedIndex, index);
      const rangeIds = cartItems
        .slice(start, end + 1)
        .map((i) => i.product_id);

      setSelectedIds((prev) =>
        checked
          ? Array.from(new Set([...prev, ...rangeIds]))
          : prev.filter((id) => !rangeIds.includes(id))
      );
    } else {
      setSelectedIds((prev) =>
        checked
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );
    }

    setLastCheckedIndex(index);
  };

  /* -------------------- HELPERS -------------------- */

  const reloadCart = async () => {
    const items = await fetchCartUser(userId);
    setCartItems(items);
    setSelectedIds([]);
    calculateTotals(items, []);
  };

  /* -------------------- SINGLE ACTIONS -------------------- */

  const handleRemoveFromCart = async (productId, name) => {
    const result = await Swal.fire({
      title: "Vas a eliminar un producto",
      html: `¿Estás seguro que deseas eliminar <strong>${name}</strong> del carrito?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Volver",
      background: "#f0f0f0",
      customClass: {
        popup: "swal-custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Eliminando...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await dispatch(removeFromCart(productId));

      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text:
          response?.payload?.message ||
          response?.message ||
          "Producto eliminado correctamente",
        confirmButtonText: "Aceptar",
              customClass: {
        popup: "swal-custom-popup",
        title: "swal-custom-title",
        content: "swalcustom-content",
        confirmButton: "swal-confirm-btn",
      },
      });

      reloadCart();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.error ||
          error?.message ||
          "No se pudo eliminar el producto",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleMoveToWishlist = async (productId, name) => {
    try {
      const result = await Swal.fire({
        title: "Enviando a lista de deseos",
        html: `¿Estás seguro que deseas mover <strong>${name}</strong> a la lista de deseos?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Volver",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
          cancelButton: "swal-cancel-btn",
        },
      });

      if (result.isConfirmed) {
        await dispatch(moveFromCartToWishlist(productId));

        Swal.fire({
          title: "¡Hecho!",
          html: `¡<strong>${name}</strong>, se ha enviado a la lista de deseos!`,
          icon: "success",
          showCancelButton: false,
          background: "#f0f0f0",
          customClass: {
            popup: "swal-custom-popup",
            title: "custom-title",
            content: "custom-content",
            confirmButton: "swal-confirm-btn",
          },
        });

        reloadCart();
      }
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al intentar mover el producto.",
        icon: "error",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn",
        },
      });
      throw error.response?.data || error.message;
    }
  };

  /* -------------------- BULK ACTIONS -------------------- */

  const handleRemoveSelected = async () => {
    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: "Eliminar productos",
      html: `¿Seguro que deseas eliminar <strong>${selectedIds.length}</strong> productos del carrito?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Volver",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Eliminando...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await Promise.all(selectedIds.map((id) => dispatch(removeFromCart(id))));
      Swal.fire("Listo", "Productos eliminados correctamente", "success");
      reloadCart();
    } catch {
      Swal.fire("Error", "No se pudieron eliminar algunos productos", "error");
    }
  };

  const handleMoveSelectedToWishlist = async () => {
    if (!selectedIds.length) return;

    const result = await Swal.fire({
      title: "Mover a wishlist",
      html: `¿Seguro que deseas mover <strong>${selectedIds.length}</strong> productos a la lista de deseos?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Volver",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Moviendo...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await Promise.all(
        selectedIds.map((id) => dispatch(moveFromCartToWishlist(id)))
      );
      Swal.fire("Listo", "Productos movidos a wishlist", "success");
      reloadCart();
    } catch {
      Swal.fire("Error", "No se pudieron mover algunos productos", "error");
    }
  };

  /* -------------------- CHECKOUT -------------------- */
  const handleCheckoutClick = () => {
    if (user) {
        if (!selectedIds.length) return;

  const selectedProducts = cartItems.filter(item =>
    selectedIds.includes(item.product_id)
  );

        navigate("/dashboard/my-cart/checkout", {
    state: {
      products: selectedProducts,
    },
  });
    } else {
      Swal.fire({
        title: "Regístrate",
        text: "Debes ser cliente registrado para comprar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Quiero registrarme",
        cancelButtonText: "Volver",
        background: "#f0f0f0",
        customClass: {
          popup: "swal-custom-popup",
          title: "custom-title",
          content: "custom-content",
          confirmButton: "swal-confirm-btn-register",
          cancelButton: "swal-cancel-btn-register",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/auth/register");
        } else {
          return;
        }
      });
    }
  };

  /* -------------------- TOTALS -------------------- */

  const calculateTotals = (items, selected = selectedIds) => {
    const active =
      selected.length > 0
        ? items.filter((i) => selected.includes(i.product_id))
        : [];

    const subtotalValue = active.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalItemsCount = active.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setSubtotal(subtotalValue);
    setTotal(totalItemsCount);
  };

  useEffect(() => {
    calculateTotals(cartItems, selectedIds);
  }, [selectedIds]);


  if (loading) return <div>Loading...</div>;

  return (
    <MyCart>
      <div className="mycart">
        <div className="mycart-contain">
          <div className="mycart-contain-header">
            <h2>
              Mi carrito ({cartItems.length})
            </h2>
            <span className="mycart-contain-header-h2"></span>
            Seleccionados {total}
              {cartItems.length > 0 && (
                <span className="mycart-contain-header-h2">
                  <BaseCheckbox
                    id="select-all"
                    modelValue={allSelected}
                    valueChange={toggleSelectAll}
                  /> 
                  Seleccionar todos
                </span>
              )}
          </div>



          <div className="mycart-contain-items">
            {!Array.isArray(cartItems) || cartItems.length === 0 ? (
              <Empty img="empty-cart" message={t("globals.emptyProducts")} />
            ) : (
              cartItems.map((item, index) => (
                <div key={item.id} className="mycart-row">
                  <BaseCheckbox
                    id={`cart-check-${item.product_id}`}
                    label=""
                    modelValue={selectedIds.includes(item.product_id)}
                    valueChange={(e) =>
                      toggleOne(
                        item.product_id,
                        index,
                        e.target.checked,
                        e.nativeEvent.shiftKey
                      )
                    }
                  />

                  <CardProductCart
                    img={
                      item.img_urls && item.img_urls.length > 0
                        ? item.img_urls[0]
                        : ""
                    }
                    price={`COP $${item.price}`}
                    name={item.name}
                    quantity={item.quantity}
                    onRemove={() =>
                      handleRemoveFromCart(item.product_id, item.name)
                    }
                    onWishlist={() =>
                      handleMoveToWishlist(item.product_id, item.name)
                    }
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🔥 SUMMARY SOLO SI HAY SELECCIONADOS */}

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
              textLabel
              label={`Pagar (${total})`}
              icon={"pay"}
              classs={"button primary"}
              colorbtn={"var(--bg-primary)"}
              colortextbtnprimary={"var(--light)"}
              colorbtnhoverprimary={"var(--bg-primary-tr)"}
              colortextbtnhoverprimary={"white"}
              disabled={paying || !selectedIds.length}
              handleClick={handleCheckoutClick}
            />

            <div>
              <h5>Entrega Rápida</h5>
              <p className="texts txsm">
                Cupón de descuento de COP $50.000 por entrega tardía, nos tomamos
                muy en serio las entregas a tiempo,
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

    &-row{
      display: flex;
      width: 100%;
      align-self: baseline;
      background: white;
      box-shadow: 1px 1px 3px #ebe9e9, -1px -1px 3px #e9ebeb;
      border-radius: 0px 10px 10px 0px;
      padding: 10px;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        border-radius: 0px;
        box-shadow: 1px 1px 3px #e9ebeb , -1px -1px 3px #e9ebeb;
        width: 100%;
        height: fit-content;
        padding: 10px;
        &-h2{
          gap: 5px;
          display: flex;
          font-weight: 600;
        }
      }

      &-items {
        display: grid;
        align-content: start;
        height: fit-content;
        min-height: 100vh;
        gap: 15px;
      }
    }

    &-flex{
      display: flex;
      justify-content: space-between;
    }
  }


`;

