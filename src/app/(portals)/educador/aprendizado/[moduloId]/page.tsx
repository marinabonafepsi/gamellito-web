import { notFound } from 'next/navigation';
import { MODULOS_PROF } from '@/lib/modulos-content-prof';
import { ModuloShell } from '@/components/dashboard/modulos/ModuloShell';
import { ModuloRenderer } from '@/components/dashboard/modulos/ModuloRenderer';

const VOLTAR_HREF = '/educador/aprendizado';

export default async function Page({ params }: { params: Promise<{ moduloId: string }> }) {
  const { moduloId } = await params;
  const modulo = MODULOS_PROF[moduloId.toLowerCase()];
  if (!modulo) notFound();

  return (
    <ModuloShell voltarHref={VOLTAR_HREF} titulo={modulo.titulo} moduloId={modulo.id}>
      <ModuloRenderer modulo={modulo} />
    </ModuloShell>
  );
}
