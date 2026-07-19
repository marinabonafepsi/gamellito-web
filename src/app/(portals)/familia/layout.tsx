import { PortalShell } from '@/components/dashboard/PortalShell';
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

  return (
    <PortalShell variant="dm1" accountHref="/familia/perfil">
      {children}
    </PortalShell>
  );
}
