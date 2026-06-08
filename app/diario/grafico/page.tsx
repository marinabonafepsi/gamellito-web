"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { GraficoGlicemia, type PontoGrafico } from "@/components/diario/GraficoGlicemia";

type Periodo = "7" | "14" | "30";

const ROTULO_LABEL: Record<string, string> = {
  jejum: "Jejum",
  antes: "Antes de comer",
  depois: "Depois de comer",
  dormir: "Antes de dormir",
  outro: "Outro",
};

export default function GraficoPage() {
  const [periodo, setPeriodo] = useState<Periodo>("7");
  const [pontos, setPontos] = useState<PontoGrafico[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const res = await fetch(`/api/registros?periodo=${periodo}`);
    if (res.ok) {
      const data = await res.json() as PontoGrafico[];
      setPontos(data);
    }
    setCarregando(false);
  }, [periodo]);

  useEffect(() => { carregar(); }, [carregar]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-display font-bold text-primary-foreground">
          Gráfico
        </h1>
        <Link href="/diario"
          className="text-sm font-body text-primary-foreground/60 hover:text-primary-foreground transition-colors">
          ← Histórico
        </Link>
      </div>

      {/* Filtro de período */}
      <div className="flex gap-2 mb-6">
        {(["7", "14", "30"] as Periodo[]).map((p) => (
          <button key={p} onClick={() => setPeriodo(p)}
            className={`rounded-full px-4 py-2 text-sm font-body font-medium transition-colors
              ${periodo === p
                ? "bg-primary text-primary-foreground"
                : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
              }`}>
            {p} dias
          </button>
        ))}
      </div>

      {/* Gráfico */}
      <div className="bg-card rounded-3xl border border-border p-4 md:p-6 mb-6">
        {carregando ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground font-body text-sm">
            Carregando…
          </div>
        ) : (
          <GraficoGlicemia pontos={pontos} />
        )}
      </div>

      {/* Legenda neutra — sem interpretação */}
      {pontos.length > 0 && (
        <div className="bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10 p-4 mb-6">
          <p className="text-xs font-body text-primary-foreground/60 mb-3 font-medium uppercase tracking-wide">
            Registros por momento ({pontos.length} total)
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(ROTULO_LABEL).map(([key, label]) => {
              const count = pontos.filter((p) => p.rotulo === key).length;
              if (count === 0) return null;
              return (
                <span key={key} className="text-xs font-body text-primary-foreground/70">
                  {label}: <strong className="text-primary-foreground">{count}</strong>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Link href="/diario/exportar"
          className="rounded-full bg-primary px-6 py-2.5 font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity text-sm">
          Exportar PDF →
        </Link>
        <Link href="/diario/lancar"
          className="rounded-full border border-primary-foreground/20 px-6 py-2.5 font-display font-bold text-primary-foreground hover:bg-primary-foreground/10 transition-colors text-sm">
          + Novo registro
        </Link>
      </div>
    </div>
  );
}
