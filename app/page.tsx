import BrandStory from "./HomePage/components/BrandStory";
import CategoryGrid from "./HomePage/components/CategoryGrid";
import Header from "./HomePage/components/Header";
import HeroSection from "./HomePage/components/HeroSectoin";
import NewProducts from "./HomePage/components/NewProducts";
import BestSellers from "./HomePage/components/BestSellers";
import FlashSale from "./HomePage/components/FlashSale";
import Newsletter from "./HomePage/components/Newsletter";
import Footer from "./HomePage/components/Footer";
import WelcomePopup from "./HomePage/components/WelcomePopup";
import LoyaltyShowcase from "./HomePage/components/LoyaltyShowcase";

export default function Home() {
  return (
    <>
      <WelcomePopup />
      <Header />
      <main>
        <HeroSection />
        <FlashSale />
        <NewProducts />
        <BestSellers />
        <CategoryGrid />
        <BrandStory />
        <LoyaltyShowcase />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
