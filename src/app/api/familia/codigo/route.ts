import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { getUserRole } from '@/lib/auth-helpers';

export const runtime = 'nodejs';

// Sem caracteres ambíguos (0/O, 1/I/L)
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function gerarCodigo(): string {
  let codigo = '';
  for (let i = 0; i < 8; i++) {
    codigo += ALFABETO[randomInt(ALFABETO.length)];
  }
  return codigo;
}

// GET /api/familia/codigo - Lista códigos pendentes (não usados/expirados) do DM1
export async function GET() {
  try {
    const role = await getUserRole();
    if (role !== 'dm1') {
      return NextResponse.json({ error: 'Apenas contas DM1 podem gerar códigos de família' }, { status: 403 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('codigos_familia')
      .select('id, codigo, criado_em, expira_em')
      .eq('dm1_user_id', user.id)
      .is('usado_por', null)
      .gt('expira_em', new Date().toISOString())
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Error fetching codigos_familia:', error);
      return NextResponse.json({ error: 'Failed to fetch codigos' }, { status: 500 });
    }

    return NextResponse.json({ codigos: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/familia/codigo - Gera um novo código de vínculo (DM1 only)
export async function POST() {
  try {
    const role = await getUserRole();
    if (role !== 'dm1') {
      return NextResponse.json({ error: 'Apenas contas DM1 podem gerar códigos de família' }, { status: 403 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let codigo = '';
    let insertError = null;
    // Tenta algumas vezes no raro caso de colisão (codigo é UNIQUE)
    for (let tentativa = 0; tentativa < 5; tentativa++) {
      codigo = gerarCodigo();
      const { error } = await supabase.from('codigos_familia').insert({
        dm1_user_id: user.id,
        codigo,
      });
      insertError = error;
      if (!error) break;
      if (error.code !== '23505') break; // não é colisão de unique, não adianta tentar de novo
    }

    if (insertError) {
      console.error('Error creating codigo_familia:', insertError);
      return NextResponse.json({ error: 'Failed to create codigo' }, { status: 500 });
    }

    return NextResponse.json({ codigo });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
