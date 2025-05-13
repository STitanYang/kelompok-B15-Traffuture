'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (res.ok) {
        router.push('/');
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

        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-black-500 text-sm">Atau Sign In dengan</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        
        <button className="w-full p-2 border border-gray-300 rounded-md flex items-center justify-center hover:bg-[#FF3E3E] gap-x-2">
          <Image src="/assets/google.png" alt="Google Logo" width={20} height={20} />
          Google
        </button>

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
