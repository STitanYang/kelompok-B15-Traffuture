'use client';

import React, { useEffect, useState } from 'react';
import '../styles/TrendNews.css'; 

interface RawNewsItem {
  _id: string;
  title: string;
  content: string;
  imageBase64: string;
}

interface TrendCardProps {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
}

const TrendCard: React.FC<{ image: string; title: string }> = ({ image, title }) => {
  return (
    <div className="trend-card">
      <div className="trend-image-container">
        <img src={image} alt="Trend" className="trend-image" />
        <div className="trend-overlay">{title}</div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [trends, setTrends] = useState<TrendCardProps[]>([
    {
      _id: '1',
      title: 'Kemacetan Parah di Jakarta',
      content: 'Kemacetan terjadi di sepanjang Jalan Sudirman hingga Thamrin.',
      imageUrl: '/assets/macet.jpg',
    },
    {
      _id: '2',
      title: 'Kemacetan di Surabaya Timur',
      content: 'Kemacetan panjang akibat perbaikan jalan utama.',
      imageUrl: '/assets/macet.jpg',
    },
    {
      _id: '3',
      title: 'Macet Hari Libur di Bandung',
      content: 'Wisatawan memadati Lembang, menyebabkan kemacetan.',
      imageUrl: '/assets/macet.jpg',
    },
  ]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const rawData: RawNewsItem[] = await res.json();

        const processedData: TrendCardProps[] = await Promise.all(
          rawData.map(async (item) => {
            const base64Response = await fetch(`data:image/png;base64,${item.imageBase64}`);
            const blob = await base64Response.blob();
            const imageUrl = URL.createObjectURL(blob);

            return {
              _id: item._id,
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
      {/* Title with horizontal lines */}
      <div className="section-title-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ flex: 1, height: '0.5px', backgroundColor: 'black', marginRight: '1rem' }}></div>
        <h2 className="section-title" style={{ fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', margin: '0' }}>
          Indonesia Trends Topic
        </h2>
        <div style={{ flex: 1, height: '0.5px', backgroundColor: 'black', marginLeft: '1rem' }}></div>
      </div>
      <div className="grid-container">
        {trends.map((trend, index) => (
          <TrendCard key={index} image={trend.imageUrl} title={trend.title} />
        ))}
      </div>
    </div>
  );
  
};

export default HomePage;