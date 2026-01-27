import BrandStory from "./HomePage/components/BrandStory";
import CategoryGrid from "./HomePage/components/CategoryGrid";
import Header from "./HomePage/components/Header";
import HeroSection from "./HomePage/components/HeroSectoin";
import NewProducts from "./HomePage/components/NewProducts";
import Newsletter from "./HomePage/components/Newsletter";
import Footer from "./HomePage/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NewProducts />
        <CategoryGrid />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
