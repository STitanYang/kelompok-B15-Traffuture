// page.tsx

import Navbar from "@/Components/navbar";
import Profile from "@/Components/profile";
import History from "@/Components/history";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-300"> {/* Menambahkan background abu-abu untuk halaman */}
      <Navbar /> {/* Navbar tetap di luar container */}
      <Profile /> {/* Profile tetap di luar container */}
      <History />
    </div>
  );
};

export default Page;
