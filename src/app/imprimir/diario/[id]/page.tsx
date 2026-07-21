'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ROTULO_LABEL: Record<string, string> = {
  jejum: 'Jejum',
  antes: 'Antes de comer',
  depois: 'Depois de comer',
  dormir: 'Antes de dormir',
};

const CONTEXTO_LABEL: Record<string, string> = {
  exercicio: 'Fez exercício',
  doente: 'Não tá bem / doente',
  estresse: 'Dia estressante',
  comida: 'Comida diferente',
};

interface Registro {
  id: string;
  valor: number;
  data_hora: string;
  rotulo: string;
  observacao?: string;
  contexto?: string | null;
  medicamentos_tomados?: string[] | null;
}

export default function ImprimirDiarioPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [nomePaciente, setNomePaciente] = useState('');
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('user_id', id)
        .single();
      setNomePaciente(profile?.name || '');

      const res = await fetch(`/api/registros?dm1_id=${id}&limit=500`);
      if (!res.ok) {
        setErro('Não foi possível carregar os registros. Confira se você ainda tem acesso a esse diário.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRegistros(data.registros || []);
      setLoading(false);
    };
    load();
  }, [id, router, supabase]);

  const formatDataHora = (dataHora: string) => {
    const d = new Date(dataHora);
    return {
      data: d.toLocaleDateString('pt-BR'),
      hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px', fontFamily: 'Arial, Helvetica, sans-serif', color: '#241C2E' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { padding: 0; }
        }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
        th { background: #f2eee6; font-weight: 700; }
      `}</style>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button
          onClick={() => router.back()}
          style={{ border: '2px solid #241C2E', borderRadius: 10, padding: '6px 14px', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
        >
          ← Voltar
        </button>
        <button
          onClick={() => window.print()}
          style={{ border: '2px solid #241C2E', borderRadius: 10, padding: '6px 14px', background: '#F26A00', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
        >
          🖨️ Imprimir / salvar como PDF
        </button>
      </div>

      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Gamellito — Diário de glicemia</h1>
      {nomePaciente && <p style={{ marginBottom: 4 }}>Paciente: <b>{nomePaciente}</b></p>}
      <p style={{ marginBottom: 20, color: '#555', fontSize: 13 }}>
        Gerado em {new Date().toLocaleDateString('pt-BR')} · {registros.length} registro{registros.length === 1 ? '' : 's'}
      </p>

      {loading ? (
        <p>Carregando...</p>
      ) : erro ? (
        <p>{erro}</p>
      ) : registros.length === 0 ? (
        <p>Nenhum registro ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora</th>
              <th>Momento</th>
              <th>Valor (mg/dL)</th>
              <th>Contexto</th>
              <th>Remédios tomados</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => {
              const { data, hora } = formatDataHora(r.data_hora);
              return (
                <tr key={r.id}>
                  <td>{data}</td>
                  <td>{hora}</td>
                  <td>{ROTULO_LABEL[r.rotulo] || r.rotulo}</td>
                  <td>{r.valor}</td>
                  <td>{r.contexto ? CONTEXTO_LABEL[r.contexto] || r.contexto : '—'}</td>
                  <td>{r.medicamentos_tomados?.length ? `${r.medicamentos_tomados.length}` : '—'}</td>
                  <td>{r.observacao || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
