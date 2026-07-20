import { notFound } from 'next/navigation';
import { MODULOS_SAUDE } from '@/lib/modulos-content-saude';
import { ModuloShell } from '@/components/dashboard/modulos/ModuloShell';
import { ModuloRenderer } from '@/components/dashboard/modulos/ModuloRenderer';

const VOLTAR_HREF = '/profissional/aprendizado';

export default async function Page({ params }: { params: Promise<{ moduloId: string }> }) {
  const { moduloId } = await params;
  const modulo = MODULOS_SAUDE[moduloId.toLowerCase()];
  if (!modulo) notFound();

  return (
    <ModuloShell voltarHref={VOLTAR_HREF} titulo={modulo.titulo} moduloId={modulo.id}>
      <ModuloRenderer modulo={modulo} />
    </ModuloShell>
  );
}
