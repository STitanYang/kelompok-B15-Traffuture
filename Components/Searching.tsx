"use client";

import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { FaSearch } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title, // Added Title for chart
} from "chart.js";
import { ChartData } from "chart.js";

// Corrected interface
interface RawDataInterface {
  datetime: string; // format: yyyymmddhh (as a number)
  location: string;
  congestionLevel: number;
  isPrediction: boolean; // Changed to boolean based on typical usage and sample
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type TrafficChartData = ChartData<"bar", (number | null)[], string>; // Allow null for missing data points

const Searching: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("Tugu Jogja"); // Default for example
  const [selectedDate, setSelectedDate] = useState(() => { // Default to today for example
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:00");
  const [submitCount, setSubmitCount] = useState(0); // To trigger fetch
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chartData, setChartData] = useState<TrafficChartData>({
    labels: [],
    datasets: [],
  });

  // Memoize derived values for API call
  const yyyymmddPart = useMemo(() => selectedDate.replace(/-/g, ""), [selectedDate]);
  const starthhPart = useMemo(() => startTime.substring(0, 2), [startTime]);
  const endhhPart = useMemo(() => endTime.substring(0, 2), [endTime]);
  
  const combinedStart = useMemo(() => yyyymmddPart + starthhPart, [yyyymmddPart, starthhPart]);
  const combinedEnd = useMemo(() => yyyymmddPart + endhhPart, [yyyymmddPart, endhhPart]);
  const lokasiFormat = useMemo(() => searchTerm.replace(/ /g, "%20"), [searchTerm]);


  const handleSubmit = () => {
    // Basic validation
    if (!searchTerm || !selectedDate || !startTime || !endTime) {
      alert("Please fill in all fields.");
      return;
    }
    if (parseInt(starthhPart, 10) > parseInt(endhhPart, 10)) {
        alert("Start time cannot be after end time for the same day.");
        return;
    }
    setSubmitCount((prev) => prev + 1);
  };

  // ... (imports and other component code) ...

useEffect(() => {
    if (submitCount === 0) {
      return;
    }

    const fetchDataAndSetChart = async () => {
      setIsLoading(true);
      setError(null);
      setChartData({ labels: [], datasets: [] });

      if (!lokasiFormat || !combinedStart || !combinedEnd || !selectedDate || !startTime || !endTime) {
        setError("Missing parameters for API call.");
        setIsLoading(false);
        return;
      }
      
      const apiUrl = `http://localhost:9999/traffic/${lokasiFormat}?time_start=${combinedStart}&time_end=${combinedEnd}`;

      try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
          throw new Error(`API error! status: ${res.status} ${res.statusText}`);
        }

        const textData = await res.text();

        if (!textData.trim()) {
            console.warn("API returned empty data.");
            setChartData({
                labels: [],
                datasets: [
                    { label: 'Actual Congestion', data: [], backgroundColor: "rgba(255, 99, 132, 0.7)" },
                    { label: 'Predicted Congestion', data: [], backgroundColor: "rgba(54, 162, 235, 0.7)" }
                ]
            });
            setIsLoading(false);
            return;
        }

        let rawApiData: RawDataInterface;
        try {
            const jsonArrayString = `${textData.replace(/}\s*{/g, "},{")}`;
            rawApiData = JSON.parse(jsonArrayString);
        } catch (parseError) {
            console.error("Error parsing API response:", parseError, "Attempted JSON string:", `[${textData.replace(/}\s*{/g, "},{")}]`);
            throw new Error("Failed to parse data from API. Check console for details.");
        }

        // Ensure rawApiData is an array before proceeding
        if (!Array.isArray(rawApiData)) {
            console.error("Parsed data is not an array:", rawApiData);
            throw new Error("API data format error: Expected an array after parsing.");
        }

        const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
        const startIndex = hours.indexOf(startTime);
        const endIndex = hours.indexOf(endTime);

        if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
          setError("Invalid time range selected.");
          setChartData({ labels: [], datasets: [] });
          setIsLoading(false);
          return;
        }

        const selectedHours = hours.slice(startIndex, endIndex + 1);
        const actualCongestionLevels: (number | null)[] = new Array(selectedHours.length).fill(null);
        const predictedCongestionLevels: (number | null)[] = new Array(selectedHours.length).fill(null);
        rawApiData.forEach((item, idx) => {
          if (!item) {
            console.warn(`Skipping invalid item at index ${idx}: item is null or undefined.`, item);
            return; // Skip this item
          }

          // 2. Now that we know 'item' is an object, check the type of 'item.datetime'
          if (typeof item.datetime !== 'string') {
            console.warn(`item.datetime at index ${idx} is of type: ${typeof item.congestionLevel}. Expected 'string'.`); // Log the actual type
            console.warn(`Skipping item at index ${idx} because item.datetime is not a number.`, item);
          }

          // Convert number to string to extract hour part
          const datetimeStr = String(item.datetime);
          // Ensure the string is long enough (yyyymmddhh format means length 10)
          const itemHourVal = parseInt(datetimeStr.substring(8, 10), 10);
          const itemHourStr = `${String(itemHourVal).padStart(2, "0")}:00`;
          const chartLabelIndex = selectedHours.indexOf(itemHourStr);

          if (chartLabelIndex !== -1) {
            if (item.isPrediction) {
              predictedCongestionLevels[chartLabelIndex] = item.congestionLevel + 1;
            } else {
              actualCongestionLevels[chartLabelIndex] = item.congestionLevel + 1;
            }
          }
        });
        console.log(predictedCongestionLevels)
        console.log(actualCongestionLevels)

        setChartData({
          labels: selectedHours,
          datasets: [
            {
              label: 'Actual Congestion',
              data: actualCongestionLevels,
              backgroundColor: "rgba(255, 99, 132, 0.7)",
            },
            {
              label: 'Predicted Congestion',
              data: predictedCongestionLevels,
              backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
          ],
        });

      } catch (error) {
        console.error("Error in fetchDataAndSetChart:", error);
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    };

    if (submitCount > 0) {
        fetchDataAndSetChart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]); // Removed selectedDate from dependencies as yyyymmddPart covers it

// ... (rest of your component, including the return statement) ...


  return (
    <div className="container mx-auto p-4 text-center">
      {/* --- Input Fields --- */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
        <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 shadow-md min-w-[200px]">
          <FaSearch className="text-black mr-2" />
          <select
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-full bg-transparent"
          >
            <option value="">Pilih Lokasi</option>
            <option value="Tugu Jogja">Tugu Jogja</option>
            <option value="Simpang Lima Semarang">Simpang Lima Semarang</option>
            <option value="Jalan TB Simatupang Jakarta">Jalan TB Simatupang Jakarta</option>
            <option value="Tugu Surabaya">Tugu Surabaya</option>
            <option value="Jalan Asia Afrika Bandung">Jalan Asia Afrika Bandung</option>
          </select>
        </div>
        <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 shadow-md">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none bg-transparent"
          />
        </div>
        <div className="flex items-center border-2 border-black rounded-lg px-3 py-2 shadow-md space-x-2">
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="outline-none bg-transparent"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={`start-${i}`} value={`${String(i).padStart(2, "0")}:00`}>
                {`${String(i).padStart(2, "0")}:00`}
              </option>
            ))}
          </select>
          <span className="text-sm font-bold text-zinc-700">until</span>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="outline-none bg-transparent"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={`end-${i}`} value={`${String(i).padStart(2, "0")}:00`}>
                {`${String(i).padStart(2, "0")}:00`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={isLoading} // Disable button while loading
        className="bg-[#FFB343] text-white px-6 py-2 rounded-lg font-bold mb-6 hover:bg-[#FF3E3E] disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Find Results"}
      </button>

