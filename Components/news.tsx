"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RawNewsItem {
  _id: string;
  title: string;
  content: string;
  imageBase64: string;
}

interface NewsCardItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const NewsCard = ({
  id,
  imageSrc,
  title,
  description,
}: {
  id: string;
  imageSrc: string;
  title: string;
  description: string;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/FullNews/${id}`);
  };

  const truncateText = (text: string, maxWords: number) => {
    const words = text.trim().split(/\s+/);
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10">
      <img
        src={imageSrc}
        alt="Berita"
        className="w-full md:w-64 h-auto object-cover rounded-md"
      />
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 text-justify mb-4">
          {truncateText(description, 25)}
        </p>
        <button
          onClick={handleClick}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          Baca Selengkapnya
        </button>
      </div>
    </div>
  );
};

const TrafficNewsSection = () => {
  const [articles, setArticles] = useState<NewsCardItem[]>([
    {
      _id: "1",
      title: "Macet di Bali",
      imageUrl: "/assets/macet.jpg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor.",
    },
    {
      _id: "2",
      title: "Kemacetan di Jakarta",
      imageUrl: "/assets/macet.jpg",
      description:
        "Seorang pengantin pria di Palembang, Sumatera Selatan, Ahmad Handa (30), dibacok dan ditembak ketika hendak melangsungkan pernikahannya. Motif kasus tersebut diduga akibat dendam pelaku pada enam tahun silam karena korban dianggap cepu oleh para pelaku.Dia ini menuduh aku jadi cepu (narkoba), tapi aku tidak merasa. Ini dendam lama, kejadiannya tahun 2019, ungkap Ahmad, dilansir detikSumbagsel, Senin (12/5/2025).Baca juga: Ngeri! Pria di Palembang Bacok dan Tembak Pengantin Pria yang Mau Akad"

    },
    {
     _id: "3",
      title: "Macet pada Hari Libur",
      imageUrl: "/assets/macet.jpg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor.",
    },
    {
      _id: "4",
      title: "Kemacetan Parah di Bandung",
      imageUrl: "/assets/macet.jpg",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor.",
    }
  ]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const rawData: RawNewsItem[] = await res.json();

        const processedData: NewsCardItem[] = await Promise.all(
          rawData.map(async (item) => {
            const base64Response = await fetch(
              `data:image/png;base64,${item.imageBase64}`
            );
            const blob = await base64Response.blob();
            const imageUrl = URL.createObjectURL(blob);

            return {
              _id: item._id,
              title: item.title,
              description: item.content,
              imageUrl,
            };
          })
        );

        setArticles(processedData);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {articles.map((item) => (
        <NewsCard
          key={item._id}
          id={item._id}
          imageSrc={item.imageUrl}
          title={item.title}
          description={item.description}
        />
      ))}
    </section>
  );
};

export default TrafficNewsSection;
