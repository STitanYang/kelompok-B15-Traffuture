"use client";

import React, { useState } from "react";
import Image from "next/image";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak cocok");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("auth", "true");
        router.push("/");
      } else {
        setError(data.message || "Sign up gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan server");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center">
        <h2 className="text-4xl font-medium mb-4">Sign Up</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 border font-extralight border-gray-300 rounded-md"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-300 rounded-md"
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border font-extralight border-gray-300 rounded-md"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-3 border font-extralight border-gray-300 rounded-md"
          />
        
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-[#FFB343] text-white rounded-md font-light mb-4 hover:bg-[#FF3E3E]"
        >
          SIGN UP
        </button>

        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-black-500 text-sm">Atau Sign Up dengan</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button className="w-full p-2 border border-gray-300 rounded-md flex items-center justify-center hover:bg-[#FF3E3E] gap-x-2">
          <Image src="/assets/google.png" alt="Google Logo" width={20} height={20} />
          Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
