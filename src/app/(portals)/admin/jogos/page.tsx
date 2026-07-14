'use client';

import { useEffect, useState } from 'react';

type Jogo = {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string | null;
  url_jogo: string | null;
  categoria: string | null;
  ativo: boolean;
  ordem: number;
  criado_em: string;
};

const FORM_VAZIO = {
  titulo: '',
  descricao: '',
  imagem_url: '',
  url_jogo: '',
  categoria: '',
  ordem: '0',
};

export default function AdminJogosPage() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/jogos');
    const data = await res.json();
    if (res.ok) {
      setJogos(data.jogos || []);
    } else {
      setErro(data.error || 'Erro ao carregar jogos');
    }
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const iniciarEdicao = (jogo: Jogo) => {
    setEditandoId(jogo.id);
    setForm({
      titulo: jogo.titulo,
      descricao: jogo.descricao || '',
      imagem_url: jogo.imagem_url || '',
      url_jogo: jogo.url_jogo || '',
      categoria: jogo.categoria || '',
      ordem: String(jogo.ordem),
    });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setForm(FORM_VAZIO);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    const payload = {
      titulo: form.titulo,
      descricao: form.descricao || null,
      imagem_url: form.imagem_url || null,
      url_jogo: form.url_jogo || null,
      categoria: form.categoria || null,
      ordem: Number(form.ordem) || 0,
    };

    const url = editandoId ? `/api/admin/jogos/${editandoId}` : '/api/admin/jogos';
    const method = editandoId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok) {
      cancelarEdicao();
      await carregar();
    } else {
      setErro(data.error || 'Erro ao salvar jogo');
    }
    setSalvando(false);
  };

  const alternarAtivo = async (jogo: Jogo) => {
    await fetch(`/api/admin/jogos/${jogo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: !jogo.ativo }),
    });
    await carregar();
  };

  const excluir = async (jogo: Jogo) => {
    if (!confirm(`Excluir "${jogo.titulo}"? Essa ação não pode ser desfeita.`)) return;
    await fetch(`/api/admin/jogos/${jogo.id}`, { method: 'DELETE' });
    await carregar();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-ink">Jogos</h1>
        <p className="muted mt-1">Catálogo exibido publicamente em /jogos — só os ativos aparecem.</p>
      </div>

      <form onSubmit={salvar} className="card space-y-4">
        <h2 className="font-display font-bold text-lg text-ink">
          {editandoId ? 'Editar jogo' : 'Novo jogo'}
        </h2>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-sm font-semibold">
            Título
            <input
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold">
            Categoria
            <input
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold">
            URL do jogo (opcional — sem link aparece como &quot;em breve&quot;)
            <input
              value={form.url_jogo}
              onChange={(e) => setForm({ ...form, url_jogo: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold">
            URL da imagem
            <input
              value={form.imagem_url}
              onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold">
            Ordem de exibição
            <input
              type="number"
              value={form.ordem}
              onChange={(e) => setForm({ ...form, ordem: e.target.value })}
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

        <div className="flex gap-3">
          <button type="submit" disabled={salvando} className="btn btn-orange">
            {editandoId ? 'Salvar alterações' : 'Criar jogo'}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelarEdicao} className="btn btn-cream">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="muted">Carregando...</p>
        ) : jogos.length === 0 ? (
          <p className="muted">Nenhum jogo cadastrado ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b-2 border-ink/10">
                <th className="py-2 pr-3">Título</th>
                <th className="py-2 pr-3">Categoria</th>
                <th className="py-2 pr-3">Ordem</th>
                <th className="py-2 pr-3">Ativo</th>
                <th className="py-2 pr-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {jogos.map((jogo) => (
                <tr key={jogo.id} className="border-b border-ink/5">
                  <td className="py-2 pr-3 font-semibold">{jogo.titulo}</td>
                  <td className="py-2 pr-3">{jogo.categoria || '—'}</td>
                  <td className="py-2 pr-3">{jogo.ordem}</td>
                  <td className="py-2 pr-3">{jogo.ativo ? 'Sim' : 'Não'}</td>
                  <td className="py-2 pr-3 flex gap-2 flex-wrap">
                    <button onClick={() => iniciarEdicao(jogo)} className="btn btn-cream btn-sm">
                      Editar
                    </button>
                    <button onClick={() => alternarAtivo(jogo)} className="btn btn-sun btn-sm">
                      {jogo.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                    <button onClick={() => excluir(jogo)} className="btn btn-purple btn-sm">
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
