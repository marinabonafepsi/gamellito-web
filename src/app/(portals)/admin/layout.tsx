import { Navbar } from '@/components/Navbar';
import { requireRole } from '@/lib/auth-helpers';

export const metadata = {
  title: 'Gamellito - Portal Admin',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garantir que apenas admin consegue acessar (defesa em profundidade —
  // o middleware já bloqueia /admin/*, isso cobre o caso de o middleware
  // ser contornado ou desatualizado).
  await requireRole('admin');

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Loja', href: '/admin/loja' },
    { label: 'Jogos', href: '/admin/jogos' },
    { label: 'Feature Flags', href: '/admin/feature-flags' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar portalType="admin" navItems={navItems} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
