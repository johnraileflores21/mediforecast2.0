import React from "react";
import DashboardLayout from "../DashboardLayout";
import BarangayTable from "../BarangayTable";

const Sampaloc = () => {
  const barangay = "Sampaloc";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Sampaloc Health Center</h1>
      <BarangayTable barangay={barangay} />
    </DashboardLayout>
  );
};

export default Sampaloc;
