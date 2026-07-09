'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from './DashboardShell.module.css';

export type DashboardVariant = 'dm1' | 'prof' | 'saude';

export interface Trilha {
  n: string;
  color: string;
  title: string;
  format: string;
  lessons: string;
  pct: string;
  barClass?: string;
  status: string;
  statusClass?: string;
}

export interface RegistroGlicemia {
  id: string;
  valor: number;
  rotulo: string;
  when: string;
  dot: string;
}

interface DashboardShellProps {
  variant: DashboardVariant;
  userName: string;
  coins: number;
  streak: number;
  onLogout: () => void;
  accountHref: string;
  content: {
    greetEb: string;
    greetName: string;
    progPct: number;
    progLbl: string;
    contImg: string;
    contTitle: string;
    contMeta: string;
    contPct: string;
    trilhasTitle: string;
    trilhas: Trilha[];
  };
  // DM1-only
  registros?: RegistroGlicemia[];
  onOpenRegistro?: () => void;
}

const NAV_BY_VARIANT: Record<DashboardVariant, { color: string; label: string; href: string }[]> = {
  dm1: [{ color: 'var(--game-red)', label: 'Diário de glicemia', href: '/familia/diario' }],
  prof: [{ color: 'var(--game-blue)', label: 'Minhas turmas', href: '/educador/dashboard' }],
  saude: [
    { color: 'var(--game-blue)', label: 'Grupos e pacientes', href: '/profissional/dashboard' },
    { color: 'var(--game-magenta)', label: 'Repositório de artigos', href: '/profissional/recursos' },
  ],
};

const ROLE_TAG: Record<DashboardVariant, string> = {
  dm1: 'Família',
  prof: 'Professor',
  saude: 'Saúde',
};

// ---- Static demo content for role-specific panels (no backing tables yet) ----
const ATIVIDADES_PROF = [
  { icon: '/assets/balao-pensamento.svg', title: 'Roda de conversa sobre DM1', desc: 'Roteiro de 20 min para toda a turma', action: 'Abrir' },
  { icon: '/assets/gamellito-board-game.svg', title: 'Jogo do Gamellito em sala', desc: 'Dinâmica com o tabuleiro impresso', action: 'Abrir' },
  { icon: '/assets/olho-desconfiado.svg', title: 'Cartaz de sinais de alerta', desc: 'Hipo e hiper para fixar na parede', action: 'Baixar' },
];

const ALUNOS_DM1 = [
  { nome: 'Théo · 2º ano', nota: 'Plano de manejo em dia', ok: true },
  { nome: 'Lívia · 4º ano', nota: 'Kit de emergência a revisar', ok: false },
  { nome: 'Cecília · 3º ano', nota: 'Plano de manejo em dia', ok: true },
];

const GRUPOS_SAUDE = [
  { icon: '/assets/mae-gamellito-glicemia.svg', title: 'Grupo de educação em DM1', desc: '8 famílias · próxima roda 12/07' },
  { icon: '/assets/medico-mae-gamellito.svg', title: 'Ambulatório pediátrico', desc: '14 pacientes acompanhados' },
];

const MATERIAIS_SAUDE = [
  { icon: '/assets/gamellito-seringa.svg', title: 'Instrumentos de avaliação', desc: 'Antes e depois da intervenção' },
  { icon: '/assets/balao-pensamento.svg', title: 'Roteiro de rodas de conversa', desc: 'Estruturado por faixa etária' },
];

const ARTIGOS_SAUDE = [
  { icon: '/assets/gamellito-seringa.svg', title: 'Educação lúdica e adesão ao tratamento em crianças com DM1', meta: 'Marta Nunes · enfermagem · 2025', published: true },
  { icon: '/assets/mae-gamellito-glicemia.svg', title: 'Impacto de rodas de conversa no manejo familiar', meta: 'Marta Nunes · enfermagem · 2026', published: false },
  { icon: '/assets/medico-mae-gamellito.svg', title: 'Protocolo escolar de emergências hipoglicêmicas', meta: 'co-autoria com USP · 2024', published: true },
];

