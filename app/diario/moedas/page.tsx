"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface HumorLog {
  id: string;
  humor: string;
  coins_ganhos: number;
  data_local: string;
}

const HUMOR_LABELS: Record<string, { label: string; emoji: string }> = {
  feliz: { label: "Feliz", emoji: "😊" },
  animado: { label: "Animado", emoji: "🤩" },
  raiva: { label: "Com raiva", emoji: "😠" },
  medo: { label: "Com medo", emoji: "😨" },
  normal: { label: "Normal", emoji: "😐" },
};

export default function MoedasPage() {
  const [coins, setCoins] = useState<number | null>(null);
  const [humores, setHumores] = useState<HumorLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      const client = createClient();

      // Carregar saldo
      fetch("/api/perfil")
        .then((r) => r.json())
        .then((d) => { if (typeof d.coins === "number") setCoins(d.coins); })
        .catch(() => {});

      // Carregar histórico de humores (últimos 30 dias)
      const hoje = new Date();
      const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { data } = await client
        .from("humor_logs")
        .select("*")
        .gte("data_local", trintaDiasAtras.toISOString().slice(0, 10))
        .order("data_local", { ascending: false });

      if (data) setHumores(data as HumorLog[]);
      setLoading(false);
    }

    carregarDados();
  }, []);

  const totalGanho = humores.reduce((sum, h) => sum + h.coins_ganhos, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#2B2233] mb-2">
          Minhas Moedas
        </h1>
        <p className="text-sm font-body text-[#2B2233]/60">
          Acompanhe seu acúmulo e histórico de emoções
        </p>
      </header>

      {/* Saldo total */}
      <div className="gm-card gm-card--sun mb-8 text-center">
        <div className="text-5xl font-display font-black text-[#2B2233] mb-2">
          🪙
        </div>
        <p className="text-sm font-body text-[#2B2233]/60 mb-1">Saldo total</p>
        <p className="text-4xl font-display font-bold text-[#F26A00]">
          {coins !== null ? coins : "0"}
        </p>
        <p className="text-xs font-body text-[#2B2233]/50 mt-3">
          +{totalGanho} moedas nos últimos 30 dias
        </p>
      </div>

      {/* Histórico */}
      <div className="mb-8">
        <h2 className="text-lg font-display font-bold text-[#2B2233] mb-4">
          Histórico de emoções
        </h2>

        {loading ? (
          <p className="text-sm font-body text-[#2B2233]/50 text-center py-8">
            Carregando...
          </p>
        ) : humores.length === 0 ? (
          <div className="gm-card gm-card--cream text-center py-8">
            <p className="text-sm font-body text-[#2B2233]/60 mb-2">
              Nenhum registro de humor ainda
            </p>
            <p className="text-xs font-body text-[#2B2233]/40">
              Comece a marcar seus humores para ganhar moedas!
            </p>
            <Link
              href="/diario/conta"
              className="gm-btn gm-btn--primary gm-btn--md mt-4 inline-block"
            >
              Marcar humor
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {humores.map((h) => {
              const info = HUMOR_LABELS[h.humor] || { label: h.humor, emoji: "❓" };
              const dataLocal = new Date(h.data_local + "T00:00:00");
              const dataFormatada = dataLocal.toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={h.id}
                  className="gm-card gm-card--cream flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.emoji}</span>
                    <div>
                      <p className="font-body font-semibold text-[#2B2233]">
                        {info.label}
                      </p>
                      <p className="text-xs font-body text-[#2B2233]/50">
                        {dataFormatada}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-[#F26A00] text-lg">
                      +{h.coins_ganhos}
                    </p>
                    <p className="text-xs font-body text-[#2B2233]/50">
                      🪙
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center">
        <Link
          href="/diario"
          className="text-sm font-body text-[#2B2233]/50 hover:text-[#2B2233] transition-colors"
        >
          ← Voltar ao diário
        </Link>
      </div>
    </div>
  );
}
