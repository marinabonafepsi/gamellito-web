import { Navbar } from '@/components/Navbar';
import { requireRole } from '@/lib/auth-helpers';

export const metadata = {
  title: 'Gamellito - Portal Família',
};

export default async function FamiliaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garantir que apenas familia/dm1 consegue acessar
  await requireRole(['familia', 'dm1']);

  const navItems = [
    { label: 'Dashboard', href: '/familia/dashboard' },
    { label: 'Meu Diário', href: '/familia/diario' },
    { label: 'Jogos', href: '/jogos' },
    { label: 'Loja', href: '/loja' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar portalType="familia" navItems={navItems} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
