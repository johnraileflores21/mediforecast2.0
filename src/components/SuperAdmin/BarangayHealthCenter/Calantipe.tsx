import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";
const Calantipe = () => {
  const barangay = "Calantipe";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Calantipe Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Calantipe;
