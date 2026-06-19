import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

export const metadata: Metadata = {
  title: "Gamellito Ltda – Jogos e soluções em saúde",
  description:
    "Plataforma Gamellito Ltda: jogos digitais e materiais lúdicos para educação em saúde no diabetes tipo 1.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#FFC400" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Gamellito" />
      </head>
      <body className="min-h-screen antialiased">
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
