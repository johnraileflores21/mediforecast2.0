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
import Dashboard from "./components/Dashboard/index";
import Add from "./components/Add";
import Request from "./components/Request";
import Community from "./components/Community";
import Individual from "./components/Individual";
import Try from "./components/Try";
import InventoryV2 from "./components/InventoryV2";
import AdminRHU1 from "./components/bin/AdminRHU1";
import RHU2 from "./components/bin/AdminRHU2";
import RHU3 from "./components/bin/AdminRHU3";
// import { FormProvider } from "./components/FormContext";
import { UserProvider, useUser } from "./components/User";
import PrivateRoute from "./components/PrivateRoute";
import PulseLoader from "react-spinners/PulseLoader";
import ForgotPassword from "./components/ForgotPassword";
import Settings from "./components/Settings";
import AdminLogin from "./components/SuperAdmin/Login";
import AdminDashboard from "./components/SuperAdmin/Dashboard";
import ResetPassword from "./components/ResetPassword";
import Rhu1 from "./components/SuperAdmin/RuralHealtUnits/Rhu1";
import Rhu2 from "./components/SuperAdmin/RuralHealtUnits/Rhu2";
import Rhu3 from "./components/SuperAdmin/RuralHealtUnits/Rhu3";
import Balucuc from "./components/SuperAdmin/BarangayHealthCenter/Balucuc";
import Calantipe from "./components/SuperAdmin/BarangayHealthCenter/Calantipe";
import Cansinala from "./components/SuperAdmin/BarangayHealthCenter/Cansinala";
import Capalangan from "./components/SuperAdmin/BarangayHealthCenter/Capalangan";
import Colgante from "./components/SuperAdmin/BarangayHealthCenter/Colgante";
import Paligui from "./components/SuperAdmin/BarangayHealthCenter/Paligui";
import Sampaloc from "./components/SuperAdmin/BarangayHealthCenter/Sampaloc";
import SanJuan from "./components/SuperAdmin/BarangayHealthCenter/SanJuan";
import SanVicente from "./components/SuperAdmin/BarangayHealthCenter/SanVicente";
import Sucad from "./components/SuperAdmin/BarangayHealthCenter/Sucad";
import Sulipan from "./components/SuperAdmin/BarangayHealthCenter/Sulipan";
import Tabuyuc from "./components/SuperAdmin/BarangayHealthCenter/Tabuyuc";
import { ConfirmationProvider } from './components/ConfirmationContext';
import InventoryListener from "./listeners/InventoryListener";

import PrivateRouteAdmin from "./components/SuperAdmin/PrivateRouteAdmin";
const App = () => {
  return (
    <ConfirmationProvider>
    <UserProvider>
      <InventoryListener />
      <Routes>
        {/* Super Admin */}
        <Route path="/administrator" element={<AdminLogin />} />
        <Route element={<PrivateRouteAdmin />}>
          <Route path="/administrator/users" element={<AdminDashboard />} />
          <Route
            path="/administrator/rural-health-units/1"
            element={<Rhu1 />}
          />
          <Route
            path="/administrator/rural-health-units/2"
            element={<Rhu2 />}
          />
          <Route
            path="/administrator/rural-health-units/3"
            element={<Rhu3 />}
          />
          <Route path="/administrator/barangay/balucuc" element={<Balucuc />} />
          <Route
            path="/administrator/barangay/calantipe"
            element={<Calantipe />}
          />
          <Route
            path="/administrator/barangay/cansinala"
            element={<Cansinala />}
          />
          <Route
            path="/administrator/barangay/capalangan"
            element={<Capalangan />}
          />
          <Route
            path="/administrator/barangay/colgante"
            element={<Colgante />}
          />
          <Route path="/administrator/barangay/paligui" element={<Paligui />} />
          <Route
            path="/administrator/barangay/sampaloc"
            element={<Sampaloc />}
          />
          <Route path="/administrator/barangay/sanjuan" element={<SanJuan />} />
          <Route
            path="/administrator/barangay/sanvicente"
            element={<SanVicente />}
          />
          <Route path="/administrator/barangay/sucad" element={<Sucad />} />
          <Route path="/administrator/barangay/sulipan" element={<Sulipan />} />
          <Route path="/administrator/barangay/tabuyuc" element={<Tabuyuc />} />
        </Route>
        {/* Barangay and RHU */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory/add" element={<Add />} />
          <Route path="/request" element={<Request />} />
          <Route path="/community" element={<Community />} />
          <Route path="/individual-treatment-record" element={<Individual />} />
          <Route path="/administrator" element={<AdminLogin />} />
          <Route path="/inventory" element={<Try />} />
          <Route path="/inventory2" element={<InventoryV2 />} />
          <Route path="/administrator-dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminRHU1 />} />
          <Route path="/rural-health-unit-2" element={<RHU2 />} />
          <Route path="/rural-health-unit-3" element={<RHU3 />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        {/* <Route path="/inventory" element={<Inventory />} /> */}
      </Routes>
    </UserProvider>
    </ConfirmationProvider>
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
