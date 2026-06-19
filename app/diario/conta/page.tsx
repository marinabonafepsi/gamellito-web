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

    await createClient().auth.signOut();
    router.push("/diario/login");
  }

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Minha conta
        </h1>
      </header>

      {/* Informações da conta */}
      <div className="bg-card rounded-3xl border-2 border-gamellito-hospital-purple/25 shadow-2xl p-6 flex flex-col gap-4">
        <div>
          <div className="text-xs font-body font-semibold uppercase tracking-widest mb-1 text-muted-foreground">
            E-mail
          </div>
          <div className="font-body font-medium text-lg text-foreground">
            {email ?? "Carregando…"}
          </div>
        </div>

        <button
          onClick={sair}
          className="w-full border border-border text-foreground rounded-full font-display font-bold py-3 hover:border-primary/40 transition-colors"
        >
          Sair da conta
        </button>
      </div>

      {/* Zona de risco — exclusão de dados (LGPD direito ao esquecimento) */}
      <div className="bg-card rounded-3xl border-2 border-destructive/40 shadow-2xl p-6 flex flex-col gap-4">
        <div>
          <h2 className="font-display font-bold text-lg mb-1 text-destructive">
            Apagar todos os dados
          </h2>
          <p className="text-sm font-body text-foreground">
            Ao confirmar, todos os registros desta família serão apagados permanentemente
            e a conta será removida. Esta ação não pode ser desfeita.
          </p>
          <p className="text-xs font-body mt-2 text-muted-foreground">
            Direito ao esquecimento — Lei nº 13.709/2018 (LGPD), art. 18, IV.
          </p>
        </div>

        {erro && (
          <p className="text-sm font-body bg-destructive/10 text-destructive rounded-xl px-4 py-3">
            {erro}
          </p>
        )}

        <button
          onClick={apagarTudo}
          disabled={apagando}
          className="w-full bg-destructive text-destructive-foreground rounded-full font-display font-bold py-3 hover:bg-destructive/90 transition-colors disabled:opacity-60"
        >
          {apagando ? "Apagando…" : "Apagar tudo e encerrar conta"}
        </button>
      </div>

      <div className="text-center">
        <Link href="/diario" className="text-sm font-body text-muted-foreground hover:underline">
          ← Voltar ao diário
        </Link>
      </div>
    </div>
  );
}
