"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface RawNewsItem {
  uuid: string;
  title: string;
  body: string;
  imageBase64: string;
}

interface NewsCardItem {
  uuid: string;
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

  const truncateText = (text: string | undefined, maxWords: number) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10">
      <Image
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

const ITEMS_PER_PAGE = 5;

const TrafficNewsSection = () => {
  const [articles, setArticles] = useState<NewsCardItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const currentData = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://20.168.209.228/news");
        const rawData: RawNewsItem[] = await res.json();

        const processedData: NewsCardItem[] = await Promise.all(
          rawData.map(async (item) => {
            let imageUrl = "";
            try {
              const base64Response = await fetch(`${item.imageBase64}`);
              const blob = await base64Response.blob();
              imageUrl = URL.createObjectURL(blob);
            } catch (err) {
              console.warn("Failed to convert imageBase64:", err);
              imageUrl = "/fallback-image.jpg";
            }

            return {
              uuid: item.uuid,
              title: item.title,
              description: item.body,
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
      {currentData.map((item) => (
        <NewsCard
          key={item.uuid}
          id={item.uuid}
          imageSrc={item.imageUrl}
          title={item.title}
          description={item.description}
        />
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default TrafficNewsSection;