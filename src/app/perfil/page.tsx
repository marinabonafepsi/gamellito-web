import { redirect } from 'next/navigation';
import { getUser, getUserRole } from '@/lib/auth-helpers';

const PERFIL_BY_ROLE: Record<string, string> = {
  familia: '/familia/perfil',
  dm1: '/familia/perfil',
  profissional: '/profissional/perfil',
  educador: '/educador/perfil',
};

export default async function PerfilRedirectPage() {
  const user = await getUser();
  if (!user) {
    redirect('/auth/login');
  }

  const role = await getUserRole();
  redirect((role && PERFIL_BY_ROLE[role]) || '/familia/perfil');
}
