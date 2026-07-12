import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// GET /api/familia/vinculos - Lista vínculos família<->DM1 do usuário atual,
// nos dois sentidos (uma conta pode, em tese, ser dono e acesso em vínculos
// diferentes, então sempre retornamos as duas listas).
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: permissoes, error } = await supabase
      .from('permissoes')
      .select('id, usuario_dono, usuario_acesso, criado_em')
      .or(`usuario_dono.eq.${user.id},usuario_acesso.eq.${user.id}`)
      .is('revogado_em', null);

    if (error) {
      console.error('Error fetching vinculos:', error);
      return NextResponse.json({ error: 'Failed to fetch vinculos' }, { status: 500 });
    }

    const comoDm1Rows = (permissoes || []).filter((p) => p.usuario_dono === user.id);
    const comoFamiliaRows = (permissoes || []).filter((p) => p.usuario_acesso === user.id);

    const outrosIds = [
      ...comoDm1Rows.map((p) => p.usuario_acesso),
      ...comoFamiliaRows.map((p) => p.usuario_dono),
    ];

    const nomesPorId = new Map<string, string>();
    if (outrosIds.length > 0) {
      const { data: perfis } = await supabase
        .from('user_profiles')
        .select('user_id, name')
        .in('user_id', outrosIds);
      for (const p of perfis || []) {
        nomesPorId.set(p.user_id, p.name || 'Sem nome');
      }
    }

    return NextResponse.json({
      vinculosComoDm1: comoDm1Rows.map((p) => ({
        id: p.id,
        familiaUserId: p.usuario_acesso,
        nome: nomesPorId.get(p.usuario_acesso) || 'Sem nome',
        criadoEm: p.criado_em,
      })),
      vinculosComoFamilia: comoFamiliaRows.map((p) => ({
        id: p.id,
        dm1UserId: p.usuario_dono,
        nome: nomesPorId.get(p.usuario_dono) || 'Sem nome',
        criadoEm: p.criado_em,
      })),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
