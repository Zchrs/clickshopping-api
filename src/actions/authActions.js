/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import Swal from "sweetalert2";
import {
  fetchWithToken,
  fetchWithTokenAdmin,
  fetchWithoutToken,
  fetchWithoutTokenAdmin,
} from "../helpers/fetch";
import { types } from "../types/types";

export const startLogin = (email, password) => {
  return async (dispatch) => {
    const res = await fetchWithoutToken(
      "users/auth/login",
      { email, password },
      "POST",
    );


    const body = await res.json();
    if (body.ok) {
      localStorage.setItem("id", body.user.id);
      localStorage.setItem("role", body.user.role);
      localStorage.setItem("tokenUser", body.user.token);
      localStorage.setItem("tokenUser-init-date", new Date().getTime());
      dispatch(
        loginSuccess({
          id: body.user.id,
          name: body.user.name,
          lastname: body.user.lastname,
          city: body.user.city,
          address: body.user.address,
          zipCode: body.user.zip_code,
        }),
      );

      let timerInterval;
      Swal.fire({
        title: "¡Correcto!",
        html: "¡Inicio de sesión exitoso! Esta ventana se cerrará en: <b></b> segundos, o clic en Ok para cerrar.",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "Ok",
        cancelButtonText: "Volver",
        background: "#f0f0f0",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
        didOpen: () => {
          const b = Swal.getHtmlContainer().querySelector("b");
          let timeLeft = 3;
          timerInterval = setInterval(() => {
            b.textContent = timeLeft;
            timeLeft--;
            if (timeLeft < 0) {
              clearInterval(timerInterval);
              Swal.close(); // Cierra el SweetAlert automáticamente cuando el contador llega a 0
            }
          }, 1000);
        },
        // willClose: () => {
        //   clearInterval(timerInterval);
        //   window.location.href = `${import.meta.env.VITE_APP_API_DASHBOARD_USER}`;
        // }
      });
    } else {
      Swal.fire({
        title: "¡Error!",
        text: "Email y/o contraseña incorrecta",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "Volver",
        background: "#f0f0f0",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          content: "custom-content",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          return;
        }
      });
      body.msg;
      dispatch(checkingFinish());
    }
  };
};

export const loginSuccess = (user) => ({
  type: types.authLogin,
  payload: { user },
});

export const startLogout = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(logout());
  };
};

const logout = () => ({ type: types.authLogout });

const checkingFinish = () => ({ type: types.authCheckingFinish });

export const startChecking = () => {
  return async (dispatch) => {
    const res = await fetchWithToken("users/auth/renew");
    const body = await res.json();

    if (body.ok) {
      localStorage.setItem("id", body.id);
      localStorage.setItem("role", body.role);
      localStorage.setItem("tokenUser", body.token);
      localStorage.setItem("tokenUser-init-date", new Date().getTime());

      dispatch(
        loginSuccess({
          id: body.id,
          name: body.name,
          lastname: body.lastname,
          address: body.address,
          city: body.city,
          zipCode: body.zip_code,
          role: body.role,
        }),
      );
    } else {
      console.log(body.msg);
      dispatch(checkingFinish());
    }
    // debugger
  };
};

// acciones para login admins
export const startLoginAdmin = (email, pass) => {
  return async (dispatch) => {
    const res = await fetchWithoutTokenAdmin(
      "admin/auth/login",
      { email, pass },
      "POST",
    );
    Swal.fire({
      title: "Iniciando sesión...",
      text: "Validando credenciales",
      allowOutsideClick: false,
      background: "#f9fafb",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm-btn",
      },
      didOpen: () => Swal.showLoading(),
    });
    const body = await res.json();
    if (body.ok) {
      console.log(body);
      localStorage.setItem("role", body.admin.role);
      localStorage.setItem("tokenAdmin", body.admin.token);
      localStorage.setItem("tokenAdmin-init-date", new Date().getTime());
      dispatch(
        loginAdminSuccess({
          fullname: body.admin.fullname,
        }),
      );
      let timerInterval;
      Swal.fire({
        title: "¡Correcto!",
        html: "¡Inicio de sesión exitoso! ok para cerrar o esperar: <b></b> segundos.",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "Ok",
        cancelButtonText: "Volver",
        background: "#f0f0f0",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
        didOpen: () => {
          const b = Swal.getHtmlContainer().querySelector("b");
          let timeLeft = 3;
          timerInterval = setInterval(() => {
            b.textContent = timeLeft;
            timeLeft--;
            if (timeLeft < 0) {
              clearInterval(timerInterval);
              Swal.close(); // Cierra el SweetAlert automáticamente cuando el contador llega a 0
            }
          }, 1000);
        },
      });
    } else {
      Swal.fire({
        title: "No eres admin",
        text: "Email y/o contraseña incorrecta",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "Volver",
        background: "#f0f0f0",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          return;
        }
      });
      body.msg;

      dispatch(checkingFinishAdmin());
      return;
    }
  };
};

export const startLogoutAdmin = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(logoutAdmin());
  };
};

export const loginAdminSuccess = (admin) => ({
  type: types.authAdminLogin,
  payload: { admin },
});

const logoutAdmin = () => ({ type: types.authAdminLogout });

const checkingFinishAdmin = () => ({ type: types.adminCheckingFinish });

export const startCheckingAdmin = () => {
  return async (dispatch) => {
    const res = await fetchWithTokenAdmin("admin/auth/renew");
    const body = await res.json();

    if (body.ok) {
      localStorage.setItem("role", body.role);
      localStorage.setItem("tokenAdmin", body.token);
      localStorage.setItem("tokenAdmin-init-date", new Date().getTime());

      dispatch(
        loginAdminSuccess({
          fullname: body.fullname,
        }),
      );
    } else {
      console.log(body.msg);
      dispatch(checkingFinishAdmin());
    }
    // debugger
  };
};
