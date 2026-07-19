import { PortalShell } from '@/components/dashboard/PortalShell';
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

  return (
    <PortalShell variant="saude" accountHref="/profissional/perfil">
      {children}
    </PortalShell>
  );
}
