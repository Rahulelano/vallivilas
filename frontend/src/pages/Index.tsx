import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategorySection from "@/components/CategorySection";
import TopSellers from "@/components/TopSellers";
import FreshArrivals from "@/components/FreshArrivals";
import PromoBanners from "@/components/PromoBanners";
import TrustBadges from "@/components/TrustBadges";
import OurStory from "@/components/OurStory";
import MediaRecognition from "@/components/MediaRecognition";
import CustomerReviews from "@/components/CustomerReviews";
import InstagramSection from "@/components/InstagramSection";
import Footer from "@/components/Footer";
import PromoPopup from "@/components/PromoPopup";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { data: appearance } = useQuery({
    queryKey: ["appearance"],
    queryFn: async () => {
      const response = await fetch("/api/appearance");
      return response.json();
    }
  });

  // Generate dynamic CSS variables
  const dynamicStyles = appearance?.map((item: any) => `
    :root {
      --bg-${item.section}: ${item.backgroundColor};
      --text-${item.section}: ${item.textColor};
    }
    .${item.section}-section {
      background-color: var(--bg-${item.section}) !important;
      color: var(--text-${item.section}) !important;
    }
  `).join('\n') || '';

  return (
    <div className="min-h-screen bg-background">
      <style>{dynamicStyles}</style>
      <AnnouncementBar />
      <Header />
      <PromoPopup />
      <main>
        <HeroBanner />
        <CategorySection />
        <TopSellers />
        <FreshArrivals />
        <PromoBanners />
        <TrustBadges />
        <OurStory />
        <MediaRecognition />
        <CustomerReviews />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
