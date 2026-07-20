// Conteúdo dos módulos interativos da Trilha Profissional de Saúde.

import type { ModuloDef } from './modulos-content';
import type { DecisaoCenario, ArtigoContent, VideoContent } from './modulos-types';

export const MODULOS_SAUDE: Record<string, ModuloDef> = {
  'saude-1': { id: 'saude-1', titulo: '1 · Educação em saúde lúdica', tipo: 'video' },
  'saude-2': { id: 'saude-2', titulo: '2 · Rodas de conversa', tipo: 'artigo' },
  'saude-3': { id: 'saude-3', titulo: '3 · Monitoramento de resultados', tipo: 'decisao' },
  'saude-4': { id: 'saude-4', titulo: '4 · Embasamento científico', tipo: 'artigo' },
};

// ---------- saude-1 · Vídeo ----------
export const VIDEO_SAUDE1: VideoContent = {
  caption: 'Vídeo · 4 min 10s — como o Gamellito pode apoiar consultas e explicações lúdicas do diagnóstico para crianças.',
  poster: '/assets/gamellito-glicosimetro.svg',
};

// ---------- saude-2 · Artigo (rodas de conversa) ----------
export const ARTIGO_SAUDE2: ArtigoContent = {
  intro: 'Rodas de conversa entre famílias reduzem a sensação de isolamento no dia a dia com o DM1.',
  paragrafos: [
    'Reunir famílias que vivem a mesma rotina — em grupos presenciais ou remotos — cria um espaço para trocar experiências práticas que vão além do que cabe numa consulta.',
    'O papel do profissional de saúde nessas rodas costuma ser mais de facilitador do que de palestrante: perguntas abertas geram mais troca real do que uma exposição unilateral de conteúdo.',
    'Vale incluir, quando possível, uma roda específica para os próprios adolescentes com DM1, sem os pais na sala — eles costumam falar mais livremente sobre dificuldades sociais entre pares.',
  ],
};

// ---------- saude-3 · Decisão (monitoramento de resultados) ----------
export const DECISAO_SAUDE3: DecisaoCenario[] = [
  {
    situacao: 'O relatório do sensor de um paciente mostra glicemia estável durante o dia, mas picos frequentes de madrugada.',
    opcoes: [
      { label: 'Investigar o esquema de insulina basal noturna e hábitos antes de dormir', ok: true, desfecho: 'Isso mesmo! Padrões noturnos recorrentes geralmente apontam para o esquema basal ou algo na rotina antes de dormir, não para um evento isolado.' },
      { label: 'Ignorar, já que a média geral do dia está boa', ok: false, desfecho: 'A média pode esconder um padrão real — picos recorrentes na madrugada merecem investigação específica, mesmo com boa média geral.' },
    ],
  },
  {
    situacao: 'Uma família registra poucas medições de glicemia por semana no aplicativo, mesmo após orientação.',
    opcoes: [
      { label: 'Explorar com empatia as barreiras práticas antes de reforçar apenas a orientação técnica', ok: true, desfecho: 'Isso mesmo! Baixa adesão ao registro costuma ter uma causa prática ou emocional por trás — entender isso rende mais do que repetir a mesma orientação.' },
      { label: 'Repetir a mesma orientação técnica sobre a importância de medir', ok: false, desfecho: 'Repetir a mesma orientação sem entender a barreira real tende a não mudar o comportamento — vale investigar o motivo primeiro.' },
    ],
  },
];

// ---------- saude-4 · Artigo (embasamento científico) ----------
export const ARTIGO_SAUDE4: ArtigoContent = {
  intro: 'Um resumo do que sustenta a abordagem gamificada e centrada na família usada no Gamellito.',
  paragrafos: [
    'Diretrizes internacionais de manejo do DM1 pediátrico (como as da ISPAD) recomendam educação continuada e individualizada como parte do tratamento, não apenas a prescrição de insulina.',
    'Evidências em educação em saúde mostram que abordagens lúdicas e microaprendizagem aumentam a retenção de rotinas complexas, especialmente em crianças e adolescentes.',
    'O acompanhamento multiprofissional (endocrinologia, nutrição, psicologia e educação em diabetes) está associado a melhores desfechos de controle glicêmico a longo prazo do que o acompanhamento isolado.',
  ],
  destaque: 'Este resumo não substitui a leitura das diretrizes originais — use-o como ponto de partida para discussão com a equipe multiprofissional.',
};
