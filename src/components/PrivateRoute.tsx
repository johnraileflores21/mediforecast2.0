import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./User";

const PrivateRoute: React.FC = () => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;
