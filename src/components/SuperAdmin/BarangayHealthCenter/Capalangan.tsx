import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const Capalangan = () => {
  const barangay = "Capalangan";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Capalangan Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Capalangan;
