import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, loggedIn, ...props }) => {
  return loggedIn ? <Component {...props} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
