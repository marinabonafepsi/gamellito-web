import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// POST /api/familia/vinculos/resgatar - Troca um código de família por um
// vínculo de leitura ao diário do DM1 (RPC porque quem resgata não é dono
// do código, então a policy normal de insert em `permissoes` bloquearia).
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const codigo = String(body?.codigo || '').trim();
    if (!codigo) {
      return NextResponse.json({ error: 'codigo is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .rpc('resgatar_codigo_familia', { p_codigo: codigo })
      .single();

    if (error) {
      const mensagens: Record<string, string> = {
        codigo_invalido: 'Código inválido ou expirado',
        nao_pode_vincular_a_si_mesmo: 'Esse código é seu — peça o código de quem vai acompanhar você',
      };
      const msg = mensagens[error.message] || 'Não foi possível vincular com esse código';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json({
      sucesso: true,
      dm1Nome: (data as { dm1_nome: string } | null)?.dm1_nome || null,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
