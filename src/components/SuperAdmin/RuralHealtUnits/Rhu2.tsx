import React from "react";
import DashboardLayout from "../DashboardLayout";
import Table from "../RHUTable";
const Rhu2 = () => {
  const rhu = "2";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Rural Health Unit II</h1>
      <Table rhu={rhu} />
    </DashboardLayout>
  );
};

export default Rhu2;
