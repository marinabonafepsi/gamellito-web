import { Navbar } from '@/components/Navbar';
import { requireRole } from '@/lib/auth-helpers';

export const metadata = {
  title: 'Gamellito - Portal Profissional',
};

export default async function ProfissionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garantir que apenas profissional consegue acessar
  await requireRole('profissional');

  const navItems = [
    { label: 'Meus Pacientes', href: '/profissional/dashboard' },
    { label: 'Relatórios', href: '/profissional/relatorios' },
    { label: 'Recursos', href: '/profissional/recursos' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar portalType="profissional" navItems={navItems} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
