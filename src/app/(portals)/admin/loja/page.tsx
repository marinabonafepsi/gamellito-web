'use client';

import { useEffect, useState } from 'react';

type LojaItem = {
  id: string;
  nome: string;
  descricao: string | null;
  custo_moedas: number;
  imagem_url: string | null;
  tipo: string | null;
  ativo: boolean;
  criado_em: string;
};

const TIPOS = ['avatar_skin', 'badge', 'poder_jogo', 'recurso', 'cosmético'];

const FORM_VAZIO = {
  nome: '',
  descricao: '',
  custo_moedas: '',
  imagem_url: '',
  tipo: TIPOS[0],
};

export default function AdminLojaPage() {
  const [itens, setItens] = useState<LojaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/loja-items');
    const data = await res.json();
    if (res.ok) {
      setItens(data.itens || []);
    } else {
      setErro(data.error || 'Erro ao carregar itens');
    }
    setLoading(false);
  };

  useEffect(() => {
    carregar();
  }, []);

  const iniciarEdicao = (item: LojaItem) => {
    setEditandoId(item.id);
    setForm({
      nome: item.nome,
      descricao: item.descricao || '',
      custo_moedas: String(item.custo_moedas),
      imagem_url: item.imagem_url || '',
      tipo: item.tipo || TIPOS[0],
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
      nome: form.nome,
      descricao: form.descricao || null,
      custo_moedas: Number(form.custo_moedas),
      imagem_url: form.imagem_url || null,
      tipo: form.tipo,
    };

    const url = editandoId ? `/api/admin/loja-items/${editandoId}` : '/api/admin/loja-items';
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
      setErro(data.error || 'Erro ao salvar item');
    }
    setSalvando(false);
  };

  const alternarAtivo = async (item: LojaItem) => {
    await fetch(`/api/admin/loja-items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: !item.ativo }),
    });
    await carregar();
  };

  const excluir = async (item: LojaItem) => {
    if (!confirm(`Excluir "${item.nome}"? Essa ação não pode ser desfeita.`)) return;
    await fetch(`/api/admin/loja-items/${item.id}`, { method: 'DELETE' });
    await carregar();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-ink">Loja</h1>
        <p className="muted mt-1">Itens compráveis com moedas — o que estiver ativo aparece em /loja.</p>
      </div>

      <form onSubmit={salvar} className="card space-y-4">
        <h2 className="font-display font-bold text-lg text-ink">
          {editandoId ? 'Editar item' : 'Novo item'}
        </h2>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-sm font-semibold">
            Nome
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold">
            Custo em moedas
            <input
              required
              type="number"
              min={1}
              value={form.custo_moedas}
              onChange={(e) => setForm({ ...form, custo_moedas: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold">
            Tipo
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="mt-1 w-full border-2 border-ink rounded-xl px-3 py-2"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            URL da imagem
            <input
              value={form.imagem_url}
              onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
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
            {editandoId ? 'Salvar alterações' : 'Criar item'}
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
        ) : itens.length === 0 ? (
          <p className="muted">Nenhum item cadastrado ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b-2 border-ink/10">
                <th className="py-2 pr-3">Nome</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Moedas</th>
                <th className="py-2 pr-3">Ativo</th>
                <th className="py-2 pr-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id} className="border-b border-ink/5">
                  <td className="py-2 pr-3 font-semibold">{item.nome}</td>
                  <td className="py-2 pr-3">{item.tipo || '—'}</td>
                  <td className="py-2 pr-3">{item.custo_moedas}</td>
                  <td className="py-2 pr-3">{item.ativo ? 'Sim' : 'Não'}</td>
                  <td className="py-2 pr-3 flex gap-2 flex-wrap">
                    <button onClick={() => iniciarEdicao(item)} className="btn btn-cream btn-sm">
                      Editar
                    </button>
                    <button onClick={() => alternarAtivo(item)} className="btn btn-sun btn-sm">
                      {item.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                    <button onClick={() => excluir(item)} className="btn btn-purple btn-sm">
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
