"use client";

/**
 * Loop completo de cuidado diário (3 tarefas, glicemia, próximo dia).
 * Não é usado pela página Experimente após o refactor da geladeira — ver useFridgeGame.
 * Mantido para possível rota “modo completo” ou reutilização futura.
 */
import { useCallback, useEffect, useMemo, useReducer } from "react";

type TimeOfDay = "Manha" | "Tarde" | "Noite";
type Mood = "Contente" | "Com fome" | "Alerta de glicemia" | "Cansado";

type DailyTasks = {
  feed: boolean;
  measure: boolean;
  correction: boolean;
};

type GameState = {
  day: number;
  score: number;
  streak: number;
  energy: number;
  glucose: number;
  mood: Mood;
  timeOfDay: TimeOfDay;
  dailyTasks: DailyTasks;
  completedTasks: number;
  lastMeasurement: number | null;
  message: string;
};

type GameAction =
  | { type: "LOAD"; payload: GameState }
  | { type: "FEED" }
  | { type: "MEASURE" }
  | { type: "CORRECTION" }
  | { type: "TICK" }
  | { type: "NEXT_DAY" };

const STORAGE_KEY = "gamellito-web-light-state-v1";

const initialState: GameState = {
  day: 1,
  score: 0,
  streak: 0,
  energy: 78,
  glucose: 118,
  mood: "Contente",
  timeOfDay: "Manha",
  dailyTasks: {
    feed: false,
    measure: false,
    correction: false,
  },
  completedTasks: 0,
  lastMeasurement: null,
  message: "Dia novo! Complete as 3 tarefas: alimentar, medir e corrigir.",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function evaluateMood(energy: number, glucose: number): Mood {
  if (energy < 35) return "Cansado";
  if (glucose < 70 || glucose > 180) return "Alerta de glicemia";
  if (energy < 52) return "Com fome";
  return "Contente";
}

function countTasks(tasks: DailyTasks) {
  return Number(tasks.feed) + Number(tasks.measure) + Number(tasks.correction);
}

function reducer(state: GameState, action: GameAction): GameState {
  if (action.type === "LOAD") {
    return action.payload;
  }

  if (action.type === "FEED") {
    if (state.dailyTasks.feed) return state;
    const energy = clamp(state.energy + 16, 0, 100);
    const glucose = clamp(state.glucose + 24, 55, 260);
    const dailyTasks = { ...state.dailyTasks, feed: true };
    const completedTasks = countTasks(dailyTasks);
    return {
      ...state,
      energy,
      glucose,
      mood: evaluateMood(energy, glucose),
      dailyTasks,
      completedTasks,
      score: state.score + 1,
      message: "Alimentacao concluida. Agora meca a glicemia.",
    };
  }

  if (action.type === "MEASURE") {
    if (state.dailyTasks.measure) return state;
    const dailyTasks = { ...state.dailyTasks, measure: true };
    const completedTasks = countTasks(dailyTasks);
    const reading = state.glucose;
    const message =
      reading < 70
        ? "Glicemia baixa detectada. Aplique correcao com atencao."
        : reading > 180
          ? "Glicemia alta detectada. Vamos fazer correcao."
          : "Glicemia em faixa segura. Finalize com a acao de correcao.";

    return {
      ...state,
      dailyTasks,
      completedTasks,
      score: state.score + 1,
      lastMeasurement: reading,
      message,
    };
  }

  if (action.type === "CORRECTION") {
    if (state.dailyTasks.correction) return state;
    const glucose = clamp(state.glucose - 28, 55, 260);
    const dailyTasks = { ...state.dailyTasks, correction: true };
    const completedTasks = countTasks(dailyTasks);
    const allDone = completedTasks >= 3;
    return {
      ...state,
      glucose,
      mood: evaluateMood(state.energy, glucose),
      dailyTasks,
      completedTasks,
      score: state.score + 1,
      message: allDone
        ? "Parabens! Dia concluido. Inicie o proximo dia para manter a rotina."
        : "Correcao aplicada. Continue o cuidado diario.",
    };
  }

  if (action.type === "TICK") {
    const energy = clamp(state.energy - 6, 0, 100);
    const glucose = clamp(state.glucose + 5, 55, 260);
    const nextTime: TimeOfDay =
      state.timeOfDay === "Manha"
        ? "Tarde"
        : state.timeOfDay === "Tarde"
          ? "Noite"
          : "Manha";
    return {
      ...state,
      energy,
      glucose,
      timeOfDay: nextTime,
      mood: evaluateMood(energy, glucose),
      message: "O tempo passou. Mantenha a rotina de cuidado ativa.",
    };
  }

  const completed = state.completedTasks >= 3;
  if (!completed) return state;

  const day = state.day + 1;
  const streak = state.streak + 1;
  const energy = clamp(state.energy - 12, 0, 100);
  const glucose = clamp(state.glucose + 8, 55, 260);
  const mood = evaluateMood(energy, glucose);
  return {
    ...state,
    day,
    streak,
    energy,
    glucose,
    mood,
    timeOfDay: "Manha",
    dailyTasks: {
      feed: false,
      measure: false,
      correction: false,
    },
    completedTasks: 0,
    score: state.score + 2,
    lastMeasurement: null,
    message: "Novo dia iniciado. Repita as 3 tarefas para ganhar estrelas.",
  };
}

function isValidState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GameState>;
  return typeof candidate.day === "number" && typeof candidate.score === "number";
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed: unknown = JSON.parse(saved);
      if (isValidState(parsed)) {
        dispatch({ type: "LOAD", payload: parsed });
      }
    } catch {
      // Se falhar leitura do storage, segue com estado inicial.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignora erro de quota/privacidade sem quebrar jogo.
    }
  }, [state]);

  const feed = useCallback(() => dispatch({ type: "FEED" }), []);
  const measureGlucose = useCallback(() => dispatch({ type: "MEASURE" }), []);
  const applyCorrection = useCallback(() => dispatch({ type: "CORRECTION" }), []);
  const tick = useCallback(() => dispatch({ type: "TICK" }), []);
  const startNextDay = useCallback(() => dispatch({ type: "NEXT_DAY" }), []);

  const canStartNextDay = useMemo(() => state.completedTasks >= 3, [state.completedTasks]);

  return {
    state,
    feed,
    measureGlucose,
    applyCorrection,
    tick,
    startNextDay,
    canStartNextDay,
  };
}
