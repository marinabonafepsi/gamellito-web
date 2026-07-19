import { AprendizadoMapa } from '@/components/dashboard/AprendizadoMapa';
import { ProgressoVinculado } from '@/components/dashboard/ProgressoVinculado';
import { TRILHAS_DM1_FAMILIA, TRILHAS_DM1_CRIANCA } from '@/lib/trilhas-data';
import { getUserRole } from '@/lib/auth-helpers';

export default async function Page() {
  const role = await getUserRole();
  const isDm1 = role === 'dm1';

  const trilhas = isDm1 ? TRILHAS_DM1_CRIANCA : TRILHAS_DM1_FAMILIA;
  const titulo = isDm1 ? 'Trilha Criança/Adolescente' : 'Trilha Família';

  return (
    <>
      <AprendizadoMapa
        titulo={titulo}
        trilhas={trilhas}
        contImg="/assets/gamellito-glicosimetro.svg"
        contTitle={isDm1 ? 'Como sei que preciso comer algo doce' : 'Rotina diária: glicemia, insulina e refeições'}
        contMeta={`${titulo} · nível Primeiros passos`}
        contPct="60%"
        contHref={isDm1 ? '/familia/aprendizado/b1' : '/familia/aprendizado/a2'}
      />
      {!isDm1 && <ProgressoVinculado />}
    </>
  );
}
