// page.tsx
"use client";
import Navbar from "@/Components/navbar";
import Profile from "@/Components/profile";
// import History from "@/Components/history";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

const Page: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/SignIn');
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.role !== 'user') {
        router.push('/SignIn');
      }
    } catch (err) {
      console.error("Token tidak valid:", err);
      router.push('/SignIn');
    }
  }, [router]);


  return (
    <div className="min-h-screen bg-gray-300"> {/* Menambahkan background abu-abu untuk halaman */}
      <Navbar /> {/* Navbar tetap di luar container */}
      <Profile /> {/* Profile tetap di luar container */}
      {/* <History /> */}
    </div>
  );
};

export default Page;
