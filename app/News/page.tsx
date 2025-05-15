"use client";

import Navbar from "@/Components/navbar";
import News from "@/Components/news"
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

const news: React.FC = () => {
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
        <h1 className=" text-3xl font-bold mb-5 text-center mt-7">Berita Lalu Lintas</h1>

        <News />
        </div>
  );
}

export default news;

