import type { Trilha } from '@/components/dashboard/DashboardShell';

// ---------- DM1 (família) — trilha em formato de mapa, agrupada por nível ----------
// Cada item é um módulo único e interativo (ver src/lib/modulos-content.ts para o
// conteúdo dos módulos que já têm jogo implementado — os demais aparecem como
// "em breve" no mapa, igual ao protótipo original.
export const TRILHAS_DM1_FAMILIA: Trilha[] = [
  { n: 'A1', color: 'var(--game-green)', nivel: 'Primeiros passos', title: 'Entendendo o diagnóstico', format: 'vídeo + glossário vivo', lessons: '1 módulo', pct: '100%', barClass: 'g', status: 'concluída', statusClass: 'done' },
  { n: 'A2', color: 'var(--game-green)', nivel: 'Primeiros passos', title: 'Rotina diária: glicemia, insulina e refeições', format: 'linha do tempo interativa', lessons: '1 módulo', pct: '60%', status: 'em andamento' },
  { n: 'A3', color: 'var(--game-blue)', nivel: 'Rotina do dia a dia', title: 'Ponta de dedo e monitorização (CGM)', format: 'vídeo', lessons: '1 módulo', pct: '0%', status: 'começar' },
  { n: 'A4', color: 'var(--game-blue)', nivel: 'Rotina do dia a dia', title: 'Contagem de carboidratos na prática', format: 'monte o prato', lessons: '1 módulo', pct: '0%', status: 'começar' },
  { n: 'A5', color: 'var(--game-blue)', nivel: 'Rotina do dia a dia', title: 'Reconhecendo hipo e hiperglicemia', format: 'simulador de decisão', lessons: '1 módulo', pct: '0%', status: 'começar' },
  { n: 'A6', color: 'var(--game-blue)', nivel: 'Rotina do dia a dia', title: 'Cetoacidose: sinais de alerta', format: 'checklist', lessons: '1 módulo', pct: '0%', status: 'começar' },
  { n: 'A7', color: 'var(--game-blue)', nivel: 'Rotina do dia a dia', title: 'Dias de doença (sick days)', format: 'protocolo passo a passo', lessons: '1 módulo', pct: '0%', status: 'começar' },
  { n: 'A8', color: 'var(--color-orange)', nivel: 'Situações especiais', title: 'Diabetes e outras condições', format: 'cartão + quiz', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'A9', color: 'var(--color-orange)', nivel: 'Situações especiais', title: 'Complicações de longo prazo', format: 'infográfico', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'A10', color: 'var(--color-orange)', nivel: 'Situações especiais', title: 'Conversando com a escola', format: 'modelo editável', lessons: '1 módulo', pct: '0%', status: 'começar' },
  { n: 'A11', color: 'var(--color-orange)', nivel: 'Situações especiais', title: 'Autonomia gradual', format: 'marcos por idade', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'A12', color: 'var(--color-purple)', nivel: 'Autonomia e apoio', title: 'Kit de emergência', format: 'monte a mochila', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'A13', color: 'var(--color-purple)', nivel: 'Autonomia e apoio', title: 'Saúde mental da família', format: 'texto + indicação', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'A14', color: 'var(--color-purple)', nivel: 'Autonomia e apoio', title: 'Rede de apoio multiprofissional', format: 'mapa de especialistas', lessons: '1 módulo', pct: '0%', status: 'em breve' },
];

export const TRILHAS_DM1_CRIANCA: Trilha[] = [
  { n: 'B1', color: 'var(--game-green)', nivel: 'Primeiros passos', title: 'O que é o pancrezinho preguiçoso', format: 'vídeo animado', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'B2', color: 'var(--game-green)', nivel: 'Primeiros passos', title: 'Meu kit: caneta, sensor e lancetas', format: 'encontre os objetos', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'B3', color: 'var(--game-blue)', nivel: 'Rotina do dia a dia', title: 'Como sei que preciso comer algo doce', format: 'quiz de sinais', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'B4', color: 'var(--game-blue)', nivel: 'Rotina do dia a dia', title: 'Contando carboidrato com o prato mágico', format: 'monte o prato', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'B5', color: 'var(--color-orange)', nivel: 'Situações especiais', title: 'O que contar pros amigos e pra escola', format: 'história em quadrinhos', lessons: '1 módulo', pct: '0%', status: 'em breve' },
  { n: 'B6', color: 'var(--color-purple)', nivel: 'Autonomia e apoio', title: 'Aplicando minha própria insulina', format: 'passo a passo guiado', lessons: '1 módulo', pct: '0%', status: 'em breve' },
];

// Mantido para compatibilidade — usado no dashboard (prévia das 3 primeiras trilhas)
export const TRILHAS_DM1: Trilha[] = TRILHAS_DM1_FAMILIA;

export const TRILHAS_PROF: Trilha[] = [
  { n: '1', color: 'var(--game-blue)', title: 'Identificar sinais do DM1', format: 'vídeo', lessons: '3 aulas', pct: '100%', barClass: 'g', status: 'concluída', statusClass: 'done' },
  { n: '2', color: 'var(--game-green)', title: 'Acolher o aluno', format: 'texto', lessons: '3 aulas', pct: '60%', status: 'em andamento' },
  { n: '3', color: 'var(--color-orange)', title: 'Agir em emergências', format: 'vídeo + quiz', lessons: '4 aulas', pct: '30%', status: 'em andamento' },
  { n: '4', color: 'var(--game-pink)', title: 'Inclusão da turma', format: 'texto', lessons: '3 aulas', pct: '0%', status: 'começar' },
];

export const TRILHAS_SAUDE: Trilha[] = [
  { n: '1', color: 'var(--game-blue)', title: 'Educação em saúde lúdica', format: 'vídeo', lessons: '4 aulas', pct: '100%', barClass: 'g', status: 'concluída', statusClass: 'done' },
  { n: '2', color: 'var(--game-green)', title: 'Rodas de conversa', format: 'texto', lessons: '3 aulas', pct: '80%', status: 'em andamento' },
  { n: '3', color: 'var(--color-orange)', title: 'Monitoramento de resultados', format: 'vídeo + quiz', lessons: '4 aulas', pct: '55%', status: 'em andamento' },
  { n: '4', color: 'var(--game-magenta)', title: 'Embasamento científico', format: 'texto', lessons: '3 aulas', pct: '0%', status: 'começar' },
];

export interface Medalha {
  n: string;
  color: string;
  t: string;
  d: string;
  locked: boolean;
}

// Mesmo conjunto de medalhas independente do papel (dm1/prof/saude) — igual
// ao design, que usa uma lista única de conquistas pros 3 papéis do demo.
export const MEDALS: Medalha[] = [
  { n: '1', color: 'var(--game-pink)', t: 'Primeira trilha', d: 'Concluiu "Os primeiros 30 dias"', locked: false },
  { n: '7', color: 'var(--color-orange)', t: 'Semana de fogo', d: '7 dias seguidos de registro', locked: false },
  { n: '10', color: 'var(--game-green)', t: 'Colecionador', d: '10 registros de glicemia', locked: false },
  { n: '★', color: '', t: 'Explorador', d: 'Conclua 3 trilhas', locked: true },
  { n: '30', color: '', t: 'Mês completo', d: '30 dias seguidos de registro', locked: true },
  { n: '★', color: '', t: 'Herói dos remédios', d: 'Marque 20 doses no diário', locked: true },
  { n: '★', color: '', t: 'Sabe tudo', d: 'Termine todas as trilhas', locked: true },
  { n: '50', color: '', t: 'Veterano', d: '50 registros de glicemia', locked: true },
];
