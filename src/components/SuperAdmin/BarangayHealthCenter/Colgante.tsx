import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const Colgante = () => {
  const barangay = "Colgante";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Colgante Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Colgante;
