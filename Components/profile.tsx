"use client";
import React, { useState, useRef, useEffect } from "react";
import { Pencil, Check } from "lucide-react";


const UserProfile: React.FC = () => {
  const [username, setUsername] = useState("Sarah Alana");
  const [email, setEmail] = useState("sarahalana@gmail.com");
  const [password, setPassword] = useState("*****");

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUsernameEdit = () => setIsEditingUsername(!isEditingUsername);
  const handleEmailEdit = () => setIsEditingEmail(!isEditingEmail);
  const handlePasswordEdit = () => {
    setIsEditingPassword(!isEditingPassword);
    if (isEditingPassword) setPassword("*****");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) alert("Profil berhasil diperbarui!");
      else alert("Gagal memperbarui profil.");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat memperbarui profil.");
    }
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await fetch("/api/user/profile-image");
        const data = await res.json(); // misalnya { image: "base64..." }
  
        if (data.image) {
          const base64Url = `data:image/png;base64,${data.image}`;
          const response = await fetch(base64Url);
          const blob = await response.blob();
          const file = new File([blob], "profile.png", { type: blob.type });
  
          setProfileImage(file);
          setPreviewImage(URL.createObjectURL(blob));
        }
      } catch (err) {
        console.error("Gagal ambil gambar profil:", err);
      }
    };
  
    fetchProfileImage();
  }, []);
  

  const showSaveButton =
    isEditingUsername || isEditingEmail || isEditingPassword || profileImage;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 rounded-xl w-full max-w-screen-md mx-auto h-auto">
      {/* Kiri: Profile */}
      <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-2 shadow w-full md:w-[300px] text-center">
  <div className="text-5xl mb-2">
    {previewImage ? (
      <img
        src={previewImage}
        alt="Preview"
        className="w-24 h-24 rounded-full object-cover"
      />
    ) : (
      "👤"
    )}
  </div>
  <p className="text-lg font-medium">{username}</p>

  {/* Tombol Ubah Gambar */}
  <button
    className="mt-2 text-sm text-white bg-[#FFB343] hover:bg-[#FF3E3E] transition px-3 py-1 rounded"
    onClick={() => fileInputRef.current?.click()}
  >
    Ubah Gambar
  </button>

  {/* Input file yang disembunyikan */}
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
        {/* Username */}
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
            <button onClick={handleUsernameEdit}>
              {isEditingUsername ? (
                <Check size={16} className="text-green-500 cursor-pointer" />
              ) : (
                <Pencil size={16} className="text-gray-500 cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        {/* Email */}
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
            <button onClick={handleEmailEdit}>
              {isEditingEmail ? (
                <Check size={16} className="text-green-500 cursor-pointer" />
              ) : (
                <Pencil size={16} className="text-gray-500 cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium">Password :</label>
          <div className="flex items-center justify-between border rounded p-1 mt-1">
            <input
              type={isEditingPassword ? "text" : "password"}
              value={password}
              readOnly={!isEditingPassword}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full focus:outline-none"
            />
            <button onClick={handlePasswordEdit}>
              {isEditingPassword ? (
                <Check size={16} className="text-green-500 cursor-pointer" />
              ) : (
                <Pencil size={16} className="text-gray-500 cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        {/* Simpan Perubahan */}
        {showSaveButton && (
          <button
            onClick={handleSave}
            className="mt-4 bg-[#FFB343] text-white py-2 px-4 rounded  hover:bg-[#FF3E3E] transition"
          >
            Simpan Perubahan
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
