import { notFound } from "next/navigation";
import Navbar from "@/Components/navbar";

interface Params {
  params: { id: string };
}

const getNewsItem = async (id: string) => {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/news/${id}`, {
cache: "no-store",
      });
  if (!res.ok) return null;

  return res.json();
};

export default async function FullNewsPage({ params }: Params) {
  const newsItem = await getNewsItem(params.id);

  if (!newsItem) {
    notFound(); // Jika data tidak ditemukan, tampilkan halaman 404
  }

  return (
    <div>
      <Navbar /> {/* Tambahkan Navbar di sini */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
        <img
          src={`data:image/png;base64,${newsItem.imageBase64}`}
          alt={newsItem.title}
          className="w-full h-auto object-cover mb-4"
        />
        <p className="text-gray-700 whitespace-pre-line">{newsItem.content}</p>
      </div>
    </div>
  );
}
