import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const SanVicente = () => {
  const barangay = "San Vicente";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">San Vicente Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default SanVicente;
