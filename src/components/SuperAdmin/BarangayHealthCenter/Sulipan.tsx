import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const Sulipan = () => {
  const barangay = "Sulipan";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Sulipan Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Sulipan;
