// Tipos de conteúdo compartilhados pelos jogos reutilizáveis (decisão,
// sequência, prato, stepper, vídeo, mochila, artigo) entre as trilhas de
// família, criança, educador e profissional de saúde. Vive num arquivo à
// parte para evitar import circular entre os arquivos de conteúdo de cada
// persona e o registry central (modulos-content-registry.ts).

export interface DecisaoOpcao {
  label: string;
  ok: boolean;
  desfecho: string;
}

export interface DecisaoCenario {
  situacao: string;
  opcoes: DecisaoOpcao[];
}

export interface SeqItem {
  key: string;
  label: string;
  glyph: string;
  color: string;
}

export interface SeqRound {
  label: string;
  order: string[];
}

export interface SeqReactions {
  idle: string;
  wrong: string;
  ok3: string;
  ok2: string;
  ok1: string;
}

export interface SequenciaContent {
  items: Record<string, SeqItem>;
  rounds: SeqRound[];
  reactions: SeqReactions;
}

export interface PratoFood {
  key: string;
  label: string;
  glyph: string;
  carbs: number;
}

export interface PratoContent {
  intro: string;
  foods: PratoFood[];
  target: { min: number; max: number };
}

export interface StepperStep {
  title: string;
  body: string;
}

export interface StepperContent {
  intro: string;
  steps: StepperStep[];
}

export interface VideoContent {
  caption: string;
  poster: string;
}

export interface MochilaItem {
  key: string;
  label: string;
  glyph: string;
  essencial: boolean;
}

export interface MochilaContent {
  intro: string;
  itens: MochilaItem[];
}

export interface ArtigoContent {
  intro: string;
  paragrafos: string[];
  destaque?: string;
}
