'use client';

import Navbar from "@/Components/navbar";
import TrendNews from "@/Components/TrendNews";
import Searching from "@/Components/Searching";
// import Result from "@/Components/results";

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

const Home: React.FC = () => {
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
    <div>
      <Navbar />
      <Searching />
      <TrendNews />
    </div>
  );
};

export default Home;