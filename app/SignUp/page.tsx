"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const showPassword = false;
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak cocok");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    try {
      const res = await fetch("http://localhost:9999/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, email, password}),
        credentials: "include", // jika backend kirim cookie
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/SignIn"); // redirect setelah register berhasil
      } else {
        setError(data.message || "Sign up gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan server");
      console.log(err)
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
        <p className="text-sm text-gray-600 mt-4">
          Sudah punya akun?
          <Link href="/SignIn" className="text-[#FF3E3E] font-semibold ml-1">
            Klik disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
