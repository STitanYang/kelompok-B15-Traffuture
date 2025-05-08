"use client";
import React from "react";

// Data dummy yang didefinisikan dulu
const trafficData = [
  {
    datetime: "2025-05-01 08:00",
    lokasi: "Jl. Sudirman",
    keterangan: "Macet karena ada kecelakaan",
  },
  {
    datetime: "2025-05-01 09:30",
    lokasi: "Jl. Thamrin",
    keterangan: "Padat merayap",
  },
  {
    datetime: "2025-05-01 11:00",
    lokasi: "Jl. Gatot Subroto",
    keterangan: "Lalu lintas lancar",
  },

  {
    datetime: "2025-05-01 11:00",
    lokasi: "Jl. Gatot Subroto",
    keterangan: "Lalu lintas lancar",
  },
];

const TrafficHistoryTable: React.FC = () => {
  return (
    <div className=" min-h-screen p-8">
         <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Traffic History</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-300 text-left">
            <th className="p-2">No</th>
            <th className="p-2">Datetime</th>
            <th className="p-2">Lokasi</th>
            <th className="p-2">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {trafficData.map((item, index) => (
            <tr key={index} className="bg-white border-2">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{item.datetime}</td>
              <td className="p-2">{item.lokasi}</td>
              <td className="p-2">{item.keterangan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default TrafficHistoryTable;
