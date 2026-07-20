// Conteúdo dos módulos interativos da Trilha Educador (professor/escola).

import type { ModuloDef } from './modulos-content';
import type { DecisaoCenario, ArtigoContent, SequenciaContent } from './modulos-types';

export const MODULOS_PROF: Record<string, ModuloDef> = {
  'prof-1': { id: 'prof-1', titulo: '1 · Identificar sinais do DM1', tipo: 'decisao' },
  'prof-2': { id: 'prof-2', titulo: '2 · Acolher o aluno', tipo: 'artigo' },
  'prof-3': { id: 'prof-3', titulo: '3 · Agir em emergências', tipo: 'sequencia' },
  'prof-4': { id: 'prof-4', titulo: '4 · Inclusão da turma', tipo: 'artigo' },
};

// ---------- prof-1 · Decisão (radar do professor) ----------
export const DECISAO_PROF1: DecisaoCenario[] = [
  {
    situacao: 'Um aluno com DM1 está mais quieto que o normal durante a aula, com as mãos meio trêmulas.',
    opcoes: [
      { label: 'Discretamente perguntar como ele está e sugerir medir a glicemia', ok: true, desfecho: 'Isso mesmo! Tremor e mudança de comportamento merecem uma checagem discreta — sem alarde na frente da turma.' },
      { label: 'Pedir pra ele prestar mais atenção na aula', ok: false, desfecho: 'Tremor e quietude fora do padrão podem ser sinais de hipoglicemia, não falta de atenção — vale checar antes de repreender.' },
    ],
  },
  {
    situacao: 'No recreio, um aluno com DM1 pede pra beber água toda hora e vai ao banheiro com frequência incomum.',
    opcoes: [
      { label: 'Observar e, se persistir, avisar a coordenação/família', ok: true, desfecho: 'Isso mesmo! Sede e idas ao banheiro fora do padrão podem indicar glicemia alta — vale registrar e comunicar.' },
      { label: 'Não dar importância, já que criança bebe água mesmo', ok: false, desfecho: 'Beber água é normal, mas esse padrão insistente e fora do comum é um sinal que vale a pena observar com atenção.' },
    ],
  },
];

// ---------- prof-2 · Artigo (acolher o aluno) ----------
export const ARTIGO_PROF2: ArtigoContent = {
  intro: 'Acolher um aluno com DM1 começa por entender que a condição não define quem ele é.',
  paragrafos: [
    'Um aluno com diabetes tipo 1 pode participar de todas as atividades da escola — educação física, passeios, festas — com pequenos ajustes de rotina, não com restrições generalizadas.',
    'Evite tratamentos que destaquem a criança na frente da turma (como comentar em voz alta sobre remédios ou lanches). Um combinado discreto entre professor, família e o próprio aluno costuma funcionar melhor.',
    'Vale perguntar diretamente à família (ou ao aluno, dependendo da idade) como ele prefere que a escola aja em situações do dia a dia — cada criança tem um jeito diferente de lidar com isso.',
  ],
  destaque: 'Pergunte à família: existe um plano de cuidado escolar por escrito? Ter esse documento em mãos ajuda toda a equipe pedagógica a agir de forma consistente.',
};

// ---------- prof-3 · Sequência (protocolo de emergência em sala) ----------
export const SEQUENCIA_PROF3: SequenciaContent = {
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

// ---------- prof-4 · Artigo (inclusão da turma) ----------
export const ARTIGO_PROF4: ArtigoContent = {
  intro: 'Uma turma bem informada é a melhor rede de apoio para um colega com DM1.',
  paragrafos: [
    'Com o consentimento da família (e, se fizer sentido, do próprio aluno), uma conversa simples com a turma sobre o que é diabetes tipo 1 ajuda a reduzir curiosidade invasiva e evita comentários sem querer machucar.',
    'Em festas e lanches coletivos, incluir pelo menos uma opção compatível com a contagem de carboidratos evita que o aluno precise ficar de fora ou comer algo separado de forma constrangedora.',
    'Pequenos gestos — como deixar o aluno guardar o kit de emergência num lugar acessível da sala — fazem diferença sem chamar atenção extra para a condição.',
  ],
};
