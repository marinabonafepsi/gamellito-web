import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MOMENTOS = ['jejum', 'antes', 'depois', 'dormir'];

// GET /api/metas-glicemia - Lista a faixa-alvo do usuário atual (família).
// Com ?paciente_id=<uuid>, um profissional com permissão ativa consulta a
// faixa daquele paciente (RLS aplica a checagem).
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const pacienteId = url.searchParams.get('paciente_id');

    const { data, error } = await supabase
      .from('metas_glicemia')
      .select('*')
      .eq('familia_id', pacienteId || user.id);

    if (error) {
      console.error('Error fetching metas_glicemia:', error);
      return NextResponse.json({ error: 'Failed to fetch metas' }, { status: 500 });
    }

    return NextResponse.json({ metas: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/metas-glicemia - Um profissional define/atualiza a faixa-alvo
// de um paciente que compartilhou acesso com ele (RLS exige tipo_acesso
// 'comment' ou 'full' — 'readonly' não basta pra escrever).
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paciente_id, metas } = body as {
      paciente_id?: string;
      metas?: { momento: string; min: number; max: number }[];
    };

    if (!paciente_id || !Array.isArray(metas) || metas.length === 0) {
      return NextResponse.json(
        { error: 'paciente_id e metas (lista de momento/min/max) são obrigatórios' },
        { status: 400 }
      );
    }

    for (const m of metas) {
      if (!MOMENTOS.includes(m.momento)) {
        return NextResponse.json(
          { error: `momento deve ser uma de: ${MOMENTOS.join(', ')}` },
          { status: 400 }
        );
      }
      if (!Number.isFinite(m.min) || !Number.isFinite(m.max) || m.min <= 0 || m.max <= m.min) {
        return NextResponse.json(
          { error: `faixa inválida para ${m.momento}: mínimo deve ser maior que zero e menor que o máximo` },
          { status: 400 }
        );
      }
    }

    const rows = metas.map((m) => ({
      familia_id: paciente_id,
      momento: m.momento,
      min: m.min,
      max: m.max,
      definido_por: user.id,
      atualizado_em: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('metas_glicemia')
      .upsert(rows, { onConflict: 'familia_id,momento' })
      .select();

    if (error) {
      console.error('Error saving metas_glicemia:', error);
      return NextResponse.json(
        { error: 'Não foi possível salvar. Confira se esta família ainda compartilha os dados com você.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ sucesso: true, metas: data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
