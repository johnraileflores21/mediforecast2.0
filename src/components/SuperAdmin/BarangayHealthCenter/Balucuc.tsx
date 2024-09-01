import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const Balucuc = () => {
  const barangay = "Balucuc";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Balucuc Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Balucuc;
