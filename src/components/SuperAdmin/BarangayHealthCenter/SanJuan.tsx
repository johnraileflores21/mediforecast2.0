import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const SanJuan = () => {
  const barangay = "San Juan";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">San Juan Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default SanJuan;
