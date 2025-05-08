import React from "react";

const NewsCard = ({
  imageSrc,
  title,
  description,
  imageWidth = "w-[660px]",  // Default width is 128px
  imageHeight = "h-[300px]",  // Default height is 32px
}: {
  imageSrc: string;
  title: string;
  description: string;
  imageWidth?: string;
  imageHeight?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-10">
      {/* Gambar di atas */}
      <img
        src={imageSrc}
        alt="Berita"
        className={`${imageWidth} ${imageHeight} object-cover shadow-lg mb-4`}
      />
      {/* Teks di bawah gambar */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 text-justify mb-4">{description}</p>
      </div>
    </div>
  );
};

const TrafficNewsSection = () => {
  // Data artikel dengan gambar dan deskripsi dummy
  const articles = [
    {
      image: "/assets/macet.jpg", // Ganti dengan path gambar yang sesuai
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
       
    },
    // Artikel lain bisa ditambahkan di sini
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {articles.map((item, index) => (
        <NewsCard
          key={index}
          imageSrc={item.image} // Mendapatkan gambar dari array
          title={item.title} // Mendapatkan judul dari array
          description={item.description} // Menggunakan deskripsi dari array
         
        />
      ))}
    </section>
  );
};

export default TrafficNewsSection;
