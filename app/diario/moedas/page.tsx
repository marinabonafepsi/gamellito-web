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
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-[#2B2233] mb-2">
          Meus ganhos
        </h1>
        <p className="text-sm font-body text-[#2B2233]/60">
          Acompanhe o acúmulo de moedas e seu histórico de emoções
        </p>
      </div>

      {/* Saldo Total - Destaque */}
      <div className="gm-card gm-card--sun mb-12">
        <div className="text-center space-y-4">
          <div className="text-6xl">🪙</div>

          <div>
            <p className="text-sm font-body text-[#2B2233]/60 mb-1">
              Saldo total
            </p>
            <p className="text-5xl font-display font-black text-[#F26A00]">
              {coins !== null ? coins : "0"}
            </p>
          </div>

          <div className="pt-3 border-t-2 border-[#FFC400]/40">
            <p className="text-xs font-body text-[#2B2233]/50">
              +{totalGanho} moedas nos últimos 30 dias
            </p>
          </div>
        </div>
      </div>

      {/* Histórico */}
      <div>
        <h2 className="text-2xl font-display font-bold text-[#2B2233] mb-6">
          Histórico de emoções
        </h2>

        {loading ? (
          <div className="gm-card text-center py-12">
            <p className="text-sm font-body text-[#2B2233]/50">
              Carregando...
            </p>
          </div>
        ) : humores.length === 0 ? (
          <div className="gm-card gm-card--cream text-center py-12">
            <p className="text-sm font-body text-[#2B2233]/60 mb-3">
              😔 Nenhum registro de humor ainda
            </p>
            <p className="text-xs font-body text-[#2B2233]/40 mb-6">
              Comece a marcar como você se sente para ganhar moedas!
            </p>
            <Link
              href="/diario/conta"
              className="gm-btn gm-btn--primary gm-btn--md inline-block"
            >
              Marcar humor agora
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {humores.map((h) => {
              const info = HUMOR_LABELS[h.humor] || { label: h.humor, emoji: "❓" };
              const dataLocal = new Date(h.data_local + "T00:00:00");
              const dataFormatada = dataLocal.toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "numeric",
                month: "short",
              });

              return (
                <div
                  key={h.id}
                  className="gm-card gm-card--cream hover:shadow-md transition-shadow flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{info.emoji}</span>
                    <div>
                      <p className="font-body font-semibold text-[#2B2233]">
                        {info.label}
                      </p>
                      <p className="text-xs font-body text-[#2B2233]/50">
                        {dataFormatada}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-2xl">+{h.coins_ganhos}</span>
                    <span className="text-xl">🪙</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-[#2B2233]/10 text-center">
        <Link
          href="/diario"
          className="inline-flex items-center gap-2 text-sm font-body font-semibold text-[#2B2233] hover:text-[#F26A00] transition-colors"
        >
          ← Voltar ao diário
        </Link>
      </div>
    </div>
  );
}
