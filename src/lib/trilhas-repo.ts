import type { SupabaseClient } from '@supabase/supabase-js';
import type { Trilha } from '@/components/dashboard/DashboardShell';

interface TrilhaRef {
  nome: string;
  ordem: number;
}

interface ModuloRow {
  codigo: string;
  titulo: string;
  cor: string;
  formato: string;
  licoes_label: string;
  pct_demo: string;
  bar_class: string | null;
  status_demo: string;
  status_class: string | null;
  trilhas: TrilhaRef | TrilhaRef[] | null;
}

function mapRowToTrilha(row: ModuloRow): Trilha {
  const trilha = Array.isArray(row.trilhas) ? row.trilhas[0] : row.trilhas;
  return {
    n: row.codigo,
    color: row.cor,
    nivel: trilha?.nome,
    title: row.titulo,
    format: row.formato,
    lessons: row.licoes_label,
    pct: row.pct_demo,
    barClass: row.bar_class ?? undefined,
    status: row.status_demo,
    statusClass: row.status_class ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getTrilhasByPersona(supabase: SupabaseClient<any>, persona: string): Promise<Trilha[]> {
  const { data, error } = await supabase
    .from('modulos')
    .select(
      'codigo, titulo, cor, formato, licoes_label, pct_demo, bar_class, status_demo, status_class, ordem, trilhas!inner(nome, ordem, persona, ativo)'
    )
    .eq('ativo', true)
    .eq('trilhas.persona', persona)
    .eq('trilhas.ativo', true)
    .order('ordem', { referencedTable: 'trilhas' })
    .order('ordem');

  if (error || !data) {
    console.error('Error fetching trilhas:', error);
    return [];
  }

  return (data as unknown as ModuloRow[]).map(mapRowToTrilha);
}
