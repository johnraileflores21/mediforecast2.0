import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { FaExclamationCircle } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface InventoryItem {
  id: string;
  type: "Medicine" | "Vitamin" | "Vaccine";
  medicineStock?: number | string;
  vitaminStock?: number | string;
  vaccineStock?: number | string;
  medicineGenericName?: string;
  vitaminGenericName?: string;
  vaccineName?: string;
  [key: string]: any;
}

interface PieChartProps {
  data: InventoryItem[];
  size?: number;
  limit?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 10,
  limit = 50,
}) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const [processedData, setProcessedData] = useState<any[]>([]);

  useEffect(() => {
    const processData = () => {
      const mappedData = data.map((item) => {
        let stock: number = 0;
        let name: string = "";

        // get the stock count depending on the item type
        if (item.type === "Medicine") {
          stock =
            typeof item.medicineStock === "number"
              ? item.medicineStock
              : parseInt(item.medicineStock as string) || 0;
          name = item.medicineGenericName || "Unknown Medicine";
        } else if (item.type === "Vitamin") {
          stock =
            typeof item.vitaminStock === "number"
              ? item.vitaminStock
              : parseInt(item.vitaminStock as string) || 0;
          name = item.vitaminGenericName || "Unknown Vitamin";
        } else if (item.type === "Vaccine") {
          stock =
            typeof item.vaccineStock === "number"
              ? item.vaccineStock
              : parseInt(item.vaccineStock as string) || 0;
          name = item.vaccineName || "Unknown Vaccine";
        }
        // console.log('stock:', stock);
        return {
          name,
          type: item.type,
          stock,
        };
      });

      const filteredData = mappedData.filter((item) => item.stock <= limit);
      const sortedData = filteredData.sort((a, b) => a.stock - b.stock);
      const limitedData = sortedData.slice(0, size);

      setProcessedData(limitedData);

      const labels = limitedData.map((item) => item.name);
      const dataValues = limitedData.map((item) => item.stock);
      const backgroundColors = labels.map((_, index) => {
        const hue = (index * 360) / limitedData.length;
        return `hsla(${hue}, 70%, 50%, 0.6)`;
      });

      const borderColors = labels.map((_, index) => {
        const hue = (index * 360) / limitedData.length;
        return `hsla(${hue}, 70%, 50%, 1)`;
      });

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Stock Count",
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      });
    };

    processData();
  }, [data, size, limit]);

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Top Out of Stock Items",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const item = processedData[index];
            return `${item.name} (${item.type}): ${item.stock}`;
          },
        },
      },
    },
  };

  const hasData =
  chartData.datasets.length > 0 &&
  chartData.datasets[0].data &&
  chartData.datasets[0].data.length > 0;

return hasData ? (
  <Pie data={chartData} options={pieOptions} />
) : (
  <div className="flex flex-col items-center justify-between rounded-lg h-full">
    <div className="text-[12px] text-gray-700 font-bold">Top Out of Stock Items</div>
    <div className="flex flex-col items-center">
      <FaExclamationCircle className="text-4xl text-red-500 mb-4 mt-4" />
      <p className="text-lg text-gray-700">No items to display.</p>
    </div>
    <div className="invisible">1</div>
  </div>
);
};

export default PieChart;
