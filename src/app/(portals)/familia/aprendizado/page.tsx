import { AprendizadoMapa } from '@/components/dashboard/AprendizadoMapa';
import { TRILHAS_DM1_FAMILIA, TRILHAS_DM1_CRIANCA } from '@/lib/trilhas-data';

export default function Page() {
  return (
    <AprendizadoMapa
      familia={TRILHAS_DM1_FAMILIA}
      crianca={TRILHAS_DM1_CRIANCA}
      contImg="/assets/gamellito-glicosimetro.svg"
      contTitle="Rotina diária: glicemia, insulina e refeições"
      contMeta="Trilha Família · nível Primeiros passos"
      contPct="60%"
      contHref="/familia/aprendizado/a2"
    />
  );
}
