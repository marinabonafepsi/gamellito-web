'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';

interface DadosGrafico {
  data: string;
  registros: Array<{ valor: number; rotulo: string }>;
  media?: number;
}

export default function GraficoPage() {
  const params = useParams();
  const [dados, setDados] = useState<DadosGrafico[]>([]);
  const [periodo, setPeriodo] = useState<'7' | '30' | '90'>('30');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    minimo: 0,
    maximo: 0,
    media: 0,
    adesao: 0,
  });

  useEffect(() => {
    loadGrafico();
  }, [periodo]);

  const loadGrafico = async () => {
    setLoading(true);
    try {
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - parseInt(periodo));

      const response = await fetch(
        `/api/registros?limit=1000&data_inicio=${dataInicio.toISOString()}`
      );
      const data = await response.json();

      // Group by date
      const grouped = new Map<string, number[]>();
      data.registros.forEach(
        (r: { valor: number; data_hora: string }) => {
          const date = new Date(r.data_hora).toLocaleDateString('pt-BR');
          if (!grouped.has(date)) {
            grouped.set(date, []);
          }
          grouped.get(date)!.push(r.valor);
        }
      );

      // Transform to chart data
      const chartData = Array.from(grouped.entries())
        .map(([date, valores]) => ({
          data: date,
          registros: valores.map((v) => ({ valor: v, rotulo: '' })),
          media: valores.reduce((a, b) => a + b, 0) / valores.length,
        }))
        .sort(
          (a, b) =>
            new Date(a.data).getTime() - new Date(b.data).getTime()
        );

      setDados(chartData);

      // Calculate stats
      const todosValores = data.registros.map((r: any) => r.valor);
      if (todosValores.length > 0) {
        const diasCalendario = parseInt(periodo);
        setStats({
          total: todosValores.length,
          minimo: Math.min(...todosValores),
          maximo: Math.max(...todosValores),
          media:
            todosValores.reduce((a: number, b: number) => a + b, 0) /
            todosValores.length,
          adesao: Math.round((todosValores.length / diasCalendario) * 100),
        });
      }
    } catch (error) {
      console.error('Error loading grafico:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-display font-bold text-purple-main">
          📈 Gráfico de Glicemia
        </h1>
        <div className="flex gap-2">
          {['7', '30', '90'].map((p) => (
            <GamButton
              key={p}
              variant={periodo === (p as '7' | '30' | '90') ? 'primary' : 'secondary'}
              onClick={() => setPeriodo(p as '7' | '30' | '90')}
              size="sm"
            >
              {p}d
            </GamButton>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GamCard surface="orange">
          <div className="text-center">
            <p className="text-xs text-dark-gray opacity-70">Total</p>
            <p className="text-3xl font-bold text-dark-gray mt-2">{stats.total}</p>
            <p className="text-xs text-dark-gray opacity-50 mt-1">registros</p>
          </div>
        </GamCard>

        <GamCard surface="purple">
          <div className="text-center">
            <p className="text-xs text-dark-gray opacity-70">Mínimo</p>
            <p className="text-3xl font-bold text-dark-gray mt-2">{stats.minimo}</p>
            <p className="text-xs text-dark-gray opacity-50 mt-1">mg/dL</p>
          </div>
        </GamCard>

        <GamCard surface="orange">
          <div className="text-center">
            <p className="text-xs text-dark-gray opacity-70">Máximo</p>
            <p className="text-3xl font-bold text-dark-gray mt-2">{stats.maximo}</p>
            <p className="text-xs text-dark-gray opacity-50 mt-1">mg/dL</p>
          </div>
        </GamCard>

        <GamCard surface="cream">
          <div className="text-center">
            <p className="text-xs text-dark-gray opacity-70">Adesão</p>
            <p className="text-3xl font-bold text-dark-gray mt-2">{stats.adesao}%</p>
            <p className="text-xs text-dark-gray opacity-50 mt-1">dias</p>
          </div>
        </GamCard>
      </div>

      {/* Gráfico */}
      {loading ? (
        <GamCard surface="white">
          <div className="text-center py-12">
            <p className="text-ink/60">Carregando gráfico...</p>
          </div>
        </GamCard>
      ) : dados.length > 0 ? (
        <GamCard surface="white">
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dados}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="data"
                  stroke="#999"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#999"
                  tick={{ fontSize: 12 }}
                  domain={[0, 300]}
                  label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '2px solid #FFC400',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) =>
                    value
                      ? value.length > 0
                        ? `Média: ${(
                            value.reduce((a: number, b: any) => a + b.valor, 0) /
                            value.length
                          ).toFixed(0)} mg/dL`
                        : 'Sem dados'
                      : 'Sem dados'
                  }
                  labelStyle={{ color: '#FFC400' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="media"
                  stroke="#FFC400"
                  dot={{ fill: '#FFC400', r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  name="Média do Dia"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GamCard>
      ) : (
        <GamCard surface="cream">
          <div className="text-center py-12">
            <p className="text-dark-gray opacity-70">
              Nenhum registro para este período
            </p>
          </div>
        </GamCard>
      )}

      {/* Info Box */}
      <GamCard surface="purple">
        <div className="p-4">
          <p className="text-sm font-medium text-dark-gray mb-2">ℹ️ Sobre o gráfico</p>
          <p className="text-xs text-dark-gray opacity-80">
            Este gráfico mostra a <strong>tendência</strong> de seus registros de glicemia.
            Ele <strong>NÃO interpreta</strong> se seus valores estão "altos" ou "baixos" —
            apenas visualiza o que você registrou. Fale com seu médico sobre a interpretação dos valores.
          </p>
        </div>
      </GamCard>
    </div>
  );
}
