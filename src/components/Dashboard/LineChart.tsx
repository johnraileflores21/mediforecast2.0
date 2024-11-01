import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart: React.FC<{ distributions: any[] }> = ({ distributions }) => {
//   const [distributions, setDistributions] = useState<any[]>([]);
//   const [distributionsLoading, setDistributionsLoading] = useState<boolean>(true);
//   const [distributionsError, setDistributionsError] = useState<string | null>(null);
  const [lineData, setLineData] = useState<any>({
    labels: [],
    datasets: [],
  });



  useEffect(() => {
    const currentDate = new Date();

    const labels: string[] = [];
    const data: number[] = [];
    const monthTotals: { [key: string]: number } = {};

    for (let i = 7; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthLabel = date.toLocaleString("default", { month: "long" });
      labels.push(monthLabel);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      monthTotals[monthKey] = 0;
    }

    // Process distributions
    distributions.forEach((dist:any) => {
      if (dist.created_at && dist.quantity) {
        const createdAtDate = new Date(dist.created_at);
        const distYear = createdAtDate.getFullYear();
        const distMonth = createdAtDate.getMonth();

        // Check if the distribution is within the last 8 months
        const monthsDiff =
          (currentDate.getFullYear() - distYear) * 12 + (currentDate.getMonth() - distMonth);
        // console.log('monthsDiff:', monthsDiff);
        if (monthsDiff >= 0 && monthsDiff <= 7) {

          const monthKey = `${distYear}-${distMonth}`;
          if (monthTotals[monthKey] !== undefined) {
            monthTotals[monthKey] += dist.quantity;
            // console.log('monthTotals:', monthTotals);

            // console.log(`createdAtDate: ${distMonth + 1} - value: ${dist.quantity}`);
          }
        }
      }
    });


    labels.forEach((label, index) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - (7 - index), 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const totalQuantity = monthTotals[monthKey] || 0;
      data.push(totalQuantity);
    });

    // Update lineData state
    setLineData({
      labels: labels,
      datasets: [
        {
          label: "Distributed Quantity",
          data: data,
          fill: false,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    });
  }, [distributions]);

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Distributions Over the Last 8 Months",
      },
    },
  };

  return <Line data={lineData} options={lineOptions} />;
};

export default LineChart;
