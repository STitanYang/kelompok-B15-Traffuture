import React from "react";

// Komponen NewsCard
const NewsCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10">
      <img
        src={imageSrc}
        alt="Berita"
        className="w-full md:w-64 h-auto object-cover rounded-md"
      />
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 text-justify mb-4">{description}</p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2">
          Baca Selengkapnya
        </button>
      </div>
    </div>
  );
};

// Komponen TrafficNewsSection
const TrafficNewsSection = () => {
  // Data artikel dalam array
  const articles = [
    { image: "/assets/macet.jpg", tittle: "Macet di Bali", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor."},
    { image: "/assets/macet.jpg", tittle: "Kemacetan di Jakarta", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor." },
    { image: "/assets/macet.jpg", tittle: "Macet pada Hari Libur", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor." },
    { image: "/assets/macet.jpg", tittle: "Kemacetan Parah di Bandung", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nunc et felis pretium feugiat. Vivamus vitae turpis eu orci sollicitudin tempor." },
  ];

  //
  

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {articles.map((item, index) => (
        <NewsCard
          key={index}
          imageSrc={item.image} // Mendapatkan image dari array
          title={item.tittle} // Mendapatkan judul dari array
          description={item.description} // Menggunakan dummy text untuk deskripsi
        />
      ))}
    </section>
  );
};

export default TrafficNewsSection;
