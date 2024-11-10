import React from "react";
import { AgCharts } from "ag-charts-react";

interface ChartExampleProps {
  options: any;
}

const ChartExample: React.FC<ChartExampleProps> = ({ options }) => {
  return (
    <div>
      <AgCharts
        options={options}
        style={{ height: 400, width: "100%" }}
      />
    </div>
  );
};

export default ChartExample;
