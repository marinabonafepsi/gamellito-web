import { PortalShell } from '@/components/dashboard/PortalShell';
import { requireRole } from '@/lib/auth-helpers';

export const metadata = {
  title: 'Gamellito - Portal Educador',
};

export default async function EducadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garantir que apenas educador consegue acessar
  await requireRole('educador');

  return (
    <PortalShell variant="prof" accountHref="/educador/perfil">
      {children}
    </PortalShell>
  );
}
