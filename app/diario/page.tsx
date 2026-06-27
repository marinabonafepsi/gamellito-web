"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Registro = {
  id: string;
  valor: number;
  data_hora: string;
  rotulo: string;
};

const ROTULO_EMOJI: Record<string, string> = {
  jejum:  "🌅",
  antes:  "🍽️",
  depois: "🍽️",
  dormir: "🌙",
  outro:  "🩸",
};

/* Mapeia valor mg/dl → coordenada Y no SVG (viewBox height = 150, range 40–320) */
function toY(valor: number, h = 150): number {
  const min = 40, max = 320;
  return h - ((Math.min(Math.max(valor, min), max) - min) / (max - min)) * h;
}

/* Mapeia data_hora → coordenada X no SVG (largura = 580, spread 0–24h) */
function toX(data_hora: string, w = 580): number {
  const d = new Date(data_hora);
  const frac = (d.getHours() * 60 + d.getMinutes()) / (24 * 60);
  return 10 + frac * w;
}

function calcMedia(lista: Registro[]): number | null {
  if (!lista.length) return null;
  return Math.round(lista.reduce((s, r) => s + r.valor, 0) / lista.length);
}

export default function DiarioPage() {
  const [registrosHoje, setRegistrosHoje] = useState<Registro[]>([]);
  const [registros7d,   setRegistros7d]   = useState<Registro[]>([]);
  const [carregando,    setCarregando]    = useState(true);

  useEffect(() => {
    async function carregar() {
      const [r1, r7] = await Promise.all([
        fetch("/api/registros?periodo=1").then((r) => r.json()),
        fetch("/api/registros?periodo=7").then((r) => r.json()),
      ]);
      const hoje = new Date().toDateString();
      const filtrados = Array.isArray(r1)
        ? r1.filter((r: Registro) => new Date(r.data_hora).toDateString() === hoje)
        : [];
      setRegistrosHoje(filtrados);
      setRegistros7d(Array.isArray(r7) ? r7 : []);
      setCarregando(false);
    }
    carregar();
  }, []);

  const ultimoValor  = registrosHoje[0]?.valor ?? registros7d[0]?.valor ?? null;
  const media24h     = calcMedia(registrosHoje);
  const media7d      = calcMedia(registros7d);
  const chartPontos  = [...registrosHoje].sort(
    (a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
  );

  /* SVG polyline points */
  const points = chartPontos
    .map((r) => `${toX(r.data_hora).toFixed(1)},${toY(r.valor).toFixed(1)}`)
    .join(" ");

  /* Faixa alvo: 70–180 mg/dl */
  const yAlvoTopo  = toY(180);
  const yAlvoBase  = toY(70);
  const alturaAlvo = yAlvoBase - yAlvoTopo;

  if (carregando) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-24">
        <span className="font-body text-sm" style={{ color: "#6B7280" }}>Carregando…</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">

      {/* Botão registrar */}
      <div className="flex justify-end">
        <Link href="/diario/lancar" className="ds-btn ds-btn--lg" style={{ background: "#8DC63F", color: "#2B2233" }}>
          + Registrar glicemia
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-5 items-start">

        {/* ── Coluna esquerda ── */}
        <div className="flex flex-col gap-5">

          {/* Card: última leitura */}
          <div className="ds-card p-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <span className="font-display font-bold text-2xl" style={{ color: "#2B2233" }}>
                  Últimas 24 horas
                </span>
                <p className="font-body text-sm mt-1" style={{ color: "#6B7280" }}>
                  {registrosHoje.length > 0
                    ? `${registrosHoje.length} registro${registrosHoje.length > 1 ? "s" : ""} hoje`
                    : "Nenhum registro hoje"}
                </p>
              </div>

              {ultimoValor !== null ? (
                <div
                  className="flex-shrink-0 text-right rounded-2xl px-5 py-3"
                  style={{ background: "#FFC400", border: "3px solid #2B2233", boxShadow: "3px 3px 0 #2B2233" }}
                >
                  <span className="block text-xs font-bold uppercase tracking-wide opacity-70">
                    Último valor
                  </span>
                  <span className="font-display font-bold leading-none" style={{ fontSize: 42, color: "#2B2233" }}>
                    {ultimoValor}
                    <span className="text-lg font-semibold"> mg/dl</span>
                  </span>
                </div>
              ) : (
                <div
                  className="flex-shrink-0 rounded-2xl px-5 py-3 text-center"
                  style={{ background: "#FFF3C9", border: "3px solid #2B2233", color: "#6B7280" }}
                >
                  <span className="font-body text-sm">Sem registros</span>
                </div>
              )}
            </div>

            {/* Últimos registros do dia */}
            {registrosHoje.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {registrosHoje.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ background: "#FFF3C9", border: "2px solid #2B223318" }}
                  >
                    <span className="text-lg flex-shrink-0">{ROTULO_EMOJI[r.rotulo] ?? "🩸"}</span>
                    <span className="font-display font-bold text-base flex-1" style={{ color: "#2B2233" }}>
                      {r.valor} mg/dl
                    </span>
                    <span className="font-body text-xs" style={{ color: "#6B7280" }}>
                      {new Date(r.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: gráfico do dia */}
          <div className="ds-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-lg" style={{ color: "#2B2233" }}>
                Glicemia · hoje
              </span>
              <span className="flex items-center gap-2 font-body text-xs font-bold" style={{ color: "#6B7280" }}>
                <span
                  className="inline-block rounded"
                  style={{ width: 16, height: 10, background: "#8DC63F", border: "1.5px solid #2B2233", opacity: 0.7 }}
                />
                faixa-alvo
              </span>
            </div>

            <svg
              viewBox="0 0 600 150"
              className="w-full h-auto block"
              preserveAspectRatio="none"
              style={{ minHeight: 120 }}
            >
              {/* Faixa alvo (70–180 mg/dl) */}
              <rect
                x="0" y={yAlvoTopo} width="600" height={alturaAlvo}
                fill="#8DC63F" opacity="0.18" rx="6"
              />
              <line x1="0" y1={yAlvoTopo} x2="600" y2={yAlvoTopo}
                stroke="#8DC63F" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
              <line x1="0" y1={yAlvoBase} x2="600" y2={yAlvoBase}
                stroke="#8DC63F" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />

              {chartPontos.length >= 2 ? (
                <>
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#6E59C9"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {chartPontos.map((r, i) => (
                    <circle
                      key={r.id}
                      cx={toX(r.data_hora)}
                      cy={toY(r.valor)}
                      r={i === chartPontos.length - 1 ? 7 : 5}
                      fill={i === chartPontos.length - 1 ? "#F26A00" : "#fff"}
                      stroke="#6E59C9"
                      strokeWidth="3"
                    />
                  ))}
                </>
              ) : chartPontos.length === 1 ? (
                <circle
                  cx={toX(chartPontos[0].data_hora)}
                  cy={toY(chartPontos[0].valor)}
                  r={7}
                  fill="#F26A00"
                  stroke="#6E59C9"
                  strokeWidth="3"
                />
              ) : (
                <text x="300" y="80" textAnchor="middle" fill="#6B7280" fontSize="13" fontFamily="inherit">
                  Nenhum registro hoje
                </text>
              )}
            </svg>

            <div className="flex justify-between mt-2 font-body font-bold text-xs" style={{ color: "#6B7280" }}>
              <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>agora</span>
            </div>
          </div>
        </div>

        {/* ── Coluna direita: resumos ── */}
        <div className="flex flex-col gap-4">
          {[
            {
              emoji: "🩸",
              label: "Últimas 24h",
              value: media24h !== null ? `${media24h} mg/dl` : "—",
              sub: media24h !== null ? `${registrosHoje.length} leitura${registrosHoje.length !== 1 ? "s" : ""}` : "sem registros hoje",
            },
            {
              emoji: "📊",
              label: "Média semanal",
              value: media7d !== null ? `${media7d} mg/dl` : "—",
              sub: media7d !== null ? `últimos 7 dias` : "sem registros",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="ds-card flex items-center gap-4 p-5"
            >
              <span
                className="flex-shrink-0 flex items-center justify-center rounded-2xl text-2xl"
                style={{ width: 52, height: 52, background: "#FFF3C9", border: "2.5px solid #2B2233" }}
              >
                {s.emoji}
              </span>
              <div>
                <span className="block font-body text-xs font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>
                  {s.label}
                </span>
                <span className="block font-display font-bold text-2xl leading-tight" style={{ color: "#2B2233" }}>
                  {s.value}
                </span>
                <span className="block font-body text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                  {s.sub}
                </span>
              </div>
            </div>
          ))}

          {/* Links secundários */}
          <div className="flex flex-col gap-3 mt-2">
            <Link href="/diario/historico" className="ds-btn ds-btn--ghost w-full">
              Ver histórico completo
            </Link>
            <Link href="/diario/exportar" className="ds-btn ds-btn--ghost ds-btn--sm w-full">
              Exportar PDF
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