export function DashboardShell({
  variant,
  userName,
  coins,
  streak,
  onLogout,
  accountHref,
  content,
  registros = [],
  onOpenRegistro,
}: DashboardShellProps) {
  const [regOpen, setRegOpen] = useState(false);
  const [artOpen, setArtOpen] = useState(false);

  return (
    <div className={s.app}>
      {/* ================= SIDEBAR ================= */}
      <aside className={s.side}>
        <div className={s.sideBrand}>
          <Image src="/assets/gamellito-logo.svg" alt="" width={42} height={42} />
          <div className={s.wm}>
            Gamellito
            <small>{ROLE_TAG[variant]}</small>
          </div>
        </div>

        <span className={`${s.navI} ${s.active}`}>
          <span className={s.nd} style={{ background: 'var(--game-pink)' }} />
          Aprendizado
        </span>
        {NAV_BY_VARIANT[variant].map((item) => (
          <Link key={item.href} href={item.href} className={s.navI}>
            <span className={s.nd} style={{ background: item.color }} />
            {item.label}
          </Link>
        ))}
        <Link href="/loja" className={s.navI}>
          <span className={s.nd} style={{ background: 'var(--color-sun)' }} />
          Conquistas
        </Link>
        <Link href="/loja" className={s.navI}>
          <span className={s.nd} style={{ background: 'var(--game-green)' }} />
          Loja
        </Link>
        <Link href={accountHref} className={s.navI}>
          <span className={s.nd} style={{ background: 'var(--color-lilac)' }} />
          Minha conta
        </Link>

        <div className={s.sideFoot}>
          <div className={s.sideUser}>
            <span className={s.avatar} style={{ width: 38, height: 38 }}>
              <Image src="/assets/gamellito-logo.svg" alt="" width={32} height={32} />
            </span>
            <div>
              <div className={s.name}>{userName}</div>
              <div className={s.coins}>{coins.toLocaleString('pt-BR')} moedas</div>
            </div>
          </div>
          <button className={s.sideLogout} onClick={onLogout}>
            Sair
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className={s.main}>
        <div className={s.wrap}>
          {/* topbar */}
          <div className={s.topbar}>
            <div className={s.greet}>
              <p className={s.eb}>{content.greetEb}</p>
              <h1>{content.greetName}</h1>
            </div>
            <div className={s.topright}>
              <div className={s.chip}>
                <span className={s.fire}>▲</span>
                {streak}
              </div>
              <div className={s.chip}>
                <span className={s.coinIco} />
                {coins.toLocaleString('pt-BR')}
              </div>
              <div className={s.avatar}>
                <Image src="/assets/gamellito-logo.svg" alt="" width={40} height={40} />
              </div>
            </div>
          </div>

          {/* stats */}
          <div className={s.stats3}>
            <div className={s.scard}>
              <div className={s.sic} style={{ background: 'var(--color-orange)' }}>▲</div>
              <div>
                <div className={s.snum}>{streak}</div>
                <div className={s.slbl}>dias seguidos de cuidado</div>
              </div>
            </div>
            <div className={s.scard}>
              <div className={s.sic} style={{ background: 'var(--color-sun)', color: 'var(--color-ink)' }}>G</div>
              <div>
                <div className={s.snum}>{coins.toLocaleString('pt-BR')}</div>
                <div className={s.slbl}>moedas Gamellito</div>
              </div>
            </div>
            <div className={s.scard}>
              <div className={s.sic} style={{ background: 'var(--game-green)' }}>%</div>
              <div>
                <div className={s.snum}>{content.progPct}%</div>
                <div className={s.slbl}>{content.progLbl}</div>
              </div>
            </div>
          </div>

          {/* continue */}
          <div className={s.cont}>
            <div className={s.ci}>
              <Image src={content.contImg} alt="" width={60} height={60} />
            </div>
            <div className={s.cbody}>
              <p className={s.eb}>Continue de onde parou</p>
              <h3>{content.contTitle}</h3>
              <p className={s.meta}>{content.contMeta}</p>
              <div className={`${s.prog} ${s.onp}`}>
                <i style={{ width: content.contPct }} />
              </div>
            </div>
            <a className={`${s.btn} ${s.btnSun}`} href="#">Continuar</a>
          </div>

          {/* trilhas */}
          <div className={s.sh}>
            <h2>{content.trilhasTitle}</h2>
            <a>Ver todas</a>
          </div>
          <div className={s.trilhas}>
            {content.trilhas.map((t) => (
              <div key={t.n} className={s.tcard}>
                <div className={s.tnum} style={{ background: t.color }}>{t.n}</div>
                <h4>{t.title}</h4>
                <span className={s.tag}>{t.format}</span>
                <div className={`${s.prog} ${t.barClass === 'g' ? s.g : ''}`}>
                  <i style={{ width: t.pct }} />
                </div>
                <div className={s.tmeta}>
                  <span>{t.lessons}</span>
                  <span className={t.statusClass === 'done' ? s.done : ''}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* role-specific bottom */}
          {variant === 'dm1' && (
            <div className={s.cols}>
              <div className={s.panel}>
                <h3>Diário de glicemia</h3>
                <p className={s.psub}>Últimos registros · organize para levar à consulta</p>
                <div className={s.spark}>
                  <svg viewBox="0 0 320 90" width="100%" height="90" preserveAspectRatio="none">
                    <line x1="0" y1="30" x2="320" y2="30" stroke="rgba(43,34,51,.12)" strokeWidth="1" />
                    <line x1="0" y1="66" x2="320" y2="66" stroke="rgba(43,34,51,.12)" strokeWidth="1" />
                    <polyline
                      points="8,52 60,40 112,58 164,34 216,48 268,30 312,44"
                      fill="none"
                      stroke="#F26A00"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {[[8, 52], [60, 40], [112, 58], [164, 34], [216, 48], [268, 30], [312, 44]].map(
                      ([cx, cy]) => (
                        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#fff" stroke="#2B2233" strokeWidth="3" />
                      )
                    )}
                  </svg>
                  <div className={s.srange}>
                    <span>faixa alvo 70–180 mg/dL</span>
                    <span>últimos registros</span>
                  </div>
                </div>
                {registros.length > 0 ? (
                  registros.map((r) => (
                    <div key={r.id} className={s.reg}>
                      <span className={s.rv}>{r.valor}<small> mg/dL</small></span>
                      <span className={s.rtag}>
                        <span className={s.rdot} style={{ background: r.dot }} />
                        {r.rotulo}
                      </span>
                      <span className={s.rwhen}>{r.when}</span>
                    </div>
                  ))
                ) : (
                  <p className={s.psub}>Nenhum registro ainda</p>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
                  <button
                    className={`${s.btn} ${s.btnOrange} ${s.btnSm}`}
                    onClick={onOpenRegistro || (() => setRegOpen(true))}
                  >
                    + Registrar glicemia
                  </button>
                  <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href="#">Exportar PDF</a>
                </div>
              </div>
              <div className={s.panel}>
                <h3>Conquistas</h3>
                <p className={s.psub}>Continue registrando para desbloquear mais</p>
                <div className={s.medals}>
                  <div className={s.medal}>
                    <div className={s.mic} style={{ background: 'var(--game-pink)' }}>1</div>
                    <div>
                      <div className={s.mt}>Primeira trilha</div>
                      <div className={s.md}>Concluiu "Os primeiros 30 dias"</div>
                    </div>
                  </div>
                  <div className={s.medal}>
                    <div className={s.mic} style={{ background: 'var(--color-orange)' }}>7</div>
                    <div>
                      <div className={s.mt}>Semana de fogo</div>
                      <div className={s.md}>7 dias seguidos de registro</div>
                    </div>
                  </div>
                  <div className={s.medal}>
                    <div className={s.mic} style={{ background: 'var(--game-green)' }}>10</div>
                    <div>
                      <div className={s.mt}>Colecionador</div>
                      <div className={s.md}>10 registros de glicemia</div>
                    </div>
                  </div>
                  <div className={`${s.medal} ${s.locked}`}>
                    <div className={s.mic}>★</div>
                    <div>
                      <div className={s.mt}>Explorador</div>
                      <div className={s.md}>Conclua 3 trilhas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* role-specific bottom: PROF => atividades + alunos */}
          {variant === 'prof' && (
            <div className={s.cols}>
              <div className={s.panel}>
                <h3>Atividades para a turma</h3>
                <p className={s.psub}>Pronto para aplicar em sala — sem improvisar</p>
                <div className={s.acts}>
                  {ATIVIDADES_PROF.map((a) => (
                    <div className={s.act} key={a.title}>
                      <span className={s.ai}>
                        <Image src={a.icon} alt="" width={34} height={34} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div className={s.at}>{a.title}</div>
                        <div className={s.ad}>{a.desc}</div>
                      </div>
                      <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href="#">{a.action}</a>
                    </div>
                  ))}
                </div>
              </div>
              <div className={s.panel}>
                <h3>Alunos com DM1</h3>
                <p className={s.psub}>Acompanhe quem precisa de atenção</p>
                {ALUNOS_DM1.map((al) => (
                  <div className={s.reg} key={al.nome}>
                    <span className={s.avatar} style={{ width: 38, height: 38 }}>
                      <Image src="/assets/gamellito-logo.svg" alt="" width={32} height={32} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className={s.at} style={{ fontSize: 14 }}>{al.nome}</div>
                      <div className={s.ad}>{al.nota}</div>
                    </div>
                    <span className={s.rtag}>
                      <span className={s.rdot} style={{ background: al.ok ? 'var(--game-green)' : 'var(--color-orange)' }} />
                      {al.ok ? 'ok' : 'rever'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* role-specific bottom: SAÚDE => grupos + materiais + artigos */}
          {variant === 'saude' && (
            <>
              <div className={s.cols}>
                <div className={s.panel}>
                  <h3>Grupos e pacientes</h3>
                  <p className={s.psub}>Educação em diabetes que você conduz</p>
                  <div className={s.acts}>
                    {GRUPOS_SAUDE.map((g) => (
                      <div className={s.act} key={g.title}>
                        <span className={s.ai}>
                          <Image src={g.icon} alt="" width={34} height={34} />
                        </span>
                        <div style={{ flex: 1 }}>
                          <div className={s.at}>{g.title}</div>
                          <div className={s.ad}>{g.desc}</div>
                        </div>
                        <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href="#">Abrir</a>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={s.panel}>
                  <h3>Materiais do método</h3>
                  <p className={s.psub}>Baseado em evidência (USP + UEL)</p>
                  <div className={s.acts}>
                    {MATERIAIS_SAUDE.map((m) => (
                      <div className={s.act} key={m.title}>
                        <span className={s.ai}>
                          <Image src={m.icon} alt="" width={34} height={34} />
                        </span>
                        <div style={{ flex: 1 }}>
                          <div className={s.at}>{m.title}</div>
                          <div className={s.ad}>{m.desc}</div>
                        </div>
                        <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href="#">Baixar</a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={s.sh}>
                <h2>Artigos científicos</h2>
                <button onClick={() => setArtOpen(true)}>+ Submeter artigo</button>
              </div>
              <div className={s.panel}>
                <p className={s.psub}>
                  Envie sua produção. Depois da revisão, ela é publicada no{' '}
                  <strong style={{ color: 'var(--color-purple)' }}>repositório público</strong> do site — aberto a
                  toda a comunidade.
                </p>
                <div className={s.acts}>
                  {ARTIGOS_SAUDE.map((art) => (
                    <div className={s.art} key={art.title}>
                      <span className={s.ai}>
                        <Image src={art.icon} alt="" width={34} height={34} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div className={s.at}>{art.title}</div>
                        <div className={s.ad}>{art.meta}</div>
                      </div>
                      <span className={`${s.stpill} ${art.published ? s.pub : s.rev}`}>
                        <span className={s.rdot} style={{ background: art.published ? 'var(--game-green)' : 'var(--color-orange)' }} />
                        {art.published ? 'Publicado' : 'Em revisão'}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
                  <button className={`${s.btn} ${s.btnOrange} ${s.btnSm}`} onClick={() => setArtOpen(true)}>
                    + Submeter artigo
                  </button>
                  <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href="#">Ver repositório público</a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ============ SUBMETER ARTIGO MODAL ============ */}
      {artOpen && (
        <div className={s.ov} onClick={() => setArtOpen(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <button className={s.mx} onClick={() => setArtOpen(false)}>✕</button>
            <h3>Submeter artigo</h3>
            <p className={s.msub}>Após a revisão da equipe, ele é publicado no repositório público do site.</p>
            <div className={s.field}>
              <label>Título</label>
              <input type="text" placeholder="Ex.: Educação lúdica e adesão ao tratamento…" />
            </div>
            <div className={s.field}>
              <label>Autores</label>
              <input type="text" placeholder="Nomes separados por vírgula" />
            </div>
            <div className={s.field}>
              <label>Área</label>
              <div className={s.chips}>
                <button className={`${s.lchip} ${s.lchipOn}`} type="button">Enfermagem</button>
                <button className={s.lchip} type="button">Endocrinologia</button>
                <button className={s.lchip} type="button">Educação</button>
                <button className={s.lchip} type="button">Psicologia</button>
              </div>
            </div>
            <div className={s.field}>
              <label>Arquivo (PDF)</label>
              <input type="text" placeholder="Anexar arquivo…" readOnly style={{ cursor: 'pointer' }} />
            </div>
            <button
              className={`${s.btn} ${s.btnOrange}`}
              style={{ width: '100%', marginTop: 6 }}
              onClick={() => setArtOpen(false)}
            >
              Enviar para revisão
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
