import { notFound } from 'next/navigation';
import { MODULOS_DM1 } from '@/lib/modulos-content';
import { ModuloShell } from '@/components/dashboard/modulos/ModuloShell';
import { GlossarioFlip } from '@/components/dashboard/modulos/GlossarioFlip';
import { SequenciaGame } from '@/components/dashboard/modulos/SequenciaGame';
import { VideoModulo } from '@/components/dashboard/modulos/VideoModulo';
import { PratoGame } from '@/components/dashboard/modulos/PratoGame';
import { DecisaoGame } from '@/components/dashboard/modulos/DecisaoGame';
import { ChecklistGame } from '@/components/dashboard/modulos/ChecklistGame';
import { StepperModulo } from '@/components/dashboard/modulos/StepperModulo';
import { PdfModulo } from '@/components/dashboard/modulos/PdfModulo';

const VOLTAR_HREF = '/familia/aprendizado';

export default async function Page({ params }: { params: Promise<{ moduloId: string }> }) {
  const { moduloId } = await params;
  const modulo = MODULOS_DM1[moduloId.toLowerCase()];
  if (!modulo) notFound();

  return (
    <ModuloShell voltarHref={VOLTAR_HREF} titulo={modulo.titulo} moduloId={modulo.id}>
      {modulo.tipo === 'glossario' && <GlossarioFlip voltarHref={VOLTAR_HREF} />}
      {modulo.tipo === 'sequencia' && <SequenciaGame voltarHref={VOLTAR_HREF} />}
      {modulo.tipo === 'video' && <VideoModulo voltarHref={VOLTAR_HREF} />}
      {modulo.tipo === 'prato' && <PratoGame voltarHref={VOLTAR_HREF} />}
      {modulo.tipo === 'decisao' && <DecisaoGame voltarHref={VOLTAR_HREF} />}
      {modulo.tipo === 'checklist' && <ChecklistGame voltarHref={VOLTAR_HREF} />}
      {modulo.tipo === 'stepper' && <StepperModulo voltarHref={VOLTAR_HREF} />}
      {modulo.tipo === 'pdf' && <PdfModulo voltarHref={VOLTAR_HREF} />}
    </ModuloShell>
  );
}
