import React from "react";
import DashboardLayout from "../DashboardLayout";
import Table from "../RHUTable";
interface Rhu1Props {
  rhu: string;
}
const Rhu1 = () => {
  const rhu = "1";
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Rural Health Unit I</h1>
      <Table rhu={rhu} />
    </DashboardLayout>
  );
};

export default Rhu1;
