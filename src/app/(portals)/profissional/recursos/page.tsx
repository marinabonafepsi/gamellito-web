'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import s from '@/components/dashboard/DashboardShell.module.css';
import {
  CATEGORIAS_ARTIGO,
  type Artigo,
  type ArtigoStatus,
  type CategoriaArtigo,
  type NovoArtigo,
} from '@/components/dashboard/DashboardShell';

const ARTIGO_STATUS_LABEL: Record<ArtigoStatus, string> = {
  pendente: 'Em revisão',
  publicado: 'Publicado',
  rejeitado: 'Rejeitado',
};

export default function RecursosPage() {
  const supabase = createClientComponentClient();
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);

  const [artOpen, setArtOpen] = useState(false);
  const [artTitulo, setArtTitulo] = useState('');
  const [artAutores, setArtAutores] = useState('');
  const [artResumo, setArtResumo] = useState('');
  const [artCategoria, setArtCategoria] = useState<CategoriaArtigo>('Enfermagem');
  const [artAno, setArtAno] = useState(new Date().getFullYear());
  const [artPdfUrl, setArtPdfUrl] = useState('');
  const [artSubmitting, setArtSubmitting] = useState(false);
  const [artError, setArtError] = useState('');

  const loadArtigos = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('biblioteca_artigos')
      .select('id, titulo, autores, ano, categoria, status')
      .eq('submetido_por', user.id)
      .order('criado_em', { ascending: false });
    setArtigos((data as Artigo[]) || []);
  }, [supabase]);

  useEffect(() => {
    loadArtigos().finally(() => setLoading(false));
  }, [loadArtigos]);

  const resetArtForm = () => {
    setArtTitulo('');
    setArtAutores('');
    setArtResumo('');
    setArtCategoria('Enfermagem');
    setArtAno(new Date().getFullYear());
    setArtPdfUrl('');
    setArtError('');
  };

  const submitArtigo = async (novo: NovoArtigo) => {
    const response = await fetch('/api/biblioteca', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao enviar artigo');
    }
    await loadArtigos();
  };

  const handleSubmitArtigo = async () => {
    if (!artTitulo.trim() || !artAutores.trim() || !artResumo.trim()) {
      setArtError('Preencha título, autores e resumo.');
      return;
    }
    setArtSubmitting(true);
    setArtError('');
    try {
      await submitArtigo({
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

  if (loading) return null;

  return (
    <>
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
