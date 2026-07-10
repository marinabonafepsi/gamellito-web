import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DIAS_PARA_REVER = 5;

// GET /api/pacientes - Lista as famílias que compartilharam dados com o
// usuário atual (educador ou profissional), via permissoes ativas.
// "status" reflete apenas a recência do registro (engajamento), nunca o
// valor da glicemia — Gamellito não interpreta dado de saúde.
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: permissoes, error: permError } = await supabase
      .from('permissoes')
      .select('usuario_dono, criado_em, expira_em')
      .eq('usuario_acesso', user.id)
      .is('revogado_em', null);

    if (permError) {
      console.error('Error fetching permissoes:', permError);
      return NextResponse.json({ error: 'Failed to fetch pacientes' }, { status: 500 });
    }

    const now = new Date();
    const donoIds = (permissoes || [])
      .filter((p) => !p.expira_em || new Date(p.expira_em) > now)
      .map((p) => p.usuario_dono);

    if (donoIds.length === 0) {
      return NextResponse.json({ pacientes: [] });
    }

    const { data: perfis, error: perfisError } = await supabase
      .from('user_profiles')
      .select('user_id, name, display_name')
      .in('user_id', donoIds);

    if (perfisError) {
      console.error('Error fetching perfis:', perfisError);
      return NextResponse.json({ error: 'Failed to fetch pacientes' }, { status: 500 });
    }

    const { data: registros, error: registrosError } = await supabase
      .from('registros')
      .select('familia_id, data_hora')
      .in('familia_id', donoIds)
      .order('data_hora', { ascending: false });

    if (registrosError) {
      console.error('Error fetching registros:', registrosError);
      return NextResponse.json({ error: 'Failed to fetch pacientes' }, { status: 500 });
    }

    const ultimoRegistroPorId = new Map<string, string>();
    for (const r of registros || []) {
      if (!ultimoRegistroPorId.has(r.familia_id)) {
        ultimoRegistroPorId.set(r.familia_id, r.data_hora);
      }
    }

    const limiar = new Date(now.getTime() - DIAS_PARA_REVER * 24 * 60 * 60 * 1000);

    const pacientes = donoIds.map((id) => {
      const perfil = (perfis || []).find((p) => p.user_id === id);
      const ultimoRegistroEm = ultimoRegistroPorId.get(id) || null;
      const status: 'ok' | 'rever' =
        ultimoRegistroEm && new Date(ultimoRegistroEm) > limiar ? 'ok' : 'rever';

      return {
        id,
        nome: perfil?.display_name || perfil?.name || 'Sem nome',
        ultimoRegistroEm,
        status,
      };
    });

    return NextResponse.json({ pacientes });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
