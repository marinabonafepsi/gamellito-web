import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

export default function DiarioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gamellito-space flex flex-col">
      <Navbar />

      {/* Aviso não-clínico — obrigatório em todas as telas do diário */}
      <div
        className="bg-gamellito-yellow/20 border-b border-gamellito-yellow/40 px-4 py-3 text-center text-sm font-body"
        style={{ color: "hsl(var(--foreground))" }}
      >
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
