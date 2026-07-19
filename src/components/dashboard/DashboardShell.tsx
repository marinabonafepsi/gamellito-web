'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from './DashboardShell.module.css';
import { TrilhasGrid } from './TrilhasGrid';
import { MedalItem } from './MedalItem';
import { MEDALS } from '@/lib/trilhas-data';

export type DashboardVariant = 'dm1' | 'prof' | 'saude';

export const BASE_PATH_BY_VARIANT: Record<DashboardVariant, string> = {
  dm1: '/familia',
  prof: '/educador',
  saude: '/profissional',
};

export interface Trilha {
  n: string;
  color: string;
  nivel?: string;
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

export interface Recurso {
  id: string;
  titulo: string;
  descricao?: string | null;
  icone?: string | null;
  acao_label: 'Abrir' | 'Baixar';
  url?: string | null;
}

export interface PacienteResumo {
  id: string;
  nome: string;
  status: 'ok' | 'rever';
}

export type ArtigoStatus = 'pendente' | 'publicado' | 'rejeitado';

export interface Artigo {
  id: string;
  titulo: string;
  autores: string;
  ano: number;
  categoria: string;
  status: ArtigoStatus;
}

export const CATEGORIAS_ARTIGO = ['Enfermagem', 'Endocrinologia', 'Educação', 'Psicologia'] as const;
export type CategoriaArtigo = (typeof CATEGORIAS_ARTIGO)[number];

export interface NovoArtigo {
  titulo: string;
  autores: string;
  resumo: string;
  categoria: CategoriaArtigo;
  ano: number;
  pdf_url?: string;
}

interface DashboardShellProps {
  variant: DashboardVariant;
  coins: number;
  streak: number;
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
  // PROF-only
  atividades?: Recurso[];
  alunos?: PacienteResumo[];
  alunoHref?: (id: string) => string;
  // SAUDE-only
  materiais?: Recurso[];
  pacientes?: PacienteResumo[];
  pacienteHref?: (id: string) => string;
  artigos?: Artigo[];
  onSubmitArtigo?: (data: NovoArtigo) => Promise<void> | void;
}

export function DashboardShell({
  variant,
  coins,
  streak,
  content,
  registros = [],
  onOpenRegistro,
  atividades = [],
  alunos = [],
  alunoHref,
  materiais = [],
  pacientes = [],
  pacienteHref,
  artigos = [],
  onSubmitArtigo,
}: DashboardShellProps) {
  const basePath = BASE_PATH_BY_VARIANT[variant];
  const [artOpen, setArtOpen] = useState(false);
  const [artTitulo, setArtTitulo] = useState('');
  const [artAutores, setArtAutores] = useState('');
  const [artResumo, setArtResumo] = useState('');
  const [artCategoria, setArtCategoria] = useState<CategoriaArtigo>('Enfermagem');
  const [artAno, setArtAno] = useState(new Date().getFullYear());
  const [artPdfUrl, setArtPdfUrl] = useState('');
  const [artSubmitting, setArtSubmitting] = useState(false);
  const [artError, setArtError] = useState('');

  const resetArtForm = () => {
    setArtTitulo('');
    setArtAutores('');
    setArtResumo('');
    setArtCategoria('Enfermagem');
    setArtAno(new Date().getFullYear());
    setArtPdfUrl('');
    setArtError('');
  };

  const handleSubmitArtigo = async () => {
    if (!artTitulo.trim() || !artAutores.trim() || !artResumo.trim()) {
      setArtError('Preencha título, autores e resumo.');
      return;
    }
    setArtSubmitting(true);
    setArtError('');
    try {
      await onSubmitArtigo?.({
        titulo: artTitulo.trim(),
        autores: artAutores.trim(),
        resumo: artResumo.trim(),
        categoria: artCategoria,
        ano: artAno,
        pdf_url: artPdfUrl.trim() || undefined,
      });
      resetArtForm();
      setArtOpen(false);
    } catch (err) {
      setArtError(err instanceof Error ? err.message : 'Erro ao enviar artigo.');
    } finally {
      setArtSubmitting(false);
    }
  };

  const ARTIGO_STATUS_LABEL: Record<ArtigoStatus, string> = {
    pendente: 'Em revisão',
    publicado: 'Publicado',
    rejeitado: 'Rejeitado',
  };

  return (
    <>
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

      {/* trilhas (preview) */}
      <div className={s.sh}>
        <h2>{content.trilhasTitle}</h2>
        <Link href={`${basePath}/aprendizado`}>Ver todas</Link>
      </div>
      <TrilhasGrid trilhas={content.trilhas.slice(0, 3)} />

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
                onClick={onOpenRegistro}
              >
                + Registrar glicemia
              </button>
              <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href="#">Exportar PDF</a>
            </div>
          </div>
          <div className={s.panel}>
            <div className={s.sh} style={{ margin: '0 0 12px' }}>
              <h3 style={{ fontSize: 18 }}>Conquistas</h3>
              <Link href={`${basePath}/conquistas`}>Ver todas</Link>
            </div>
            <div className={s.medals}>
              {MEDALS.slice(0, 3).map((m) => (
                <MedalItem key={m.t} medal={m} />
              ))}
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
            {atividades.length > 0 ? (
              <div className={s.acts}>
                {atividades.map((a) => (
                  <div className={s.act} key={a.id}>
                    <span className={s.ai}>
                      <Image src={a.icone || '/assets/gamellito-logo.svg'} alt="" width={34} height={34} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className={s.at}>{a.titulo}</div>
                      <div className={s.ad}>{a.descricao}</div>
                    </div>
                    <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href={a.url || '#'}>{a.acao_label}</a>
                  </div>
                ))}
              </div>
            ) : (
              <p className={s.psub}>Nenhuma atividade disponível no momento</p>
            )}
          </div>
          <div className={s.panel}>
            <h3>Alunos com DM1</h3>
            <p className={s.psub}>Acompanhe quem precisa de atenção</p>
            {alunos.length > 0 ? (
              alunos.map((al) => {
                const row = (
                  <>
                    <span className={s.avatar} style={{ width: 38, height: 38 }}>
                      <Image src="/assets/gamellito-logo.svg" alt="" width={32} height={32} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className={s.at} style={{ fontSize: 14 }}>{al.nome}</div>
                    </div>
                    <span className={s.rtag}>
                      <span className={s.rdot} style={{ background: al.status === 'ok' ? 'var(--game-green)' : 'var(--color-orange)' }} />
                      {al.status}
                    </span>
                  </>
                );
                return alunoHref ? (
                  <Link href={alunoHref(al.id)} className={s.reg} key={al.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {row}
                  </Link>
                ) : (
                  <div className={s.reg} key={al.id}>
                    {row}
                  </div>
                );
              })
            ) : (
              <p className={s.psub}>
                Nenhum aluno compartilhou os dados com você ainda. Peça para a família ativar o
                compartilhamento no diário dela.
              </p>
            )}
          </div>
        </div>
      )}

      {/* role-specific bottom: SAÚDE => pacientes + materiais + artigos */}
      {variant === 'saude' && (
        <>
          <div className={s.cols}>
            <div className={s.panel}>
              <h3>Grupos e pacientes</h3>
              <p className={s.psub}>Famílias que compartilharam dados com você</p>
              {pacientes.length > 0 ? (
                pacientes.map((p) => {
                  const row = (
                    <>
                      <span className={s.avatar} style={{ width: 38, height: 38 }}>
                        <Image src="/assets/gamellito-logo.svg" alt="" width={32} height={32} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div className={s.at} style={{ fontSize: 14 }}>{p.nome}</div>
                      </div>
                      <span className={s.rtag}>
                        <span className={s.rdot} style={{ background: p.status === 'ok' ? 'var(--game-green)' : 'var(--color-orange)' }} />
                        {p.status}
                      </span>
                    </>
                  );
                  return pacienteHref ? (
                    <Link href={pacienteHref(p.id)} className={s.reg} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {row}
                    </Link>
                  ) : (
                    <div className={s.reg} key={p.id}>
                      {row}
                    </div>
                  );
                })
              ) : (
                <p className={s.psub}>
                  Nenhum paciente compartilhou os dados com você ainda. Peça para a família ativar o
                  compartilhamento no diário dela.
                </p>
              )}
            </div>
            <div className={s.panel}>
              <h3>Materiais do método</h3>
              <p className={s.psub}>Baseado em evidência (USP + UEL)</p>
              {materiais.length > 0 ? (
                <div className={s.acts}>
                  {materiais.map((m) => (
                    <div className={s.act} key={m.id}>
                      <span className={s.ai}>
                        <Image src={m.icone || '/assets/gamellito-logo.svg'} alt="" width={34} height={34} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div className={s.at}>{m.titulo}</div>
                        <div className={s.ad}>{m.descricao}</div>
                      </div>
                      <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href={m.url || '#'}>{m.acao_label}</a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={s.psub}>Nenhum material disponível no momento</p>
              )}
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
            {artigos.length > 0 ? (
              <div className={s.acts}>
                {artigos.map((art) => (
                  <div className={s.art} key={art.id}>
                    <span className={s.ai}>
                      <Image src="/assets/gamellito-seringa.svg" alt="" width={34} height={34} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className={s.at}>{art.titulo}</div>
                      <div className={s.ad}>{art.autores} · {art.categoria} · {art.ano}</div>
                    </div>
                    <span className={`${s.stpill} ${art.status === 'publicado' ? s.pub : art.status === 'rejeitado' ? '' : s.rev}`}>
                      <span
                        className={s.rdot}
                        style={{
                          background:
                            art.status === 'publicado'
                              ? 'var(--game-green)'
                              : art.status === 'rejeitado'
                                ? 'var(--game-red)'
                                : 'var(--color-orange)',
                        }}
                      />
                      {ARTIGO_STATUS_LABEL[art.status]}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={s.psub}>Você ainda não submeteu nenhum artigo</p>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
              <button className={`${s.btn} ${s.btnOrange} ${s.btnSm}`} onClick={() => setArtOpen(true)}>
                + Submeter artigo
              </button>
              <Link href="/biblioteca" className={`${s.btn} ${s.btnCream} ${s.btnSm}`}>Ver repositório público</Link>
            </div>
          </div>
        </>
      )}

      {/* ============ SUBMETER ARTIGO MODAL ============ */}
      {artOpen && (
        <div className={s.ov} onClick={() => setArtOpen(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <button className={s.mx} onClick={() => { setArtOpen(false); resetArtForm(); }}>✕</button>
            <h3>Submeter artigo</h3>
            <p className={s.msub}>Após a revisão da equipe, ele é publicado no repositório público do site.</p>
            <div className={s.field}>
              <label>Título</label>
              <input
                type="text"
                placeholder="Ex.: Educação lúdica e adesão ao tratamento…"
                value={artTitulo}
                onChange={(e) => setArtTitulo(e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label>Autores</label>
              <input
                type="text"
                placeholder="Nomes separados por vírgula"
                value={artAutores}
                onChange={(e) => setArtAutores(e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label>Resumo</label>
              <textarea
                placeholder="Objetivo, metodologia e principal resultado"
                value={artResumo}
                onChange={(e) => setArtResumo(e.target.value)}
                rows={3}
                style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 15, padding: '11px 14px', borderRadius: 14, border: '2px solid var(--color-ink)', resize: 'vertical' }}
              />
            </div>
            <div className={s.field}>
              <label>Área</label>
              <div className={s.chips}>
                {CATEGORIAS_ARTIGO.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`${s.lchip} ${artCategoria === cat ? s.lchipOn : ''}`}
                    onClick={() => setArtCategoria(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className={s.field}>
              <label>Ano</label>
              <input
                type="number"
                value={artAno}
                onChange={(e) => setArtAno(parseInt(e.target.value, 10) || new Date().getFullYear())}
              />
            </div>
            <div className={s.field}>
              <label>Link do PDF (opcional)</label>
              <input
                type="text"
                placeholder="https://…"
                value={artPdfUrl}
                onChange={(e) => setArtPdfUrl(e.target.value)}
              />
            </div>
            {artError && (
              <p className={s.msub} style={{ color: 'var(--game-red)' }}>{artError}</p>
            )}
            <button
              className={`${s.btn} ${s.btnOrange}`}
              style={{ width: '100%', marginTop: 6 }}
              onClick={handleSubmitArtigo}
              disabled={artSubmitting}
            >
              {artSubmitting ? 'Enviando…' : 'Enviar para revisão'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
