"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Bar } from "react-chartjs-2";  // Import Bar chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,       // Import BarElement untuk Bar chart
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend); // Daftarkan BarElement

type TrafficChartData = ChartData<"bar", number[], string>;  // Ganti ke "bar"

const dummyTrafficDatabase: Record<string, Record<string, number[]>> = {
  "Tugu Jogja": {
    "2025-05-14": [30, 40, 50, 60, 55, 45, 35, 30, 30, 40, 50, 60, 55, 45, 35, 30, 30, 40, 50, 60, 55, 45, 35, 30],
    "2025-05-15": [25, 35, 60, 75, 65, 50, 30, 30, 25, 35, 60, 75, 65, 50, 30, 30, 25, 35, 60, 75, 65, 50, 30, 30],
  },
  "Simpang Lima Semarang": {
    "2025-05-14": [20, 30, 45, 55, 50, 40, 25, 30, 20, 30, 45, 55, 50, 40, 25, 30, 20, 30, 45, 55, 50, 40, 25, 30],
    "2025-05-15": [35, 50, 65, 70, 60, 45, 30, 20, 35, 50, 65, 70, 60, 45, 30, 20, 35, 50, 65, 70, 60, 45, 30, 20],
  },
  "Jalan TB Simatupang Jakarta": {
    "2025-05-14": [60, 70, 80, 90, 85, 75, 65, 89, 60, 70, 80, 90, 85, 75, 65, 89, 60, 70, 80, 90, 85, 75, 65, 89],
    "2025-05-15": [55, 60, 70, 80, 75, 65, 50, 18, 55, 60, 70, 80, 75, 65, 50, 18, 55, 60, 70, 80, 75, 65, 50, 18],
  },
  "Tugu Surabaya": {
    "2025-05-14": [15, 25, 35, 45, 40, 30, 20, 30, 15, 25, 35, 45, 40, 30, 20, 30, 15, 25, 35, 45, 40, 30, 20, 30],
    "2025-05-15": [20, 30, 40, 50, 45, 35, 25, 12, 20, 30, 40, 50, 45, 35, 25, 12, 20, 30, 40, 50, 45, 35, 25, 12],
  },
  "Jalan Asia Afrika Bandung": {
    "2025-05-14": [10, 20, 30, 35, 32, 28, 18, 82, 10, 20, 30, 35, 32, 28, 18, 82, 10, 20, 30, 35, 32, 28, 18, 82],
    "2025-05-15": [18, 25, 35, 40, 36, 30, 22, 10, 18, 25, 35, 40, 36, 30, 22, 10, 18, 25, 35, 40, 36, 30, 22, 10],
  },
};

const Searching: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [chartData, setChartData] = useState<TrafficChartData>({
      labels: [],
      datasets: [],
    });

  const handleSubmit = () => {
    const payload = {
      search: searchTerm,
      date: selectedDate,
      start: startTime,
      end: endTime,
    };

    localStorage.setItem("searchData", JSON.stringify(payload));
    setSubmitCount((prev) => prev + 1);
    setShowResult(true);
  };

useEffect(() => {
  const saved = localStorage.getItem("searchData");
  if (!saved) return;

  const input = JSON.parse(saved);

  const generateDummyData = () => {
    const hours = [
      "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
      "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
      "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
    ];

    const startIndex = hours.indexOf(input.start);
    const endIndex = hours.indexOf(input.end);

    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const selectedHours = hours.slice(startIndex, endIndex + 1);
    const locationData = dummyTrafficDatabase[input.search]?.[input.date];

    const actualData =
      locationData && locationData.length >= endIndex + 1
        ? locationData.slice(startIndex, endIndex + 1)
        : selectedHours.map(() => Math.floor(20 + Math.random() * 80));

    const predictionData = actualData.map((val) =>
      Math.min(100, Math.max(0, val + (Math.random() > 0.5 ? 10 : -10)))
    );

    return {
      labels: selectedHours,
      datasets: [
        {
          label: `Waktu Aktual`,
          data: actualData,
          backgroundColor: "rgba(255, 99, 132, 0.7)", // merah
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: `Prediksi `,
          data: predictionData,
          backgroundColor: "rgba(54, 162, 235, 0.7)", // biru
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  setChartData(generateDummyData());
}, [submitCount]);


  return (
    <div className="container mx-auto p-4 text-center">
      <div className="flex justify-center space-x-4 mb-4">
        <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 shadow-md w-48 h-15">
          <FaSearch className="black mr-2" />
          <select
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-full bg-transparent"
          >
            <option value="">Pilih Lokasi</option>
            <option value="Tugu Jogja">Tugu Jogja</option>
            <option value="Simpang Lima Semarang">Simpang lima Semarang</option>
            <option value="Jalan TB Simatupang Jakarta">Jalan TB Simatupang Jakarta</option>
            <option value="Tugu Surabaya">Tugu Surabaya</option>
            <option value="Jalan Asia Afrika Bandung">Jalan Asia Afrika Bandung</option>
          </select>
        </div>
        <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 shadow-md w-25 h-15">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="ml-2 outline-none"
          />
        </div>
        <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 shadow-md space-x-2">
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="outline-none"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={`${String(i).padStart(2, "0")}:00`}>
                {`${String(i).padStart(2, "0")}:00`}
              </option>
            ))}
          </select>
          <span className="text-sm font-bold text-zinc-700">until</span>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="outline-none"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={`${String(i).padStart(2, "0")}:00`}>
                {`${String(i).padStart(2, "0")}:00`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-[#FFB343] text-white px-6 py-2 rounded-lg font-bold mb-6 hover:bg-[#FF3E3E]"
      >
        Find Results
      </button>
      <div className="bg-white rounded-2xl shadow-md p-6 mt-8 w-[600px] mx-auto">
        <Bar data={chartData} /> {/* Ganti Line ke Bar */}
        <div className="mt-4 text-sm text-black">
          <p>X = Jam</p>
          <p>Y = Tingkat Kepadatan Lalu Lintas</p>
          <p>0 (Lalu Lintas Lancar)</p>
          <p>1 (Lalu Lintas Mulai Padat)</p>
          <p>2 (Lalu Lintas Cukup Padat)</p>
          <p>3 (Lalu Lintas Sangat)</p>
        </div>
      </div>
    </div>
  );
};

export default Searching;
