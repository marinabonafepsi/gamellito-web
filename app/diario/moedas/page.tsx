"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type Registro = {
  id: string;
  valor: number;
  data_hora: string;
  rotulo: string;
};

const ROTULO_LABEL: Record<string, { emoji: string; label: string }> = {
  jejum:  { emoji: "🌅", label: "Jejum"          },
  antes:  { emoji: "🍽️", label: "Antes de comer" },
  depois: { emoji: "🍽️", label: "Depois de comer" },
  dormir: { emoji: "🌙", label: "Antes de dormir" },
  outro:  { emoji: "🩸", label: "Outro"           },
};

const META_COINS = 1500;

export default function MoedasPage() {
  const [coins,     setCoins]     = useState<number | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [aba,       setAba]       = useState<"saldo" | "meta">("saldo");

  useEffect(() => {
    async function carregar() {
      const [perf, regs] = await Promise.all([
        fetch("/api/perfil").then((r) => r.json()),
        fetch("/api/registros?periodo=30").then((r) => r.json()),
      ]);
      if (typeof perf.coins === "number") setCoins(perf.coins);
      if (Array.isArray(regs)) setRegistros(regs);
      setLoading(false);
    }
    carregar();
  }, []);

  const saldo       = coins ?? 0;
  const pct         = Math.min(1, saldo / META_COINS);
  const remaining   = Math.max(0, META_COINS - saldo);
  const circumf     = 2 * Math.PI * 80;
  const ringOffset  = circumf * (1 - pct);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display font-bold text-3xl" style={{ color: "#2B2233" }}>
          Minhas moedas
        </h1>

        {/* Saldo / Meta toggle */}
        <div
          style={{
            display: "inline-flex",
            background: "#FFFFFF",
            border: "3px solid #2B2233",
            borderRadius: 999,
            padding: 3,
            boxShadow: "2px 2px 0 #2B2233",
          }}
        >
          {(["saldo", "meta"] as const).map((id) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              style={{
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 13,
                padding: "8px 18px",
                borderRadius: 999,
                color: "#2B2233",
                background: aba === id ? "#FFC400" : "transparent",
                transition: "background 120ms",
              }}
            >
              {id === "saldo" ? "Saldo" : "Meta"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

        {/* ── Hero card ── */}
        <div>
          {aba === "saldo" ? (
            <>
              <div
                className="ds-card p-8 text-center flex flex-col items-center gap-3"
                style={{ background: "#FFC400" }}
              >
                <span className="text-xs font-bold uppercase tracking-widest opacity-70">
                  Seu saldo
                </span>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 52 }}>🪙</span>
                  <span
                    className="font-display font-black leading-none"
                    style={{
                      fontSize: "clamp(52px,12vw,72px)",
                      color: "#F26A00",
                      WebkitTextStroke: "3px #2B2233",
                      paintOrder: "stroke fill",
                    } as React.CSSProperties}
                  >
                    {loading ? "…" : saldo.toLocaleString("pt-BR")}
                  </span>
                </div>
                <span className="text-sm font-bold opacity-75">moedas Gamellito</span>
              </div>

              {/* mini stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="ds-card p-4">
                  <span style={{ fontSize: 26 }}>🩸</span>
                  <span className="block font-display font-bold text-2xl mt-1" style={{ color: "#F26A00" }}>
                    {registros.length}
                  </span>
                  <span className="block text-sm font-bold mt-0.5" style={{ color: "#2B2233", lineHeight: 1.3 }}>
                    registros nos últimos 30 dias
                  </span>
                </div>
                <div className="ds-card p-4">
                  <span style={{ fontSize: 26 }}>📈</span>
                  <span className="block font-display font-bold text-2xl mt-1" style={{ color: "#F26A00" }}>
                    +{registros.length * 10}
                  </span>
                  <span className="block text-sm font-bold mt-0.5" style={{ color: "#2B2233", lineHeight: 1.3 }}>
                    moedas este mês
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="ds-card p-8 text-center flex flex-col items-center gap-4">
              {/* Ring chart */}
              <div style={{ position: "relative", width: 200, height: 200 }}>
                <svg viewBox="0 0 200 200" width="200" height="200"
                     style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="100" cy="100" r="80" fill="none"
                          stroke="#FFF3C9" strokeWidth="18" />
                  <circle cx="100" cy="100" r="80" fill="none"
                          stroke="#F26A00" strokeWidth="18"
                          strokeLinecap="round"
                          strokeDasharray={circumf}
                          strokeDashoffset={ringOffset}
                          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.22,1,.36,1)" }}
                  />
                </svg>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 34 }}>🪙</span>
                  <span
                    className="font-display font-black"
                    style={{
                      fontSize: 36, lineHeight: 1,
                      color: "#F26A00",
                      WebkitTextStroke: "2px #2B2233",
                      paintOrder: "stroke fill",
                    } as React.CSSProperties}
                  >
                    {loading ? "…" : saldo.toLocaleString("pt-BR")}
                  </span>
                  <span className="text-xs font-bold mt-1" style={{ color: "#6B7280" }}>
                    de {META_COINS.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>

              <p className="text-base font-bold" style={{ color: "#2B2233", lineHeight: 1.4 }}>
                Faltam{" "}
                <span style={{ color: "#F26A00", fontWeight: 900 }}>
                  {remaining.toLocaleString("pt-BR")} 🪙
                </span>{" "}
                pra desbloquear{" "}
                <span style={{ color: "#6E59C9" }}>o adesivo do Gamellito 🎉</span>
              </p>
            </div>
          )}
        </div>

        {/* ── Histórico ── */}
        <div>
          <p className="font-display font-bold text-lg mb-3" style={{ color: "#2B2233" }}>
            Histórico
          </p>

          {loading ? (
            <p className="text-sm font-body" style={{ color: "#6B7280" }}>Carregando…</p>
          ) : registros.length === 0 ? (
            <div className="ds-card p-6 text-center" style={{ background: "#FFF3C9" }}>
              <p className="font-body text-sm" style={{ color: "#6B7280" }}>
                Nenhum registro ainda. Comece a registrar glicemia para ganhar moedas!
              </p>
              <Link href="/diario/lancar" className="ds-btn ds-btn--sm mt-4 inline-flex"
                    style={{ background: "#8DC63F", color: "#2B2233" }}>
                + Registrar agora
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {registros.slice(0, 15).map((r) => {
                const info = ROTULO_LABEL[r.rotulo] ?? { emoji: "🩸", label: r.rotulo };
                const dt   = new Date(r.data_hora);
                const dataFmt = dt.toLocaleDateString("pt-BR", {
                  weekday: "short", day: "numeric", month: "short",
                });
                const horaFmt = dt.toLocaleTimeString("pt-BR", {
                  hour: "2-digit", minute: "2-digit",
                });
                return (
                  <div
                    key={r.id}
                    className="ds-card flex items-center gap-4 px-4 py-3"
                    style={{ boxShadow: "3px 3px 0 #2B2233" }}
                  >
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-2xl text-xl"
                      style={{
                        width: 44, height: 44,
                        background: "#FFF3C9",
                        border: "2.5px solid #2B2233",
                      }}
                    >
                      {info.emoji}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display font-bold text-sm" style={{ color: "#2B2233" }}>
                        {info.label} · {r.valor} mg/dL
                      </span>
                      <span className="block font-body text-xs mt-0.5" style={{ color: "#6B7280" }}>
                        {dataFmt} às {horaFmt}
                      </span>
                    </span>
                    <span className="flex-shrink-0 font-display font-bold text-lg" style={{ color: "#8DC63F" }}>
                      +10 🪙
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="text-center pt-4 border-t" style={{ borderColor: "#2B223320" }}>
        <Link href="/diario" className="ds-btn ds-btn--ghost ds-btn--sm">
          ← Voltar ao diário
        </Link>
      </div>
    </div>
  );
}
