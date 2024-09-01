import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const Paligui = () => {
  const barangay = "Paligui";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Paligui Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Paligui;
