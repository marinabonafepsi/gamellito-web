'use client';

import { createContext, useContext } from 'react';

interface ModuloCompletionValue {
  concluir: (estrelas?: number) => void;
  concluindo: boolean;
}

export const ModuloCompletionContext = createContext<ModuloCompletionValue | null>(null);

// Hook usado pelos jogos de cada módulo para disparar a conclusão (grava
// progresso + credita GCoins) em vez de só navegar de volta com um <Link>.
export function useConcluirModulo() {
  const ctx = useContext(ModuloCompletionContext);
  if (!ctx) {
    throw new Error('useConcluirModulo deve ser usado dentro de um ModuloShell');
  }
  return ctx;
}
