import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const Tabuyuc = () => {
  const barangay = "Tabuyuc";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Tabuyuc Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Tabuyuc;
