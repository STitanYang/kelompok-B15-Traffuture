"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

interface JwtPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}
const NewsWriter: React.FC = () => {
  const emptyFile = new File([], "");
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [photo, setPhoto] = useState<File>(emptyFile);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
   
       const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/SignIn');
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.role !== 'administrator') {
        router.push('/SignIn');
      }
    } catch (err) {
      console.error("Token tidak valid:", err);
      router.push('/SignIn');
    }
  }, [router]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news/1"); // endpoint dummy
        const data = await res.json();

        setTitle(data.title || '');
        setContent(data.content || '');

        if (data.imageBase64) {
          const base64Url = `data:image/png;base64,${data.imageBase64}`;
          const blob = await (await fetch(base64Url)).blob();
          const file = new File([blob], "news-image.png", { type: blob.type });

          setPhoto(file);
          setPhotoPreview(URL.createObjectURL(blob));
        }
      } catch (err) {
        console.error("Gagal load berita:", err);
      }
    };

    fetchNews();
  }, []);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePost = async () => {
    if (!title || !content) {
      alert("Judul dan isi harus diisi!");
      return;
    }
    try {
      const token = Cookies.get('token');
      const response = await fetch("http://localhost:9999/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `${token}`,
        },
        body: JSON.stringify({
          title: title,  // Include the title directly as a string
          body: content,
          image: await convertToBase64(photo) || ""
        })
      });

      if (response.ok) {
        alert("Berita berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui berita.");
      }
    } catch (err) {
      console.error("Error saat mengirim:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="text-3xl font-bold mb-5 text-center mt-7" style={styles.heading}>
        News Writing
      </h1>

      <div style={styles.form}>
        <label htmlFor="photo-upload" style={styles.photoBox}>
          {photoPreview ? (
            <Image src={photoPreview} alt="Preview" style={styles.imagePreview} />
          ) : (
            <>
              <div style={styles.plus}>+</div>
              <div style={styles.addPhotoText}>add photo</div>
            </>
          )}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.inputTitle}
          />
          <textarea
            placeholder="Isi Berita"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textArea}
          />
        </div>
      </div>

      <button
        onClick={handlePost}
        className="p-2 bg-[#FFB343] text-white rounded-md font-light mb-4 mt-4 hover:bg-[#FF3E3E] w-[200px]"
      >
        POSTING
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "40px",
  },
  heading: {
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "40px",
    flexWrap: "wrap",
  },
  photoBox: {
    width: "300px",
    height: "300px",
    border: "5px solid orange",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
  },
  plus: {
    fontSize: "50px",
    color: "orange",
  },
  addPhotoText: {
    marginTop: "10px",
    color: "orange",
    fontSize: "18px",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  inputContainer: {
    width: "500px",
    backgroundColor: "#eae8e8",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  },
  inputTitle: {
    border: "none",
    borderBottom: "1px solid gray",
    padding: "10px",
    fontSize: "18px",
    marginBottom: "10px",
    backgroundColor: "#eae8e8",
    outline: "none",
  },
  textArea: {
    height: "400px",
    resize: "none",
    border: "none",
    backgroundColor: "#eae8e8",
    padding: "10px",
    fontSize: "16px",
    outline: "none",
  },
};

export default NewsWriter;