'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

type Categoria = 'Enfermagem' | 'Endocrinologia' | 'Educação' | 'Psicologia';

const CATEGORIA_COR: Record<Categoria, string> = {
  Enfermagem: 'var(--game-red)',
  Endocrinologia: 'var(--game-blue)',
  Educação: 'var(--game-green)',
  Psicologia: 'var(--game-magenta)',
};

interface Artigo {
  categoria: Categoria;
  titulo: string;
  autores: string;
  resumo: string;
  ano: number;
}

const ARTIGOS: Artigo[] = [
  {
    categoria: 'Enfermagem',
    titulo: 'Educação lúdica e adesão ao tratamento em crianças com DM1',
    autores: 'Nunes, M.; Ferreira, L.',
    resumo: 'Ensaio com 84 crianças mostrando ganho de autonomia e adesão após intervenção com o método Gamellito.',
    ano: 2025,
  },
  {
    categoria: 'Educação',
    titulo: 'Protocolo escolar de emergências hipoglicêmicas',
    autores: 'Silva, R.; equipe USP',
    resumo: 'Redução de 77% em emergências na escola após formação de educadores e protocolo estruturado.',
    ano: 2024,
  },
  {
    categoria: 'Endocrinologia',
    titulo: 'Contagem de carboidratos gamificada: resultados em HbA1c',
    autores: 'Almeida, P.; Costa, T.',
    resumo: 'Estudo observacional relacionando engajamento no jogo à melhora do controle glicêmico.',
    ano: 2023,
  },
  {
    categoria: 'Psicologia',
    titulo: 'Luto e adaptação familiar após o diagnóstico de DM1',
    autores: 'Rocha, J.; Lima, A.',
    resumo: 'Análise qualitativa das fases emocionais e do papel do suporte lúdico na adaptação.',
    ano: 2025,
  },
  {
    categoria: 'Enfermagem',
    titulo: 'Rodas de conversa no manejo familiar do DM1',
    autores: 'Nunes, M.',
    resumo: 'Impacto das rodas estruturadas na confiança de cuidadores e na rotina de monitoramento.',
    ano: 2026,
  },
  {
    categoria: 'Educação',
    titulo: 'Inclusão de alunos com DM1: o que a legislação garante',
    autores: 'Barros, C.; UEL',
    resumo: 'Revisão das leis 13.230/2015 e 11.347/2006 e sua aplicação prática nas escolas.',
    ano: 2022,
  },
  {
    categoria: 'Endocrinologia',
    titulo: 'Bombas de insulina e sensores em pediatria: revisão',
    autores: 'Tavares, D.',
    resumo: 'Panorama de eficácia e qualidade de vida com CGM e infusão contínua em crianças.',
    ano: 2024,
  },
  {
    categoria: 'Psicologia',
    titulo: 'Ansiedade e doença crônica na infância: sinais e manejo',
    autores: 'Moreira, F.; Pires, S.',
    resumo: 'Fatores de risco e estratégias de acolhimento para crianças e adolescentes com DM1.',
    ano: 2023,
  },
];

const CATEGORIAS: Categoria[] = ['Enfermagem', 'Endocrinologia', 'Educação', 'Psicologia'];

export default function BibliotecaPage() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState<Categoria | 'Todos'>('Todos');

  const artigosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return ARTIGOS.filter((a) => {
      const bateCategoria = categoria === 'Todos' || a.categoria === categoria;
      const bateBusca =
        !termo ||
        a.titulo.toLowerCase().includes(termo) ||
        a.autores.toLowerCase().includes(termo) ||
        a.categoria.toLowerCase().includes(termo);
      return bateCategoria && bateBusca;
    });
  }, [busca, categoria]);

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

            <p className="rcount">{artigosFiltrados.length} artigos publicados</p>
          </div>
        </section>

        <section className="wrap">
          <div className="agrid">
            {artigosFiltrados.map((artigo) => (
              <article key={artigo.titulo} className="acard">
                <span className="atag">
                  <span className="ad" style={{ background: CATEGORIA_COR[artigo.categoria] }} />
                  {artigo.categoria}
                </span>
                <h3>{artigo.titulo}</h3>
                <p className="authors">{artigo.autores}</p>
                <p className="abs">{artigo.resumo}</p>
                <div className="cfoot">
                  <button type="button" className="btn btn-orange btn-sm">
                    Ler PDF
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm">
                    Citar
                  </button>
                  <span className="yr">{artigo.ano}</span>
                </div>
              </article>
            ))}
          </div>
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
