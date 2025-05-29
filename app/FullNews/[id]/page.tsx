import { notFound } from "next/navigation";
import Navbar from "@/Components/navbar";
import Image from "next/image";

const getNewsItem = async (id: string) => {
  const res = await fetch(`http://20.168.209.228/news/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
};

export default async function FullNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params 
  const newsItem = await getNewsItem(id);

  if (!newsItem) {
    notFound(); // Jika data tidak ditemukan, tampilkan halaman 404
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
        <Image
          src={newsItem.imageBase64}
          alt={newsItem.title}
          className="w-full h-auto object-cover mb-4"
        />
        <p>{newsItem.body}</p>
      </div>
    </div>
  );
}
