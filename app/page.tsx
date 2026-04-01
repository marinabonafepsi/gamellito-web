import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GamesSection from "@/components/GamesSection";
import SolutionsSection from "@/components/SolutionsSection";
import AwardsSection from "@/components/AwardsSection";
import PartnersSection from "@/components/PartnersSection";
import FooterSection from "@/components/FooterSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GamesSection />
      <SolutionsSection />
      <AwardsSection />
      <PartnersSection />
      <FooterSection />
    </div>
  );
}
