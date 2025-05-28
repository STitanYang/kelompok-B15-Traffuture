'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

const SignIn: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
  setError('');

  if (password.length < 8) {
    setError('Password minimal 8 karakter');
    return;
  }

  try {
    const res = await fetch('http://localhost:9999/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    if (res.ok) {
      const data = await res.json();
      const token = data.token;

      const decoded = jwtDecode<JwtPayload>(token);

      // ⬇️ Simpan data ke localStorage setelah decode token
      localStorage.setItem('username', decoded.username);
      localStorage.setItem('role', decoded.role);
      Cookies.set('token', token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
        path: '/',
      });

      // Redirect berdasarkan role
      if (decoded.role === 'administrator') {
        router.push('/Admin');
      } else {
        router.push('/');
      }

    } else {
      let message = 'Login gagal';
      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch (jsonErr) {
        console.warn('Response bukan JSON:', jsonErr);
      }
      setError(message);
    }
  } catch (err) {
    setError('Terjadi kesalahan server');
  }
};



    
      

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center">
        <h2 className="text-4xl font-medium mb-4">Sign In</h2>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 border font-extralight border-gray-300 rounded-md"
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border font-extralight border-gray-300 rounded-md"
        />
        
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-[#FFB343] text-white rounded-md font-light mb-4 hover:bg-[#FF3E3E]"
        >
          SIGN IN
        </button>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <p className="text-sm text-gray-600 mt-4">
          Belum punya akun?
          <Link href="/SignUp" className="text-[#FF3E3E] font-semibold ml-1">
            Sign Up sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
