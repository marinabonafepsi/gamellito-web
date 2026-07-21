'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';

interface Registro {
  id: string;
  valor: number;
  data_hora: string;
  rotulo: string;
  observacao?: string;
}

interface NotaClinica {
  id: string;
  texto: string;
  criado_em: string;
  criado_por: string;
}

interface Medicamento {
  id: string;
  nome: string;
  tipo: 'basal' | 'bolus' | 'outro';
  dose: string;
  horarios: string;
  desde?: string;
  observacao?: string;
}

const TIPO_LABEL: Record<Medicamento['tipo'], string> = {
  basal: 'Basal',
  bolus: 'Bolus',
  outro: 'Outro',
};

const MOMENTOS: { key: string; label: string }[] = [
  { key: 'jejum', label: 'Jejum' },
  { key: 'antes', label: 'Antes de comer' },
  { key: 'depois', label: 'Depois de comer' },
  { key: 'dormir', label: 'Antes de dormir' },
];

type MetaForm = Record<string, { min: string; max: string }>;

function formatDesde(desde?: string) {
  if (!desde) return '—';
  const d = new Date(`${desde}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
}

export default function PacienteFichaPage() {
  const params = useParams();
  const pacienteId = params.id as string;
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [notas, setNotas] = useState<NotaClinica[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [nomePaciente, setNomePaciente] = useState('Paciente');
  const [loading, setLoading] = useState(true);
  const [notaText, setNotaText] = useState('');
  const [salvandoNota, setSalvandoNota] = useState(false);
  const [metaForm, setMetaForm] = useState<MetaForm>(
    Object.fromEntries(MOMENTOS.map((m) => [m.key, { min: '', max: '' }]))
  );
  const [salvandoMetas, setSalvandoMetas] = useState(false);
  const [metaMsg, setMetaMsg] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadPaciente();
  }, [pacienteId]);

  const loadPaciente = async () => {
    try {
      // Get nome paciente
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('user_id', pacienteId)
        .single();

      if (profile) {
        setNomePaciente(profile.name);
      }

      // Get últimos 20 registros
      const { data: regs } = await supabase
        .from('registros')
        .select('*')
        .eq('familia_id', pacienteId)
        .order('data_hora', { ascending: false })
        .limit(20);

      setRegistros(regs || []);

      // Get notas clínicas (para este paciente)
      // TODO: Implementar clinical_notes table
      setNotas([]);

      // Get posologia atual
      const medsRes = await fetch(`/api/medicamentos?paciente_id=${pacienteId}`);
      if (medsRes.ok) {
        const medsData = await medsRes.json();
        setMedicamentos(medsData.medicamentos || []);
      }

      // Get faixa-alvo já definida (se houver)
      const metasRes = await fetch(`/api/metas-glicemia?paciente_id=${pacienteId}`);
      if (metasRes.ok) {
        const metasData = await metasRes.json();
        const next: MetaForm = Object.fromEntries(MOMENTOS.map((m) => [m.key, { min: '', max: '' }]));
        (metasData.metas || []).forEach((m: { momento: string; min: number; max: number }) => {
          next[m.momento] = { min: String(m.min), max: String(m.max) };
        });
        setMetaForm(next);
      }
    } catch (error) {
      console.error('Error loading paciente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNota = async () => {
    if (!notaText.trim()) return;

    setSalvandoNota(true);
    try {
      // TODO: Implementar POST /api/notas-clinicas
      alert('Nota salva: ' + notaText);
      setNotaText('');
      loadPaciente();
    } catch (error) {
      console.error('Error saving nota:', error);
      alert('Erro ao salvar nota');
    } finally {
      setSalvandoNota(false);
    }
  };

  const handleMetaChange = (momento: string, field: 'min' | 'max', value: string) => {
    setMetaMsg('');
    setMetaForm((prev) => ({ ...prev, [momento]: { ...prev[momento], [field]: value } }));
  };

  const handleSalvarMetas = async () => {
    const metas = MOMENTOS
      .map((m) => ({ momento: m.key, min: Number(metaForm[m.key]?.min), max: Number(metaForm[m.key]?.max) }))
      .filter((m) => metaForm[m.momento]?.min !== '' && metaForm[m.momento]?.max !== '');

    if (metas.length === 0) {
      setMetaMsg('Preencha ao menos um momento antes de salvar.');
      return;
    }
    if (metas.some((m) => !Number.isFinite(m.min) || !Number.isFinite(m.max) || m.min <= 0 || m.max <= m.min)) {
      setMetaMsg('Confira os valores — o mínimo precisa ser maior que zero e menor que o máximo.');
      return;
    }

    setSalvandoMetas(true);
    setMetaMsg('');
    try {
      const res = await fetch('/api/metas-glicemia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paciente_id: pacienteId, metas }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar');
      setMetaMsg('Faixa-alvo salva! Já aparece pra família no Diário.');
    } catch (error) {
      setMetaMsg(error instanceof Error ? error.message : 'Erro ao salvar a faixa-alvo');
    } finally {
      setSalvandoMetas(false);
    }
  };

  const handleExportarRelatorio = async () => {
    try {
      // TODO: Implementar POST /api/relatorios/gerar
      alert('📄 Relatório gerado (em desenvolvimento)');
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Erro ao gerar relatório');
    }
  };

  const getRolotuloEmoji = (rotulo: string) => {
    const emojis: Record<string, string> = {
      jejum: '🌅',
      antes: '🍽️',
      depois: '🍴',
      dormir: '😴',
      outro: '📝',
    };
    return emojis[rotulo] || '📊';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold text-purple-main mb-2">
            👦 Ficha de {nomePaciente}
          </h1>
          <p className="text-dark-gray">Últimos 20 registros de glicemia</p>
        </div>
        <GamButton variant="primary" onClick={handleExportarRelatorio}>
          📄 Exportar Relatório
        </GamButton>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GamCard surface="sun">
          <div className="text-center">
            <p className="text-sm text-ink opacity-70">Total</p>
            <p className="text-3xl font-bold text-ink mt-2">{registros.length}</p>
          </div>
        </GamCard>
        <GamCard surface="orange">
          <div className="text-center">
            <p className="text-sm text-ink opacity-70">Mínimo</p>
            <p className="text-3xl font-bold text-ink mt-2">
              {registros.length > 0 ? Math.min(...registros.map((r) => r.valor)) : '-'}
            </p>
          </div>
        </GamCard>
        <GamCard surface="lilac">
          <div className="text-center">
            <p className="text-sm text-ink opacity-70">Máximo</p>
            <p className="text-3xl font-bold text-ink mt-2">
              {registros.length > 0 ? Math.max(...registros.map((r) => r.valor)) : '-'}
            </p>
          </div>
        </GamCard>
        <GamCard surface="cream">
          <div className="text-center">
            <p className="text-sm text-ink opacity-70">Média</p>
            <p className="text-3xl font-bold text-ink mt-2">
              {registros.length > 0
                ? Math.round(
                    registros.reduce((a, b) => a + b.valor, 0) / registros.length
                  )
                : '-'}
            </p>
          </div>
        </GamCard>
      </div>

      {/* Faixa-alvo de glicemia */}
      <div>
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-2xl font-display font-bold text-purple-main">Faixa-alvo de glicemia</h2>
          <p className="text-xs text-ink/50 font-body">visível pra família no Diário</p>
        </div>
        <GamCard surface="white">
          <p className="text-sm text-ink/70 mb-4">
            Defina a faixa que você recomenda pra {nomePaciente} em cada momento do dia. O Gamellito não
            calcula nem sugere valores — só mostra pra família o que você definir aqui.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink/50 uppercase border-b-2 border-ink/10">
                  <th className="pb-2 pr-3">Momento</th>
                  <th className="pb-2 pr-3">Mínimo (mg/dL)</th>
                  <th className="pb-2">Máximo (mg/dL)</th>
                </tr>
              </thead>
              <tbody>
                {MOMENTOS.map((m) => (
                  <tr key={m.key} className="border-b border-ink/10 last:border-0">
                    <td className="py-2 pr-3 font-bold text-ink">{m.label}</td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        min={1}
                        value={metaForm[m.key]?.min ?? ''}
                        onChange={(e) => handleMetaChange(m.key, 'min', e.target.value)}
                        placeholder="Ex: 70"
                        className="w-24 px-3 py-1.5 bg-cream border-2 border-ink rounded-lg text-ink focus:outline-none focus:shadow-pop-sm"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        min={1}
                        value={metaForm[m.key]?.max ?? ''}
                        onChange={(e) => handleMetaChange(m.key, 'max', e.target.value)}
                        placeholder="Ex: 180"
                        className="w-24 px-3 py-1.5 bg-cream border-2 border-ink rounded-lg text-ink focus:outline-none focus:shadow-pop-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {metaMsg && <p className="text-sm font-bold text-ink mt-3">{metaMsg}</p>}
          <div className="mt-4">
            <GamButton variant="primary" onClick={handleSalvarMetas} disabled={salvandoMetas}>
              {salvandoMetas ? 'Salvando...' : '✅ Salvar faixa-alvo'}
            </GamButton>
          </div>
        </GamCard>
      </div>

      {/* Posologia atual */}
      <div>
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-2xl font-display font-bold text-purple-main">Posologia atual</h2>
          <p className="text-xs text-ink/50 font-body">informado pelo responsável no app</p>
        </div>
        <GamCard surface="lilac" className="mb-4">
          <div className="p-2 flex flex-col md:flex-row md:items-center gap-2 text-sm">
            <span className="tag" style={{ color: '#2B2233', background: 'rgba(255,255,255,.5)', padding: '2px 10px', borderRadius: 999 }}>
              Gestão completa de medicamentos
            </span>
            <span className="font-bold text-ink">chega em breve</span>
            <span className="text-ink/80">
              ao painel Gamellito — por ora, os dados abaixo são preenchidos manualmente pela família.
            </span>
          </div>
        </GamCard>
        {medicamentos.length > 0 ? (
          <GamCard surface="white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-ink/50 uppercase border-b-2 border-ink/10">
                    <th className="pb-2 pr-3">Medicamento</th>
                    <th className="pb-2 pr-3">Tipo</th>
                    <th className="pb-2 pr-3">Dose</th>
                    <th className="pb-2 pr-3">Horários</th>
                    <th className="pb-2 pr-3">Desde</th>
                    <th className="pb-2">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {medicamentos.map((m) => (
                    <tr key={m.id} className="border-b border-ink/10 last:border-0">
                      <td className="py-3 pr-3 font-bold text-ink">{m.nome}</td>
                      <td className="py-3 pr-3">
                        <span className="tag" style={{ background: '#EDE9FE', color: '#6E59C9', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                          {TIPO_LABEL[m.tipo]}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-ink">{m.dose}</td>
                      <td className="py-3 pr-3 text-ink">{m.horarios}</td>
                      <td className="py-3 pr-3 text-ink/70">{formatDesde(m.desde)}</td>
                      <td className="py-3 text-ink/70">{m.observacao || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GamCard>
        ) : (
          <GamCard surface="cream">
            <div className="text-center py-8">
              <p className="text-ink opacity-70">Nenhum medicamento cadastrado por esta família ainda</p>
            </div>
          </GamCard>
        )}
      </div>

      {/* Notas Clínicas */}
      <GamCard surface="cream">
        <h3 className="text-xl font-bold text-ink mb-4">📝 Notas Clínicas</h3>
        <div className="space-y-3">
          <textarea
            value={notaText}
            onChange={(e) => setNotaText(e.target.value)}
            placeholder="Adicione uma observação clínica..."
            className="w-full px-4 py-2 bg-white border-[3px] border-ink rounded-lg text-ink placeholder-gray-400 focus:outline-none focus:shadow-pop-sm resize-none"
            rows={3}
          />
          <GamButton
            onClick={handleAddNota}
            disabled={salvandoNota || !notaText.trim()}
            variant="primary"
          >
            {salvandoNota ? 'Salvando...' : '✅ Salvar Nota'}
          </GamButton>
        </div>

        {notas.length > 0 && (
          <div className="mt-6 space-y-3 pt-6 border-t border-gray-300">
            {notas.map((nota) => (
              <div key={nota.id} className="bg-white p-3 rounded-lg border border-gray-300">
                <p className="text-sm text-ink">{nota.texto}</p>
                <p className="text-xs text-ink opacity-50 mt-2">
                  {new Date(nota.criado_em).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </GamCard>

      {/* Timeline de Registros */}
      <div>
        <h2 className="text-2xl font-display font-bold text-purple-main mb-4">
          📋 Histórico de Registros
        </h2>

        {loading ? (
          <GamCard surface="white">
            <div className="text-center py-8">
              <p className="text-gray-400">Carregando registros...</p>
            </div>
          </GamCard>
        ) : registros.length > 0 ? (
          <div className="space-y-3">
            {registros.map((registro) => (
              <GamCard key={registro.id} surface="white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl">
                        {getRolotuloEmoji(registro.rotulo)}
                      </span>
                      <div>
                        <p className="text-2xl font-bold text-ink">
                          {registro.valor} mg/dL
                        </p>
                        <p className="text-sm text-ink opacity-70">
                          {registro.rotulo.charAt(0).toUpperCase() +
                            registro.rotulo.slice(1)}
                        </p>
                      </div>
                    </div>
                    {registro.observacao && (
                      <p className="text-sm text-ink opacity-60 mt-2">
                        💬 {registro.observacao}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-sm text-ink opacity-70">
                    {new Date(registro.data_hora).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </GamCard>
            ))}
          </div>
        ) : (
          <GamCard surface="cream">
            <div className="text-center py-12">
              <p className="text-ink opacity-70">Sem registros ainda</p>
            </div>
          </GamCard>
        )}
      </div>

      {/* Info */}
      <GamCard surface="lilac">
        <div className="p-4">
          <p className="text-sm font-medium text-ink mb-2">ℹ️ Sobre os dados</p>
          <p className="text-xs text-ink opacity-80">
            Estes são os dados que o paciente compartilhou com você.
            Você é responsável pela interpretação clínica e acompanhamento.
            Gamellito não fornece interpretação médica.
          </p>
        </div>
      </GamCard>
    </div>
  );
}
