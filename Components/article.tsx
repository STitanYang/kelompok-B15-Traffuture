"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FullNews = () => {
  const [newsItem, setNewsItem] = useState<any>(null); // Menyimpan data berita detail
  const { query } = useRouter(); // Mengambil ID dari URL
  const { id } = query;

  useEffect(() => {
    if (id) {
      const fetchNewsItem = async () => {
        try {
          const res = await fetch(`pages/api/FullNews/${id}`);
          const data = await res.json();
          setNewsItem(data); // Set data berita yang diterima
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      };

      fetchNewsItem();
    }
  }, [id]);

  if (!newsItem) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
      <img
        src={`data:image/png;base64,${newsItem.imageBase64}`} // Menampilkan gambar berdasarkan Base64
        alt={newsItem.title}
        className="w-full h-auto object-cover mb-4"
      />
      <p className="text-gray-700">{newsItem.content}</p>
    </div>
  );
};

export default FullNews;
