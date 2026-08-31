import BrandStrip from "@/components/BrandStrip";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import BestSellersSection from "@/components/BestSellersSection";
import DealBanners from "@/components/DealBanners";
import InfoStrip from "@/components/InfoStrip";

export default function HomePage() {
  return (
    <>
      <BrandStrip />
      <Hero />
      <CategoryGrid />
      <BestSellersSection />
      <DealBanners />
      <InfoStrip />
    </>
  );
}

