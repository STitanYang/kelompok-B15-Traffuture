"use client";

import Navbar from "@/Components/navbar";
// import Results from "@/Components/results";
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

const Nnews: React.FC = () => {
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

        {/* <Results/> */}
        </div>
  );
}

export default Nnews;

