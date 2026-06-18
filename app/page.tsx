import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GamesSection from "@/components/GamesSection";
import AtividadesSection from "@/components/AtividadesSection";
import SolutionsSection from "@/components/SolutionsSection";
import AwardsSection from "@/components/AwardsSection";
import PartnersSection from "@/components/PartnersSection";
import ParceriaSection from "@/components/ParceriaSection";
import FooterSection from "@/components/FooterSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* 1. Hero — impacto imediato */}
      <HeroSection />
      {/* 2. O problema + A virada */}
      <AboutSection />
      {/* 3. Jogos — ecossistema lúdico */}
      <GamesSection />
      {/* 4. Como funciona — 3 passos do método */}
      <AtividadesSection />
      {/* 5. O que fazemos (3 frentes) + Para quem é + Credibilidade */}
      <SolutionsSection />
      {/* 5. Prêmios */}
      <AwardsSection />
      {/* 6. Parceiros */}
      <PartnersSection />
      {/* 7. Seja um parceiro */}
      <ParceriaSection />
      <FooterSection />
    </div>
  );
}
