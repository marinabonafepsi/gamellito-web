"use client";

/**
 * Gráfico visual neutro de glicemia.
 *
 * REGRA Nº 1 — critérios obrigatórios:
 * - SEM faixas coloridas de bom/ruim
 * - SEM zonas-alvo ou linhas de referência
 * - SEM interpretação, alerta ou avaliação dos valores
 * - Eixos neutros: tempo × valor (mg/dL)
 * - Legível em preto-e-branco para impressão
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
export interface PontoGrafico {
  data_hora: string;
  valor: number;
  rotulo: string;
}

const ROTULO_LABEL: Record<string, string> = {
  jejum: "Jejum",
  antes: "Antes de comer",
  depois: "Depois de comer",
  dormir: "Antes de dormir",
  outro: "Outro",
};

function formatarEixoX(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TooltipNeutro({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const ponto = payload[0].payload as PontoGrafico;
  return (
    <div className="rounded-2xl shadow-lg px-4 py-3 text-sm font-body" style={{ background: "#FFFFFF", border: "2px solid #2B2233" }}>
      <p className="font-bold" style={{ color: "#2B2233" }}>{ponto.valor} mg/dL</p>
      <p className="text-xs" style={{ color: "#6B7280" }}>{ROTULO_LABEL[ponto.rotulo] ?? ponto.rotulo}</p>
      <p className="text-xs mt-1" style={{ color: "#6B7280" }}>{formatarEixoX(ponto.data_hora)}</p>
    </div>
  );
}

interface Props {
  pontos: PontoGrafico[];
}

export function GraficoGlicemia({ pontos }: Props) {
  if (pontos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground font-body text-sm">
        Nenhum registro neste período.
      </div>
    );
  }

  // Ordena cronologicamente para o gráfico
  const dados = [...pontos].sort(
    (a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
  );

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={dados} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        {/*
          Grade discreta apenas para guiar o olhar —
          NÃO representa faixas clínicas (REGRA Nº 1)
        */}
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />

        <XAxis
          dataKey="data_hora"
          tickFormatter={formatarEixoX}
          tick={{ fontSize: 10, fontFamily: "Roboto, sans-serif" }}
          stroke="currentColor"
          strokeOpacity={0.3}
          interval="preserveStartEnd"
          minTickGap={60}
        />

        <YAxis
          tick={{ fontSize: 11, fontFamily: "Roboto, sans-serif" }}
          stroke="currentColor"
          strokeOpacity={0.3}
          label={{
            value: "mg/dL",
            angle: -90,
            position: "insideLeft",
            offset: 12,
            style: { fontSize: 10, fontFamily: "Roboto, sans-serif", opacity: 0.5 },
          }}
          width={52}
        />

        <Tooltip content={<TooltipNeutro />} />

        {/*
          Linha neutra — cor da marca, sem gradiente de bom/ruim.
          Ponto sólido para identificar cada medição.
        */}
        <Line
          type="monotone"
          dataKey="valor"
          stroke="hsl(33 100% 50%)"   /* gamellito-orange */
          strokeWidth={2}
          dot={{ r: 4, fill: "hsl(33 100% 50%)", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
          isAnimationActive={false}   /* sem animação para impressão */
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
