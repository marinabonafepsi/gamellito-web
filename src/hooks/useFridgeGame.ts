"use client";

import { useCallback, useEffect, useReducer } from "react";
import { getSnackById } from "@/components/game-light/fridgeSnacks";

const STORAGE_V2 = "gamellito-web-fridge-v2";
const STORAGE_V1 = "gamellito-web-fridge-v1";

const SATISFACTION_PER_SNACK = 18;
const SATISFACTION_CLOSE_BONUS = 6;
const BASE_SCORE_ON_OPEN = 1;
const BASE_BONUS_SNACK = 2;

export type FridgeGameState = {
  fridgeOpen: boolean;
  openCount: number;
  score: number;
  message: string;
  selectedSnack: string | null;
  /** 0–100 “fome satisfeita” / diversão. */
  satisfaction: number;
  /** Abriu, escolheu lanche e fechou em sequência — quantas vezes seguidas. */
  streak: number;
  /** Nesta abertura atual, já escolheu um lanche? */
  hadSnackThisOpen: boolean;
  /** Ids de lanches já experimentados (para meta de variedade). */
  snacksTriedIds: string[];
  /** Total de vezes que escolheu um lanche (efeitos visuais). */
  snackPickCount: number;
};

type FridgeGameAction =
  | { type: "LOAD"; payload: FridgeGameState }
  | { type: "TOGGLE_FRIDGE" }
  | { type: "SELECT_SNACK"; payload: string };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const initialState: FridgeGameState = {
  fridgeOpen: false,
  openCount: 0,
  score: 0,
  message: "Toque na geladeira para abrir! Combine abrir, escolher um lanche e fechar para aumentar a sequência.",
  selectedSnack: null,
  satisfaction: 20,
  streak: 0,
  hadSnackThisOpen: false,
  snacksTriedIds: [],
  snackPickCount: 0,
};

function reducer(state: FridgeGameState, action: FridgeGameAction): FridgeGameState {
  if (action.type === "LOAD") return action.payload;

  if (action.type === "TOGGLE_FRIDGE") {
    if (!state.fridgeOpen) {
      const openCount = state.openCount + 1;
      const score = state.score + BASE_SCORE_ON_OPEN;
      return {
        ...state,
        fridgeOpen: true,
        openCount,
        score,
        hadSnackThisOpen: false,
        selectedSnack: null,
        message: "Escolha um lanche! Depois feche a geladeira para guardar o ponto extra de sequência.",
      };
    }

    let streak = state.streak;
    let satisfaction = state.satisfaction;
    if (state.hadSnackThisOpen) {
      streak += 1;
      satisfaction = clamp(satisfaction + SATISFACTION_CLOSE_BONUS + Math.min(5, streak), 0, 100);
    } else {
      streak = 0;
    }

    const closedMsg = state.hadSnackThisOpen
      ? streak >= 2
        ? `Sequência de ${streak}! Você está mandando bem no cuidado com a geladeira.`
        : "Geladeira fechada. Abra de novo para continuar a brincadeira!"
      : "Sem lanche desta vez — a sequência zerou. Abra, escolha e feche para recuperar o combo!";

    return {
      ...state,
      fridgeOpen: false,
      streak,
      satisfaction,
      hadSnackThisOpen: false,
      message: closedMsg,
    };
  }

  if (action.type === "SELECT_SNACK") {
    const id = action.payload;
    const snack = getSnackById(id);
    if (!snack) return state;

    const already = state.snacksTriedIds.includes(id);
    const snacksTriedIds = already ? state.snacksTriedIds : [...state.snacksTriedIds, id];
    const varietyBonus = already ? 0 : 4;
    const streakBonus = Math.min(3, state.streak);
    const pts = BASE_BONUS_SNACK + snack.bonusPoints + varietyBonus + streakBonus;
    const nextScore = state.score + pts;
    const nextSatisfaction = clamp(state.satisfaction + SATISFACTION_PER_SNACK, 0, 100);
    const allTried = snacksTriedIds.length >= 4;
    const allMsg = allTried && !already ? " Meta: você provou todos os lanches da geladeira!" : "";

    return {
      ...state,
      hadSnackThisOpen: true,
      selectedSnack: snack.label,
      snackPickCount: state.snackPickCount + 1,
      snacksTriedIds,
      score: nextScore,
      satisfaction: nextSatisfaction,
      message: `${snack.reaction} (+${pts} pts)${allMsg}`,
    };
  }

  return state;
}

function isV2Save(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return typeof o.fridgeOpen === "boolean" && typeof o.openCount === "number";
}

function migrateV1ToV2(raw: Record<string, unknown>): FridgeGameState {
  const openCount = typeof raw.openCount === "number" ? raw.openCount : 0;
  const score = typeof raw.score === "number" ? raw.score : openCount;
  return {
    ...initialState,
    fridgeOpen: false,
    openCount,
    score,
    message: initialState.message,
    selectedSnack: typeof raw.selectedSnack === "string" ? raw.selectedSnack : null,
    satisfaction: clamp(20 + openCount * 2, 0, 100),
    streak: 0,
    hadSnackThisOpen: false,
    snacksTriedIds: [],
    snackPickCount: 0,
  };
}

export function useFridgeGame() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const rawV2 = localStorage.getItem(STORAGE_V2);
      if (rawV2) {
        const parsed: unknown = JSON.parse(rawV2);
        if (isV2Save(parsed)) {
          const p = parsed as Record<string, unknown>;
          dispatch({
            type: "LOAD",
            payload: {
              ...initialState,
              fridgeOpen: !!p.fridgeOpen,
              openCount: Number(p.openCount) || 0,
              score: typeof p.score === "number" ? p.score : Number(p.openCount) || 0,
              message: typeof p.message === "string" ? p.message : initialState.message,
              selectedSnack: typeof p.selectedSnack === "string" || p.selectedSnack === null ? (p.selectedSnack as string | null) : null,
              snacksTriedIds: Array.isArray(p.snacksTriedIds) ? (p.snacksTriedIds as string[]) : [],
              satisfaction:
                typeof p.satisfaction === "number" ? clamp(p.satisfaction, 0, 100) : initialState.satisfaction,
              streak: typeof p.streak === "number" ? p.streak : 0,
              hadSnackThisOpen: !!p.hadSnackThisOpen,
              snackPickCount: typeof p.snackPickCount === "number" ? p.snackPickCount : 0,
            },
          });
          return;
        }
      }
      const rawV1 = localStorage.getItem(STORAGE_V1);
      if (rawV1) {
        const parsed: unknown = JSON.parse(rawV1);
        if (parsed && typeof parsed === "object") {
          dispatch({ type: "LOAD", payload: migrateV1ToV2(parsed as Record<string, unknown>) });
        }
      }
    } catch {
      // ignora
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_V2, JSON.stringify(state));
    } catch {
      // ignora
    }
  }, [state]);

  const toggleFridge = useCallback(() => dispatch({ type: "TOGGLE_FRIDGE" }), []);
  const selectSnack = useCallback((snackId: string) => dispatch({ type: "SELECT_SNACK", payload: snackId }), []);

  return {
    state,
    toggleFridge,
    selectSnack,
  };
}
