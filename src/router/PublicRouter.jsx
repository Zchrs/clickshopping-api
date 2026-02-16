/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux";






export const PublicRoute = ({children}) => {
  const user = useSelector((state) => state.auth.user);

    return (!user) ? children : <Navigate to="/dashboard" replace />;
  };
export const PublicRouteAdmin = ({children}) => {
  const admin = useSelector((state) => state.authAdmin.admin);

    return (!admin) ? children : <Navigate to="/admin/dashboard" replace />;
  };

