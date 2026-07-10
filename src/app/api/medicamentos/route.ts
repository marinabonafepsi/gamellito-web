import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TIPOS = ['basal', 'bolus', 'outro'];

// GET /api/medicamentos - Lista os medicamentos do usuário atual (família).
// Com ?paciente_id=<uuid>, um profissional/educador com permissão ativa
// consulta os medicamentos daquele paciente (RLS aplica a checagem).
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
    const somenteAtivos = url.searchParams.get('ativos') !== 'false';

    let query = supabase
      .from('medicamentos')
      .select('*')
      .eq('familia_id', pacienteId || user.id)
      .order('tipo', { ascending: true })
      .order('criado_em', { ascending: true });

    if (somenteAtivos) {
      query = query.eq('ativo', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching medicamentos:', error);
      return NextResponse.json({ error: 'Failed to fetch medicamentos' }, { status: 500 });
    }

    return NextResponse.json({ medicamentos: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/medicamentos - Cria um novo medicamento para o usuário atual
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
    const { nome, tipo, dose, horarios, desde, observacao } = body;

    if (!nome || !tipo || !dose || !horarios) {
      return NextResponse.json(
        { error: 'nome, tipo, dose e horarios são obrigatórios' },
        { status: 400 }
      );
    }

    if (!TIPOS.includes(tipo)) {
      return NextResponse.json(
        { error: `tipo deve ser uma de: ${TIPOS.join(', ')}` },
        { status: 400 }
      );
    }

    const { data: medicamento, error } = await supabase
      .from('medicamentos')
      .insert({
        familia_id: user.id,
        nome,
        tipo,
        dose,
        horarios,
        desde: desde || null,
        observacao: observacao || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating medicamento:', error);
      return NextResponse.json({ error: 'Failed to create medicamento' }, { status: 500 });
    }

    return NextResponse.json({ sucesso: true, medicamento });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
