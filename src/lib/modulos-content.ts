// Conteúdo dos módulos interativos da Trilha Família (DM1), portado do protótipo
// Gamellito-Dashboard.dc.html. Cada módulo é um único "jogo" — glossário, sequência,
// vídeo, prato, decisão, checklist, stepper, mochila, artigo ou pdf — sem sub-aulas.

import type { DecisaoCenario, ArtigoContent, StepperContent, MochilaContent, SeqItem } from './modulos-types';

export type ModuloTipo =
  | 'glossario'
  | 'sequencia'
  | 'video'
  | 'prato'
  | 'decisao'
  | 'checklist'
  | 'stepper'
  | 'mochila'
  | 'artigo'
  | 'pdf';

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
  a8: { id: 'a8', titulo: 'A8 · Diabetes e outras condições', tipo: 'decisao' },
  a9: { id: 'a9', titulo: 'A9 · Complicações de longo prazo', tipo: 'artigo' },
  a10: { id: 'a10', titulo: 'A10 · Conversando com a escola', tipo: 'pdf' },
  a11: { id: 'a11', titulo: 'A11 · Autonomia gradual', tipo: 'stepper' },
  a12: { id: 'a12', titulo: 'A12 · Kit de emergência', tipo: 'mochila' },
  a13: { id: 'a13', titulo: 'A13 · Saúde mental da família', tipo: 'artigo' },
  a14: { id: 'a14', titulo: 'A14 · Rede de apoio multiprofissional', tipo: 'artigo' },
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
export const DECISAO_A5: DecisaoCenario[] = [
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

// ---------- A8 · Decisão (diabetes e outras condições) ----------
export const DECISAO_A8: DecisaoCenario[] = [
  {
    situacao: 'Sua filha foi diagnosticada com doença celíaca além do DM1, e agora precisa também cortar o glúten.',
    opcoes: [
      { label: 'Ajustar a contagem de carboidratos para as novas opções sem glúten, com apoio da nutricionista', ok: true, desfecho: 'Isso mesmo! As duas condições convivem — o segredo é atualizar a contagem de carboidratos para os alimentos sem glúten, não abandonar nenhum dos dois cuidados.' },
      { label: 'Focar só no glúten por enquanto e pausar a contagem de carboidratos', ok: false, desfecho: 'As duas coisas precisam continuar juntas — pausar a contagem de carboidratos aumenta o risco de hipo/hiperglicemia.' },
    ],
  },
  {
    situacao: 'Seu filho está com uma virose comum (sem vômito), mas a família não sabe se isso muda algo na rotina do diabetes.',
    opcoes: [
      { label: 'Medir a glicemia com mais frequência e manter a insulina normalmente', ok: true, desfecho: 'Isso mesmo! Qualquer doença pode alterar a glicemia — o acompanhamento fica mais frequente, mas a insulina não se pausa.' },
      { label: 'Não fazer nada diferente, já que é só uma virose leve', ok: false, desfecho: 'Mesmo uma doença leve pode mexer com a glicemia — vale medir mais vezes para não ser pego de surpresa.' },
    ],
  },
];

// ---------- A9 · Artigo (complicações de longo prazo) ----------
export const ARTIGO_A9: ArtigoContent = {
  intro: 'Falar sobre o futuro sem gerar medo — o controle de hoje é o que mais protege amanhã.',
  paragrafos: [
    'Manter a glicemia numa faixa saudável ao longo dos anos reduz bastante o risco de complicações nos olhos (retinopatia), nos rins (nefropatia) e nos nervos (neuropatia). Isso não é sobre perfeição — é sobre tendência ao longo do tempo.',
    'É por isso que a equipe de saúde pede exames de acompanhamento periódicos, mesmo quando está tudo bem: eles servem para pegar qualquer sinal bem cedo, quando é mais fácil de cuidar.',
    'Encarar esse assunto não é para assustar a família — é para reforçar que cada medição, cada dose e cada ajuste de rotina de hoje têm um efeito real e positivo lá na frente.',
  ],
  destaque: 'Leve essas dúvidas para a próxima consulta: a equipe de saúde pode explicar com calma o que os exames de acompanhamento anual (olhos, rins, pés) significam para o seu caso.',
};

// ---------- A11 · Stepper (autonomia gradual por idade) ----------
export const STEPPER_A11: StepperContent = {
  intro: 'A autonomia no cuidado do diabetes cresce aos poucos, sempre com supervisão de um adulto por perto.',
  steps: [
    { title: '6 a 8 anos', body: 'A criança já ajuda a escolher o lanche e reconhece as primeiras sensações de hipoglicemia, mas a aplicação de insulina e as decisões continuam com o adulto.' },
    { title: '9 a 11 anos', body: 'Pode operar o glicosímetro ou o sensor sozinha, e começa a entender a contagem de carboidratos — sempre com um adulto conferindo o resultado.' },
    { title: '12 a 14 anos', body: 'Muitas crianças já aplicam a própria insulina com supervisão à distância, e começam a levar o próprio kit para passeios curtos.' },
    { title: '15+ anos', body: 'Autonomia crescente para decidir doses e lidar com situações sociais (festas, esportes, viagens), com a família como rede de apoio, não mais como executora direta.' },
  ],
};

// ---------- A12 · Mochila (kit de emergência) ----------
export const MOCHILA_A12: MochilaContent = {
  intro: 'Monte o kit de emergência que deve ficar sempre pronto, em casa e para sair.',
  itens: [
    { key: 'glicosimetro', label: 'Glicosímetro + tiras', glyph: '🩸', essencial: true },
    { key: 'insulina-extra', label: 'Insulina extra', glyph: '💉', essencial: true },
    { key: 'carbo-resgate', label: 'Carboidrato de resgate (suco/gel)', glyph: '🧃', essencial: true },
    { key: 'identificacao', label: 'Identificação médica', glyph: '🪪', essencial: true },
    { key: 'contato', label: 'Contato de emergência', glyph: '📱', essencial: true },
    { key: 'brinquedo', label: 'Brinquedo favorito', glyph: '🧸', essencial: false },
    { key: 'protetor-solar', label: 'Protetor solar', glyph: '🧴', essencial: false },
  ],
};

// ---------- A13 · Artigo (saúde mental da família) ----------
export const ARTIGO_A13: ArtigoContent = {
  intro: 'Cuidar de quem cuida também faz parte do tratamento.',
  paragrafos: [
    'É comum sentir cansaço, ansiedade ou até um luto silencioso pela rotina que mudou depois do diagnóstico. Esses sentimentos não significam fraqueza — fazem parte do processo de adaptação de qualquer família.',
    '"Diabetes burnout" é o nome dado ao esgotamento de cuidar todos os dias, sem pausa, de algo que exige atenção constante. Buscar apoio psicológico não é admitir que não está dando conta — é uma forma de sustentar o cuidado por mais tempo, com mais leveza.',
    'Conversar com outras famílias que vivem o mesmo dia a dia também ajuda a sentir que vocês não estão sozinhos nessa.',
  ],
  destaque: 'Se o cansaço estiver constante, considere buscar um psicólogo com experiência em condições crônicas — peça uma indicação à equipe de saúde que acompanha a família.',
};

// ---------- A14 · Artigo (rede de apoio multiprofissional) ----------
export const ARTIGO_A14: ArtigoContent = {
  intro: 'Conheça os profissionais que podem compor a rede de cuidado ao longo da jornada.',
  paragrafos: [
    'Endocrinologista pediátrico: acompanha o tratamento com insulina e os ajustes de dose ao longo do crescimento.',
    'Nutricionista: ajuda a família a dominar a contagem de carboidratos no dia a dia e em situações especiais (festas, viagens).',
    'Psicólogo: apoia tanto a criança quanto a família a lidar com os aspectos emocionais do diagnóstico e da rotina.',
    'Educador em diabetes (enfermeiro ou outro profissional especializado): ensina a operar os aparelhos e reforça a rotina no dia a dia.',
    'Oftalmologista e outros especialistas de acompanhamento: entram no cuidado a partir dos exames periódicos de rotina.',
  ],
  destaque: 'Nem toda família precisa de todos esses profissionais ao mesmo tempo — a equipe de referência ajuda a decidir quem entra na rede e quando.',
};
