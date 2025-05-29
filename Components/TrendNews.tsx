'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Correct import for useRouter
import '../styles/TrendNews.css';
import Image from 'next/image';

interface RawNewsItem {
  uuid: string;
  title: string;
  content: string;
  imageBase64: string;
}

interface TrendCardProps {
  uuid: string;
  title: string;
  content: string;
  imageUrl: string;
}

const TrendCard: React.FC<{ image: string; title: string; onClick: () => void }> = ({ image, title, onClick }) => {
  return (
    <div className="trend-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="trend-image-container">
        <Image src={image} alt="Trend" className="trend-image" />
        <div className="trend-overlay">{title}</div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [trends, setTrends] = useState<TrendCardProps[]>([]);
  const router = useRouter();  // Hook to get the router instance

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('http://localhost:9999/news'); // Update your API endpoint
        const rawData: RawNewsItem[] = await res.json();

        // Get the last 4 items from the fetched data
        const lastFour = rawData.slice(-4);

        const processedData: TrendCardProps[] = await Promise.all(
          lastFour.map(async (item) => {
            let imageUrl = '';
            try {
              const base64Response = await fetch(`${item.imageBase64}`);
              const blob = await base64Response.blob();
              imageUrl = URL.createObjectURL(blob);
            } catch (err) {
              console.warn('Failed to process image:', err);
              imageUrl = '/fallback-image.jpg';  // Fallback image in case of error
            }

            return {
              uuid: item.uuid,
              title: item.title,
              content: item.content,
              imageUrl,
            };
          })
        );

        setTrends(processedData);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="container">
      <div className="section-title-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ flex: 1, height: '0.5px', backgroundColor: 'black', marginRight: '1rem' }}></div>
        <h2 className="section-title" style={{ fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', margin: '0' }}>
          Indonesia Trends Topic
        </h2>
        <div style={{ flex: 1, height: '0.5px', backgroundColor: 'black', marginLeft: '1rem' }}></div>
      </div>

      <div className="grid-container text-wrap">
        {trends.map((trend) => (
          <TrendCard
            key={trend.uuid}
            image={trend.imageUrl}
            title={trend.title}
            onClick={() => router.push(`/FullNews/${trend.uuid}`)} // Correct navigation
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;