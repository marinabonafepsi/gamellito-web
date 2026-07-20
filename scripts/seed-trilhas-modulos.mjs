// Seed idempotente: migra o conteúdo hoje hardcoded em src/lib/trilhas-data.ts
// e src/lib/modulos-content*.ts para as tabelas `trilhas`/`modulos` (ver
// supabase/migrations/20260719000100_create_trilhas_modulos_tables.sql).
//
// Uso: node scripts/seed-trilhas-modulos.mjs
// Requer NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local
// (a migration acima precisa já ter sido aplicada antes de rodar isso).

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

function loadEnvLocal() {
  const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const env = loadEnvLocal();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Conteúdo (transcrito de src/lib/trilhas-data.ts + modulos-content*.ts)
// ---------------------------------------------------------------------------

const GLOSS_A1 = [
  { term: 'Insulina', def: 'Hormônio que leva o açúcar do sangue para dentro das células, dando energia ao corpo.' },
  { term: 'Glicemia', def: 'A quantidade de açúcar (glicose) presente no sangue naquele momento.' },
  { term: 'Hipoglicemia', def: 'Quando a glicemia fica baixa demais — precisa de açúcar rápido.' },
  { term: 'Hiperglicemia', def: 'Quando a glicemia fica alta demais — geralmente precisa de mais insulina.' },
  { term: 'Carboidratos', def: 'Nutriente dos alimentos que mais eleva a glicemia — por isso é contado nas refeições.' },
  { term: 'Contagem de carboidratos', def: 'Técnica de calcular quanta insulina aplicar com base no que será comido.' },
  { term: 'HbA1c', def: 'Exame de sangue que mostra a média da glicemia dos últimos 2 a 3 meses.' },
  { term: 'Bomba de insulina', def: 'Aparelho que aplica insulina continuamente, substituindo as canetas.' },
];

const A1_ACOLHIMENTO = [
  'Receber o diagnóstico de diabetes tipo 1 muda a rotina, mas não muda quem sua família é. É normal sentir medo, culpa ou cansaço nos primeiros dias — nenhuma dessas reações significa que vocês estão fazendo algo errado.',
  'O diabetes tipo 1 acontece porque o pâncreas parou de produzir insulina, o hormônio que leva o açúcar do sangue para as células do corpo. Por isso, a insulina passa a vir de fora: por canetas, seringas ou bomba. Isso não foi causado por açúcar, por algo que a criança comeu ou por algo que a família fez.',
  'Nas próximas semanas vocês vão aprender uma rotina nova junto com a equipe de saúde. Cada módulo aqui foi pensado para caber no seu tempo — sem pressa, no ritmo da família.',
];

const SEQ_ITEMS = {
  medir: { key: 'medir', label: 'Medir glicemia', glyph: 'M', color: 'var(--color-purple)' },
  insulina: { key: 'insulina', label: 'Aplicar insulina', glyph: 'I', color: 'var(--color-sun)' },
  comer: { key: 'comer', label: 'Comer', glyph: 'C', color: 'var(--color-orange)' },
  ajustar: { key: 'ajustar', label: 'Conferir dose basal', glyph: 'B', color: 'var(--color-sun)' },
  dormir: { key: 'dormir', label: 'Ir dormir', glyph: 'Z', color: 'var(--game-blue)' },
};
const ROUNDS_A2 = [
  { label: 'Antes do café da manhã', order: ['medir', 'insulina', 'comer'] },
  { label: 'Antes do almoço', order: ['medir', 'insulina', 'comer'] },
  { label: 'Antes de dormir', order: ['medir', 'ajustar', 'dormir'] },
];
const SEQ_REACTIONS = {
  idle: 'Toque nos passos na ordem certa para montar a rotina.',
  wrong: 'Ainda não é essa — vamos ver juntos de novo?',
  ok3: 'Isso mesmo, na primeira tentativa! Rotina completa 🌟🌟🌟',
  ok2: 'Isso mesmo! Rotina completa 🌟🌟',
  ok1: 'Isso mesmo! Rotina completa 🌟',
};

const VIDEO_A3 = {
  caption: 'Vídeo · 3 min 40s — como usar o glicosímetro e o sensor de monitorização contínua, e o que cada número no gráfico significa.',
  poster: '/assets/gamellito-glicosimetro.svg',
};

const PRATO_FOODS = [
  { key: 'arroz', label: 'Arroz (4 col.)', glyph: '🍚', carbs: 28 },
  { key: 'feijao', label: 'Feijão (1 concha)', glyph: '🫘', carbs: 12 },
  { key: 'frango', label: 'Frango grelhado', glyph: '🍗', carbs: 0 },
  { key: 'batata', label: 'Batata cozida', glyph: '🥔', carbs: 20 },
  { key: 'salada', label: 'Salada verde', glyph: '🥬', carbs: 2 },
  { key: 'pao', label: 'Pão francês', glyph: '🍞', carbs: 25 },
  { key: 'suco', label: 'Suco de laranja (copo)', glyph: '🧃', carbs: 22 },
  { key: 'maca', label: 'Maçã', glyph: '🍎', carbs: 15 },
];
const PRATO_TARGET = { min: 45, max: 65 };

const DECISAO_A5 = [
  { situacao: 'Sua filha está tremendo, suando frio e diz que está tonta antes do almoço.', opcoes: [
    { label: 'Dar 15g de carboidrato rápido (suco, mel) e medir de novo em 15 min', ok: true, desfecho: 'Isso mesmo! Sinais de hipoglicemia pedem açúcar rápido primeiro — depois é só confirmar com uma nova medição.' },
    { label: 'Aplicar mais insulina para adiantar a próxima dose', ok: false, desfecho: 'Isso pioraria a queda. Quando os sinais são de hipoglicemia, o corpo precisa de açúcar, não de mais insulina.' },
  ]},
  { situacao: 'Ele está com muita sede, fazendo xixi toda hora e cansado, mas sem sinais de tremor.', opcoes: [
    { label: 'Verificar se a insulina de hoje foi aplicada e oferecer água', ok: true, desfecho: 'Isso mesmo! São sinais clássicos de glicemia alta — checar a insulina e hidratar é o primeiro passo.' },
    { label: 'Ignorar, porque sede é normal em dia quente', ok: false, desfecho: 'Sede constante + xixi frequente juntos merecem atenção — não é só o calor.' },
  ]},
  { situacao: 'Depois de vomitar, seu filho está com respiração ofegante e um hálito diferente, meio adocicado.', opcoes: [
    { label: 'Esperar algumas horas para ver se passa sozinho', ok: false, desfecho: 'Esses sinais juntos podem indicar cetoacidose — não é para esperar, é para agir agora.' },
    { label: 'Procurar ajuda médica imediatamente', ok: true, desfecho: 'Isso mesmo! Vômito + respiração ofegante + hálito diferente são sinais de emergência — procure ajuda na hora.' },
  ]},
];

const CHECK_A6 = [
  { key: 'sede', label: 'Sede muito intensa, fora do comum' },
  { key: 'xixi', label: 'Vontade de urinar com muita frequência' },
  { key: 'vomito', label: 'Vômitos repetidos' },
  { key: 'halito', label: 'Hálito com cheiro de fruta/acetona' },
  { key: 'respiracao', label: 'Respiração rápida e profunda' },
  { key: 'cansaco', label: 'Cansaço extremo, dificuldade de ficar acordado' },
];
const CHECK_A6_ALERTA = 'Se dois ou mais desses sinais aparecerem juntos — especialmente vômito, hálito diferente e respiração ofegante — procure ajuda médica imediatamente. Não espere melhorar sozinho.';
const CHECK_A6_INTRO = 'Marque os sinais que você já observou ou reconhece — quanto mais cedo identificar, mais rápido é buscar ajuda.';

const STEPPER_A7 = [
  { title: 'A febre aparece', body: 'Meça a glicemia e a cetona (se tiver o medidor) a cada 4 horas, mesmo sem fome. Febre aumenta a necessidade de insulina, não diminui.' },
  { title: 'O que observar', body: 'Fique de olho em vômito, dor de barriga, respiração mais rápida e recusa de líquidos — sinais de que o corpo não está lidando bem com a doença.' },
  { title: 'Mantenha a hidratação', body: 'Ofereça líquidos com frequência, mesmo em pequenos goles. Se não conseguir comer o normal, substitua por opções líquidas com carboidrato (suco, picolé).' },
  { title: 'Quando ligar para o médico', body: 'Ligue imediatamente se houver vômito repetido, cetonas altas, sonolência incomum ou dificuldade para manter a glicemia dentro da faixa.' },
];

const PDF_A10 = {
  intro: 'Um modelo editável para levar até a coordenação e alinhar o cuidado no ambiente escolar.',
  nome: 'Carta modelo para a escola.pdf',
  meta: '2 páginas · pronta para editar com o nome da criança',
};

const DECISAO_A8 = [
  { situacao: 'Sua filha foi diagnosticada com doença celíaca além do DM1, e agora precisa também cortar o glúten.', opcoes: [
    { label: 'Ajustar a contagem de carboidratos para as novas opções sem glúten, com apoio da nutricionista', ok: true, desfecho: 'Isso mesmo! As duas condições convivem — o segredo é atualizar a contagem de carboidratos para os alimentos sem glúten, não abandonar nenhum dos dois cuidados.' },
    { label: 'Focar só no glúten por enquanto e pausar a contagem de carboidratos', ok: false, desfecho: 'As duas coisas precisam continuar juntas — pausar a contagem de carboidratos aumenta o risco de hipo/hiperglicemia.' },
  ]},
  { situacao: 'Seu filho está com uma virose comum (sem vômito), mas a família não sabe se isso muda algo na rotina do diabetes.', opcoes: [
    { label: 'Medir a glicemia com mais frequência e manter a insulina normalmente', ok: true, desfecho: 'Isso mesmo! Qualquer doença pode alterar a glicemia — o acompanhamento fica mais frequente, mas a insulina não se pausa.' },
    { label: 'Não fazer nada diferente, já que é só uma virose leve', ok: false, desfecho: 'Mesmo uma doença leve pode mexer com a glicemia — vale medir mais vezes para não ser pego de surpresa.' },
  ]},
];

const ARTIGO_A9 = {
  intro: 'Falar sobre o futuro sem gerar medo — o controle de hoje é o que mais protege amanhã.',
  paragrafos: [
    'Manter a glicemia numa faixa saudável ao longo dos anos reduz bastante o risco de complicações nos olhos (retinopatia), nos rins (nefropatia) e nos nervos (neuropatia). Isso não é sobre perfeição — é sobre tendência ao longo do tempo.',
    'É por isso que a equipe de saúde pede exames de acompanhamento periódicos, mesmo quando está tudo bem: eles servem para pegar qualquer sinal bem cedo, quando é mais fácil de cuidar.',
    'Encarar esse assunto não é para assustar a família — é para reforçar que cada medição, cada dose e cada ajuste de rotina de hoje têm um efeito real e positivo lá na frente.',
  ],
  destaque: 'Leve essas dúvidas para a próxima consulta: a equipe de saúde pode explicar com calma o que os exames de acompanhamento anual (olhos, rins, pés) significam para o seu caso.',
};

const STEPPER_A11 = {
  intro: 'A autonomia no cuidado do diabetes cresce aos poucos, sempre com supervisão de um adulto por perto.',
  steps: [
    { title: '6 a 8 anos', body: 'A criança já ajuda a escolher o lanche e reconhece as primeiras sensações de hipoglicemia, mas a aplicação de insulina e as decisões continuam com o adulto.' },
    { title: '9 a 11 anos', body: 'Pode operar o glicosímetro ou o sensor sozinha, e começa a entender a contagem de carboidratos — sempre com um adulto conferindo o resultado.' },
    { title: '12 a 14 anos', body: 'Muitas crianças já aplicam a própria insulina com supervisão à distância, e começam a levar o próprio kit para passeios curtos.' },
    { title: '15+ anos', body: 'Autonomia crescente para decidir doses e lidar com situações sociais (festas, esportes, viagens), com a família como rede de apoio, não mais como executora direta.' },
  ],
};

const MOCHILA_A12 = {
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

const ARTIGO_A13 = {
  intro: 'Cuidar de quem cuida também faz parte do tratamento.',
  paragrafos: [
    'É comum sentir cansaço, ansiedade ou até um luto silencioso pela rotina que mudou depois do diagnóstico. Esses sentimentos não significam fraqueza — fazem parte do processo de adaptação de qualquer família.',
    '"Diabetes burnout" é o nome dado ao esgotamento de cuidar todos os dias, sem pausa, de algo que exige atenção constante. Buscar apoio psicológico não é admitir que não está dando conta — é uma forma de sustentar o cuidado por mais tempo, com mais leveza.',
    'Conversar com outras famílias que vivem o mesmo dia a dia também ajuda a sentir que vocês não estão sozinhos nessa.',
  ],
  destaque: 'Se o cansaço estiver constante, considere buscar um psicólogo com experiência em condições crônicas — peça uma indicação à equipe de saúde que acompanha a família.',
};

const ARTIGO_A14 = {
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

const VIDEO_B1 = {
  caption: 'Vídeo animado · 2 min — o pancrezinho parou de fazer uma das suas tarefas, e é por isso que a insulina agora vem de fora do corpo.',
  poster: '/assets/gamellito-glicosimetro.svg',
};

const MOCHILA_B2 = {
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

const DECISAO_B3 = [
  { situacao: 'Você está brincando e de repente sente as mãos tremendo e um pouco de tontura. O que você faz?', opcoes: [
    { label: 'Conto pra um adulto e como algo doce rapidinho', ok: true, desfecho: 'Isso mesmo! Tremer e ficar tonto pode ser sinal de que o açúcar no sangue está baixo — contar pra um adulto e comer algo doce ajuda rápido.' },
    { label: 'Continuo brincando até passar sozinho', ok: false, desfecho: 'Melhor não esperar — quando o corpo dá esses sinais, é hora de parar e pedir ajuda.' },
  ]},
  { situacao: 'Você está com muita sede e fazendo xixi toda hora, mesmo tendo bebido água.', opcoes: [
    { label: 'Falo pra um adulto que estou com muita sede sem parar', ok: true, desfecho: 'Isso mesmo! Sede que não passa é um sinal importante — contar pra um adulto ajuda a cuidar disso rapidinho.' },
    { label: 'Acho que é só porque hoje está calor', ok: false, desfecho: 'Pode até ter relação com o calor, mas é sempre bom contar pra um adulto quando a sede não passa.' },
  ]},
];

const PRATO_B4 = {
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

const STEPPER_B5 = {
  intro: 'Uma historinha em quadrinhos sobre contar pros amigos que você tem diabetes tipo 1.',
  steps: [
    { title: 'Quadrinho 1', body: '"Gente, eu tenho diabetes tipo 1. Isso quer dizer que meu corpo precisa de uma ajudinha extra pra usar a energia da comida."' },
    { title: 'Quadrinho 2', body: '"Às vezes eu preciso medir meu açúcar no sangue ou aplicar insulina — não dói tanto, e não é contagioso!"' },
    { title: 'Quadrinho 3', body: '"Se um dia vocês me virem tremendo ou meio zonzo, é só chamar um adulto rapidinho, tá bom?"' },
    { title: 'Quadrinho 4', body: '"Fora isso, eu sou igualzinho a vocês: adoro brincar, jogar bola e me divertir!"' },
  ],
};

const STEPPER_B6 = {
  intro: 'Um passo a passo para quando você (com um adulto por perto) for aplicar sua própria insulina.',
  steps: [
    { title: 'Lave as mãos', body: 'Lave bem as mãos com água e sabão antes de começar — assim como você aprendeu na hora de medir a glicemia.' },
    { title: 'Prepare a caneta', body: 'Com ajuda de um adulto, confira a dose certinha marcada na caneta de insulina.' },
    { title: 'Escolha o local', body: 'Lembre do rodízio: barriga, coxa ou braço — sempre em um lugar diferente do da última vez.' },
    { title: 'Aplique com calma', body: 'Respire fundo, aplique devagar e conte até 10 antes de tirar a agulha — você conseguiu!' },
  ],
};

const DECISAO_PROF1 = [
  { situacao: 'Um aluno com DM1 está mais quieto que o normal durante a aula, com as mãos meio trêmulas.', opcoes: [
    { label: 'Discretamente perguntar como ele está e sugerir medir a glicemia', ok: true, desfecho: 'Isso mesmo! Tremor e mudança de comportamento merecem uma checagem discreta — sem alarde na frente da turma.' },
    { label: 'Pedir pra ele prestar mais atenção na aula', ok: false, desfecho: 'Tremor e quietude fora do padrão podem ser sinais de hipoglicemia, não falta de atenção — vale checar antes de repreender.' },
  ]},
  { situacao: 'No recreio, um aluno com DM1 pede pra beber água toda hora e vai ao banheiro com frequência incomum.', opcoes: [
    { label: 'Observar e, se persistir, avisar a coordenação/família', ok: true, desfecho: 'Isso mesmo! Sede e idas ao banheiro fora do padrão podem indicar glicemia alta — vale registrar e comunicar.' },
    { label: 'Não dar importância, já que criança bebe água mesmo', ok: false, desfecho: 'Beber água é normal, mas esse padrão insistente e fora do comum é um sinal que vale a pena observar com atenção.' },
  ]},
];

const ARTIGO_PROF2 = {
  intro: 'Acolher um aluno com DM1 começa por entender que a condição não define quem ele é.',
  paragrafos: [
    'Um aluno com diabetes tipo 1 pode participar de todas as atividades da escola — educação física, passeios, festas — com pequenos ajustes de rotina, não com restrições generalizadas.',
    'Evite tratamentos que destaquem a criança na frente da turma (como comentar em voz alta sobre remédios ou lanches). Um combinado discreto entre professor, família e o próprio aluno costuma funcionar melhor.',
    'Vale perguntar diretamente à família (ou ao aluno, dependendo da idade) como ele prefere que a escola aja em situações do dia a dia — cada criança tem um jeito diferente de lidar com isso.',
  ],
  destaque: 'Pergunte à família: existe um plano de cuidado escolar por escrito? Ter esse documento em mãos ajuda toda a equipe pedagógica a agir de forma consistente.',
};

const SEQUENCIA_PROF3 = {
  items: {
    observar: { key: 'observar', label: 'Observar os sinais', glyph: 'O', color: 'var(--game-blue)' },
    medir: { key: 'medir', label: 'Ajudar a medir/tratar', glyph: 'M', color: 'var(--color-purple)' },
    coordenacao: { key: 'coordenacao', label: 'Chamar a coordenação', glyph: 'C', color: 'var(--color-orange)' },
    familia: { key: 'familia', label: 'Acionar a família', glyph: 'F', color: 'var(--game-green)' },
  },
  rounds: [
    { label: 'Aluno com sinais leves de hipoglicemia no recreio', order: ['observar', 'medir', 'coordenacao'] },
    { label: 'Sinais não melhoram após o primeiro tratamento', order: ['observar', 'coordenacao', 'familia'] },
  ],
  reactions: {
    idle: 'Toque nas ações na ordem certa para montar o protocolo.',
    wrong: 'Essa ordem ainda não é a mais segura — vamos tentar de novo?',
    ok3: 'Isso mesmo, na primeira tentativa! Protocolo completo 🌟🌟🌟',
    ok2: 'Isso mesmo! Protocolo completo 🌟🌟',
    ok1: 'Isso mesmo! Protocolo completo 🌟',
  },
};

const ARTIGO_PROF4 = {
  intro: 'Uma turma bem informada é a melhor rede de apoio para um colega com DM1.',
  paragrafos: [
    'Com o consentimento da família (e, se fizer sentido, do próprio aluno), uma conversa simples com a turma sobre o que é diabetes tipo 1 ajuda a reduzir curiosidade invasiva e evita comentários sem querer machucar.',
    'Em festas e lanches coletivos, incluir pelo menos uma opção compatível com a contagem de carboidratos evita que o aluno precise ficar de fora ou comer algo separado de forma constrangedora.',
    'Pequenos gestos — como deixar o aluno guardar o kit de emergência num lugar acessível da sala — fazem diferença sem chamar atenção extra para a condição.',
  ],
};

const VIDEO_SAUDE1 = {
  caption: 'Vídeo · 4 min 10s — como o Gamellito pode apoiar consultas e explicações lúdicas do diagnóstico para crianças.',
  poster: '/assets/gamellito-glicosimetro.svg',
};

const ARTIGO_SAUDE2 = {
  intro: 'Rodas de conversa entre famílias reduzem a sensação de isolamento no dia a dia com o DM1.',
  paragrafos: [
    'Reunir famílias que vivem a mesma rotina — em grupos presenciais ou remotos — cria um espaço para trocar experiências práticas que vão além do que cabe numa consulta.',
    'O papel do profissional de saúde nessas rodas costuma ser mais de facilitador do que de palestrante: perguntas abertas geram mais troca real do que uma exposição unilateral de conteúdo.',
    'Vale incluir, quando possível, uma roda específica para os próprios adolescentes com DM1, sem os pais na sala — eles costumam falar mais livremente sobre dificuldades sociais entre pares.',
  ],
};

const DECISAO_SAUDE3 = [
  { situacao: 'O relatório do sensor de um paciente mostra glicemia estável durante o dia, mas picos frequentes de madrugada.', opcoes: [
    { label: 'Investigar o esquema de insulina basal noturna e hábitos antes de dormir', ok: true, desfecho: 'Isso mesmo! Padrões noturnos recorrentes geralmente apontam para o esquema basal ou algo na rotina antes de dormir, não para um evento isolado.' },
    { label: 'Ignorar, já que a média geral do dia está boa', ok: false, desfecho: 'A média pode esconder um padrão real — picos recorrentes na madrugada merecem investigação específica, mesmo com boa média geral.' },
  ]},
  { situacao: 'Uma família registra poucas medições de glicemia por semana no aplicativo, mesmo após orientação.', opcoes: [
    { label: 'Explorar com empatia as barreiras práticas antes de reforçar apenas a orientação técnica', ok: true, desfecho: 'Isso mesmo! Baixa adesão ao registro costuma ter uma causa prática ou emocional por trás — entender isso rende mais do que repetir a mesma orientação.' },
    { label: 'Repetir a mesma orientação técnica sobre a importância de medir', ok: false, desfecho: 'Repetir a mesma orientação sem entender a barreira real tende a não mudar o comportamento — vale investigar o motivo primeiro.' },
  ]},
];

const ARTIGO_SAUDE4 = {
  intro: 'Um resumo do que sustenta a abordagem gamificada e centrada na família usada no Gamellito.',
  paragrafos: [
    'Diretrizes internacionais de manejo do DM1 pediátrico (como as da ISPAD) recomendam educação continuada e individualizada como parte do tratamento, não apenas a prescrição de insulina.',
    'Evidências em educação em saúde mostram que abordagens lúdicas e microaprendizagem aumentam a retenção de rotinas complexas, especialmente em crianças e adolescentes.',
    'O acompanhamento multiprofissional (endocrinologia, nutrição, psicologia e educação em diabetes) está associado a melhores desfechos de controle glicêmico a longo prazo do que o acompanhamento isolado.',
  ],
  destaque: 'Este resumo não substitui a leitura das diretrizes originais — use-o como ponto de partida para discussão com a equipe multiprofissional.',
};

// ---------------------------------------------------------------------------
// Estrutura de trilhas + módulos
// ---------------------------------------------------------------------------

const TRILHAS = [
  { key: 'familia-primeiros-passos', persona: 'familia', nome: 'Primeiros passos', cor: 'var(--game-green)', ordem: 0 },
  { key: 'familia-rotina', persona: 'familia', nome: 'Rotina do dia a dia', cor: 'var(--game-blue)', ordem: 1 },
  { key: 'familia-situacoes', persona: 'familia', nome: 'Situações especiais', cor: 'var(--color-orange)', ordem: 2 },
  { key: 'familia-autonomia', persona: 'familia', nome: 'Autonomia e apoio', cor: 'var(--color-purple)', ordem: 3 },

  { key: 'crianca-primeiros-passos', persona: 'crianca', nome: 'Primeiros passos', cor: 'var(--game-green)', ordem: 0 },
  { key: 'crianca-rotina', persona: 'crianca', nome: 'Rotina do dia a dia', cor: 'var(--game-blue)', ordem: 1 },
  { key: 'crianca-situacoes', persona: 'crianca', nome: 'Situações especiais', cor: 'var(--color-orange)', ordem: 2 },
  { key: 'crianca-autonomia', persona: 'crianca', nome: 'Autonomia e apoio', cor: 'var(--color-purple)', ordem: 3 },

  { key: 'educador-trilha', persona: 'educador', nome: 'Trilha do Educador', cor: 'var(--game-blue)', ordem: 0 },
  { key: 'profissional-trilha', persona: 'profissional', nome: 'Método Gamellito', cor: 'var(--game-blue)', ordem: 0 },
];

function mod(id, trilhaKey, ordem, codigo, titulo, cor, formato, licoes, pct, barClass, status, statusClass, tipo, conteudo) {
  return { id, trilhaKey, ordem, codigo, titulo, cor, formato, licoes_label: licoes, pct_demo: pct, bar_class: barClass, status_demo: status, status_class: statusClass, tipo, conteudo };
}

const MODULOS = [
  // ---- Família ----
  mod('a1', 'familia-primeiros-passos', 0, 'A1', 'Entendendo o diagnóstico', 'var(--game-green)', 'vídeo + glossário vivo', '1 módulo', '100%', 'g', 'concluída', 'done', 'glossario', { paragrafos: A1_ACOLHIMENTO, cards: GLOSS_A1 }),
  mod('a2', 'familia-primeiros-passos', 1, 'A2', 'Rotina diária: glicemia, insulina e refeições', 'var(--game-green)', 'linha do tempo interativa', '1 módulo', '60%', null, 'em andamento', null, 'sequencia', { items: SEQ_ITEMS, rounds: ROUNDS_A2, reactions: SEQ_REACTIONS }),
  mod('a3', 'familia-rotina', 0, 'A3', 'Ponta de dedo e monitorização (CGM)', 'var(--game-blue)', 'vídeo', '1 módulo', '0%', null, 'começar', null, 'video', VIDEO_A3),
  mod('a4', 'familia-rotina', 1, 'A4', 'Contagem de carboidratos na prática', 'var(--game-blue)', 'monte o prato', '1 módulo', '0%', null, 'começar', null, 'prato', { intro: `Monte um prato de almoço com carboidrato entre ${PRATO_TARGET.min}g e ${PRATO_TARGET.max}g`, foods: PRATO_FOODS, target: PRATO_TARGET }),
  mod('a5', 'familia-rotina', 2, 'A5', 'Reconhecendo hipo e hiperglicemia', 'var(--game-blue)', 'simulador de decisão', '1 módulo', '0%', null, 'começar', null, 'decisao', { cenarios: DECISAO_A5 }),
  mod('a6', 'familia-rotina', 3, 'A6', 'Cetoacidose: sinais de alerta', 'var(--game-blue)', 'checklist', '1 módulo', '0%', null, 'começar', null, 'checklist', { intro: CHECK_A6_INTRO, itens: CHECK_A6, alerta: CHECK_A6_ALERTA }),
  mod('a7', 'familia-rotina', 4, 'A7', 'Dias de doença (sick days)', 'var(--game-blue)', 'protocolo passo a passo', '1 módulo', '0%', null, 'começar', null, 'stepper', { intro: 'Um roteiro simples para os dias em que a família enfrenta febre ou outra doença junto com o diabetes.', steps: STEPPER_A7 }),
  mod('a8', 'familia-situacoes', 0, 'A8', 'Diabetes e outras condições', 'var(--color-orange)', 'cartão + quiz', '1 módulo', '0%', null, 'em breve', null, 'decisao', { cenarios: DECISAO_A8 }),
  mod('a9', 'familia-situacoes', 1, 'A9', 'Complicações de longo prazo', 'var(--color-orange)', 'infográfico', '1 módulo', '0%', null, 'em breve', null, 'artigo', ARTIGO_A9),
  mod('a10', 'familia-situacoes', 2, 'A10', 'Conversando com a escola', 'var(--color-orange)', 'modelo editável', '1 módulo', '0%', null, 'começar', null, 'pdf', { ...PDF_A10, url: null }),
  mod('a11', 'familia-situacoes', 3, 'A11', 'Autonomia gradual', 'var(--color-orange)', 'marcos por idade', '1 módulo', '0%', null, 'em breve', null, 'stepper', STEPPER_A11),
  mod('a12', 'familia-autonomia', 0, 'A12', 'Kit de emergência', 'var(--color-purple)', 'monte a mochila', '1 módulo', '0%', null, 'em breve', null, 'mochila', MOCHILA_A12),
  mod('a13', 'familia-autonomia', 1, 'A13', 'Saúde mental da família', 'var(--color-purple)', 'texto + indicação', '1 módulo', '0%', null, 'em breve', null, 'artigo', ARTIGO_A13),
  mod('a14', 'familia-autonomia', 2, 'A14', 'Rede de apoio multiprofissional', 'var(--color-purple)', 'mapa de especialistas', '1 módulo', '0%', null, 'em breve', null, 'artigo', ARTIGO_A14),

  // ---- Criança/adolescente ----
  mod('b1', 'crianca-primeiros-passos', 0, 'B1', 'O que é o pancrezinho preguiçoso', 'var(--game-green)', 'vídeo animado', '1 módulo', '0%', null, 'em breve', null, 'video', VIDEO_B1),
  mod('b2', 'crianca-primeiros-passos', 1, 'B2', 'Meu kit: caneta, sensor e lancetas', 'var(--game-green)', 'encontre os objetos', '1 módulo', '0%', null, 'em breve', null, 'mochila', MOCHILA_B2),
  mod('b3', 'crianca-rotina', 0, 'B3', 'Como sei que preciso comer algo doce', 'var(--game-blue)', 'quiz de sinais', '1 módulo', '0%', null, 'em breve', null, 'decisao', { cenarios: DECISAO_B3 }),
  mod('b4', 'crianca-rotina', 1, 'B4', 'Contando carboidrato com o prato mágico', 'var(--game-blue)', 'monte o prato', '1 módulo', '0%', null, 'em breve', null, 'prato', PRATO_B4),
  mod('b5', 'crianca-situacoes', 0, 'B5', 'O que contar pros amigos e pra escola', 'var(--color-orange)', 'história em quadrinhos', '1 módulo', '0%', null, 'em breve', null, 'stepper', STEPPER_B5),
  mod('b6', 'crianca-autonomia', 0, 'B6', 'Aplicando minha própria insulina', 'var(--color-purple)', 'passo a passo guiado', '1 módulo', '0%', null, 'em breve', null, 'stepper', STEPPER_B6),

  // ---- Educador ----
  mod('prof-1', 'educador-trilha', 0, '1', 'Identificar sinais do DM1', 'var(--game-blue)', 'vídeo', '3 aulas', '100%', 'g', 'concluída', 'done', 'decisao', { cenarios: DECISAO_PROF1 }),
  mod('prof-2', 'educador-trilha', 1, '2', 'Acolher o aluno', 'var(--game-green)', 'texto', '3 aulas', '60%', null, 'em andamento', null, 'artigo', ARTIGO_PROF2),
  mod('prof-3', 'educador-trilha', 2, '3', 'Agir em emergências', 'var(--color-orange)', 'vídeo + quiz', '4 aulas', '30%', null, 'em andamento', null, 'sequencia', SEQUENCIA_PROF3),
  mod('prof-4', 'educador-trilha', 3, '4', 'Inclusão da turma', 'var(--game-pink)', 'texto', '3 aulas', '0%', null, 'começar', null, 'artigo', ARTIGO_PROF4),

  // ---- Profissional de saúde ----
  mod('saude-1', 'profissional-trilha', 0, '1', 'Educação em saúde lúdica', 'var(--game-blue)', 'vídeo', '4 aulas', '100%', 'g', 'concluída', 'done', 'video', VIDEO_SAUDE1),
  mod('saude-2', 'profissional-trilha', 1, '2', 'Rodas de conversa', 'var(--game-green)', 'texto', '3 aulas', '80%', null, 'em andamento', null, 'artigo', ARTIGO_SAUDE2),
  mod('saude-3', 'profissional-trilha', 2, '3', 'Monitoramento de resultados', 'var(--color-orange)', 'vídeo + quiz', '4 aulas', '55%', null, 'em andamento', null, 'decisao', { cenarios: DECISAO_SAUDE3 }),
  mod('saude-4', 'profissional-trilha', 3, '4', 'Embasamento científico', 'var(--game-magenta)', 'texto', '3 aulas', '0%', null, 'começar', null, 'artigo', ARTIGO_SAUDE4),
];

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Upserting ${TRILHAS.length} trilhas...`);
  const trilhaIdByKey = {};

  for (const t of TRILHAS) {
    const { data, error } = await supabase
      .from('trilhas')
      .upsert({ persona: t.persona, nome: t.nome, cor: t.cor, ordem: t.ordem }, { onConflict: 'persona,nome' })
      .select('id')
      .single();
    if (error) {
      console.error(`  ERRO trilha ${t.key}:`, error.message);
      process.exit(1);
    }
    trilhaIdByKey[t.key] = data.id;
    console.log(`  ok: ${t.persona}/${t.nome} -> ${data.id}`);
  }

  console.log(`\nUpserting ${MODULOS.length} modulos...`);
  const rows = MODULOS.map((m) => ({
    id: m.id,
    trilha_id: trilhaIdByKey[m.trilhaKey],
    codigo: m.codigo,
    titulo: m.titulo,
    cor: m.cor,
    formato: m.formato,
    licoes_label: m.licoes_label,
    pct_demo: m.pct_demo,
    bar_class: m.bar_class,
    status_demo: m.status_demo,
    status_class: m.status_class,
    tipo: m.tipo,
    conteudo: m.conteudo,
    ordem: m.ordem,
  }));

  const { error: modErr } = await supabase.from('modulos').upsert(rows, { onConflict: 'id' });
  if (modErr) {
    console.error('  ERRO modulos:', modErr.message);
    process.exit(1);
  }
  console.log(`  ok: ${rows.length} módulos upsertados`);

  console.log('\nSeed concluído.');
}

main();
