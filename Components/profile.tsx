"use client";
import React, { useState, useEffect, useRef } from "react";
import { Pencil, Check } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";

interface JwtPayload {
  username: string;
}

const UserProfile: React.FC = () => {
  const router = useRouter;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setimage] = useState(DEFAULT_IMAGE);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject("Failed to convert");
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const base64 = await fileToBase64(file);
      setimage(base64);
    }
  };

  const handleSave = async () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Token tidak ditemukan.");
      return;
    }

    const decoded = jwtDecode<JwtPayload>(token);
    const currentUsername = decoded.username;

    const payload = {
      username,
      email,
      image,
    };

    try {
      const res = await fetch(`http://localhost:9999/user/${currentUsername}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
                    token: `${token}`,

        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Berhasil update!");
        setIsEditingUsername(false);
        setIsEditingEmail(false);
        setSelectedFile(null);
        Cookies.remove('token')
        window.location.reload()

      } else {
        const errorData = await res.json();
        alert("Gagal update: " + (errorData.message || res.statusText));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saat update profil.");
    }
  };

useEffect(() => {
  const fetchUserData = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    const decoded = jwtDecode<JwtPayload>(token);
    const currentUsername = decoded.username;

    try {
      const res = await fetch(`http://localhost:9999/user/${currentUsername}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          token: `${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Fetch error:", err.message || res.statusText);
        return;
      }

      const data = await res.json();
      setUsername(data.username || "");
      setEmail(data.email || "");
      setimage(data.image || DEFAULT_IMAGE);
    } catch (err) {
      console.error("Fetch gagal:", err);
    }
  };

  fetchUserData();
}, []);


  const showSaveButton = isEditingUsername || isEditingEmail || selectedFile !== null;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 rounded-xl w-full max-w-screen-md mx-auto h-auto">
      {/* Kiri: Profile */}
      <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-2 shadow w-full md:w-[300px] text-center">
        <div className="text-5xl mb-2">
          <img
            src={image || DEFAULT_IMAGE}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        <p className="text-lg font-medium">{username}</p>
        <button
          className="mt-2 text-sm text-white bg-[#FFB343] hover:bg-[#FF3E3E] transition px-3 py-1 rounded"
          onClick={() => fileInputRef.current?.click()}
        >
          Ubah Gambar
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>

      {/* Kanan: Form */}
      <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-center gap-4 w-full">
        <div>
          <label className="block font-medium">Username :</label>
          <div className="flex items-center justify-between border rounded p-1 mt-1">
            <input
              type="text"
              value={username}
              readOnly={!isEditingUsername}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            />
            <button onClick={() => setIsEditingUsername(!isEditingUsername)}>
              {isEditingUsername ? (
                <Check size={16} className="text-green-500 cursor-pointer" />
              ) : (
                <Pencil size={16} className="text-gray-500 cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium">Email :</label>
          <div className="flex items-center justify-between border rounded p-1 mt-1">
            <input
              type="email"
              value={email}
              readOnly={!isEditingEmail}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            />
            <button onClick={() => setIsEditingEmail(!isEditingEmail)}>
              {isEditingEmail ? (
                <Check size={16} className="text-green-500 cursor-pointer" />
              ) : (
                <Pencil size={16} className="text-gray-500 cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        {showSaveButton && (
          <button
            onClick={handleSave}
            className="mt-4 bg-[#FFB343] text-white py-2 px-4 rounded hover:bg-[#FF3E3E] transition"
          >
            Simpan Perubahan
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
