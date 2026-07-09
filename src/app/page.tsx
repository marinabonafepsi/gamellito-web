import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ===== HERO (espaço) ===== */}
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
            <p className="eyebrow" style={{ color: '#F26A00' }}>Educação em saúde lúdica</p>
            <h1 className="h-xl text-white">A gente transforma o difícil em <span className="hl-sun">aventura</span>.</h1>
            <div className="relative bg-purple-deep border-[3px] border-ink rounded-[22px] shadow-pop text-white font-body text-lg leading-relaxed max-w-[560px] my-5 px-5 py-4">
              Educação em saúde lúdica que transforma o cuidado de crianças, adolescentes e famílias que convivem com o diabetes tipo 1.
            </div>
            <div className="flex gap-3.5 flex-wrap">
              <Link className="btn btn-orange" href="/sobre">Conheça os programas</Link>
              <Link className="btn btn-cream" href="/contato">Seja um parceiro</Link>
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

      {/* ===== CREME: o problema ===== */}
      <section className="surface surface-creme dots dots-purple sec-pad">
        <div className="cluster" style={{ top: 40, right: 60 }}>
          <span className="d bg-game-pink" />
          <span className="d bg-game-blue" />
          <span className="d bg-sun" />
        </div>
        <div className="wrap">
          <div className="grid md:grid-cols-2 items-center gap-14">
            <div>
              <p className="eyebrow on-creme">O problema</p>
              <h2 className="h-lg">Informação não muda comportamento. <span className="hl-orange">Experiência sim.</span></h2>
              <p className="lead muted mt-5">
                Viver com diabetes na infância é lidar, todos os dias, com escolhas que assustam adultos. A informação existe — o que falta é{' '}
                <strong className="text-ink">vontade de cuidar</strong>. E vontade não nasce do medo.
              </p>
              <p className="lead muted mt-4">
                Crianças e adolescentes precisam de adesão sustentada ao cuidado. A gente transforma isso em algo afetivo, leve e — principalmente — duradouro.
              </p>
              <div className="flex gap-3.5 flex-wrap mt-6">
                <Link className="btn btn-orange" href="/sobre">Nossa proposta</Link>
                <Link className="btn btn-cream" href="/sobre">Ver o método</Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative bg-lilac-soft border-[3px] border-ink rounded-[28px] shadow-pop-lg pt-[34px] px-[30px] pb-0 w-full max-w-[440px] overflow-hidden">
                <div className="cluster" style={{ top: 18, left: 20 }}>
                  <span className="d bg-game-pink" style={{ width: 14, height: 14 }} />
                  <span className="d bg-sun" style={{ width: 14, height: 14 }} />
                </div>
                <Image src="/assets/gamellito-e-amigos.svg" alt="Gamellito e amigos" width={440} height={360} className="w-full h-auto block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ROXO: a virada + jornada + stats ===== */}
      <section className="surface surface-purple dots dots-cream sec-pad on-purple">
        <div className="wrap">
          <div className="text-center max-w-[820px] mx-auto">
            <p className="eyebrow on-purple">Nossa proposta de valor</p>
            <h2 className="h-lg text-white">
              A gente não ensina sobre diabetes. <span className="hl-sun">A gente faz a criança querer cuidar de si.</span>
            </h2>
            <p className="lead muted-c mt-4">
              Do susto do diagnóstico à adaptação: unimos jogo, narrativa e ilustração a uma base psicológica real para atravessar cada fase junto com a família.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3.5">
            <div className="jcard">
              <Image src="/assets/gamellito-diagnostico-medo.svg" alt="" width={96} height={96} className="mx-auto" />
              <div className="jt">Medo</div>
              <div className="jd">o diagnóstico assusta</div>
            </div>
            <div className="jcard">
              <Image src="/assets/gamellito-diagnostico-raiva.svg" alt="" width={96} height={96} className="mx-auto" />
              <div className="jt">Raiva</div>
              <div className="jd">"por que comigo?"</div>
            </div>
            <div className="jcard">
              <Image src="/assets/gamellito-diagnostico-tristeza.svg" alt="" width={96} height={96} className="mx-auto" />
              <div className="jt">Tristeza</div>
              <div className="jd">a rotina pesa</div>
            </div>
            <div className="jcard">
              <Image src="/assets/gamellito-diagnostico-adaptacao.svg" alt="" width={96} height={96} className="mx-auto" />
              <div className="jt">Adaptação</div>
              <div className="jd">o cuidado vira jogo</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px] mt-[34px]">
            <div className="stat"><div className="num">2.000+</div><div className="lbl">crianças impactadas</div></div>
            <div className="stat"><div className="num">77%</div><div className="lbl">menos idas à emergência</div></div>
            <div className="stat"><div className="num">5</div><div className="lbl">prêmios internacionais</div></div>
            <div className="stat"><div className="num">12+</div><div className="lbl">anos de pesquisa</div></div>
          </div>
        </div>
      </section>

      {/* ===== CREME: soluções ===== */}
      <section className="surface surface-creme dots dots-purple sec-pad">
        <div className="cluster" style={{ top: 50, left: 56 }}>
          <span className="d bg-game-green" />
          <span className="d bg-game-red" />
        </div>
        <div className="wrap">
          <div className="text-center max-w-[760px] mx-auto mb-11">
            <p className="eyebrow on-creme">O que fazemos</p>
            <h2 className="h-lg">Soluções para <span className="hl-orange">saúde pública</span></h2>
            <p className="lead muted mt-4">
              Promoção do autocuidado e educação em saúde para crianças e adolescentes com Diabetes Mellitus Tipo 1, com atividades semanais desde 2023.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-[26px]">
            <div className="card">
              <div className="flex items-start justify-between gap-3.5 mb-3">
                <div className="flex items-center gap-3">
                  <span className="chip-ico bg-game-pink"><Image src="/assets/geladeira.svg" alt="" width={30} height={30} className="w-[30px] h-[30px] object-contain" /></span>
                  <span className="tag">Oficinas</span>
                </div>
                <Image src="/assets/geladeira.svg" alt="" width={88} height={88} className="w-[88px] h-auto" />
              </div>
              <h3 className="h-md">Oficinas culinárias e alimentação</h3>
              <p className="muted font-body mt-2 leading-relaxed">Aprendizado prático sobre alimentação saudável e contagem de carboidratos, com participação ativa das crianças.</p>
              <div className="bullet"><span className="bd bg-game-pink" />Contagem de carboidratos na prática</div>
              <div className="bullet"><span className="bd bg-game-blue" />Melhora comprovada em parâmetros clínicos</div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between gap-3.5 mb-3">
                <div className="flex items-center gap-3">
                  <span className="chip-ico bg-orange"><Image src="/assets/controle-videogame.svg" alt="" width={30} height={30} className="w-[30px] h-[30px] object-contain" /></span>
                  <span className="tag">Jogos</span>
                </div>
                <Image src="/assets/gamellito-adventures.svg" alt="" width={96} height={96} className="w-24 h-auto" />
              </div>
              <h3 className="h-md">Jogos educativos e método Gamellito</h3>
              <p className="muted font-body mt-2 leading-relaxed">Recursos lúdicos e interativos que facilitam a compreensão do manejo do DM1 e estimulam a autonomia.</p>
              <div className="bullet"><span className="bd bg-orange" />Jogo digital e de tabuleiro</div>
              <div className="mt-4"><Link className="btn btn-orange !text-sm !py-2.5 !px-[18px]" href="/jogos">Quero conhecer o jogo</Link></div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between gap-3.5 mb-3">
                <div className="flex items-center gap-3">
                  <span className="chip-ico bg-game-blue"><Image src="/assets/gamellito-glicosimetro.svg" alt="" width={30} height={30} className="w-[30px] h-[30px] object-contain" /></span>
                  <span className="tag">Rodas de conversa</span>
                </div>
                <Image src="/assets/medico-mae-gamellito.svg" alt="" width={96} height={96} className="w-24 h-auto" />
              </div>
              <h3 className="h-md">Rodas de conversa e equipe multidisciplinar</h3>
              <p className="muted font-body mt-2 leading-relaxed">Nutrição, psicologia, enfermagem, artes cênicas e educação física integradas ao cuidado.</p>
              <div className="bullet"><span className="bd bg-game-blue" />Apoio à adesão de longo prazo</div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between gap-3.5 mb-3">
                <div className="flex items-center gap-3">
                  <span className="chip-ico bg-game-green"><Image src="/assets/balao-pensamento.svg" alt="" width={30} height={30} className="w-[30px] h-[30px] object-contain" /></span>
                  <span className="tag">Materiais digitais</span>
                </div>
                <Image src="/assets/mae-gamellito-glicemia.svg" alt="" width={96} height={96} className="w-24 h-auto" />
              </div>
              <h3 className="h-md">Materiais educativos e alcance digital</h3>
              <p className="muted font-body mt-2 leading-relaxed">Livros, histórias em quadrinhos, vídeos e telenovela educativa em linguagem acessível.</p>
              <div className="bullet"><span className="bd bg-game-green" />Distribuição gratuita via canais da UEL</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CREME: loja / troca de pontos ===== */}
      <section className="surface surface-creme dots dots-purple sec-pad">
        <div className="cluster" style={{ top: 46, right: 60 }}>
          <span className="d bg-game-blue" />
          <span className="d bg-game-pink" />
          <span className="d bg-game-green" />
        </div>
        <div className="wrap">
          <div className="text-center max-w-[760px] mx-auto mb-11">
            <p className="eyebrow on-creme">Loja Gamellito</p>
            <h2 className="h-lg">Cuidou, <span className="hl-orange">ganhou moedas</span>. Agora é só trocar.</h2>
            <p className="lead muted mt-4">
              Cada registro no diário e cada fase do jogo rendem moedas Gamellito. Troque por recompensas de verdade — e, em breve, roupinhas pro seu Gamellito.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="prod">
              <div className="thumb"><Image src="/assets/gamellito-board-game.svg" alt="" width={140} height={118} /></div>
              <div className="pname">Jogo de tabuleiro</div>
              <div className="pdesc">O método Gamellito pra jogar em grupo e em família.</div>
              <div className="price"><span className="coin-ico" /><span className="pv">1.200</span><Link className="trocar" href="/auth/login">Trocar</Link></div>
            </div>
            <div className="prod">
              <div className="thumb"><Image src="/assets/gamellito-badge-circle.svg" alt="" width={140} height={118} /></div>
              <div className="pname">Kit de adesivos</div>
              <div className="pdesc">Cartela com o Gamellito em várias poses.</div>
              <div className="price"><span className="coin-ico" /><span className="pv">300</span><Link className="trocar" href="/auth/login">Trocar</Link></div>
            </div>
            <div className="prod">
              <div className="thumb"><Image src="/assets/gamellito-diary-scene.svg" alt="" width={140} height={118} /></div>
              <div className="pname">Livro de aventuras</div>
              <div className="pdesc">"As Aventuras de Gamellito" ilustrado.</div>
              <div className="price"><span className="coin-ico" /><span className="pv">800</span><Link className="trocar" href="/auth/login">Trocar</Link></div>
            </div>
            <div className="prod">
              <div className="thumb"><span className="soon-badge">em breve</span><Image src="/assets/gamellito-corpinho.svg" alt="" width={140} height={118} /></div>
              <div className="pname">Roupinhas do Gamellito</div>
              <div className="pdesc">Vista seu Gamellito e cuide dele como um bichinho.</div>
              <div className="price"><span className="coin-ico" /><span className="pv">—</span><span className="trocar soon">em breve</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUN: CTA band ===== */}
      <section className="surface surface-sun py-16">
        <div className="wrap flex items-center justify-between gap-8 flex-wrap">
          <div className="flex-1 min-w-[420px]">
            <p className="eyebrow on-sun">Bora, Gamellito!</p>
            <h2 className="h-lg">Leve a <span className="hl-purple">aventura do cuidado</span> pra sua escola, clínica ou município.</h2>
          </div>
          <div className="flex items-center gap-5">
            <Image
              src="/assets/gamellito-contente.svg"
              alt="Gamellito contente"
              width={120}
              height={120}
              className="w-[120px] h-auto"
              style={{ filter: 'drop-shadow(4px 5px 0 rgba(43,34,51,.25))' }}
            />
            <Link className="btn btn-purple" href="/contato">Seja um parceiro</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
