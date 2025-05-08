"use client";

import Image from "next/image";

const Results = () => {
  return (
    <div className="min-h-screen bg-gray-200 p-10">
      {/* Judul */}
      <h1 className="text-2xl font-bold text-center mb-8 text-black">
        Informasi Lalu Lintas di Lorem Ipsum Sit Amet
      </h1>

      {/* Kontainer utama */}
      <div className="flex justify-center items-start gap-10">
        {/* Kiri: Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-[600px]">
          {/* Gambar Chart */}
          <div className="relative w-full h-[350px]">
            <Image
              src="/chart-placeholder.png" // ganti ini dengan chart dinamis atau src sesuai file kamu
              alt="Grafik lalu lintas"
              fill
              className="object-contain"
            />
          </div>
          <div className="mt-4 text-sm text-black">
            <p>X = jam</p>
            <p>Y = kepadatan lalu lintas</p>
          </div>
        </div>

        {/* Kanan: Laporan */}
       
      </div>
    </div>
  );
};

export default Results;
