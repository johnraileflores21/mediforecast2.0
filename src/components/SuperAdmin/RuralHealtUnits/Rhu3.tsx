import React from "react";
import DashboardLayout from "../DashboardLayout";
import Table from "../RHUTable";

const Rhu3 = () => {
  const rhu = "3";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Rural Health Unit III</h1>
      <Table rhu={rhu} />
    </DashboardLayout>
  );
};

export default Rhu3;
