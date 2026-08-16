import HeroCarousel from "./hero-carousel";
import VoiceBanner from "./voice-banner";
import TrustSignals from "./trust-signals";
import CategoriesSection from "./categories-section";
import FlashSaleSection from "./flash-sale-section";
import TodayDealsSection from "./deals-section";
import RecommendedSection from "./recommended-section";
import ProductSections from "./product-sections";
import PromoBanner from "./promo-banner";

const HomePage = () => {
  return (
    <div className="w-full space-y-6">
      {/* Hero Header */}
      <HeroCarousel />

      {/* 1. Voice AI Quick-Trigger Banner */}
      <VoiceBanner />

      {/* 2. Trust Signals & Social Proof Strip */}
      <TrustSignals />

      {/* Category Browsing */}
      <CategoriesSection />

      {/* 3. Flash Sale Deals with Ticking Countdown */}
      <FlashSaleSection />

      {/* Standard Daily Deals */}
      <TodayDealsSection />

      {/* 4. AI-Personalized Recommended Products */}
      <RecommendedSection />

      {/* Full Catalog Product Grid */}
      <ProductSections />

      {/* 6. High-Contrast Promo Coupon CTA Band */}
      <PromoBanner />
    </div>
  );
};

export default HomePage;
