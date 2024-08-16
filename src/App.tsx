import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Add from "./components/Add";
import Request from "./components/Request";
import Community from "./components/Community";
import Individual from "./components/Individual";
import AdminLogin from "./components/AdminLogin";
import Try from "./components/Try";
import AdminDashboard from "./components/AdminDashboard";
import AdminRHU1 from "./components/AdminRHU1";
import RHU2 from "./components/AdminRHU2";
import RHU3 from "./components/AdminRHU3";
// import { FormProvider } from "./components/FormContext";
import { UserProvider, useUser } from "./components/User";
import PrivateRoute from "./components/PrivateRoute";
import PulseLoader from "react-spinners/PulseLoader";
import ForgotPassword from "./components/ForgotPassword";
import PDFFile from "./components/PDFFile";
const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory/add" element={<Add />} />
          <Route path="/request" element={<Request />} />
          <Route path="/community" element={<Community />} />
          <Route path="/individual-treatment-record" element={<Individual />} />
          <Route path="/administrator" element={<AdminLogin />} />
          <Route path="/inventory" element={<Try />} />
          <Route path="/administrator-dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminRHU1 />} />
          <Route path="/rural-health-unit-2" element={<RHU2 />} />
          <Route path="/rural-health-unit-3" element={<RHU3 />} />
        </Route>
        {/* <Route path="/inventory" element={<Inventory />} /> */}
      </Routes>
    </UserProvider>
  );
};
const AuthRedirect = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <h1 className="text-4xl mb-4 text-gray-800">Loading...</h1>
            <PulseLoader
              color={"#007f80"}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      </>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <Login />;
};

export default App;
