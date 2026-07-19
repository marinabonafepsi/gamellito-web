// Conteúdo dos módulos interativos da Trilha Família (DM1), portado do protótipo
// Gamellito-Dashboard.dc.html. Cada módulo é um único "jogo" — glossário, sequência,
// vídeo, prato, decisão, checklist ou stepper — sem sub-aulas.

export type ModuloTipo = 'glossario' | 'sequencia' | 'video' | 'prato' | 'decisao' | 'checklist' | 'stepper' | 'pdf';

export interface ModuloDef {
  id: string;
  titulo: string;
  tipo: ModuloTipo;
}

export const MODULOS_DM1: Record<string, ModuloDef> = {
  a1: { id: 'a1', titulo: 'A1 · Entendendo o diagnóstico', tipo: 'glossario' },
  a2: { id: 'a2', titulo: 'A2 · Rotina diária: monte a linha do tempo', tipo: 'sequencia' },
  a3: { id: 'a3', titulo: 'A3 · Ponta de dedo e monitorização (CGM)', tipo: 'video' },
  a4: { id: 'a4', titulo: 'A4 · Contagem de carboidratos na prática', tipo: 'prato' },
  a5: { id: 'a5', titulo: 'A5 · Reconhecendo hipo e hiperglicemia', tipo: 'decisao' },
  a6: { id: 'a6', titulo: 'A6 · Cetoacidose: sinais de alerta', tipo: 'checklist' },
  a7: { id: 'a7', titulo: 'A7 · Dias de doença (sick days)', tipo: 'stepper' },
  a10: { id: 'a10', titulo: 'A10 · Conversando com a escola', tipo: 'pdf' },
};

// ---------- A1 · Glossário vivo (flip cards) ----------
export const GLOSS_A1 = [
  { term: 'Insulina', def: 'Hormônio que leva o açúcar do sangue para dentro das células, dando energia ao corpo.' },
  { term: 'Glicemia', def: 'A quantidade de açúcar (glicose) presente no sangue naquele momento.' },
  { term: 'Hipoglicemia', def: 'Quando a glicemia fica baixa demais — precisa de açúcar rápido.' },
  { term: 'Hiperglicemia', def: 'Quando a glicemia fica alta demais — geralmente precisa de mais insulina.' },
  { term: 'Carboidratos', def: 'Nutriente dos alimentos que mais eleva a glicemia — por isso é contado nas refeições.' },
  { term: 'Contagem de carboidratos', def: 'Técnica de calcular quanta insulina aplicar com base no que será comido.' },
  { term: 'HbA1c', def: 'Exame de sangue que mostra a média da glicemia dos últimos 2 a 3 meses.' },
  { term: 'Bomba de insulina', def: 'Aparelho que aplica insulina continuamente, substituindo as canetas.' },
];

export const A1_ACOLHIMENTO = [
  'Receber o diagnóstico de diabetes tipo 1 muda a rotina, mas não muda quem sua família é. É normal sentir medo, culpa ou cansaço nos primeiros dias — nenhuma dessas reações significa que vocês estão fazendo algo errado.',
  'O diabetes tipo 1 acontece porque o pâncreas parou de produzir insulina, o hormônio que leva o açúcar do sangue para as células do corpo. Por isso, a insulina passa a vir de fora: por canetas, seringas ou bomba. Isso não foi causado por açúcar, por algo que a criança comeu ou por algo que a família fez.',
  'Nas próximas semanas vocês vão aprender uma rotina nova junto com a equipe de saúde. Cada módulo aqui foi pensado para caber no seu tempo — sem pressa, no ritmo da família.',
];

// ---------- A2 · Sequência (monte a linha do tempo) ----------
export interface SeqItem {
  key: string;
  label: string;
  glyph: string;
  color: string;
}

export const SEQ_ITEMS: Record<string, SeqItem> = {
  medir: { key: 'medir', label: 'Medir glicemia', glyph: 'M', color: 'var(--color-purple)' },
  insulina: { key: 'insulina', label: 'Aplicar insulina', glyph: 'I', color: 'var(--color-sun)' },
  comer: { key: 'comer', label: 'Comer', glyph: 'C', color: 'var(--color-orange)' },
  ajustar: { key: 'ajustar', label: 'Conferir dose basal', glyph: 'B', color: 'var(--color-sun)' },
  dormir: { key: 'dormir', label: 'Ir dormir', glyph: 'Z', color: 'var(--game-blue)' },
};

export const ROUNDS_A2: { label: string; order: string[] }[] = [
  { label: 'Antes do café da manhã', order: ['medir', 'insulina', 'comer'] },
  { label: 'Antes do almoço', order: ['medir', 'insulina', 'comer'] },
  { label: 'Antes de dormir', order: ['medir', 'ajustar', 'dormir'] },
];

export const SEQ_REACTIONS = {
  idle: 'Toque nos passos na ordem certa para montar a rotina.',
  wrong: 'Ainda não é essa — vamos ver juntos de novo?',
  ok3: 'Isso mesmo, na primeira tentativa! Rotina completa 🌟🌟🌟',
  ok2: 'Isso mesmo! Rotina completa 🌟🌟',
  ok1: 'Isso mesmo! Rotina completa 🌟',
};

