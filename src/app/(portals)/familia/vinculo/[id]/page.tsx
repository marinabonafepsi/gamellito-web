'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamCard } from '@/components/ds/GamCard';

interface Registro {
  id: string;
  valor: number;
  data_hora: string;
  rotulo: string;
  observacao?: string;
}

const ROLOTULO_EMOJI: Record<string, string> = {
  jejum: '🌅',
  antes: '🍽️',
  depois: '🍴',
  dormir: '😴',
  outro: '📝',
};

// Visão somente-leitura do diário de glicemia de um DM1 vinculado — o
// acesso é validado pelo backend (permissoes) em GET /api/registros?dm1_id=,
// aqui não há como registrar/editar/deletar.
export default function DiarioVinculadoPage() {
  const params = useParams();
  const dm1Id = params.id as string;
  const [nome, setNome] = useState('');
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    const load = async () => {
      const { data: perfil } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('user_id', dm1Id)
        .single();
      setNome(perfil?.name || 'DM1');

      const res = await fetch(`/api/registros?dm1_id=${dm1Id}&limit=50`);
      if (!res.ok) {
        setErro(res.status === 403 ? 'Você não tem acesso a esse diário' : 'Erro ao carregar');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRegistros(data.registros || []);
      setLoading(false);
    };
    load();
  }, [dm1Id, supabase]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/familia/perfil"
          className="mb-4 inline-flex items-center gap-1 text-sm font-display font-bold text-ink/70 hover:text-ink"
        >
          ← Voltar
        </Link>
        <h1 className="text-4xl font-display font-bold text-purple-main mb-2">
          Diário de {nome}
        </h1>
        <p className="text-dark-gray">Visão somente leitura, vinculada por código de família</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-12">Carregando...</p>
      ) : erro ? (
        <GamCard surface="cream">
          <p className="text-center py-8 text-game-red font-bold">{erro}</p>
        </GamCard>
      ) : registros.length > 0 ? (
        <div className="space-y-3">
          {registros.map((r) => (
            <GamCard key={r.id} surface="white">
              <div className="flex justify-between items-start">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl">{ROLOTULO_EMOJI[r.rotulo] || '📊'}</span>
                  <div>
                    <p className="text-2xl font-bold text-ink">{r.valor} mg/dL</p>
                    <p className="text-sm text-ink opacity-70">
                      {r.rotulo.charAt(0).toUpperCase() + r.rotulo.slice(1)}
                    </p>
                    {r.observacao && (
                      <p className="text-sm text-ink opacity-60 mt-2">💬 {r.observacao}</p>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-ink opacity-70">
                  <p>
                    {new Date(r.data_hora).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </p>
                  <p>
                    {new Date(r.data_hora).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </GamCard>
          ))}
        </div>
      ) : (
        <GamCard surface="cream">
          <p className="text-center py-12 text-ink opacity-70">Nenhum registro ainda.</p>
        </GamCard>
      )}
    </div>
  );
}
