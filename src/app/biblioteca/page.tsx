'use client';

import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

type Categoria = 'Enfermagem' | 'Endocrinologia' | 'Educação' | 'Psicologia';

const CATEGORIA_COR: Record<Categoria, string> = {
  Enfermagem: 'var(--game-red)',
  Endocrinologia: 'var(--game-blue)',
  Educação: 'var(--game-green)',
  Psicologia: 'var(--game-magenta)',
};

const CATEGORIAS: Categoria[] = ['Enfermagem', 'Endocrinologia', 'Educação', 'Psicologia'];

interface Artigo {
  id: string;
  categoria: Categoria;
  titulo: string;
  autores: string;
  resumo: string;
  ano: number;
  pdf_url?: string | null;
}

const ARTIGO_EXEMPLO: Artigo = {
  id: 'exemplo',
  categoria: 'Enfermagem',
  titulo: 'Título do seu artigo aqui',
  autores: 'Sobrenome, Nome; equipe/instituição',
  resumo: 'Um resumo curto explicando o objetivo do estudo, a metodologia e o principal resultado encontrado.',
  ano: new Date().getFullYear(),
};

export default function BibliotecaPage() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState<Categoria | 'Todos'>('Todos');
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('/api/biblioteca')
      .then((res) => res.json())
      .then((data) => setArtigos(data.artigos || []))
      .catch((err) => console.error('Erro ao carregar biblioteca:', err))
      .finally(() => setCarregando(false));
  }, []);

  const artigosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return artigos.filter((a) => {
      const bateCategoria = categoria === 'Todos' || a.categoria === categoria;
      const bateBusca =
        !termo ||
        a.titulo.toLowerCase().includes(termo) ||
        a.autores.toLowerCase().includes(termo) ||
        a.categoria.toLowerCase().includes(termo);
      return bateCategoria && bateBusca;
    });
  }, [busca, categoria, artigos]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream">
        <section className="surface surface-creme rhero">
          <div className="wrap">
            <p className="eyebrow on-creme">Repositório aberto</p>
            <h1>
              Biblioteca científica do <span className="hl-orange">DM1</span>
            </h1>
            <p className="lead">
              Artigos, protocolos e materiais submetidos por profissionais de saúde e publicados em acesso
              aberto — pra toda a comunidade que cuida de crianças com diabetes tipo 1.
            </p>

            <div className="toolbar">
              <div className="search">
                <span className="si" />
                <input
                  type="text"
                  placeholder="Buscar por título, autor ou tema…"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <a
                className="btn btn-orange"
                href="https://forms.gle/nX7Fh1tSkXzC5jC79"
                target="_blank"
                rel="noreferrer"
              >
                Submeter artigo
              </a>
            </div>

            <div className="filters">
              <button
                type="button"
                className={`fchip ${categoria === 'Todos' ? 'on' : ''}`}
                onClick={() => setCategoria('Todos')}
              >
                <span className="fd" style={{ background: 'var(--color-purple)' }} />
                Todos
              </button>
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`fchip ${categoria === cat ? 'on' : ''}`}
                  onClick={() => setCategoria(cat)}
                >
                  <span className="fd" style={{ background: CATEGORIA_COR[cat] }} />
                  {cat}
                </button>
              ))}
            </div>

            <p className="rcount">
              {carregando ? 'Carregando…' : `${artigosFiltrados.length} artigos publicados`}
            </p>
          </div>
        </section>

        <section className="wrap">
          <p className="tag" style={{ marginBottom: 10 }}>
            Veja como seu artigo vai aparecer
          </p>
          <div className="agrid" style={{ paddingBottom: 8 }}>
            <article className="acard exemplo">
              <span className="atag">
                <span className="ad" style={{ background: CATEGORIA_COR[ARTIGO_EXEMPLO.categoria] }} />
                {ARTIGO_EXEMPLO.categoria}
              </span>
              <h3>{ARTIGO_EXEMPLO.titulo}</h3>
              <p className="authors">{ARTIGO_EXEMPLO.autores}</p>
              <p className="abs">{ARTIGO_EXEMPLO.resumo}</p>
              <div className="cfoot">
                <span className="btn btn-orange btn-sm inert">Ler PDF</span>
                <span className="btn btn-ghost btn-sm inert">Citar</span>
                <span className="yr">{ARTIGO_EXEMPLO.ano}</span>
              </div>
            </article>
          </div>
        </section>

        <section className="wrap">
          {!carregando && artigosFiltrados.length === 0 ? (
            <div className="card card-cream text-center" style={{ padding: '40px 24px' }}>
              <p className="font-display font-bold text-ink text-lg mb-2">
                Ainda não há artigos publicados{categoria !== 'Todos' ? ` em ${categoria}` : ''}.
              </p>
              <p className="text-ink/70 font-body">
                Seja um dos primeiros profissionais a contribuir com o repositório.
              </p>
            </div>
          ) : (
            <div className="agrid">
              {artigosFiltrados.map((artigo) => (
                <article key={artigo.id} className="acard">
                  <span className="atag">
                    <span className="ad" style={{ background: CATEGORIA_COR[artigo.categoria] }} />
                    {artigo.categoria}
                  </span>
                  <h3>{artigo.titulo}</h3>
                  <p className="authors">{artigo.autores}</p>
                  <p className="abs">{artigo.resumo}</p>
                  <div className="cfoot">
                    {artigo.pdf_url ? (
                      <a className="btn btn-orange btn-sm" href={artigo.pdf_url} target="_blank" rel="noreferrer">
                        Ler PDF
                      </a>
                    ) : (
                      <span className="btn btn-orange btn-sm inert">Ler PDF</span>
                    )}
                    <button type="button" className="btn btn-ghost btn-sm">
                      Citar
                    </button>
                    <span className="yr">{artigo.ano}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="submeter" className="lib-cta">
          <div className="wrap">
            <div>
              <h2>É profissional de saúde?</h2>
              <p>Preencha o formulário de submissão e, após a revisão, seu artigo é publicado aqui em acesso aberto.</p>
            </div>
            <a
              className="btn btn-sun"
              href="https://forms.gle/nX7Fh1tSkXzC5jC79"
              target="_blank"
              rel="noreferrer"
            >
              Submeter artigo
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
