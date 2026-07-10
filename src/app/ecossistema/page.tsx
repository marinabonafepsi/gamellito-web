import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface Persona {
  id: string;
  tag: string;
  dotColor: string;
  art: string;
  surface: 'surface-creme' | 'surface-purple';
  title: string;
  description: string;
  features: Feature[];
  cta: string;
  href: string;
}

const personas: Persona[] = [
  {
    id: 'familia',
    tag: 'Família & DM1',
    dotColor: 'bg-game-pink',
    art: '/assets/gamellito-e-amigos.svg',
    surface: 'surface-creme',
    title: 'Pra quem cuida em casa',
    description:
      'Um diário que celebra o hábito de registrar — nunca o valor da glicemia. Cada registro vira moeda, e moeda vira recompensa de verdade.',
    features: [
      { icon: '/assets/gamellito-glicosimetro.svg', title: 'Diário sem julgamento', desc: 'Glicemia, alimentação e insulina, sem rótulos de "alto/baixo/normal"' },
      { icon: '/assets/gamellito-badge-circle.svg', title: 'Moedas Gamellito', desc: 'Cada registro rende moedas, trocáveis na Loja' },
      { icon: '/assets/balao-pensamento.svg', title: 'Compartilhamento por convite', desc: 'Dados visíveis pro profissional ou educador só com seu consentimento' },
      { icon: '/assets/controle-videogame.svg', title: 'Jogos e trilhas', desc: 'Aprendizado lúdico junto com o Gamellito' },
    ],
    cta: 'Entrar como família',
    href: '/auth/signup/familia',
  },
  {
    id: 'profissional',
    tag: 'Sou da Saúde',
    dotColor: 'bg-game-blue',
    art: '/assets/medico-mae-gamellito.svg',
    surface: 'surface-purple',
    title: 'Pra quem acompanha o cuidado clínico',
    description:
      'Visão dos pacientes que compartilharam dados com você, biblioteca de artigos científicos e materiais validados pro consultório.',
    features: [
      { icon: '/assets/gamellito-glicosimetro.svg', title: 'Painel de pacientes', desc: 'Dados dos pacientes e grupos que compartilharam acesso com você' },
      { icon: '/assets/gamellito-diary-scene.svg', title: 'Biblioteca de artigos', desc: 'Produção científica sobre DM1, curada e pesquisável' },
      { icon: '/assets/gamellito-seringa.svg', title: 'Materiais clínicos', desc: 'Recursos validados pra apoiar orientações no consultório' },
      { icon: '/assets/gamellito-badge-small.svg', title: 'Relatórios', desc: 'Acompanhamento de evolução por paciente' },
    ],
    cta: 'Entrar como saúde',
    href: '/auth/signup/profissional',
  },
  {
    id: 'educador',
    tag: 'Sou Educador',
    dotColor: 'bg-game-green',
    art: '/assets/gamellito-board-game.svg',
    surface: 'surface-creme',
    title: 'Pra quem educa em grupo',
    description:
      'Ferramentas pra levar o método Gamellito pra escola: turmas, atividades prontas e espaço pra trocar experiência com outros educadores.',
    features: [
      { icon: '/assets/gamellito-e-amigos.svg', title: 'Grupos e alunos', desc: 'Acompanhamento de alunos com DM1 na turma' },
      { icon: '/assets/gamellito-board-game.svg', title: 'Atividades prontas', desc: 'Recursos e materiais do método, prontos pra aplicar' },
      { icon: '/assets/balao-pensamento.svg', title: 'Fórum de educadores', desc: 'Espaço pra trocar experiência com outros educadores' },
    ],
    cta: 'Entrar como educador',
    href: '/auth/signup/educador',
  },
  {
    id: 'instituicao',
    tag: 'Sou de uma Instituição',
    dotColor: 'bg-orange',
    art: '/assets/gamellito-contente.svg',
    surface: 'surface-purple',
    title: 'Pra escolas e clínicas',
    description:
      'Implemente o método Gamellito com toda a sua equipe — gestão de grupos, equipe e relatórios agregados num só lugar.',
    features: [
      { icon: '/assets/gamellito-badge-circle.svg', title: 'Grupos e equipe', desc: 'Gestão centralizada da escola ou clínica' },
      { icon: '/assets/gamellito-glicosimetro.svg', title: 'Relatórios agregados', desc: 'Visão consolidada de uso e impacto' },
      { icon: '/assets/gamellito-contente.svg', title: 'Suporte à implementação', desc: 'Ajuda pra colocar o método em prática com a equipe' },
    ],
    cta: 'Entrar como instituição',
    href: '/auth/signup/instituicao',
  },
];

export default function EcossistemaPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <section className="surface surface-purple dots dots-cream sec-pad on-purple">
        <div className="wrap text-center max-w-[820px] mx-auto">
          <p className="eyebrow on-purple">Ecossistema Gamellito</p>
          <h1 className="h-lg text-white">
            Um app <span className="hl-sun">pra cada papel</span> no cuidado da criança.
          </h1>
          <p className="lead muted-c mt-4">
            Família, profissional de saúde, educador e instituição — cada um entra por uma porta diferente, mas todos trabalham com os mesmos dados, compartilhados por consentimento.
          </p>
        </div>
      </section>

      {personas.map((persona) => {
        const onPurple = persona.surface === 'surface-purple';
        return (
          <section
            key={persona.id}
            className={`surface ${persona.surface} dots ${onPurple ? 'dots-cream on-purple' : 'dots-purple'} sec-pad`}
          >
            <div className="wrap">
              <div className="grid md:grid-cols-2 items-center gap-14">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={`bd w-2.5 h-2.5 rounded-full border-2 border-ink ${persona.dotColor}`} />
                    <span className="tag" style={onPurple ? { color: 'var(--color-sun)' } : undefined}>{persona.tag}</span>
                  </div>
                  <h2 className={`h-lg ${onPurple ? 'text-white' : ''}`}>{persona.title}</h2>
                  <p className={`lead mt-4 ${onPurple ? 'muted-c' : 'muted'}`}>{persona.description}</p>

                  <div className="mt-6">
                    {persona.features.map((f) => (
                      <div className="feat" key={f.title}>
                        <span className="fic">
                          <Image src={f.icon} alt="" width={44} height={44} />
                        </span>
                        <div>
                          <div className="ft">{f.title}</div>
                          <div className="fd">{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link className="btn btn-orange" href={persona.href}>
                      {persona.cta}
                    </Link>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative bg-lilac-soft border-[3px] border-ink rounded-[28px] shadow-pop-lg pt-[34px] px-[30px] pb-0 w-full max-w-[420px] overflow-hidden">
                    <Image src={persona.art} alt="" width={420} height={340} className="w-full h-auto block" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="surface surface-sun py-16">
        <div className="wrap flex items-center justify-between gap-8 flex-wrap">
          <div className="flex-1 min-w-[420px]">
            <p className="eyebrow on-sun">Não sabe por onde começar?</p>
            <h2 className="h-lg">Escolha seu perfil e a gente te leva pro lugar certo.</h2>
          </div>
          <Link className="btn btn-purple" href="/auth/select-role">
            Escolher meu perfil
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
