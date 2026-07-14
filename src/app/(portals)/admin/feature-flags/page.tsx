'use client';

import { useEffect, useState } from 'react';

type FeatureFlag = {
  chave: string;
  nome: string;
  descricao: string | null;
  ativo_geral: boolean;
  visivel_admin: boolean;
  criado_em: string;
};

const FORM_VAZIO = { chave: '', nome: '', descricao: '' };

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/feature-flags');
    const data = await res.json();
    if (res.ok) {
      setFlags(data.flags || []);
    } else {
      setErro(data.error || 'Erro ao carregar flags');
    }
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    const res = await fetch('/api/admin/feature-flags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chave: form.chave,
        nome: form.nome,
        descricao: form.descricao || null,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      setForm(FORM_VAZIO);
      await carregar();
    } else {
      setErro(data.error || 'Erro ao criar flag');
    }
    setSalvando(false);
  };

  const alternar = async (flag: FeatureFlag, campo: 'ativo_geral' | 'visivel_admin') => {
    await fetch(`/api/admin/feature-flags/${flag.chave}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [campo]: !flag[campo] }),
    });
    await carregar();
  };

  const excluir = async (flag: FeatureFlag) => {
    if (!confirm(`Excluir a flag "${flag.chave}"? Essa ação não pode ser desfeita.`)) return;
    await fetch(`/api/admin/feature-flags/${flag.chave}`, { method: 'DELETE' });
    await carregar();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-ink">Feature Flags</h1>
        <p className="muted mt-1">
          Ligue uma flag pra testar uma feature só como admin; quando estiver pronta,
          vire &quot;ativo geral&quot; pra liberar pra todo mundo.
        </p>
      </div>

      <form onSubmit={criar} className="card space-y-4">
        <h2 className="font-display font-bold text-lg text-ink">Nova flag</h2>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-sm font-semibold">
            Chave (identificador único, ex: jogos_catalogo)
            <input
              required
              value={form.chave}
              onChange={(e) => setForm({ ...form, chave: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold">
            Nome
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Descrição
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
              rows={2}
            />
          </label>
        </div>

        <button type="submit" disabled={salvando} className="btn btn-orange">
          Criar flag
        </button>
      </form>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="muted">Carregando...</p>
        ) : flags.length === 0 ? (
          <p className="muted">Nenhuma flag criada ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b-2 border-ink/10">
                <th className="py-2 pr-3">Chave</th>
                <th className="py-2 pr-3">Nome</th>
                <th className="py-2 pr-3">Ativo geral</th>
                <th className="py-2 pr-3">Visível p/ admin</th>
                <th className="py-2 pr-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {flags.map((flag) => (
                <tr key={flag.chave} className="border-b border-ink/5">
                  <td className="py-2 pr-3 font-mono text-xs">{flag.chave}</td>
                  <td className="py-2 pr-3 font-semibold">{flag.nome}</td>
                  <td className="py-2 pr-3">
                    <button
                      onClick={() => alternar(flag, 'ativo_geral')}
                      className={`btn btn-sm ${flag.ativo_geral ? 'btn-orange' : 'btn-cream'}`}
                    >
                      {flag.ativo_geral ? 'Ativa geral' : 'Só admin'}
                    </button>
                  </td>
                  <td className="py-2 pr-3">
                    <button
                      onClick={() => alternar(flag, 'visivel_admin')}
                      className={`btn btn-sm ${flag.visivel_admin ? 'btn-sun' : 'btn-cream'}`}
                    >
                      {flag.visivel_admin ? 'Sim' : 'Não'}
                    </button>
                  </td>
                  <td className="py-2 pr-3">
                    <button onClick={() => excluir(flag)} className="btn btn-purple btn-sm">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
