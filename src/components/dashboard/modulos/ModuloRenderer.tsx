import type { ModuloDef } from '@/lib/modulos-content';
import { GlossarioFlip } from './GlossarioFlip';
import { SequenciaGame } from './SequenciaGame';
import { VideoModulo } from './VideoModulo';
import { PratoGame } from './PratoGame';
import { DecisaoGame } from './DecisaoGame';
import { ChecklistGame } from './ChecklistGame';
import { StepperModulo } from './StepperModulo';
import { MochilaGame } from './MochilaGame';
import { ArtigoModulo } from './ArtigoModulo';
import { PdfModulo } from './PdfModulo';

// Renderiza o jogo certo para um módulo, dado seu tipo. Compartilhado pelas
// rotas /familia, /educador e /profissional de aprendizado — cada uma só
// precisa resolver o ModuloDef certo (de qual registry) e delegar aqui.
export function ModuloRenderer({ modulo }: { modulo: ModuloDef }) {
  switch (modulo.tipo) {
    case 'glossario':
      return <GlossarioFlip />;
    case 'sequencia':
      return <SequenciaGame moduloId={modulo.id} />;
    case 'video':
      return <VideoModulo moduloId={modulo.id} />;
    case 'prato':
      return <PratoGame moduloId={modulo.id} />;
    case 'decisao':
      return <DecisaoGame moduloId={modulo.id} />;
    case 'checklist':
      return <ChecklistGame />;
    case 'stepper':
      return <StepperModulo moduloId={modulo.id} />;
    case 'mochila':
      return <MochilaGame moduloId={modulo.id} />;
    case 'artigo':
      return <ArtigoModulo moduloId={modulo.id} />;
    case 'pdf':
      return <PdfModulo />;
    default:
      return null;
  }
}