// ---------- A4 · Monte o prato (contagem de carboidratos) ----------
export const PRATO_FOODS = [
  { key: 'arroz', label: 'Arroz (4 col.)', glyph: '🍚', carbs: 28 },
  { key: 'feijao', label: 'Feijão (1 concha)', glyph: '🫘', carbs: 12 },
  { key: 'frango', label: 'Frango grelhado', glyph: '🍗', carbs: 0 },
  { key: 'batata', label: 'Batata cozida', glyph: '🥔', carbs: 20 },
  { key: 'salada', label: 'Salada verde', glyph: '🥬', carbs: 2 },
  { key: 'pao', label: 'Pão francês', glyph: '🍞', carbs: 25 },
  { key: 'suco', label: 'Suco de laranja (copo)', glyph: '🧃', carbs: 22 },
  { key: 'maca', label: 'Maçã', glyph: '🍎', carbs: 15 },
];
export const PRATO_TARGET = { min: 45, max: 65 };

// ---------- A5 · Simulador de decisão (hipo/hiper) ----------
export const DECISAO_A5 = [
  {
    situacao: 'Sua filha está tremendo, suando frio e diz que está tonta antes do almoço.',
    opcoes: [
      { label: 'Dar 15g de carboidrato rápido (suco, mel) e medir de novo em 15 min', ok: true, desfecho: 'Isso mesmo! Sinais de hipoglicemia pedem açúcar rápido primeiro — depois é só confirmar com uma nova medição.' },
      { label: 'Aplicar mais insulina para adiantar a próxima dose', ok: false, desfecho: 'Isso pioraria a queda. Quando os sinais são de hipoglicemia, o corpo precisa de açúcar, não de mais insulina.' },
    ],
  },
  {
    situacao: 'Ele está com muita sede, fazendo xixi toda hora e cansado, mas sem sinais de tremor.',
    opcoes: [
      { label: 'Verificar se a insulina de hoje foi aplicada e oferecer água', ok: true, desfecho: 'Isso mesmo! São sinais clássicos de glicemia alta — checar a insulina e hidratar é o primeiro passo.' },
      { label: 'Ignorar, porque sede é normal em dia quente', ok: false, desfecho: 'Sede constante + xixi frequente juntos merecem atenção — não é só o calor.' },
    ],
  },
  {
    situacao: 'Depois de vomitar, seu filho está com respiração ofegante e um hálito diferente, meio adocicado.',
    opcoes: [
      { label: 'Esperar algumas horas para ver se passa sozinho', ok: false, desfecho: 'Esses sinais juntos podem indicar cetoacidose — não é para esperar, é para agir agora.' },
      { label: 'Procurar ajuda médica imediatamente', ok: true, desfecho: 'Isso mesmo! Vômito + respiração ofegante + hálito diferente são sinais de emergência — procure ajuda na hora.' },
    ],
  },
];

// ---------- A6 · Checklist (cetoacidose) ----------
export const CHECK_A6 = [
  { key: 'sede', label: 'Sede muito intensa, fora do comum' },
  { key: 'xixi', label: 'Vontade de urinar com muita frequência' },
  { key: 'vomito', label: 'Vômitos repetidos' },
  { key: 'halito', label: 'Hálito com cheiro de fruta/acetona' },
  { key: 'respiracao', label: 'Respiração rápida e profunda' },
  { key: 'cansaco', label: 'Cansaço extremo, dificuldade de ficar acordado' },
];
export const CHECK_A6_ALERTA = 'Se dois ou mais desses sinais aparecerem juntos — especialmente vômito, hálito diferente e respiração ofegante — procure ajuda médica imediatamente. Não espere melhorar sozinho.';

// ---------- A7 · Protocolo passo a passo (dias de doença) ----------
export const STEPPER_A7 = [
  { title: 'A febre aparece', body: 'Meça a glicemia e a cetona (se tiver o medidor) a cada 4 horas, mesmo sem fome. Febre aumenta a necessidade de insulina, não diminui.' },
  { title: 'O que observar', body: 'Fique de olho em vômito, dor de barriga, respiração mais rápida e recusa de líquidos — sinais de que o corpo não está lidando bem com a doença.' },
  { title: 'Mantenha a hidratação', body: 'Ofereça líquidos com frequência, mesmo em pequenos goles. Se não conseguir comer o normal, substitua por opções líquidas com carboidrato (suco, picolé).' },
  { title: 'Quando ligar para o médico', body: 'Ligue imediatamente se houver vômito repetido, cetonas altas, sonolência incomum ou dificuldade para manter a glicemia dentro da faixa.' },
];

// ---------- A3 · Vídeo ----------
export const VIDEO_A3 = {
  caption: 'Vídeo · 3 min 40s — como usar o glicosímetro e o sensor de monitorização contínua, e o que cada número no gráfico significa.',
  poster: '/assets/gamellito-glicosimetro.svg',
};

// ---------- A10 · PDF ----------
export const PDF_A10 = {
  intro: 'Um modelo editável para levar até a coordenação e alinhar o cuidado no ambiente escolar.',
  nome: 'Carta modelo para a escola.pdf',
  meta: '2 páginas · pronta para editar com o nome da criança',
};
