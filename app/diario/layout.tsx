import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import "./diario.css";

export default function DiarioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFF3C9" }}>
      <Navbar />

      {/* Aviso não-clínico — obrigatório em todas as telas do diário (REGRA Nº 1) */}
      <div className="ds-disclaimer">
        Este diário ajuda a organizar os registros para a sua consulta. Ele não substitui
        orientação médica e não interpreta os valores. Em caso de dúvida, fale com a
        equipe de saúde do seu filho.
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      <FooterSection />
    </div>
  );
}
