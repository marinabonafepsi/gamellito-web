import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gamellito Ltda – Jogos e soluções em saúde",
  description:
    "Plataforma Gamellito Ltda: jogos digitais e materiais lúdicos para educação em saúde no diabetes tipo 1.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
