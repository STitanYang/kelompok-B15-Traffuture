
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch} from "react-icons/fa";

const searching: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const payload = {
        search: searchTerm,
        date: selectedDate,
        start: startTime,
        end: endTime,
      };
  
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // redirect ke halaman hasil analisis berdasarkan _id dari MongoDB
        router.push(`/Result/${data.id}`);
      } else {
        console.error(data.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  };
  
  return (
    <div>
    
    <div className="container mx-auto p-4 text-center">
    
    <div className="flex justify-center space-x-4 mb-4">
    <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 shadow-md w-25 h-15">
        <FaSearch className="black" />
        <input type="text" placeholder="Search" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} className="ml-2 outline-none" />
      </div>
      <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 shadow-md w-25 h-15">
        
        <input type="date" value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)} className="ml-2 outline-none" />
       </div>
       <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 shadow-md space-x-2">
  <input
    type="time"
    value={startTime}
    onChange={(e) => setStartTime(e.target.value)}
    className="outline-none"
    placeholder="Start Time"
  />

<span className="text-sm font-bold text-zinc-700">until</span>


  <input
    type="time"
    value={endTime}
    onChange={(e) => setEndTime(e.target.value)}
    className="outline-none"
    placeholder="End Time"
  />
</div>




    </div>
    <button   onClick={handleSubmit} className="bg-[#FFB343] text-white px-6 py-2 rounded-lg font-bold mb-6 hover:bg-[#FF3E3E]">
  Find Results
</button>
 

    </div>

    </div>
  );
}

export default searching;