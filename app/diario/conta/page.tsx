"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ContaPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState<string | null>(null);
  const [apagando, setApagando] = useState(false);
  const [erro,     setErro]     = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function sair() {
    await createClient().auth.signOut();
    router.push("/diario/login");
  }

  async function apagarTudo() {
    const confirmado = window.confirm(
      "Tem certeza? Todos os registros desta família serão apagados permanentemente e a conta será removida. Esta ação não pode ser desfeita."
    );
    if (!confirmado) return;

    setApagando(true);
    setErro(null);

    const res = await fetch("/api/conta", { method: "DELETE" });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setErro((err as { error?: string }).error ?? "Erro ao apagar. Tente novamente.");
      setApagando(false);
      return;
    }

    // Dados apagados — sai e redireciona
    await createClient().auth.signOut();
    router.push("/diario/login");
  }

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-display font-bold" style={{ color: "#2B2233" }}>
          Minha conta
        </h1>
      </header>

      {/* Informações da conta */}
      <div className="ds-card p-6 flex flex-col gap-4">
        <div>
          <div className="text-xs font-body font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(43,34,51,0.5)" }}>
            E-mail
          </div>
          <div className="font-body font-medium text-lg" style={{ color: "#2B2233" }}>
            {email ?? "Carregando…"}
          </div>
        </div>

        <button onClick={sair} className="ds-btn ds-btn--ghost w-full">
          Sair da conta
        </button>
      </div>

      {/* Zona de risco — exclusão de dados (LGPD direito ao esquecimento) */}
      <div
        className="ds-card p-6 flex flex-col gap-4"
        style={{ borderColor: "#991B1B", boxShadow: "4px 4px 0 #991B1B" }}
      >
        <div>
          <h2 className="font-display font-bold text-lg mb-1" style={{ color: "#991B1B" }}>
            Apagar todos os dados
          </h2>
          <p className="text-sm font-body" style={{ color: "#2B2233" }}>
            Ao confirmar, todos os registros desta família serão apagados permanentemente
            e a conta será removida. Esta ação não pode ser desfeita.
          </p>
          <p className="text-xs font-body mt-2" style={{ color: "rgba(43,34,51,0.6)" }}>
            Direito ao esquecimento — Lei nº 13.709/2018 (LGPD), art. 18, IV.
          </p>
        </div>

        {erro && (
          <p className="text-sm font-body px-4 py-3 rounded-ds-md" style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 12 }}>
            {erro}
          </p>
        )}

        <button
          onClick={apagarTudo}
          disabled={apagando}
          className="ds-btn w-full"
          style={{ background: "#991B1B", borderColor: "#991B1B", boxShadow: "4px 4px 0 #5a0000" }}
        >
          {apagando ? "Apagando…" : "Apagar tudo e encerrar conta"}
        </button>
      </div>

      <div className="text-center">
        <Link href="/diario" className="text-sm font-body hover:underline" style={{ color: "rgba(43,34,51,0.6)" }}>
          ← Voltar ao diário
        </Link>
      </div>
    </div>
  );
}
