// Registry central: junta o conteúdo dos jogos reutilizáveis (decisão,
// sequência, prato, stepper, vídeo, mochila, artigo) de todas as personas,
// indexado por moduloId. Os componentes de jogo (DecisaoGame, SequenciaGame
// etc.) importam só daqui — assim ficam agnósticos de qual persona/arquivo
// de conteúdo é dono de cada módulo, e evitamos import circular entre os
// arquivos de conteúdo de cada persona.

import type {
  DecisaoCenario,
  SequenciaContent,
  PratoContent,
  StepperContent,
  VideoContent,
  MochilaContent,
  ArtigoContent,
} from './modulos-types';

import {
  MODULOS_DM1,
  DECISAO_A5,
  DECISAO_A8,
  ROUNDS_A2,
  SEQ_ITEMS,
  SEQ_REACTIONS,
  PRATO_FOODS,
  PRATO_TARGET,
  STEPPER_A7,
  STEPPER_A11,
  VIDEO_A3,
  MOCHILA_A12,
  ARTIGO_A9,
  ARTIGO_A13,
  ARTIGO_A14,
} from './modulos-content';

import {
  MODULOS_CRIANCA,
  DECISAO_B3,
  PRATO_B4,
  STEPPER_B5,
  STEPPER_B6,
  VIDEO_B1,
  MOCHILA_B2,
} from './modulos-content-crianca';

import {
  MODULOS_PROF,
  DECISAO_PROF1,
  ARTIGO_PROF2,
  SEQUENCIA_PROF3,
  ARTIGO_PROF4,
} from './modulos-content-prof';

import {
  MODULOS_SAUDE,
  VIDEO_SAUDE1,
  ARTIGO_SAUDE2,
  DECISAO_SAUDE3,
  ARTIGO_SAUDE4,
} from './modulos-content-saude';

export const MODULOS_TODOS = {
  ...MODULOS_DM1,
  ...MODULOS_CRIANCA,
  ...MODULOS_PROF,
  ...MODULOS_SAUDE,
};

export const DECISAO_CONTENT: Record<string, DecisaoCenario[]> = {
  a5: DECISAO_A5,
  a8: DECISAO_A8,
  b3: DECISAO_B3,
  'prof-1': DECISAO_PROF1,
  'saude-3': DECISAO_SAUDE3,
};

export const SEQUENCIA_CONTENT: Record<string, SequenciaContent> = {
  a2: { items: SEQ_ITEMS, rounds: ROUNDS_A2, reactions: SEQ_REACTIONS },
  'prof-3': SEQUENCIA_PROF3,
};

export const PRATO_CONTENT: Record<string, PratoContent> = {
  a4: { intro: `Monte um prato de almoço com carboidrato entre ${PRATO_TARGET.min}g e ${PRATO_TARGET.max}g`, foods: PRATO_FOODS, target: PRATO_TARGET },
  b4: PRATO_B4,
};

export const STEPPER_CONTENT: Record<string, StepperContent> = {
  a7: { intro: 'Um roteiro simples para os dias em que a família enfrenta febre ou outra doença junto com o diabetes.', steps: STEPPER_A7 },
  a11: STEPPER_A11,
  b5: STEPPER_B5,
  b6: STEPPER_B6,
};

export const VIDEO_CONTENT: Record<string, VideoContent> = {
  a3: VIDEO_A3,
  b1: VIDEO_B1,
  'saude-1': VIDEO_SAUDE1,
};

export const MOCHILA_CONTENT: Record<string, MochilaContent> = {
  a12: MOCHILA_A12,
  b2: MOCHILA_B2,
};

export const ARTIGO_CONTENT: Record<string, ArtigoContent> = {
  a9: ARTIGO_A9,
  a13: ARTIGO_A13,
  a14: ARTIGO_A14,
  'prof-2': ARTIGO_PROF2,
  'prof-4': ARTIGO_PROF4,
  'saude-2': ARTIGO_SAUDE2,
  'saude-4': ARTIGO_SAUDE4,
};
