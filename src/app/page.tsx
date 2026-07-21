import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollToHash } from '@/components/ScrollToHash';

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

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <ScrollToHash />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero surface relative min-h-screen md:min-h-[calc(100vh-90px)] flex items-center overflow-hidden bg-gamellito-space pt-[110px] md:pt-0 md:-mt-[90px]">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/hero-space-bg.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[rgba(43,27,82,0.45)]" />
        </div>
        <span className="star absolute rounded-full bg-sun z-[1] animate-twinkle" style={{ top: '18%', left: '12%', width: 4, height: 4 }} />
        <span className="star absolute rounded-full bg-sun z-[1] animate-twinkle" style={{ top: '30%', left: '78%', width: 5, height: 5, animationDelay: '.6s' }} />
        <span className="star absolute rounded-full bg-sun z-[1] animate-twinkle" style={{ top: '62%', left: '24%', width: 3, height: 3, animationDelay: '1.1s' }} />
        <span className="star absolute rounded-full bg-sun z-[1] animate-twinkle" style={{ top: '44%', left: '56%', width: 4, height: 4, animationDelay: '1.6s' }} />
        <span className="star absolute rounded-full bg-sun z-[1] animate-twinkle" style={{ top: '74%', left: '84%', width: 5, height: 5, animationDelay: '.3s' }} />
        <span className="star absolute rounded-full bg-sun z-[1] animate-twinkle" style={{ top: '16%', left: '46%', width: 3, height: 3, animationDelay: '2s' }} />

        <div className="wrap relative z-[2] flex items-center gap-12 flex-wrap py-10">
          <div className="flex-1 min-w-[440px]">
            <h1 className="h-xl text-white">Aprender a se cuidar pode ser uma <span className="hl-sun">aventura</span>.</h1>
            <div className="relative bg-purple-deep border-[3px] border-ink rounded-[22px] shadow-pop text-white font-body text-lg leading-relaxed max-w-[560px] my-5 px-5 py-4">
              Trilhas de aprendizado, diário de glicemia e conquistas. Para crianças, adolescentes, pais, educadores e equipe de saúde, cada um na sua jornada com o diabetes.
            </div>
            <div className="flex gap-3.5 flex-wrap">
              <Link className="btn btn-orange" href="/auth/select-role">Criar conta grátis</Link>
              <a className="btn btn-cream" href="#ecossistema">Ver o ecossistema ↓</a>
            </div>
          </div>
          <div className="flex-1 min-w-[360px] flex justify-center">
            <Image
              src="/assets/gamellito-hero-gigante.svg"
              alt="Gamellito"
              width={440}
              height={440}
              className="w-full max-w-[440px] h-auto"
              style={{ filter: 'drop-shadow(6px 8px 0 rgba(0,0,0,.35))' }}
            />
          </div>
        </div>
      </section>

      {/* ===== ECOSSISTEMA ===== */}
      <section id="ecossistema" className="surface surface-purple sec-pad on-purple scroll-mt-24">
        <div className="wrap">
          <div className="text-center max-w-[820px] mx-auto">
            <p className="eyebrow on-purple">Ecossistema Gamellito</p>
            <h2 className="h-lg text-white">
              Um app <span className="hl-sun">pra cada papel</span> no cuidado da criança.
            </h2>
            <p className="lead muted-c mt-4">
              Família, profissional de saúde, educador e instituição — cada um entra por uma porta diferente, mas todos trabalham com os mesmos dados, compartilhados por consentimento.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px] mt-10">
            <div className="stat"><div className="num">+2.000</div><div className="lbl">famílias acompanhadas</div></div>
            <div className="stat"><div className="num">12 anos</div><div className="lbl">de pesquisa e método</div></div>
            <div className="stat"><div className="num">USP + UEL</div><div className="lbl">validação científica</div></div>
            <div className="stat"><div className="num">3 prêmios</div><div className="lbl">internacionais</div></div>
          </div>
        </div>
      </section>

      {personas.map((persona) => {
        const onPurple = persona.surface === 'surface-purple';
        return (
          <section
            key={persona.id}
            className={`surface ${persona.surface} sec-pad ${onPurple ? 'on-purple' : ''}`}
          >
            <div className="wrap">
              <div className="grid md:grid-cols-2 items-center gap-14">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={`bd w-2.5 h-2.5 rounded-full border-2 border-ink ${persona.dotColor}`} />
                    <span className="tag" style={onPurple ? { color: 'var(--color-sun)' } : undefined}>{persona.tag}</span>
                  </div>
                  <h3 className={`h-lg ${onPurple ? 'text-white' : ''}`}>{persona.title}</h3>
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

      {/* ===== SOBRE ===== */}
      <section id="sobre" className="surface surface-creme sec-pad scroll-mt-24">
        <div className="wrap max-w-4xl">
          <p className="eyebrow on-creme">Sobre a gente</p>
          <h2 className="h-lg mb-8">
            Sobre <span className="hl-orange">Gamellito</span>
          </h2>

          <div className="space-y-8 text-ink">
            <section>
              <h3 className="h-md text-purple mb-4">Nossa Missão</h3>
              <p className="lead leading-relaxed">
                Gamellito é uma plataforma gamificada de saúde digital que torna o acompanhamento de crianças com Diabetes Mellitus Tipo 1 (DM1) uma experiência divertida e envolvente. Conectamos famílias, profissionais de saúde e educadores em um ecossistema colaborativo.
              </p>
            </section>

            <section>
              <h3 className="h-md text-purple mb-4">Como Funciona</h3>
              <div className="card flex items-center justify-between gap-6 flex-wrap">
                <p className="max-w-[520px]">
                  Família, profissional de saúde, educador e instituição — cada papel tem sua própria porta de entrada e suas próprias ferramentas dentro do Gamellito.
                </p>
                <a className="btn btn-orange" href="#ecossistema">Ver o ecossistema completo</a>
              </div>
            </section>

            <section>
              <h3 className="h-md text-purple mb-4">Nossos Valores</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 bullet !mt-0">
                  <span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-orange mt-1.5" />
                  <div>
                    <strong className="text-purple">Saúde em Primeiro Lugar</strong>
                    <p>Todas as funcionalidades são baseadas em evidências e diretrizes médicas.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bullet">
                  <span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-game-blue mt-1.5" />
                  <div>
                    <strong className="text-purple">Colaboração</strong>
                    <p>Famílias, profissionais e educadores trabalham juntos.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bullet">
                  <span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-game-green mt-1.5" />
                  <div>
                    <strong className="text-purple">Segurança e Privacidade</strong>
                    <p>Conformidade total com LGPD e padrões de proteção de dados.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bullet">
                  <span className="bd w-2.5 h-2.5 rounded-full border-2 border-ink bg-game-pink mt-1.5" />
                  <div>
                    <strong className="text-purple">Diversão</strong>
                    <p>A saúde não precisa ser chata. Gamificação torna o cuidado engajante.</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      {/* ===== SUN: CTA band ===== */}
      <section className="surface surface-sun py-16">
        <div className="wrap flex items-center justify-between gap-8 flex-wrap">
          <div className="flex-1 min-w-[420px]">
            <p className="eyebrow on-sun">A gente vai junto</p>
            <h2 className="h-lg">Crie a conta e comece a <span className="hl-purple">primeira trilha</span> hoje.</h2>
          </div>
          <Link className="btn btn-purple" href="/auth/select-role">Começar agora</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
