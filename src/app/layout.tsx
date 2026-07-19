import type { Metadata, Viewport } from 'next';
import './globals.css';
import { VisitTracker } from '@/components/VisitTracker';

export const metadata: Metadata = {
  title: 'Gamellito — A gente transforma a rotina em aventura',
  description:
    'A gente transforma o cuidado de crianças, adolescentes e famílias que convivem com o diabetes tipo 1.',
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
      <body>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