      {/* --- Chart Display Area --- */}
      {error && <div className="text-red-500 mb-4">No Data Found!!!</div>}
      
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8 w-full max-w-2xl mx-auto">
          <Bar 
            data={chartData} 
            options={{
                responsive: true,
                plugins: {
                    legend: { position: 'top' as const },
                    title: { display: true, text: `Traffic Congestion: ${searchTerm} on ${selectedDate}` }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Congestion Level' },
                        ticks: {
                            stepSize: 1, 
                            callback: function(value) {
                                switch(value) {
                                    case 0: return '';
                                    case 1: return 'Low';
                                    case 2: return 'Medium';
                                    case 3: return 'High';
                                    case 4: return 'Very High';
                                    default: return value;
                                }
                            }
                        },
                        max: 4,
                    }
                }
            }}
          />
          <div className="mt-4 text-sm text-black text-left">
            <p className="font-semibold">Legend:</p>
            <p>X-axis = Hour of the day</p>
            <p>Y-axis = Tingkat Kepadatan Lalu Lintas (Congestion Level)</p>
            <ul className="list-disc list-inside ml-4">
                <li>0: Lalu Lintas Lancar (Low)</li>
                <li>1: Lalu Lintas Mulai Padat (Medium)</li>
                <li>2: Lalu Lintas Cukup Padat (High)</li>
                <li>3: Lalu Lintas Sangat Padat (Very High)</li>
            </ul>
          </div>
        </div>
    </div>
  );
};

export default Searching;