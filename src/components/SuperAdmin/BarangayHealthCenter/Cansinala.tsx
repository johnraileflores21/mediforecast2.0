import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const Cansinala = () => {
  const barangay = "Cansinala";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Cansinala Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Cansinala;
