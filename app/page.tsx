import Navbar from "@/Components/navbar";
import TrendNews from "@/Components/TrendNews"
import Searching from "@/Components/Searching"



const home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Searching/>
    <TrendNews/>
    </div>
  );
}

export default home;