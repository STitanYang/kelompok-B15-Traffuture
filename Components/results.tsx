"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData } from "chart.js";

type TrafficChartData = ChartData<"line", number[], string>;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Results = () => {
  const [chartData, setChartData] = useState<TrafficChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/traffic-data");
        const data = await res.json();

        const labels = data.map((item: any) => item.time);
        const densities = data.map((item: any) => item.density);

        setChartData({
          labels,
          datasets: [
            {
              label: "Tingkat Kepadatan Lalu Lintas",
              data: densities,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 p-10">
      <h1 className="text-2xl font-bold text-center mb-8 text-black">
        Informasi Lalu Lintas
      </h1>
      <div className="flex justify-center items-start gap-10">
        <div className="bg-white rounded-2xl shadow-md p-6 w-[600px]">
          <Line data={chartData} />
          <div className="mt-4 text-sm text-black">
            <p>X = Jam</p>
            <p>Y = Tingkat Kepadatan Lalu Lintas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
