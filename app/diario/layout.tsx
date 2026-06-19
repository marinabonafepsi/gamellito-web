import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

export default function DiarioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF3C9] flex flex-col">
      <Navbar />

      {/* Aviso não-clínico */}
      <div className="border-b-[3px] border-[#2B2233] bg-[#FFC400] px-4 py-2.5 text-center text-sm font-body font-semibold text-[#2B2233]">
        📋 Este diário organiza registros para sua consulta — não substitui orientação médica.
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      <FooterSection />
    </div>
  );
}
