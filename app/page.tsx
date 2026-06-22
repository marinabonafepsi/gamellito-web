import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import AwardsSection from "@/components/AwardsSection";
import PartnersSection from "@/components/PartnersSection";
import ParceriaSection from "@/components/ParceriaSection";
import FooterSection from "@/components/FooterSection";
import EcosystemCTA from "@/components/EcosystemCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* 1. Hero — impacto imediato */}
      <HeroSection />
      {/* 2. O problema + A virada */}
      <AboutSection />
      {/* 3. Ecossistema CTA */}
      <EcosystemCTA />
      {/* 4. Prêmios */}
      <AwardsSection />
      {/* 5. Parceiros */}
      <PartnersSection />
      {/* 6. Seja um parceiro */}
      <ParceriaSection />
      <FooterSection />
    </div>
  );
}
