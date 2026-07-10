import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gamellito — A gente transforma o difícil em aventura',
  description:
    'Educação em saúde lúdica que transforma o cuidado de crianças, adolescentes e famílias que convivem com o diabetes tipo 1.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
