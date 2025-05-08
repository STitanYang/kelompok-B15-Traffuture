"use client";
import React, { useState } from "react";
import '../styles/TrendNews.css'; 

interface TrendCardProps {
  image: string;
  title: string;
}

const TrendCard: React.FC<TrendCardProps> = ({ image, title }) => {
  return (
    <div className="trend-card">
      <div className="trend-image-container">
        <img src={image} alt="Trend" className="trend-image" />
        <div className="trend-overlay">{title}</div>
      </div>
    </div>
  );
};

const IndonesiaTrends: React.FC = () => {
  const [trends, setTrends] = useState<TrendCardProps[]>([
    { image: "/assets/macet.jpg", title: "Macet di" },
    { image: "/assets/macet.jpg", title: "Kemacetan Parah di Bandung" },
    { image: "/assets/macet.jpg", title: "Kemacetan di Surabaya" },
    { image: "/assets/macet.jpg", title: "Macet di Bali" },
    { image: "/assets/macet.jpg", title: "Kemacetan di Jakarta Pusat" },
    { image: "/assets/macet.jpg", title: "Macet pada Hari Libur" },
    { image: "/assets/macet.jpg", title: " Menyebabkan Polusi" },
    { image: "/assets/macet.jpg", title: "Kemacetan di Jakarta Barat" },
    { image: "/assets/macet.jpg", title: "Kemacetan di Jakarta Barat" },
  ]);

  return (
    <div className="max-w-6xl mx-auto py-8">
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
          <TrendCard key={index} image={trend.image} title={trend.title} />
        ))}
      </div>
    </div>
  );
};

export default IndonesiaTrends;
