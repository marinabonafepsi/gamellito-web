// Conteúdo dos módulos interativos da Trilha Criança/Adolescente (DM1) —
// mesma ideia da Trilha Família, mas com linguagem e desafios voltados
// diretamente à criança que vive com o diabetes.

import type { ModuloDef } from './modulos-content';
import type { DecisaoCenario, StepperContent, MochilaContent, VideoContent, PratoContent } from './modulos-types';

export const MODULOS_CRIANCA: Record<string, ModuloDef> = {
  b1: { id: 'b1', titulo: 'B1 · O que é o pancrezinho preguiçoso', tipo: 'video' },
  b2: { id: 'b2', titulo: 'B2 · Meu kit: caneta, sensor e lancetas', tipo: 'mochila' },
  b3: { id: 'b3', titulo: 'B3 · Como sei que preciso comer algo doce', tipo: 'decisao' },
  b4: { id: 'b4', titulo: 'B4 · Contando carboidrato com o prato mágico', tipo: 'prato' },
  b5: { id: 'b5', titulo: 'B5 · O que contar pros amigos e pra escola', tipo: 'stepper' },
  b6: { id: 'b6', titulo: 'B6 · Aplicando minha própria insulina', tipo: 'stepper' },
};

// ---------- B1 · Vídeo ----------
export const VIDEO_B1: VideoContent = {
  caption: 'Vídeo animado · 2 min — o pancrezinho parou de fazer uma das suas tarefas, e é por isso que a insulina agora vem de fora do corpo.',
  poster: '/assets/gamellito-glicosimetro.svg',
};

// ---------- B2 · Mochila (meu kit) ----------
export const MOCHILA_B2: MochilaContent = {
  intro: 'Ajude o Gamellito a separar as coisas do kit dele antes de sair de casa!',
  itens: [
    { key: 'caneta', label: 'Caneta de insulina', glyph: '🖊️', essencial: true },
    { key: 'sensor', label: 'Sensor', glyph: '📡', essencial: true },
    { key: 'lancetas', label: 'Lancetas', glyph: '🩹', essencial: true },
    { key: 'docinho', label: 'Docinho de emergência', glyph: '🍬', essencial: true },
    { key: 'bola', label: 'Bola de brincar', glyph: '⚽', essencial: false },
    { key: 'livro', label: 'Livro de história', glyph: '📖', essencial: false },
  ],
};

// ---------- B3 · Decisão (quiz de sinais) ----------
export const DECISAO_B3: DecisaoCenario[] = [
  {
    situacao: 'Você está brincando e de repente sente as mãos tremendo e um pouco de tontura. O que você faz?',
    opcoes: [
      { label: 'Conto pra um adulto e como algo doce rapidinho', ok: true, desfecho: 'Isso mesmo! Tremer e ficar tonto pode ser sinal de que o açúcar no sangue está baixo — contar pra um adulto e comer algo doce ajuda rápido.' },
      { label: 'Continuo brincando até passar sozinho', ok: false, desfecho: 'Melhor não esperar — quando o corpo dá esses sinais, é hora de parar e pedir ajuda.' },
    ],
  },
  {
    situacao: 'Você está com muita sede e fazendo xixi toda hora, mesmo tendo bebido água.',
    opcoes: [
      { label: 'Falo pra um adulto que estou com muita sede sem parar', ok: true, desfecho: 'Isso mesmo! Sede que não passa é um sinal importante — contar pra um adulto ajuda a cuidar disso rapidinho.' },
      { label: 'Acho que é só porque hoje está calor', ok: false, desfecho: 'Pode até ter relação com o calor, mas é sempre bom contar pra um adulto quando a sede não passa.' },
    ],
  },
];

// ---------- B4 · Monte o prato mágico (versão infantil) ----------
export const PRATO_B4: PratoContent = {
  intro: 'Monte um lanche da tarde com carboidrato entre 20g e 35g',
  foods: [
    { key: 'banana', label: 'Banana', glyph: '🍌', carbs: 20 },
    { key: 'biscoito', label: 'Biscoito (3 un.)', glyph: '🍪', carbs: 18 },
    { key: 'iogurte', label: 'Iogurte natural', glyph: '🥛', carbs: 8 },
    { key: 'queijo', label: 'Queijo', glyph: '🧀', carbs: 0 },
    { key: 'uva', label: 'Uvas (10 un.)', glyph: '🍇', carbs: 15 },
    { key: 'pipoca', label: 'Pipoca (1 tigela)', glyph: '🍿', carbs: 12 },
  ],
  target: { min: 20, max: 35 },
};

// ---------- B5 · Stepper (história em quadrinhos: contar pros amigos) ----------
export const STEPPER_B5: StepperContent = {
  intro: 'Uma historinha em quadrinhos sobre contar pros amigos que você tem diabetes tipo 1.',
  steps: [
    { title: 'Quadrinho 1', body: '"Gente, eu tenho diabetes tipo 1. Isso quer dizer que meu corpo precisa de uma ajudinha extra pra usar a energia da comida."' },
    { title: 'Quadrinho 2', body: '"Às vezes eu preciso medir meu açúcar no sangue ou aplicar insulina — não dói tanto, e não é contagioso!"' },
    { title: 'Quadrinho 3', body: '"Se um dia vocês me virem tremendo ou meio zonzo, é só chamar um adulto rapidinho, tá bom?"' },
    { title: 'Quadrinho 4', body: '"Fora isso, eu sou igualzinho a vocês: adoro brincar, jogar bola e me divertir!"' },
  ],
};

// ---------- B6 · Stepper (aplicando minha própria insulina) ----------
export const STEPPER_B6: StepperContent = {
  intro: 'Um passo a passo para quando você (com um adulto por perto) for aplicar sua própria insulina.',
  steps: [
    { title: 'Lave as mãos', body: 'Lave bem as mãos com água e sabão antes de começar — assim como você aprendeu na hora de medir a glicemia.' },
    { title: 'Prepare a caneta', body: 'Com ajuda de um adulto, confira a dose certinha marcada na caneta de insulina.' },
    { title: 'Escolha o local', body: 'Lembre do rodízio: barriga, coxa ou braço — sempre em um lugar diferente do da última vez.' },
    { title: 'Aplique com calma', body: 'Respire fundo, aplique devagar e conte até 10 antes de tirar a agulha — você conseguiu!' },
  ],
};
