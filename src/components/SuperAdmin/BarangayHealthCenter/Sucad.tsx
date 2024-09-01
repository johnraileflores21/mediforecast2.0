import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const Sucad = () => {
  const barangay = "Sucad";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Sucad Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Sucad;
