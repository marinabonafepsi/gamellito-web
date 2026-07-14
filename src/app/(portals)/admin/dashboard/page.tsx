import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function loadStats() {
  const supabase = createServerComponentClient({ cookies });

  const [
    { count: usuarios },
    { count: itensLojaAtivos },
    { count: jogosAtivos },
    { count: flagsAtivas },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('loja_items').select('*', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('jogos').select('*', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('feature_flags').select('*', { count: 'exact', head: true }).eq('ativo_geral', true),
  ]);

  return {
    usuarios: usuarios || 0,
    itensLojaAtivos: itensLojaAtivos || 0,
    jogosAtivos: jogosAtivos || 0,
    flagsAtivas: flagsAtivas || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await loadStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-3xl text-ink">Painel Admin</h1>
        <p className="muted mt-1">Visão geral do Gamellito, sem precisar abrir o Supabase Studio.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat">
          <div className="num">{stats.usuarios}</div>
          <div className="lbl">Usuários cadastrados</div>
        </div>
        <div className="stat">
          <div className="num">{stats.itensLojaAtivos}</div>
          <div className="lbl">Itens ativos na loja</div>
        </div>
        <div className="stat">
          <div className="num">{stats.jogosAtivos}</div>
          <div className="lbl">Jogos ativos</div>
        </div>
        <div className="stat">
          <div className="num">{stats.flagsAtivas}</div>
          <div className="lbl">Feature flags ativas</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Link href="/admin/loja" className="card no-underline">
          <p className="tag">Loja</p>
          <h2 className="font-display font-bold text-xl text-ink mt-1">Gerenciar itens</h2>
          <p className="muted text-sm mt-2">Criar, editar e ativar/desativar itens compráveis com moedas.</p>
        </Link>
        <Link href="/admin/jogos" className="card no-underline">
          <p className="tag">Jogos</p>
          <h2 className="font-display font-bold text-xl text-ink mt-1">Gerenciar catálogo</h2>
          <p className="muted text-sm mt-2">Adicionar jogos ao catálogo público em /jogos.</p>
        </Link>
        <Link href="/admin/feature-flags" className="card no-underline">
          <p className="tag">Feature Flags</p>
          <h2 className="font-display font-bold text-xl text-ink mt-1">Testar em produção</h2>
          <p className="muted text-sm mt-2">Ligar uma feature só pra você antes de liberar geral.</p>
        </Link>
      </div>
    </div>
  );
}
