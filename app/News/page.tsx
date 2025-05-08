import Navbar from "@/Components/navbar";
import News from "@/Components/news"

const news: React.FC = () => {
    return (
      <div>
        <Navbar />
        <h1 className=" text-3xl font-bold mb-5 text-center mt-7">Berita Lalu Lintas</h1>

        <News />
        </div>
  );
}

export default news;

