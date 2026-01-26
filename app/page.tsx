import BrandStory from "./HomePage/components/BrandStory";
import CategoryGrid from "./HomePage/components/CategoryGrid";
import Header from "./HomePage/components/Header";
import HeroSection from "./HomePage/components/HeroSectoin";
import NewArrivals from "./HomePage/components/NewArrivals";
import Newsletter from "./HomePage/components/Newsletter";
import Footer from "./HomePage/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NewArrivals />
        <CategoryGrid />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
