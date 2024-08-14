import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./User";

const PrivateRoute: React.FC = () => {
  const { user } = useUser();

  // If no user is authenticated, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated, render the child components (outlet)
  return <Outlet />;
};

export default PrivateRoute;
